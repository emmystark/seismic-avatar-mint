import { HfInference } from '@huggingface/inference';
import { ProfileAnalysis } from '@/types';
import { constructMonadStylePrompt, NFTConfig } from './nftConfig';

/**
 * Anime NFT Client - Optimized for Monad Cards style
 * Uses anime-specific models for better results
 */
export class AnimeNFTClient {
  private client: HfInference;
  
  // Anime-optimized models (fast and good quality)
  private models = {
    primary: 'Ojimi/anime-kawai-diffusion',
    fallback1: 'stablediffusionapi/anything-v5',
    fallback2: 'prompthero/openjourney-v4',
  };

  constructor(apiKey: string) {
    this.client = new HfInference(apiKey);
  }

  /**
   * Generate anime-style NFT
   */
  async generateAnimeNFT(analysis: ProfileAnalysis): Promise<Blob> {
    const prompt = this.constructAnimePrompt(analysis);
    const negativePrompt = NFTConfig.negativePrompt;

    // Try multiple models for best results
    const strategies = [
      () => this.generateWithModel(this.models.primary, prompt, negativePrompt),
      () => this.generateWithModel(this.models.fallback1, prompt, negativePrompt),
      () => this.generateWithModel(this.models.fallback2, prompt, negativePrompt),
    ];

    for (const strategy of strategies) {
      try {
        console.log('Generating anime NFT...');
        return await strategy();
      } catch (error) {
        console.log('Strategy failed, trying next...');
        continue;
      }
    }

    throw new Error('All generation strategies failed');
  }

  /**
   * Generate with specific model
   */
  private async generateWithModel(
    model: string,
    prompt: string,
    negativePrompt: string
  ): Promise<Blob> {
    return await this.client.textToImage({
      model,
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt,
        num_inference_steps: NFTConfig.generationParams.numInferenceSteps,
        guidance_scale: NFTConfig.generationParams.guidanceScale,
        width: 512,
        height: 512,
      },
    });
  }

  /**
   * Construct anime-style prompt
   */
  private constructAnimePrompt(analysis: ProfileAnalysis): string {
    const { profile, personality } = analysis;
    
    // Use the Monad-style prompt builder
    let prompt = constructMonadStylePrompt(profile.username, personality);
    
    // Add user-specific details
    if (profile.verified) {
      prompt += ', verified badge, premium character';
    }
    
    // Add topic-specific elements
    if (personality.topics.includes('technology')) {
      prompt += ', tech accessories, digital elements';
    }
    if (personality.topics.includes('gaming')) {
      prompt += ', gaming elements, esports vibes';
    }
    
    return prompt;
  }

  /**
   * Convert Blob to base64
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

/**
 * Create anime NFT client
 */
export function createAnimeNFTClient(): AnimeNFTClient | null {
  const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    console.error('NEXT_PUBLIC_HUGGINGFACE_API_KEY not found');
    return null;
  }
  
  return new AnimeNFTClient(apiKey);
}