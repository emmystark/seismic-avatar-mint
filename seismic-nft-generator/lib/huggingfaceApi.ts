import { HfInference } from '@huggingface/inference';
import { ProfileAnalysis } from '@/types';
import { NFTConfig, getPromptConfig } from './nftConfig';

export class HuggingFaceClient {
  private client: HfInference;

  constructor(apiKey: string) {
    this.client = new HfInference(apiKey);
  }

  /**
   * Generate NFT image based on profile analysis
   */
  async generateNFTImage(analysis: ProfileAnalysis): Promise<Blob> {
    const prompt = this.constructPrompt(analysis);
    const negativePrompt = NFTConfig.negativePrompt;

    try {
      const imageBlob = await this.client.textToImage({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          num_inference_steps: NFTConfig.generationParams.numInferenceSteps,
          guidance_scale: NFTConfig.generationParams.guidanceScale,
          width: NFTConfig.generationParams.width,
          height: NFTConfig.generationParams.height,
        },
      });

      return imageBlob;
    } catch (error: any) {
      console.error('Hugging Face generation error:', error);
      throw new Error(error.message || 'Failed to generate NFT image');
    }
  }

  /**
   * Generate with custom style
   */
  async generateWithStyle(
    analysis: ProfileAnalysis, 
    customStyle: string
  ): Promise<Blob> {
    const prompt = this.constructPrompt(analysis, customStyle);
    const negativePrompt = NFTConfig.negativePrompt;

    try {
      const imageBlob = await this.client.textToImage({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          num_inference_steps: NFTConfig.generationParams.numInferenceSteps,
          guidance_scale: NFTConfig.generationParams.guidanceScale,
          width: NFTConfig.generationParams.width,
          height: NFTConfig.generationParams.height,
        },
      });

      return imageBlob;
    } catch (error: any) {
      console.error('Hugging Face styled generation error:', error);
      throw new Error('Failed to generate styled NFT image');
    }
  }

  /**
   * Construct Web3 NFT-style prompt using configuration
   */
  private constructPrompt(
    analysis: ProfileAnalysis, 
    customStyle?: string
  ): string {
    const { profile, personality } = analysis;
    
    // Get configuration for this personality
    const config = getPromptConfig(personality);

    // Start with base art style
    let prompt = customStyle || config.artStyle;
    prompt += ', ';

    // Add character description
    prompt += `NFT character avatar for @${profile.username}, `;
    
    // Add personality-based features
    prompt += `${config.features.outfit}, `;
    prompt += `${config.features.accessories}, `;
    prompt += `${config.features.expression}, `;
    prompt += `${config.features.pose}, `;

    // Add topic-based elements
    const topicElements = this.getTopicElements(personality.topics);
    if (topicElements) {
      prompt += `${topicElements}, `;
    }

    // Add color scheme
    prompt += `${config.colors}, `;

    // Add engagement effects
    prompt += `${config.effects}, `;

    // Add Seismic branding
    prompt += `${NFTConfig.seismicBranding.element} in ${NFTConfig.seismicBranding.placement}, ${NFTConfig.seismicBranding.style}, `;

    // Add quality modifiers
    prompt += NFTConfig.qualityModifiers;

    return prompt;
  }

  /**
   * Get topic-based visual elements from config
   */
  private getTopicElements(topics: string[]): string {
    const elements: string[] = [];

    topics.forEach(topic => {
      const topicConfig = NFTConfig.topicElements[topic as keyof typeof NFTConfig.topicElements];
      if (topicConfig) {
        elements.push(topicConfig.background);
        elements.push(topicConfig.effects);
      }
    });

    return elements.slice(0, 2).join(', ');
  }

  /**
   * Convert Blob to base64 (for client-side use)
   */
  async blobToBase64(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}