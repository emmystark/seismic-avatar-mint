// lib/stableDiffusion15Client.tsx

export interface ProfileAnalysis {
  profile: {
    username: string;
    name?: string;
    description?: string;
    followers?: number;
    following?: number;
    tweets?: number;
    verified?: boolean;
    profileImageUrl?: string;
    bannerImageUrl?: string;
    joinDate?: string;
    location?: string;
    website?: string;
  };
  personality: {
    tone: string;
    topics: string[];
    traits?: string[];
    sentiment?: string;
    communicationStyle?: string;
  };
  insights?: {
    primaryFocus?: string;
    expertise?: string[];
    audience?: string;
    contentStrategy?: string;
  };
}

import axios from 'axios';

export class StableDiffusion15Client {
  private apiUrl: string;
  private modelName: string;

  constructor(
    apiUrl: string = 'http://localhost:7860',
    modelName: string = 'v1-5-pruned-emaonly.safetensors'
  ) {
    this.apiUrl = apiUrl;
    this.modelName = modelName;
  }

  async generateNFTImage(analysis: ProfileAnalysis): Promise<Blob> {
    const prompt = this.constructPrompt(analysis);
    const negativePrompt = this.getNegativePrompt();

    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error(`Stable Diffusion server unreachable at ${this.apiUrl}`);
      }

      const payload = {
        prompt: prompt,
        negative_prompt: negativePrompt,
        steps: 30,
        cfg_scale: 7.5,
        width: 512,
        height: 512,
        sampler_name: 'DPM++ 2M Karras',
        batch_size: 1,
        n_iter: 1,
        seed: -1,
        restore_faces: false,
        tiling: false,
        override_settings: {
          sd_model_checkpoint: this.modelName,
        },
        override_settings_restore_afterwards: true,
      };

      const data = await this.postTxt2Img(payload);
      
      if (!data.images || data.images.length === 0) {
        throw new Error('No image generated');
      }

      const imageBase64 = data.images[0];
      const blob = this.base64ToBlob(imageBase64, 'image/png');
      
      return blob;
    } catch (error: any) {
      console.error('SD 1.5 generation error:', error);
      throw new Error(error.message || 'Failed to generate NFT image');
    }
  }

  async generateWithStyle(
    analysis: ProfileAnalysis, 
    customStyle: string
  ): Promise<Blob> {
    const prompt = this.constructPrompt(analysis, customStyle);
    const negativePrompt = this.getNegativePrompt();

    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error(`Stable Diffusion server unreachable at ${this.apiUrl}`);
      }

      const payload = {
        prompt: prompt,
        negative_prompt: negativePrompt,
        steps: 30,
        cfg_scale: 7.5,
        width: 512,
        height: 512,
        sampler_name: 'DPM++ 2M Karras',
        batch_size: 1,
        n_iter: 1,
        seed: -1,
        restore_faces: false,
        tiling: false,
        override_settings: {
          sd_model_checkpoint: this.modelName,
        },
        override_settings_restore_afterwards: true,
      };

      const data = await this.postTxt2Img(payload);
      
      if (!data.images || data.images.length === 0) {
        throw new Error('No image generated');
      }

      const imageBase64 = data.images[0];
      const blob = this.base64ToBlob(imageBase64, 'image/png');
      
      return blob;
    } catch (error: any) {
      console.error('SD 1.5 styled generation error:', error);
      throw new Error('Failed to generate styled NFT image');
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const res = await axios.get(`${this.apiUrl}/sdapi/v1/sd-models`, { timeout: 10000 });
      return res.status === 200;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const res = await axios.get(`${this.apiUrl}/sdapi/v1/sd-models`, { timeout: 10000 });
      if (res.status !== 200) throw new Error('Failed to fetch models');
      const models = res.data;
      return models.map((m: any) => m.title || m.model_name);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  async getCurrentModel(): Promise<string | null> {
    try {
      const res = await axios.get(`${this.apiUrl}/sdapi/v1/options`, { timeout: 10000 });
      if (res.status !== 200) throw new Error('Failed to fetch current model');
      const options = res.data;
      return options.sd_model_checkpoint || null;
    } catch (error) {
      console.error('Failed to fetch current model:', error);
      return null;
    }
  }

  async setModel(modelName: string): Promise<boolean> {
    try {
      const res = await axios.post(`${this.apiUrl}/sdapi/v1/options`, { sd_model_checkpoint: modelName }, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });
      if (res.status === 200) {
        this.modelName = modelName;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to set model:', error);
      return false;
    }
  }

  private async postTxt2Img(payload: any, maxRetries = 3): Promise<any> {
    let attempt = 0;
    let lastError: any = null;

    while (attempt < maxRetries) {
      try {
        const resp = await axios.post(`${this.apiUrl}/sdapi/v1/txt2img`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 120000, // 2 minutes
        });

        if (resp.status !== 200) {
          throw new Error(`API request failed: ${resp.status} - ${JSON.stringify(resp.data)}`);
        }

        return resp.data;
      } catch (err: any) {
        lastError = err;
        const status = err.response?.status;
        // Don't retry for client errors (4xx)
        if (status && status >= 400 && status < 500) {
          break;
        }

        attempt++;
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`txt2img attempt ${attempt} failed: ${err.message}. Retrying in ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }

    throw lastError;
  }

  private constructPrompt(
    analysis: ProfileAnalysis, 
    customStyle?: string
  ): string {
    const { profile, personality } = analysis;
    
    let prompt = '';

    prompt += 'centered portrait, sharp focus, professional avatar style, ';

    if (customStyle) {
      prompt += `${customStyle}, `;
    } else {
      prompt += this.getArtStyleForTone(personality.tone);
    }

    prompt += this.describeCharacterFromProfile(profile);
    prompt += ', ';

    prompt += this.getPersonalityFeatures(personality.tone);
    prompt += ', ';

    if (personality.topics && personality.topics.length > 0) {
      prompt += this.getTopicElements(personality.topics);
      prompt += ', ';
    }

    prompt += this.getBackgroundForTone(personality.tone);
    prompt += ', ';

    prompt += 'highly detailed, professional quality, sharp, vibrant colors, masterpiece, best quality';

    return prompt;
  }

  private getArtStyleForTone(tone: string): string {
    const styles: Record<string, string> = {
      professional: 'digital art, clean design, modern aesthetic, corporate style, ',
      casual: 'vibrant digital art, friendly style, approachable design, ',
      humorous: 'playful art style, fun design, creative expression, ',
      inspirational: 'ethereal digital art, uplifting design, motivational aesthetic, ',
      technical: 'futuristic digital art, tech-inspired design, geometric patterns, ',
    };
    return styles[tone] || styles.professional;
  }

  private getPersonalityFeatures(tone: string): string {
    const features: Record<string, string> = {
      professional: 'confident expression, business attire, polished appearance',
      casual: 'friendly expression, relaxed style, comfortable appearance',
      humorous: 'playful expression, creative outfit, fun accessories',
      inspirational: 'serene expression, elegant style, graceful pose',
      technical: 'focused expression, tech wear, innovative accessories',
    };
    return features[tone] || features.professional;
  }

  private getTopicElements(topics: string[]): string {
    const elements: string[] = [];
    
    const topicMap: Record<string, string> = {
      technology: 'tech symbols, digital elements, circuit patterns',
      blockchain: 'crypto symbols, blockchain visualization, digital currency icons',
      ai: 'AI elements, neural network patterns, futuristic tech',
      web3: 'Web3 symbols, decentralized network icons, crypto aesthetic',
      defi: 'DeFi symbols, finance icons, trading elements',
      nft: 'NFT badges, digital collectible aesthetic, unique art elements',
      gaming: 'gaming elements, pixel art touches, game UI inspiration',
      metaverse: 'virtual world elements, immersive design, 3D aesthetic',
    };

    topics.slice(0, 3).forEach(topic => {
      const element = topicMap[topic.toLowerCase()];
      if (element) elements.push(element);
    });

    return elements.join(', ');
  }

  private getBackgroundForTone(tone: string): string {
    const backgrounds: Record<string, string> = {
      professional: 'gradient background, professional lighting, clean backdrop',
      casual: 'urban background, natural lighting, casual setting',
      humorous: 'colorful background, playful atmosphere, fun setting',
      inspirational: 'cosmic background, ethereal lighting, inspiring atmosphere',
      technical: 'geometric background, tech environment, digital space',
    };
    return backgrounds[tone] || backgrounds.professional;
  }

  private describeCharacterFromProfile(profile: any): string {
    const username = profile.username?.toLowerCase() || '';
    const description = profile.description?.toLowerCase() || '';
    
    let characterDesc = 'unique character avatar';

    if (username.includes('dev') || username.includes('tech') || description.includes('developer')) {
      characterDesc += ', tech-savvy appearance, developer vibes';
    }
    if (username.includes('art') || username.includes('design') || description.includes('artist')) {
      characterDesc += ', creative artistic look';
    }
    if (username.includes('crypto') || username.includes('web3') || description.includes('blockchain')) {
      characterDesc += ', crypto enthusiast style';
    }
    if (username.includes('founder') || username.includes('ceo') || description.includes('entrepreneur')) {
      characterDesc += ', leadership presence, entrepreneurial energy';
    }

    if (profile.verified) {
      characterDesc += ', premium verified aura, distinguished appearance';
    }

    return characterDesc;
  }

  private getNegativePrompt(): string {
    return 'blurry, low quality, distorted, deformed, ugly, bad anatomy, worst quality, low resolution, pixelated, amateur, watermark, signature, text, duplicate, mutation';
  }

  private base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

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