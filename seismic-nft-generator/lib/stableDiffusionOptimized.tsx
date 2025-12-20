// lib/stableDiffusionOptimized.tsx
// OPTIMIZED FOR SPEED AND NFT QUALITY

import { NFTPromptOptimizer, GenerationPresets, NFTStyles } from './nftOptimizedConfig';

export interface ProfileAnalysis {
  profile: any;
  personality: {
    tone: string;
    topics: string[];
  };
}

export type NFTStyle = keyof typeof NFTStyles;
export type QualityPreset = keyof typeof GenerationPresets;

export class StableDiffusionOptimized {
  private apiUrl: string;
  private modelName: string;

  constructor(
    apiUrl: string = 'http://localhost:7860',
    modelName: string = 'dreamshaper_8.safetensors'
  ) {
    this.apiUrl = apiUrl;
    this.modelName = modelName;
  }

  /**
   * Generate NFT with automatic style selection
   */
  async generateNFTImage(
    analysis: ProfileAnalysis,
    preset: QualityPreset = 'balanced'
  ): Promise<Blob> {
    // Auto-select style based on personality
    const style = this.autoSelectStyle(analysis.personality.tone);
    return this.generateWithStyle(analysis, style, preset);
  }

  /**
   * Generate with specific NFT style
   */
  async generateWithStyle(
    analysis: ProfileAnalysis,
    style: NFTStyle = 'cartoon',
    preset: QualityPreset = 'balanced'
  ): Promise<Blob> {
    
    const { prompt, negative, cfg_scale } = NFTPromptOptimizer.generatePrompt(
      analysis.personality,
      analysis.profile,
      style
    );
    
    const settings = GenerationPresets[preset];
    
    console.log(`🎨 Generating ${style} style NFT (${preset} quality)...`);
    console.log(`⏱️  Estimated time: ${this.estimateTime(preset)}`);

    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negative_prompt: negative,
          steps: settings.steps,
          cfg_scale,
          width: settings.width,
          height: settings.height,
          sampler_name: settings.sampler_name,
          batch_size: 1,
          seed: -1,
          override_settings: {
            sd_model_checkpoint: this.modelName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }

      const data = await response.json();
      if (!data.images?.[0]) throw new Error('No image generated');

      return this.base64ToBlob(data.images[0]);
    } catch (error: any) {
      console.error('❌ Generation failed:', error);
      throw new Error(error.message || 'Failed to generate NFT');
    }
  }

  /**
   * Generate multiple variations quickly
   */
  async generateVariations(
    analysis: ProfileAnalysis,
    count: number = 3,
    style: NFTStyle = 'cartoon'
  ): Promise<Blob[]> {
    console.log(`🎨 Generating ${count} variations...`);
    
    const blobs: Blob[] = [];
    for (let i = 0; i < count; i++) {
      console.log(`  ${i + 1}/${count}...`);
      const blob = await this.generateWithStyle(analysis, style, 'preview');
      blobs.push(blob);
    }
    
    return blobs;
  }

  /**
   * Check if API is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/sd-models`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/sd-models`);
      if (!response.ok) return [];
      const models = await response.json();
      return models.map((m: any) => m.title || m.model_name);
    } catch {
      return [];
    }
  }

  /**
   * Auto-select best NFT style based on tone
   */
  private autoSelectStyle(tone: string): NFTStyle {
    const styleMap: Record<string, NFTStyle> = {
      professional: 'premium',
      casual: 'cartoon',
      humorous: 'cute',
      inspirational: 'illustrative',
      technical: 'cyberpunk',
    };
    return styleMap[tone] || 'cartoon';
  }

  /**
   * Estimate generation time
   */
  private estimateTime(preset: QualityPreset): string {
    const times: Record<QualityPreset, string> = {
      preview: '10-15 seconds',
      balanced: '20-30 seconds',
      quality: '40-60 seconds',
      ultra: '60-90 seconds',
    };
    return times[preset];
  }

  private base64ToBlob(base64: string): Blob {
    const data = base64.replace(/^data:image\/\w+;base64,/, '');
    const bytes = atob(data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: 'image/png' });
  }

  async blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }
}

/**
 * Helper function to create client with recommended model
 */
export function createOptimizedClient(modelType: 'standard' | 'dreamshaper' | 'anime' = 'standard') {
  const models = {
    standard: 'v1-5-pruned-emaonly.safetensors',
    dreamshaper: 'dreamshaper_8.safetensors',
    anime: 'anything-v5.safetensors',
  };
  
  return new StableDiffusionOptimized('http://localhost:7860', models[modelType]);
}