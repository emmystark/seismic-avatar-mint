// app/api/analyze-features/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouterClient } from '@/lib/openrouterClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Initialize OpenRouter client
    let client;
    try {
      client = createOpenRouterClient();
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'OpenRouter API key not configured',
          details: 'Please set OPENROUTER_API_KEY in your environment variables. Get one at https://openrouter.ai/keys'
        },
        { status: 500 }
      );
    }

    // Prepare the prompt for Gemini to analyze facial features
    const analysisPrompt = `Analyze this portrait image and extract the following facial features with high precision:

1. HAIR COLOR: Describe the exact hair color (e.g., black, dark brown, light brown, blonde, red, etc.)
2. SKIN TONE: Describe the exact skin tone (e.g., pale, fair, light, medium, tan, brown, dark brown, etc.)
3. EYE COLOR: Describe the exact eye color (e.g., brown, blue, green, hazel, gray, etc.)
4. NOSE SHAPE: Describe the nose shape (e.g., small button, round, straight, pointed, broad, narrow, etc.)
5. EAR SHAPE: Describe the ear shape (e.g., small rounded, normal sized, large, pointed, etc.)

Format your response EXACTLY as JSON with these keys:
{
  "hairColor": "string",
  "skinTone": "string",
  "eyeColor": "string",
  "noseShape": "string",
  "earShape": "string"
}

Be specific and accurate. This will be used to preserve facial features in avatar generation.`;

    console.log('📸 Analyzing facial features with OpenRouter (Gemini 2.0 Flash)...');

    try {
      const geminiResponse = await client.analyzeImage(imageBase64, analysisPrompt, {
        temperature: 0.3,
        maxTokens: 500,
      });
      console.log('✅ Gemini response received');

      // Parse the JSON response from Gemini
      let features;
      try {
        // Try to extract JSON from the response
        const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          features = JSON.parse(jsonMatch[0]);
          console.log('✅ Features parsed successfully:', features);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response:', geminiResponse);
        return NextResponse.json(
          { 
            error: 'Failed to parse feature analysis',
            details: geminiResponse,
            parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        features,
        model: 'google/gemini-2.0-flash-exp:free',
        timestamp: new Date().toISOString(),
      });
    } catch (apiError: any) {
      console.error('❌ OpenRouter API error:', apiError);

      // Handle specific error types
      if (apiError.isAuthError) {
        return NextResponse.json(
          { 
            error: 'Authentication failed',
            details: 'Invalid or expired OpenRouter API key. Get one at https://openrouter.ai/keys'
          },
          { status: 401 }
        );
      }

      if (apiError.isRateLimited) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            details: 'Please try again in a moment'
          },
          { status: 429 }
        );
      }

      if (apiError.isServiceError) {
        return NextResponse.json(
          { 
            error: 'Service temporarily unavailable',
            details: 'OpenRouter service is temporarily down. Please try again later.'
          },
          { status: 503 }
        );
      }

      // Handle timeout errors
      if (apiError.name === 'AbortError') {
        return NextResponse.json(
          { 
            error: 'Request timeout',
            details: 'Analysis took too long. Please try again.'
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to analyze image',
          details: apiError.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Unexpected error:', error);

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';