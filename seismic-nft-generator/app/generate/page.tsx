'use client';

import { useState, useRef } from 'react';

interface FacialFeatures {
  hairColor: string;
  skinTone: string;
  eyeColor: string;
  noseShape: string;
  earShape: string;
}

export default function GeneratePage() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedFeatures, setExtractedFeatures] = useState<FacialFeatures | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setReferenceImage(base64);
      setError(null);
      setExtractedFeatures(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFeatures = async () => {
    if (!referenceImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: referenceImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Feature analysis failed');
      }

      setExtractedFeatures(data.features);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze features');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!referenceImage) {
      setError('Please upload a reference image first');
      return;
    }

    // Analyze features first if not already done
    if (!extractedFeatures) {
      await analyzeFeatures();
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceImage,
          features: extractedFeatures,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage(`data:image/png;base64,${data.image}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `seismic-christmas-avatar-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🎄 Seismic Christmas Avatar Generator
          </h1>
          <p className="text-gray-300 text-lg">
            AI-powered facial feature preservation with Christmas magic ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">📸 Upload Your Photo</h2>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all mb-6 text-lg"
            >
              Choose Profile Picture
            </button>

            {referenceImage && (
              <div className="mb-6 rounded-lg overflow-hidden border-4 border-green-500 shadow-lg">
                <img src={referenceImage} alt="Reference" className="w-full" />
              </div>
            )}

            {/* Feature Analysis Button */}
            {referenceImage && !extractedFeatures && (
              <button
                onClick={analyzeFeatures}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all mb-4"
              >
                {analyzing ? '🔍 Analyzing Features...' : '🧠 Analyze Features with AI'}
              </button>
            )}

            {/* Extracted Features Display */}
            {extractedFeatures && (
              <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3">✅ Extracted Features:</h3>
                <div className="text-gray-200 text-sm space-y-1">
                  <p><strong>Hair:</strong> {extractedFeatures.hairColor}</p>
                  <p><strong>Skin:</strong> {extractedFeatures.skinTone}</p>
                  <p><strong>Eyes:</strong> {extractedFeatures.eyeColor}</p>
                  <p><strong>Nose:</strong> {extractedFeatures.noseShape}</p>
                  <p><strong>Ears:</strong> {extractedFeatures.earShape}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!referenceImage || loading || analyzing}
              className="w-full bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg text-lg"
            >
              {loading ? '🎄 Generating Christmas Magic...' : '🎅 Generate Christmas Avatar'}
            </button>

            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-200 font-semibold">❌ {error}</p>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-6 space-y-4">
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">🤖 AI-Powered:</h3>
                <ul className="text-gray-200 text-sm space-y-1">
                  <li>• Gemini 2.0 Flash analyzes your face</li>
                  <li>• Extracts exact facial features</li>
                  <li>• Preserves your unique look</li>
                  <li>• 100% FREE AI analysis</li>
                </ul>
              </div>

              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">🎄 Christmas Magic:</h3>
                <ul className="text-gray-200 text-sm space-y-1">
                  <li>• Winter wonderland background</li>
                  <li>• Glowing Christmas lights</li>
                  <li>• Falling snowflakes</li>
                  <li>• SEISMIC watermark</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">✨ Your Christmas Avatar</h2>
            
            {(loading || analyzing) && (
              <div className="flex flex-col items-center justify-center h-96 bg-black/20 rounded-lg">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500"></div>
                  <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-t-4 border-red-500" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <p className="text-white font-bold text-xl mb-2">
                  {analyzing ? '🧠 AI analyzing your features...' : '🎄 Creating your Christmas avatar...'}
                </p>
                <p className="text-gray-300 text-sm">
                  {analyzing ? 'Extracting hair, skin, eyes, nose, ears...' : 'Adding Christmas trees, lights & snow ❄️'}
                </p>
              </div>
            )}

            {generatedImage && !loading && (
              <div>
                <div className="rounded-lg overflow-hidden border-4 border-green-500 mb-4 shadow-2xl">
                  <img src={generatedImage} alt="Generated" className="w-full" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
                  >
                    💾 Download Avatar
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedImage(null);
                      setReferenceImage(null);
                      setExtractedFeatures(null);
                    }}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    🔄 Generate Another
                  </button>
                </div>
              </div>
            )}

            {!generatedImage && !loading && !analyzing && (
              <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-white/30 rounded-lg bg-black/20">
                <div className="text-center px-6">
                  <p className="text-gray-300 text-xl mb-3">🎁 Your Christmas avatar will appear here</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload a photo → AI analyzes features → Generate festive NFT
                  </p>
                  <div className="text-6xl mb-4">🎄</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}