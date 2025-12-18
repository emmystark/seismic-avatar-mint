import { NextRequest, NextResponse } from 'next/server';
import { StableDiffusion15Client } from '@/lib/stableDiffusion15Client';
import { ProfileAnalysis, NFTMetadata } from '@/types';



import { ComfyUIClient } from '@/lib/comfyuiClient';





export async function POST(req: NextRequest) {
  const client = new ComfyUIClient();
  
  try {
    const { analysis, customStyle } = await req.json();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Profile analysis is required' },
        { status: 400 }
      );
    }

    // Initialize SD 1.5 client
    const apiUrl = process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860';
    const sd15Client = new StableDiffusion15Client(apiUrl);

    // Generate image with SD 1.5
    let imageBlob: Blob;
    if (customStyle) {
      imageBlob = await sd15Client.generateWithStyle(analysis, customStyle);
    } else {
      imageBlob = await sd15Client.generateNFTImage(analysis);
    }

    // Convert Blob to base64
    const base64Image = await sd15Client.blobToBase64(imageBlob);
    // const imageUrl = `data:image/png;base64,${base64Image}`;

    const imageUrl = await client.generateNFTImage(analysis);

    // Create NFT metadata
    const nftMetadata: NFTMetadata = {
      name: `${analysis.profile.name} - Seismic NFT`,
      description: `Personalized NFT for @${analysis.profile.username} created by Seismic using Stable Diffusion 1.5. This unique artwork represents their digital personality and online presence.`,
      imageUrl,
      attributes: [
        {
          trait_type: 'Username',
          value: analysis.profile.username,
        },
        {
          trait_type: 'Personality Tone',
          value: analysis.personality.tone,
        },
        {
          trait_type: 'Activity Level',
          value: analysis.personality.activityLevel,
        },
        {
          trait_type: 'Engagement',
          value: analysis.personality.engagement,
        },
        {
          trait_type: 'Sentiment',
          value: analysis.personality.sentiment,
        },
        {
          trait_type: 'Primary Topics',
          value: analysis.personality.topics.join(', ') || 'General',
        },
        {
          trait_type: 'Art Style',
          value: 'Stable Diffusion 1.5',
        },
        {
          trait_type: 'Seismic Branded',
          value: 'true',
        },
      ],
      createdAt: new Date().toISOString(),
      username: analysis.profile.username,
      seismicBranded: true,
    };

    return NextResponse.json({
      success: true,
      nft: nftMetadata,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate NFT image' },
      { status: 500 }
    );
  }
}

// Use Node.js runtime
export const runtime = 'nodejs';