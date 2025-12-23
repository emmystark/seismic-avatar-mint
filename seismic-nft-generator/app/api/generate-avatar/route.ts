// app/api/generate-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SD_API_URL = process.env.STABLE_DIFFUSION_API_URL || 'http://127.0.0.1:7860';

interface GenerationParams {
  prompt: string;
  negative_prompt: string;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  seed?: number;
  sampler_name?: string;
  denoising_strength?: number;
  init_images?: string[]; // Base64 encoded images for img2img
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      referenceImage, // Base64 image from user
      cfg_scale = 2,
      steps = 20,
      denoising_strength = 0.46,
      seed = -1,
      sampler_name = 'DPM++ 2M Karras',
    } = body;

    // Build the Christmas + Seismic prompt with background
    const prompt = `anime style NFT avatar wearing red Santa hat with white fur trim, brown winter jacket with neon green accents and geometric patterns, festive red and green Christmas details, cozy holiday theme, hexagonal tech badge, professional uniform style, clean line art, hexagonal portrait frame, warm beige background, Christmas NFT collection, digital illustration, festive but modern aesthetic`.trim();

//     const negative_prompt = `
// wrong hair color, way different hair color, changed hair color, altered skin tone, changed eye color, wrong eye color, different background, wrong background color, different ears, wrong ear shape, changed facial features, different face, realistic photo, photorealistic, 3d render, ugly, deformed, bad anatomy, blurry, low quality, watermark (except SEISMIC logo), amateur, messy, no Christmas elements, missing SEISMIC logo, plain background, solid color background, empty background, boring background, generic background, minimalist background
//     `.trim();

    // Prepare img2img request with your exact settings
    const payload: any = {
      init_images: [referenceImage], // Base64 encoded
      prompt,
    //   negative_prompt,
      steps: 20,
      cfg_scale: 10,
      width: 768,
      height: 768,
      denoising_strength: 0.59,
      seed,
      sampler_name,
      restore_faces: false,
      override_settings: {
        sd_model_checkpoint: 'dreamshaper_8.safetensors',
      },
    };

    console.log('Sending request to Stable Diffusion API...');
    
    // Call Stable Diffusion API
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
    
    // Return the generated image (base64)
    return NextResponse.json({
      success: true,
      image: result.images[0], // Base64 image
      info: result.info,
      parameters: result.parameters,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if SD is running
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