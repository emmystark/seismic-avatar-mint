import { ProfileAnalysis } from '@/types';
import { NFTConfig, getPromptConfig } from './nftConfig';

/**
 * Local Stable Diffusion 1.5 Client
 * Connects to Automatic1111 WebUI API running on localhost:7860
 * Uses the v1-5-pruned-emaonly model
 */
export class StableDiffusion15Client {
  private apiUrl: string;
  private modelName: string;

  /**
   * Initialize the client
   * @param apiUrl - URL of the Automatic1111 API (default: http://localhost:7860)
   * @param modelName - Name of the model checkpoint to use
   */
  constructor(
    apiUrl: string = 'http://localhost:7860',
    modelName: string = 'v1-5-pruned-emaonly.safetensors'
  ) {
    this.apiUrl = apiUrl;
    this.modelName = modelName;
  }

  /**
   * Generate NFT image using local SD 1.5
   */
  async generateNFTImage(analysis: ProfileAnalysis): Promise<Blob> {
    const prompt = this.constructPrompt(analysis);
    const negativePrompt = NFTConfig.negativePrompt;

    try {
      // Make request to Automatic1111 txt2img endpoint
      const response = await fetch(`${this.apiUrl}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: negativePrompt,
          steps: NFTConfig.generationParams.numInferenceSteps,
          cfg_scale: NFTConfig.generationParams.guidanceScale,
          width: 512,
          height: 512,
          sampler_name: 'DPM++ 2M Karras', // High-quality sampler
          batch_size: 1,
          n_iter: 1,
          seed: -1, // Random seed each time
          restore_faces: false, // Set to true if generating human faces
          tiling: false,
          override_settings: {
            sd_model_checkpoint: this.modelName, // Use your local model
          },
          override_settings_restore_afterwards: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.images || data.images.length === 0) {
        throw new Error('No image generated');
      }

      // Convert base64 to Blob
      const imageBase64 = data.images[0];
      const blob = this.base64ToBlob(imageBase64, 'image/png');
      
      return blob;
    } catch (error: any) {
      console.error('SD 1.5 generation error:', error);
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
      const response = await fetch(`${this.apiUrl}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: negativePrompt,
          steps: NFTConfig.generationParams.numInferenceSteps,
          cfg_scale: NFTConfig.generationParams.guidanceScale,
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
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

  /**
   * Check if the Automatic1111 API is available and responding
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/sd-models`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  /**
   * Get list of available models from Automatic1111
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/sd-models`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const models = await response.json();
      return models.map((m: any) => m.title || m.model_name);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  /**
   * Get current model being used
   */
  async getCurrentModel(): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/options`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch current model');
      }
      
      const options = await response.json();
      return options.sd_model_checkpoint || null;
    } catch (error) {
      console.error('Failed to fetch current model:', error);
      return null;
    }
  }

  /**
   * Set the model to use
   */
  async setModel(modelName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sd_model_checkpoint: modelName,
        }),
      });
      
      if (response.ok) {
        this.modelName = modelName;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to set model:', error);
      return false;
    }
  }

  /**
   * Get available samplers
   */
  async getAvailableSamplers(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/sdapi/v1/samplers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch samplers');
      }
      
      const samplers = await response.json();
      return samplers.map((s: any) => s.name);
    } catch (error) {
      console.error('Failed to fetch samplers:', error);
      return [];
    }
  }

  /**
   * Construct Web3 NFT-style prompt with Seismic branding
   */
  private constructPrompt(
    analysis: ProfileAnalysis, 
    customStyle?: string
  ): string {
    const { profile, personality } = analysis;
    
    // Get configuration for this personality
    const config = getPromptConfig(personality);

    if (!config || !config.artStyle) {
      throw new Error('Failed to generate prompt configuration');
    }

    // Start with PFP composition rules
    let prompt = '';
    if (NFTConfig.composition) {
      prompt = `${NFTConfig.composition.framing}, ${NFTConfig.composition.focus}, ${NFTConfig.composition.style}, `;
    }

    // Base art style
    prompt += customStyle || config.artStyle;
    prompt += ', ';

    // Character description
    prompt += this.describeCharacterFromProfile(profile);
    prompt += ', ';

    // Add personality-based features
    prompt += `${config.features.outfit}, `;
    prompt += `${config.features.accessories}, `;
    prompt += `${config.features.expression}, `;
    prompt += `${config.features.pose}, `;
    prompt += `${config.features.special}, `;

    // Strong Seismic branding
    prompt += `${config.branding.logo}, `;
    prompt += `${config.branding.crystal}, `;
    prompt += `${config.branding.patterns}, `;
    prompt += `${config.branding.effects}, `;
    prompt += `${config.branding.brandColors}, `;

    // Add topic elements
    const topicElements = this.getTopicElements(personality.topics);
    if (topicElements) {
      prompt += `${topicElements}, `;
    }

    // Background
    const background = this.selectBackground(personality);
    prompt += `${background}, `;

    // Colors and effects
    prompt += `${config.colors}, `;
    prompt += `${config.effects}, `;

    // Quality modifiers
    prompt += NFTConfig.qualityModifiers;

    return prompt;
  }

  private describeCharacterFromProfile(profile: any): string {
    const username = profile.username.toLowerCase();
    const bio = profile.description?.toLowerCase() || '';
    
    let characterDesc = 'unique character avatar';

    if (username.includes('dev') || username.includes('tech')) {
      characterDesc += ', tech-savvy appearance, developer vibes';
    }
    if (username.includes('art') || username.includes('design')) {
      characterDesc += ', creative artistic look';
    }
    if (username.includes('crypto') || username.includes('web3')) {
      characterDesc += ', crypto enthusiast style';
    }

    if (profile.verified) {
      characterDesc += ', premium verified aura';
    }

    return characterDesc;
  }

  private getTopicElements(topics: string[]): string {
    const elements: string[] = [];

    topics.forEach(topic => {
      const topicConfig = NFTConfig.topicElements[topic as keyof typeof NFTConfig.topicElements];
      if (topicConfig) {
        elements.push(topicConfig.background);
        elements.push(topicConfig.effects);
        elements.push(topicConfig.accessories);
      }
    });

    return elements.slice(0, 3).join(', ');
  }

  private selectBackground(personality: any): string {
    const backgrounds = NFTConfig.backgrounds;
    
    switch (personality.tone) {
      case 'professional': return backgrounds.gradient;
      case 'casual': return backgrounds.urban;
      case 'humorous': return backgrounds.solid;
      case 'inspirational': return backgrounds.cosmic;
      case 'technical': return backgrounds.geometric;
      default: return backgrounds.gradient;
    }
  }

  /**
   * Convert base64 string to Blob
   */
  private base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    
    // Decode base64
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  /**
   * Convert Blob to base64 string
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