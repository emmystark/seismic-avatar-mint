import { NextRequest, NextResponse } from 'next/server';
import { XApiClient } from '@/lib/xApi';
import { PersonalityAnalyzer } from '@/lib/personalityAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Initialize X API client
    const bearerToken = process.env.NEXT_PUBLIC_X_BEARER_TOKEN;
    if (!bearerToken) {
      return NextResponse.json(
        { error: 'X API credentials not configured' },
        { status: 500 }
      );
    }

    const xClient = new XApiClient(bearerToken);

    // Fetch user profile
    const profile = await xClient.getUserByUsername(username);

    // Fetch recent tweets
    const tweets = await xClient.getUserTweets(profile.id, 20);

    // Analyze profile
    const analysis = PersonalityAnalyzer.analyzeProfile(profile, tweets);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Profile analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze profile' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';