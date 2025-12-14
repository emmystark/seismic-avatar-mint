import { NextRequest, NextResponse } from 'next/server';
import { HuggingFaceClient } from '@/lib/huggingfaceApi';
import { ProfileAnalysis, NFTMetadata } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { analysis, customStyle } = await req.json();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Profile analysis is required' },
        { status: 400 }
      );
    }

    // Initialize Hugging Face client
    const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    const hfClient = new HuggingFaceClient(apiKey);

    // Generate image
    let imageBlob: Blob;
    if (customStyle) {
      imageBlob = await hfClient.generateWithStyle(analysis, customStyle);
    } else {
      imageBlob = await hfClient.generateNFTImage(analysis);
    }

    // Convert Blob to base64 data URL
    const base64Image = await hfClient.blobToBase64(imageBlob);
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Create NFT metadata
    const nftMetadata: NFTMetadata = {
      name: `${analysis.profile.name} - Seismic NFT`,
      description: `Personalized NFT for @${analysis.profile.username} created by Seismic. This unique artwork represents their digital personality and online presence.`,
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
          value: analysis.suggestedStyle.split(',')[0],
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

// Use Node.js runtime instead of Edge for Buffer support
export const runtime = 'nodejs';