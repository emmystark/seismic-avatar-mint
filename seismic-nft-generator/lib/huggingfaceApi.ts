import { HfInference } from '@huggingface/inference';
import { ProfileAnalysis } from '@/types';
import { NFTConfig, getPromptConfig } from './nftConfig';

export class HuggingFaceClient {
  private client: HfInference;

  constructor(apiKey: string) {
    this.client = new HfInference(apiKey);
  }

  /**
   * Generate NFT image based on profile analysis and user's PFP
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
   * Construct Web3 NFT-style prompt with Seismic branding
   */
  private constructPrompt(
    analysis: ProfileAnalysis, 
    customStyle?: string
  ): string {
    const { profile, personality } = analysis;
    
    // Get configuration for this personality
    const config = getPromptConfig(personality);

    // Validate config has required properties
    if (!config || !config.artStyle) {
      console.error('Invalid prompt config:', config);
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

    // Character description based on profile
    prompt += this.describeCharacterFromProfile(profile);
    prompt += ', ';

    // Add personality-based features with Seismic branding
    prompt += `${config.features.outfit}, `;
    prompt += `${config.features.accessories}, `;
    prompt += `${config.features.expression}, `;
    prompt += `${config.features.pose}, `;
    prompt += `${config.features.special}, `;

    // Strong Seismic branding integration
    prompt += `${config.branding.logo}, `;
    prompt += `${config.branding.crystal}, `;
    prompt += `${config.branding.patterns}, `;
    prompt += `${config.branding.effects}, `;
    prompt += `${config.branding.brandColors}, `;

    // Add topic-based elements with Seismic branding
    const topicElements = this.getTopicElements(personality.topics);
    if (topicElements) {
      prompt += `${topicElements}, `;
    }

    // Background selection
    const background = this.selectBackground(personality);
    prompt += `${background}, `;

    // Color scheme
    prompt += `${config.colors}, `;

    // Engagement effects
    prompt += `${config.effects}, `;

    // Quality modifiers
    prompt += NFTConfig.qualityModifiers;

    return prompt;
  }

  /**
   * Describe character based on profile image and details
   */
  private describeCharacterFromProfile(profile: any): string {
    // Analyze username and bio for character hints
    const username = profile.username.toLowerCase();
    const bio = profile.description.toLowerCase();
    
    let characterDesc = 'unique character avatar inspired by user profile';

    // Add personality hints from username
    if (username.includes('dev') || username.includes('tech')) {
      characterDesc += ', tech-savvy appearance, developer vibes';
    }
    if (username.includes('art') || username.includes('design')) {
      characterDesc += ', creative artistic look, designer aesthetic';
    }
    if (username.includes('crypto') || username.includes('web3')) {
      characterDesc += ', crypto enthusiast style, Web3 native look';
    }

    // Add verified badge effect if verified
    if (profile.verified) {
      characterDesc += ', premium verified aura, elite status glow';
    }

    return characterDesc;
  }

  /**
   * Get topic-based visual elements with Seismic branding
   */
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

  /**
   * Select appropriate background
   */
  private selectBackground(personality: any): string {
    const backgrounds = NFTConfig.backgrounds;
    
    switch (personality.tone) {
      case 'professional':
        return backgrounds.gradient;
      case 'casual':
        return backgrounds.urban;
      case 'humorous':
        return backgrounds.solid;
      case 'inspirational':
        return backgrounds.cosmic;
      case 'technical':
        return backgrounds.geometric;
      default:
        return backgrounds.gradient;
    }
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