// lib/nftOptimizedConfig.ts
// OPTIMIZED CONFIGURATION FOR NFT-STYLE AVATARS

export const NFTStyles = {
  // Like Bored Apes, Cool Cats
  cartoon: {
    prompt: 'cartoon character art, bold outlines, vibrant flat colors, iconic PFP design, collectible avatar style',
    negative: 'realistic, photographic, blurry, low quality',
    cfg_scale: 8,
  },
  
  // Like CryptoPunks style
  pixel: {
    prompt: '16-bit pixel art, retro gaming aesthetic, pixelated character, 8-bit style, iconic pixel avatar',
    negative: 'smooth, realistic, high poly, 3D',
    cfg_scale: 7,
  },
  
  // Like Azuki, Doodles
  anime: {
    prompt: 'anime art style, manga aesthetic, vibrant colors, expressive character, Japanese animation inspired',
    negative: 'realistic, western cartoon, 3D render',
    cfg_scale: 7.5,
  },
  
  // Like World of Women, VeeFriends
  illustrative: {
    prompt: 'digital illustration, hand-drawn style, artistic character design, painterly quality, unique avatar',
    negative: 'photorealistic, low quality, pixelated',
    cfg_scale: 8,
  },
  
  // Like Clone X, RTFKT
  cyberpunk: {
    prompt: 'cyberpunk style, neon colors, futuristic tech aesthetic, digital avatar, sci-fi character design',
    negative: 'medieval, fantasy, realistic photography',
    cfg_scale: 8.5,
  },
  
  // Like Pudgy Penguins
  cute: {
    prompt: 'cute character design, chibi style, adorable avatar, kawaii aesthetic, charming collectible',
    negative: 'scary, dark, realistic, aggressive',
    cfg_scale: 7,
  },
  
  // Like Moonbirds, Proof Collective  
  premium: {
    prompt: 'premium collectible art, high-end NFT aesthetic, exclusive avatar design, luxury digital art',
    negative: 'cheap looking, amateur, low effort',
    cfg_scale: 9,
  },
};

export const NFTBackgrounds = {
  solid: 'solid color background, clean backdrop, minimalist',
  gradient: 'gradient background, smooth color transition',
  cosmic: 'cosmic background, space theme, stars and nebula',
  urban: 'urban background, city vibes, street art aesthetic',
  abstract: 'abstract geometric background, modern patterns',
  tech: 'technological background, digital patterns, futuristic',
};

export const NFTTraits = {
  // Outfit/Clothing
  outfits: [
    'hoodie',
    'suit and tie',
    'leather jacket',
    'tech wear',
    'casual shirt',
    'futuristic armor',
    'streetwear',
  ],
  
  // Accessories
  accessories: [
    'cool sunglasses',
    'VR headset',
    'gold chain',
    'headphones',
    'cap',
    'face mask',
    'earrings',
  ],
  
  // Expressions
  expressions: [
    'confident smirk',
    'friendly smile',
    'serious look',
    'playful expression',
    'cool and calm',
    'excited',
  ],
  
  // Special effects
  effects: [
    'glowing aura',
    'holographic effects',
    'neon glow',
    'sparkles',
    'energy particles',
  ],
};

export class NFTPromptOptimizer {
  /**
   * Generate optimized NFT prompt based on profile
   */
  static generatePrompt(
    personality: { tone: string; topics: string[] },
    profile: any,
    style: keyof typeof NFTStyles = 'cartoon'
  ): { prompt: string; negative: string; cfg_scale: number } {
    
    const selectedStyle = NFTStyles[style];
    
    // Build main prompt
    const components = [
      // Base style
      selectedStyle.prompt,
      
      // Character traits based on profile
      this.getCharacterStyle(profile),
      
      // Personality-based features
      this.getPersonalityFeatures(personality.tone),
      
      // Topic elements
      this.getTopicStyle(personality.topics),
      
      // Background
      this.getBackground(personality.tone),
      
      // Quality modifiers
      'highly detailed',
      'professional NFT quality',
      'trending on OpenSea',
      'collectible avatar',
      '8k resolution',
      'sharp focus',
    ];
    
    return {
      prompt: components.filter(Boolean).join(', '),
      negative: selectedStyle.negative + ', blurry, deformed, ugly, bad anatomy, watermark, signature, text',
      cfg_scale: selectedStyle.cfg_scale,
    };
  }
  
  private static getCharacterStyle(profile: any): string {
    const traits: string[] = [];
    const username = profile.username?.toLowerCase() || '';
    
    if (username.includes('crypto') || username.includes('web3')) {
      traits.push('crypto enthusiast vibe', NFTTraits.accessories[1]); // VR headset
    }
    if (username.includes('dev') || username.includes('tech')) {
      traits.push('tech-savvy character', NFTTraits.accessories[3]); // headphones
    }
    if (username.includes('art') || username.includes('design')) {
      traits.push('creative artistic style', 'unique fashion sense');
    }
    if (profile.verified) {
      traits.push('elite status', 'premium quality', NFTTraits.effects[0]); // glowing aura
    }
    
    return traits.length > 0 ? traits.slice(0, 3).join(', ') : 'unique character design';
  }
  
  private static getPersonalityFeatures(tone: string): string {
    const features: Record<string, string> = {
      professional: `${NFTTraits.outfits[1]}, ${NFTTraits.expressions[2]}, sophisticated look`,
      casual: `${NFTTraits.outfits[4]}, ${NFTTraits.expressions[1]}, relaxed vibe`,
      humorous: `${NFTTraits.expressions[3]}, fun accessories, playful character`,
      inspirational: `${NFTTraits.effects[3]}, uplifting presence, positive energy`,
      technical: `${NFTTraits.outfits[3]}, ${NFTTraits.accessories[1]}, futuristic elements`,
    };
    return features[tone] || features.professional;
  }
  
  private static getTopicStyle(topics: string[]): string {
    const topicStyles: Record<string, string> = {
      technology: 'tech elements, digital aesthetic, innovation theme',
      blockchain: 'crypto symbols, decentralized vibe, Web3 aesthetic',
      ai: 'artificial intelligence theme, futuristic tech, neural patterns',
      gaming: 'gamer aesthetic, esports vibe, gaming culture',
      art: 'artistic flair, creative design, expressive style',
      music: 'musical elements, artistic vibe, creative expression',
    };
    
    return topics
      .slice(0, 2)
      .map(t => topicStyles[t.toLowerCase()])
      .filter(Boolean)
      .join(', ') || '';
  }
  
  private static getBackground(tone: string): string {
    const backgrounds: Record<string, string> = {
      professional: NFTBackgrounds.gradient,
      casual: NFTBackgrounds.urban,
      humorous: NFTBackgrounds.abstract,
      inspirational: NFTBackgrounds.cosmic,
      technical: NFTBackgrounds.tech,
    };
    return backgrounds[tone] || NFTBackgrounds.solid;
  }
}

/**
 * Preset configurations for different generation scenarios
 */
export const GenerationPresets = {
  // Fast preview (10-15 seconds)
  preview: {
    steps: 15,
    width: 384,
    height: 384,
    sampler_name: 'Euler a',
  },
  
  // Balanced (20-30 seconds)
  balanced: {
    steps: 25,
    width: 512,
    height: 512,
    sampler_name: 'DPM++ 2M Karras',
  },
  
  // High quality (40-60 seconds)
  quality: {
    steps: 35,
    width: 512,
    height: 512,
    sampler_name: 'DPM++ SDE Karras',
  },
  
  // Ultra quality (60-90 seconds)
  ultra: {
    steps: 50,
    width: 768,
    height: 768,
    sampler_name: 'DPM++ SDE Karras',
  },
};

/**
 * Recommended models for NFT generation
 */
export const RecommendedModels = {
  // Best overall for NFTs
  dreamshaper: 'dreamshaper_8.safetensors',
  
  // Great for portraits
  deliberate: 'deliberate_v2.safetensors',
  
  // Anime style
  anything: 'anything-v5.safetensors',
  
  // Realistic
  realistic: 'realisticVision_v51.safetensors',
  
  // Default
  sd15: 'v1-5-pruned-emaonly.safetensors',
};