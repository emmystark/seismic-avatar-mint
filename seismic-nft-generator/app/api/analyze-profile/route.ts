import { NextRequest, NextResponse } from 'next/server';
import { XApiClient } from '@/lib/xApi';
import { RapidAPITwitterClient } from '@/lib/rapidApiClient';
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

    // Try RapidAPI first (more reliable)
    const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    const xBearerToken = process.env.NEXT_PUBLIC_X_BEARER_TOKEN;

    let profile;
    let tweets;

    // Attempt 1: Try RapidAPI if available
    if (rapidApiKey) {
      try {
        console.log('Attempting with RapidAPI...');
        const rapidClient = new RapidAPITwitterClient(rapidApiKey);
        profile = await rapidClient.getUserByUsername(username);
        tweets = await rapidClient.getUserTweets(username, 20);
        console.log('RapidAPI success!');
      } catch (rapidError) {
        console.log('RapidAPI failed, trying X API...');
      }
    }

    // Attempt 2: Try X API if RapidAPI failed or not available
    if (!profile && xBearerToken) {
      try {
        console.log('Attempting with X API...');
        const xClient = new XApiClient(xBearerToken);
        profile = await xClient.getUserByUsername(username);
        tweets = await xClient.getUserTweets(profile.id, 20);
        console.log('X API success!');
      } catch (xError) {
        console.log('X API failed');
      }
    }

    // If both failed, return error
    if (!profile) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch profile. Please check the username and try again.',
          details: 'Both RapidAPI and X API failed. Please add valid API keys to .env.local'
        },
        { status: 500 }
      );
    }

    // Analyze profile (even with empty tweets)
    const analysis = PersonalityAnalyzer.analyzeProfile(profile, tweets || []);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Profile analysis error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze profile',
        details: 'Please check your API credentials in .env.local'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';