/**
 * NFT GENERATION CONFIG
 *
 * This configuration has been optimized for creating Web3 NFTs that feel organic, humane, and uniquely personal.
 * Prompts emphasize hand-crafted aesthetics, subtle imperfections, and emotional depth to avoid typical AI-generated artifacts.
 * Styles draw from human artistic traditions, with dynamic adaptations based on user personality, topics, and engagement.
 * Use natural language in prompts, reference real artists, and incorporate asymmetry and texture for a beautiful, lifelike feel.
 */
export const NFTConfig = {
  /**
   * GENERATION PARAMETERS
   * Tuned for higher detail with organic variation; lower guidance for creative freedom and less perfection.
   */
  generationParams: {
    numInferenceSteps: 50, // Increased for nuanced details and subtle textures (40-60 recommended for humane feel)
    guidanceScale: 7.0, // Balanced for creative interpretation while staying true to prompt (6-8 for natural variation)
    width: 1024, // High resolution for intricate, hand-like details
    height: 1024, // Square format for versatile NFT display
  },

  /**
   * BASE ART STYLES
   * Redesigned to evoke human artistry: inspired by painters, illustrators, and craftsmen.
   * Incorporates organic elements like brush strokes, subtle asymmetry, and emotional warmth to feel less digital.
   * Examples reference artists like Alphonse Mucha for flow, or Norman Rockwell for humanity.
   */
  artStyles: {
    professional: 'elegant watercolor illustration in the style of Alphonse Mucha, fluid lines, subtle asymmetry, warm human touch, artisanal craftsmanship, gentle gradients',
    casual: 'loose sketchbook drawing inspired by urban street artists like Banksy, imperfect lines, textured paper effect, relaxed vibe, handwritten notes in margins',
    humorous: 'whimsical ink and wash caricature in the style of Quentin Blake, exaggerated yet endearing features, playful smudges, joyful energy, hand-colored accents',
    inspirational: 'dreamy oil painting reminiscent of Caspar David Friedrich, ethereal yet grounded in human emotion, soft brushwork, natural imperfections, soulful depth',
    technical: 'detailed technical illustration like Leonardo da Vinci\'s sketches, precise yet organic lines, aged paper texture, inventive gadgets with humane scale',
  },

  /**
   * CHARACTER FEATURES
   * Enhanced for humanity: add personal quirks, natural expressions, and imperfect details.
   * Makes each NFT feel like a portrait of a real person, dynamic per user personality.
   */
  characterFeatures: {
    professional: {
      outfit: 'tailored suit with subtle wrinkles and personal flair like a favorite pin',
      accessories: 'vintage pocket watch, reading glasses with slight smudges, leather notebook',
      expression: 'thoughtful gaze with faint smile lines, conveying quiet confidence and warmth',
      pose: 'natural stance with slight weight shift, as if mid-conversation, hands gesturing subtly',
    },
    casual: {
      outfit: 'comfortable jeans and layered shirt with rolled sleeves, faded from wear',
      accessories: 'woven bracelet, well-worn backpack, coffee stain on sleeve for realism',
      expression: 'easygoing smile with crinkled eyes, hint of mischief or daydream',
      pose: 'relaxed lean against invisible wall, one hand in pocket, the other adjusting cap organically',
    },
    humorous: {
      outfit: 'mismatched quirky ensemble like polka-dot tie with striped shirt, slightly rumpled',
      accessories: 'comical prop like a rubber chicken or oversized bowtie, with hand-drawn doodles',
      expression: 'cheeky grin with raised eyebrow, laugh lines, tongue-in-cheek warmth',
      pose: 'playful gesture frozen in motion, like juggling invisible balls, with natural imbalance',
    },
    inspirational: {
      outfit: 'flowing scarf and simple robes with hand-stitched patterns, wind-swept fabric',
      accessories: 'pendant necklace with personal engraving, book of poetry clutched gently',
      expression: 'serene eyes with subtle wisdom wrinkles, radiating inner peace and empathy',
      pose: 'contemplative sit with crossed legs, head tilted as if listening to nature, soft shadows',
    },
    technical: {
      outfit: 'lab coat with pocket protectors and subtle oil stains, rolled-up sleeves',
      accessories: 'blueprint sketches in hand, augmented reality glasses slightly askew',
      expression: 'curious furrowed brow with spark of excitement, human focus lines',
      pose: 'leaning over workbench, one hand adjusting a gadget, natural posture curve',
    },
  },

  /**
   * TOPIC-BASED ELEMENTS
   * Dynamic additions based on user interests, with humane integrations like personal stories or emotional ties.
   * Avoid generic icons; use narrative elements for uniqueness.
   */
  topicElements: {
    technology: {
      background: 'workshop filled with hand-built prototypes, warm lamplight casting soft shadows',
      effects: 'faint circuit etchings like tattoos, sparks of innovation with organic flow',
      colors: 'earthy metallics, soft blue glows, aged copper patina for humane tech feel',
    },
    business: {
      background: 'bustling marketplace with handwritten signs, personal vendor interactions',
      effects: 'network of handshakes and shared ideas, rising graphs drawn in chalk',
      colors: 'rich mahogany, golden hour lighting, subtle green growth motifs',
    },
    design: {
      background: 'artist\'s atelier with scattered sketches and color swatches on wooden tables',
      effects: 'creative bursts like paint drips, harmonious shapes with slight imperfections',
      colors: 'muted pastels blending into vibrant pops, like a lived-in palette',
    },
    finance: {
      background: 'old ledger books with handwritten entries, family heirloom coins',
      effects: 'flowing wealth streams like rivers, balanced scales with human touch',
      colors: 'deep emerald greens, antique golds, subtle red ledger lines',
    },
    lifestyle: {
      background: 'cozy home interior with personal mementos, window views to nature',
      effects: 'daily ritual elements like steaming tea, journal entries, gentle motion blur',
      colors: 'warm neutrals with pops of personal favorite hues, soft diffused light',
    },
    gaming: {
      background: 'immersive game den with posters and controllers, friends in background',
      effects: 'pixel artifacts blended with real-world textures, achievement badges hand-painted',
      colors: 'nostalgic arcade glows, deep purples, energetic oranges with fade',
    },
  },

  /**
   * COLOR SCHEMES
   * Evolved for emotional depth: use analogous palettes with subtle variations for humane warmth.
   */
  colorSchemes: {
    positive: 'harmonious warm analogs like sunset oranges and soft yellows, with natural desaturation',
    neutral: 'balanced earth tones, gentle blues and grays with subtle texture variations',
    negative: 'moody deep shades with highlights, like twilight purples and shadowed indigos, emotional depth',
  },

  /**
   * ENGAGEMENT-BASED EFFECTS
   * Add dynamic layers based on user activity, focusing on humane energy rather than digital effects.
   */
  engagementEffects: {
    high: 'vibrant life energy with subtle motion lines, like a captured moment in time',
    medium: 'balanced composition with natural highlights, inviting viewer interaction',
    low: 'introspective quietude, soft focus with thoughtful negative space',
  },

  /**
   * SEISMIC BRANDING
   * Integrated organically: make it feel like a personal talisman rather than a logo.
   */
  seismicBranding: {
    element: 'hand-carved purple crystal amulet, with unique facets per user',
    placement: 'integrated naturally, perhaps worn or held by character',
    style: 'subtly glowing with inner light, organic integration, no hard edges',
  },

  /**
   * NEGATIVE PROMPT
   * Expanded to aggressively avoid AI hallmarks: symmetry, perfection, digital artifacts.
   */
  negativePrompt: [
    // Quality issues
    'blurry, pixelated, jpeg artifacts, noise, over-sharpened, unnatural smoothness',
    // Anatomical issues
    'bad anatomy, deformed, disfigured, extra limbs, missing limbs, symmetrical features, perfect skin',
    // Unwanted styles
    'photorealistic, CGI, 3D render, claymation, digital art, vector graphics, flat design',
    // Text and watermarks
    'text, watermark, signature, logo, username, grid lines',
    // Composition issues
    'cropped, out of frame, centered composition, repetitive patterns, sterile environment',
    // AI-specific artifacts
    'AI generated look, unnatural symmetry, plastic texture, doll-like eyes, mannequin pose, generic background',
    'washed-out colors, distorted shadows, harsh lighting, lack of emotion, robotic expression',
  ].join(', '),

  /**
   * QUALITY MODIFIERS
   * Focus on humane artistry: emphasize hand-made feel, emotional connection.
   */
  qualityModifiers: [
    'masterful hand-drawn artwork',
    'emotional depth and humanity',
    'subtle imperfections for realism',
    'inspired by classical masters',
    'unique personal touch',
    'beautiful organic composition',
    'trending in Web3 galleries',
    'collectible NFT masterpiece',
  ].join(', '),
};

/**
 * QUICK PRESETS
 * Updated for humane twists on popular NFT styles, adding personal dynamism.
 */
export const NFTPresets = {
  // Bored Ape with humane evolution
  boredApe: {
    baseStyle: 'expressive primate portrait in impressionist style like Van Gogh, textured brushstrokes, soulful eyes, personal backstory hints',
    background: 'dreamy abstract landscape with emotional depth',
  },
  // CryptoPunks reimagined
  cryptoPunk: {
    baseStyle: 'pixel art with hand-pixeled imperfections, retro yet humane faces, limited palette with subtle gradients',
    background: 'vintage poster background with aged effects',
  },
  // Azuki enhanced
  azuki: {
    baseStyle: 'anime-inspired but with traditional ink wash, fluid human emotions, subtle asymmetry in features',
    background: 'serene garden with natural elements',
  },
  // Doodles humanized
  doodles: {
    baseStyle: 'charming hand-sketched characters like children\'s book illustrations, warm imperfections, joyful narratives',
    background: 'whimsical hand-painted world',
  },
  // Cool Cats personalized
  coolCats: {
    baseStyle: 'stylish feline anthropomorph in mixed media collage, layered textures, expressive humane attitudes',
    background: 'urban mural with street art authenticity',
  },
};

/**
 * HELPER: Get complete prompt configuration
 * Enhanced to compose a dynamic, user-specific prompt string.
 */
export function getPromptConfig(personality: any) {
  const tone = personality.tone;
  const sentiment = personality.sentiment;
  const engagement = personality.engagement;
  return {
    artStyle: NFTConfig.artStyles[tone as keyof typeof NFTConfig.artStyles],
    features: NFTConfig.characterFeatures[tone as keyof typeof NFTConfig.characterFeatures],
    colors: NFTConfig.colorSchemes[sentiment as keyof typeof NFTConfig.colorSchemes],
    effects: NFTConfig.engagementEffects[engagement as keyof typeof NFTConfig.engagementEffects],
  };
}