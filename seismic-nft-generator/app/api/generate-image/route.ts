// app/api/generate-image/route.ts
// OPTIMIZED VERSION WITH STYLE SELECTION

import { NextRequest, NextResponse } from 'next/server';
import { StableDiffusionOptimized, NFTStyle, QualityPreset } from '../../../lib/stableDiffusionOptimized';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      profileAnalysis, 
      style,      // Optional: 'cartoon', 'cyberpunk', 'anime', etc.
      quality,    // Optional: 'preview', 'balanced', 'quality', 'ultra'
      variations  // Optional: number of variations to generate
    } = body;

    if (!profileAnalysis) {
      return NextResponse.json(
        { error: 'Profile analysis required' },
        { status: 400 }
      );
    }

    console.log('🎨 Starting NFT generation...');
    console.log('   User:', profileAnalysis.profile.username);
    console.log('   Style:', style || 'auto');
    console.log('   Quality:', quality || 'balanced');

    // Create client
    const client = new StableDiffusionOptimized(
      'http://localhost:7860',
      'v1-5-pruned-emaonly.safetensors'
    );

    // Check connection
    const connected = await client.checkConnection();
    if (!connected) {
      return NextResponse.json({
        error: 'Stable Diffusion not running',
        help: 'Start with: ./webui.sh --api --listen',
        status: 'offline'
      }, { status: 503 });
    }

    console.log('✅ SD connected');

    // Generate variations if requested
    if (variations && variations > 1) {
      console.log(`📸 Generating ${variations} variations...`);
      
      const start = Date.now();
      const blobs = await client.generateVariations(
        profileAnalysis,
        variations,
        style as NFTStyle
      );
      const duration = ((Date.now() - start) / 1000).toFixed(1);

      const images = await Promise.all(
        blobs.map(blob => client.blobToBase64(blob))
      );

      console.log(`✅ Generated ${variations} variations in ${duration}s`);

      return NextResponse.json({
        success: true,
        images: images.map(img => `data:image/png;base64,${img}`),
        metadata: {
          count: variations,
          time: `${duration}s`,
          avgTime: `${(parseFloat(duration) / variations).toFixed(1)}s per image`
        }
      });
    }

    // Single image generation
    const start = Date.now();
    
    let blob: Blob;
    if (style) {
      // Generate with specific style
      blob = await client.generateWithStyle(
        profileAnalysis,
        style as NFTStyle,
        quality as QualityPreset || 'balanced'
      );
    } else {
      // Auto-select style
      blob = await client.generateNFTImage(
        profileAnalysis,
        quality as QualityPreset || 'balanced'
      );
    }

    const duration = ((Date.now() - start) / 1000).toFixed(1);

    console.log(`✅ Generated in ${duration}s`);

    const base64 = await client.blobToBase64(blob);

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64}`,
      metadata: {
        model: 'sd-1.5-optimized',
        style: style || 'auto',
        quality: quality || 'balanced',
        time: `${duration}s`,
        size: blob.size
      }
    });

  } catch (error: any) {
    console.error('❌ Generation failed:', error);
    return NextResponse.json(
      { 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET() {
  try {
    const client = new StableDiffusionOptimized();
    const connected = await client.checkConnection();
    const models = connected ? await client.getAvailableModels() : [];

    return NextResponse.json({
      status: connected ? 'online' : 'offline',
      models: models.length,
      available_styles: ['cartoon', 'pixel', 'anime', 'illustrative', 'cyberpunk', 'cute', 'premium'],
      available_qualities: ['preview', 'balanced', 'quality', 'ultra']
    });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}