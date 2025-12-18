/**
 * NFT GENERATION CONFIG - ANIME CARD STYLE (Monad Inspired)
 *
 * Optimized for anime-style character cards like Monad Cards
 * Clean anime aesthetic with personality-based variations
 */
export const NFTConfig = {
  /**
   * GENERATION PARAMETERS
   * Optimized for anime character style
   * Added img2img settings to transform user's PFP into NFT-style image
   * Use with init_image set to the user's PFP (local path or URL, depending on your setup)
   * Model: v1-5-pruned-emaonly.safetensors (run locally with Stable Diffusion)
   * For img2img mode: strength controls how much to change the original PFP (0.0 = no change, 1.0 = full generation)
   */
  generationParams: {
    numInferenceSteps: 25,
    guidanceScale: 8.0,
    width: 512,
    height: 512,
    strength: 0.75, // Denoising strength for img2img; adjust based on how much to stylize the PFP (lower = closer to original)
    // initImage: 'path/to/user_pfp.jpg' // Set this to the user's PFP file path or URL in your local generation script
  },
  /**
   * BASE ART STYLES - ANIME FOCUSED
   * Clean anime character art that works as PFPs
   */
  artStyles: {
    professional: 'anime character portrait, business professional style, sharp suit, confident CEO look, clean anime art style, bold cel shading, defined outlines',
    casual: 'anime character portrait, casual streetwear style, relaxed cool vibe, modern anime aesthetic, vibrant colors, urban fashion',
    humorous: 'anime character portrait, funny comedic expression, exaggerated features, playful anime style, bright cheerful colors, meme energy',
    inspirational: 'anime character portrait, wise mentor aesthetic, serene expression, mystical vibes, fantasy anime style, magical elements',
    technical: 'anime character portrait, tech genius style, cyberpunk aesthetic, futuristic elements, sci-fi anime design, holographic details',
  },
  /**
   * CHARACTER FEATURES - ANIME STYLE
   * Inspired by successful anime NFT collections
   */
  characterFeatures: {
    professional: {
      outfit: 'sharp business suit, Seismic logo pin on lapel, executive tie, professional attire',
      accessories: 'designer glasses, expensive watch, briefcase with Seismic emblem',
      expression: 'confident smirk, determined eyes, professional aura',
      pose: 'power pose, arms crossed, commanding presence',
      special: 'purple Seismic energy aura, glowing crystal emblem on chest',
      hairStyle: 'slicked back professional hair, clean corporate style',
    },
    casual: {
      outfit: 'Seismic branded hoodie with large logo, streetwear jacket, trendy outfit',
      accessories: 'Seismic cap, designer headphones, chain with crystal pendant',
      expression: 'cool relaxed smile, confident look, chill vibes',
      pose: 'casual stance, hands in pockets, laid-back energy',
      special: 'purple energy trails, floating Seismic symbols',
      hairStyle: 'messy stylish hair, modern casual look',
    },
    humorous: {
      outfit: 'funny costume, oversized Seismic t-shirt, colorful accessories',
      accessories: 'comedy glasses, party hat with logo, confetti effects',
      expression: 'big grin, tongue out, playful wink',
      pose: 'silly gesture, jumping pose, comedic stance',
      special: 'sparkles and stars, comic effects, Seismic glow',
      hairStyle: 'wild crazy hair, exaggerated anime style',
    },
    inspirational: {
      outfit: 'mystical robes with Seismic patterns, flowing garments, spiritual attire',
      accessories: 'glowing crystal staff, magical amulet, halo effect',
      expression: 'serene wise eyes, peaceful smile, enlightened look',
      pose: 'meditation pose, arms raised, spiritual stance',
      special: 'purple cosmic energy, geometric Seismic mandalas',
      hairStyle: 'flowing elegant hair, mystical aesthetic',
    },
    technical: {
      outfit: 'futuristic tech suit, cybernetic enhancements, LED armor with Seismic logo',
      accessories: 'holographic visor, robotic arm, tech implants',
      expression: 'focused intense gaze, determined look, tech-enhanced eyes',
      pose: 'dynamic action pose, interacting with holograms',
      special: 'digital effects, circuit patterns, purple glitch art',
      hairStyle: 'sleek futuristic hair, tech-enhanced style',
    },
  },
  /**
   * SEISMIC BRANDING - INTEGRATED NATURALLY
   */
  seismicBranding: {
    logo: 'Seismic logo prominently displayed on clothing or accessory',
    crystal: 'purple glowing crystal gem element integrated naturally',
    colors: 'signature purple (#8B5CF6) accents throughout design',
    effects: 'subtle purple energy aura and glow effects',
  },
  /**
   * ANIME-SPECIFIC SETTINGS
   */
  animeSettings: {
    lineArt: 'bold clean outlines, anime line art style',
    shading: 'cel shading, flat color anime aesthetic',
    eyes: 'expressive anime eyes, large and detailed',
    features: 'clean anime facial features, stylized proportions',
  },
  /**
   * BACKGROUND STYLES - SIMPLE AND CLEAN
   */
  backgrounds: {
    solid: 'solid gradient background, purple to blue fade, clean simple design',
    cosmic: 'space background with stars, purple nebula, cosmic aesthetic',
    geometric: 'abstract geometric patterns, Seismic crystal shapes, modern design',
    urban: 'stylized city backdrop, neon purple lights, urban anime aesthetic',
  },
  /**
   * COLOR SCHEMES
   */
  colorSchemes: {
    positive: 'vibrant bright colors, warm tones, cheerful palette with purple accents',
    neutral: 'balanced cool colors, blues and purples, professional anime palette',
    negative: 'dark moody colors, deep purples and blacks, dramatic lighting',
  },
  /**
   * NEGATIVE PROMPT - ANIME OPTIMIZED
   */
  negativePrompt: [
    'realistic', 'photo', 'photograph', 'photorealistic', '3D render',
    'ugly', 'blurry', 'low quality', 'distorted', 'deformed',
    'bad anatomy', 'extra limbs', 'poorly drawn face',
    'bad proportions', 'gross', 'disfigured',
    'text', 'watermark', 'signature', 'username',
    'multiple views', 'split image', 'out of frame',
    'western cartoon', 'disney style',
  ].join(', '),
  /**
   * QUALITY MODIFIERS - ANIME FOCUSED
   */
  qualityModifiers: [
    'high quality anime art',
    'professional anime illustration',
    'clean line art',
    'vibrant colors',
    'detailed anime character',
    'trending on pixiv',
    'NFT collection quality',
    'anime PFP style',
    'collectible character art',
  ].join(', '),
  /**
   * COMPOSITION - ANIME PFP STYLE
   */
  composition: {
    framing: 'bust portrait, head and upper torso, centered composition',
    angle: 'front-facing or slight angle, clear view of face',
    focus: 'sharp focus on character, anime style portrait',
  },
};
/**
 * ANIME NFT PRESETS
 */
export const NFTPresets = {
  // Monad Cards style (like your examples)
  monadStyle: {
    baseStyle: 'anime character portrait, clean cel shaded art, bold outlines, Monad Cards aesthetic, vibrant colors, professional anime illustration',
    background: 'gradient background purple to blue, simple clean design',
  },
  // Azuki style
  azukiStyle: {
    baseStyle: 'anime character portrait, street fashion aesthetic, urban cool style, clean modern anime art, detailed outfit',
    background: 'minimal gradient background, Japanese aesthetic',
  },
  // Murakami style
  murakamiStyle: {
    baseStyle: 'cute anime character, colorful playful design, kawaii aesthetic, simple shapes, bold colors',
    background: 'solid bright color background, pop art style',
  },
};
/**
 * HELPER: Get anime prompt configuration
 */
export function getPromptConfig(personality: any) {
  const tone = personality.tone;
  const sentiment = personality.sentiment;
  return {
    artStyle: NFTConfig.artStyles[tone as keyof typeof NFTConfig.artStyles],
    features: NFTConfig.characterFeatures[tone as keyof typeof NFTConfig.characterFeatures],
    colors: NFTConfig.colorSchemes[sentiment as keyof typeof NFTConfig.colorSchemes],
    anime: NFTConfig.animeSettings,
    branding: NFTConfig.seismicBranding,
    composition: NFTConfig.composition,
  };
}
/**
 * CONSTRUCT FULL PROMPT - MONAD CARDS STYLE
 * Edited to incorporate user's PFP description for img2img generation
 * Use img2img mode with v1-5-pruned-emaonly.safetensors locally
 * pfpDescription: A textual description of the user's X PFP (e.g., "purple frog smoking a cigar")
 * Obtain pfpDescription by viewing the image (e.g., via AI analysis or manual description)
 */
export function constructMonadStylePrompt(username: string, personality: any, pfpDescription: string): string {
  const config = getPromptConfig(personality);
  // Build the prompt
  let prompt = '';
  // 1. Start with PFP as base for stylization (for img2img)
  if (pfpDescription) {
    prompt += `stylized anime NFT version of ${pfpDescription}, `;
  }
  // 2. Base style - MOST IMPORTANT
  prompt += 'anime character portrait, ';
  prompt += 'clean cel shaded illustration, ';
  prompt += 'bold black outlines, ';
  // 3. Art style based on personality
  prompt += `${config.artStyle}, `;
  // 4. Character features
  prompt += `${config.features.outfit}, `;
  prompt += `${config.features.hairStyle}, `;
  prompt += `${config.features.expression}, `;
  // 5. Seismic branding
  prompt += 'Seismic logo visible on clothing, ';
  prompt += 'purple glowing crystal element, ';
  // 6. Background
  prompt += 'gradient purple to blue background, ';
  // 7. Quality tags
  prompt += 'high quality anime art, professional illustration, vibrant colors, NFT collection style, trending on pixiv';
  return prompt;
}