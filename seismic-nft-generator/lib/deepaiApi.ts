import axios from 'axios';
import { ProfileAnalysis } from '@/types';

export class DeepAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.deepai.org/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate NFT image based on profile analysis
   */
  async generateNFTImage(analysis: ProfileAnalysis): Promise<string> {
    const prompt = this.constructPrompt(analysis);
    
    try {
      // DeepAI expects form-data format, not JSON
      const formData = new FormData();
      formData.append('text', prompt);

      const response = await axios.post(
        `${this.baseUrl}/text2img`,
        formData,
        {
          headers: {
            'api-key': this.apiKey,
          },
        }
      );

      return response.data.output_url;
    } catch (error: any) {
      console.error('Error generating image with DeepAI:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to generate NFT image');
    }
  }

  /**
   * Construct a detailed prompt for image generation
   */
  private constructPrompt(analysis: ProfileAnalysis): string {
    const { profile, personality, keywords, suggestedStyle } = analysis;

    // Base prompt with Seismic branding
    let prompt = `Create a unique NFT artwork for ${profile.name} (@${profile.username}). `;
    
    // Add style based on personality
    prompt += `${suggestedStyle}. `;

    // Add personality elements
    prompt += `The artwork should reflect a ${personality.tone} personality `;
    
    if (personality.topics.length > 0) {
      prompt += `with themes of ${personality.topics.join(', ')}. `;
    }

    // Add specific keywords for uniqueness (filter out common words)
    const meaningfulKeywords = keywords
      .filter(k => !['https', 'with', 'your', 'from', 'that', 'this', 'have'].includes(k))
      .slice(0, 4);
    
    if (meaningfulKeywords.length > 0) {
      prompt += `Visual elements: ${meaningfulKeywords.join(', ')}. `;
    }

    // Add mood based on sentiment
    const moodMap = {
      positive: 'bright, uplifting, energetic',
      neutral: 'balanced, harmonious',
      negative: 'contemplative, dramatic',
    };
    prompt += `${moodMap[personality.sentiment]} mood. `;

    // Add Seismic branding requirement
    prompt += `Subtle Seismic watermark. `;

    // Technical specifications
    prompt += `High quality digital art, NFT style, vibrant colors, detailed, 4K, professional.`;

    return prompt;
  }

  /**
   * Generate alternative styles for the same profile
   */
  async generateWithStyle(analysis: ProfileAnalysis, customStyle: string): Promise<string> {
    const basePrompt = this.constructPrompt(analysis);
    const styledPrompt = basePrompt.replace(analysis.suggestedStyle, customStyle);

    try {
      const formData = new FormData();
      formData.append('text', styledPrompt);

      const response = await axios.post(
        `${this.baseUrl}/text2img`,
        formData,
        {
          headers: {
            'api-key': this.apiKey,
          },
        }
      );

      return response.data.output_url;
    } catch (error: any) {
      console.error('Error generating styled image:', error.response?.data || error.message);
      throw new Error('Failed to generate styled NFT image');
    }
  }

  /**
   * Enhance existing image (optional feature)
   */
  async enhanceImage(imageUrl: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', imageUrl);

      const response = await axios.post(
        `${this.baseUrl}/waifu2x`,
        formData,
        {
          headers: {
            'api-key': this.apiKey,
          },
        }
      );

      return response.data.output_url;
    } catch (error: any) {
      console.error('Error enhancing image:', error.response?.data || error.message);
      throw new Error('Failed to enhance image');
    }
  }
}