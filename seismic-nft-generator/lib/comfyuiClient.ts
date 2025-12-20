import axios from 'axios';
import { ProfileAnalysis } from '@/types';
import { NFTConfig, getPromptConfig } from './nftConfig';

export class ComfyUIClient {
  private apiUrl = 'http://localhost:8188';

  async generateNFTImage(analysis: ProfileAnalysis): Promise<string> {
    const prompt = this.constructPrompt(analysis);
    
    // ComfyUI workflow
    const workflow = {
      "3": {
        "inputs": {
          "seed": Math.floor(Math.random() * 1000000),
          "steps": 20,
          "cfg": 7.5,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": {
          "ckpt_name": "dreamshaper_8.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": NFTConfig.negativePrompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "filename_prefix": "seismic_nft",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };

    // Queue prompt
    try {
      const response = await axios.post(`${this.apiUrl}/prompt`, workflow, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      if (!response.data || !response.data.prompt_id) {
        throw new Error(`Invalid response from ComfyUI: ${JSON.stringify(response.data)}`);
      }

      const promptId = response.data.prompt_id;

      // Wait for generation
      await this.waitForCompletion(promptId);

      // Get result
      const result = await axios.get(`${this.apiUrl}/history/${promptId}`);
      const images = result.data[promptId].outputs["9"].images;
      const filename = images[0].filename;

      // Get image as base64
      const imageResponse = await axios.get(
        `${this.apiUrl}/view?filename=${filename}`,
        { responseType: 'arraybuffer' }
      );

      return `data:image/png;base64,${Buffer.from(imageResponse.data).toString('base64')}`;
    } catch (error: any) {
      console.error('ComfyUI generation error:', error.response?.data || error.message);
      throw new Error(`Failed to generate NFT image: ${error.response?.data?.error || error.message}`);
    }
  }

  private async waitForCompletion(promptId: string): Promise<void> {
    let completed = false;
    while (!completed) {
      const response = await axios.get(`${this.apiUrl}/history/${promptId}`);
      completed = response.data[promptId]?.status?.completed === true;
      if (!completed) await new Promise(r => setTimeout(r, 500));
    }
  }

  private constructPrompt(analysis: ProfileAnalysis): string {
    const { personality } = analysis;
    const config = getPromptConfig(personality);
    
    return `NFT character avatar, ${config.artStyle}, ${config.features.outfit}, 
            Seismic logo visible, purple crystal element, high quality NFT art`;
  }
}