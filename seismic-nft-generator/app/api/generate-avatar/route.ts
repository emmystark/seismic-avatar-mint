// app/api/generate-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SD_API_URL = process.env.STABLE_DIFFUSION_API_URL || 'http://127.0.0.1:7860';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      referenceImage,
      features, // NEW: Received from frontend after Gemini analysis
      cfg_scale = 10,
      steps = 20,
      denoising_strength = 0.46,
      seed = -1,
      sampler_name = 'DPM++ 2M Karras',
    } = body;

    // Build prompt with EXTRACTED FEATURES
    const featurePrompt = features ? `
PRESERVE THESE EXACT FEATURES FROM ANALYSIS:
- Hair Color: ${features.hairColor}
- Skin Tone: ${features.skinTone}
- Eye Color: ${features.eyeColor}
- Nose Shape: ${features.noseShape}
- Ear Shape: ${features.earShape}
CRITICAL: Maintain these exact features, do not alter them.
` : '';

    const prompt = `anime style NFT avatar wearing red Santa hat with white fur trim, brown winter jacket with neon green accents and geometric patterns, festive red and green Christmas details, cozy holiday theme, hexagonal tech badge, professional uniform style, clean line art, hexagonal portrait frame, Christmas NFT collection, digital illustration, festive but modern aesthetic,

${featurePrompt}

CHRISTMAS BACKGROUND SCENE: 
winter wonderland background, decorated Christmas trees with glowing lights and ornaments, string lights hanging across scene, falling snowflakes, snow-covered ground, festive holiday atmosphere, bokeh light effects from Christmas lights, magical winter scenery, twinkling fairy lights, red and green decorations, Christmas village setting, warm holiday glow,

SEISMIC BRANDING:
"SEISMIC" logo watermark overlay, official brand mark,

high quality, vibrant colors, professional digital art`.trim();

    const negative_prompt = `
wrong hair color, different hair color, changed hair color, altered skin tone, wrong skin tone, different skin tone, changed eye color, wrong eye color, different nose, wrong nose shape, different ears, wrong ear shape, changed facial features, different face, realistic photo, photorealistic, 3d render, ugly, deformed, bad anatomy, blurry, low quality, watermark (except SEISMIC logo), amateur, messy, no Christmas elements, missing SEISMIC logo, plain background, solid color background, empty background, boring background, generic background, minimalist background
    `.trim();

    const payload = {
      init_images: [referenceImage],
      prompt,
      negative_prompt,
      steps: 20,
      cfg_scale: 10,
      width: 768,
      height: 768,
      denoising_strength: 0.46,
      seed,
      sampler_name,
      restore_faces: false,
      override_settings: {
        sd_model_checkpoint: 'dreamshaper_8.safetensors',
      },
    };

    console.log('Sending request to Stable Diffusion API with features:', features);
    
    const response = await fetch(`${SD_API_URL}/sdapi/v1/img2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SD API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate image', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      image: result.images[0],
      info: result.info,
      parameters: result.parameters,
      usedFeatures: features,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${SD_API_URL}/sdapi/v1/sd-models`);
    const models = await response.json();
    
    return NextResponse.json({
      status: 'online',
      available_models: models.map((m: any) => m.model_name),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'offline', error: 'Could not connect to Stable Diffusion API' },
      { status: 503 }
    );
  }
}