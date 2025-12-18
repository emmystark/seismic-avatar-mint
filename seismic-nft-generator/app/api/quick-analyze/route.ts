import { NextRequest, NextResponse } from 'next/server';
import { quickProfileAnalysis } from '@/lib/profileScraper';

/**
 * Quick profile analysis WITHOUT API rate limits
 * Only gets username + PFP, no tweets needed
 * Perfect for free tier / no API key users
 */
export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    console.log(`Quick analyzing @${username} (no API needed)...`);

    // Get profile analysis from just username
    const analysis = await quickProfileAnalysis(username);

    console.log('Quick analysis complete!');

    return NextResponse.json({
      success: true,
      analysis,
      method: 'quick', // Indicates this used the fast method
    });

  } catch (error: any) {
    console.error('Quick analysis error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze profile',
        details: 'Could not retrieve profile information'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';