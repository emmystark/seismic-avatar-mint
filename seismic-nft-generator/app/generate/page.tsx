'use client';

import { useState, useRef } from 'react';

export default function GeneratePage() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setReferenceImage(base64);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!referenceImage) {
      setError('Please upload a reference image first');
      return;
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🎄 Seismic Christmas Avatar Generator
          </h1>
          <p className="text-gray-300 text-lg">
            Transform your photo into a festive NFT avatar with Christmas trees, lights & snow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
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

            <button
              onClick={handleGenerate}
              disabled={!referenceImage || loading}
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
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">✨ What You'll Get:</h3>
                <ul className="text-gray-200 text-sm space-y-1">
                  <li>• Christmas trees with decorations</li>
                  <li>• Glowing string lights</li>
                  <li>• Falling snowflakes</li>
                  <li>• Winter wonderland background</li>
                  <li>• SEISMIC official watermark</li>
                </ul>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">⚙️ Optimized Settings:</h3>
                <ul className="text-gray-200 text-sm space-y-1">
                  <li>• CFG Scale: 10</li>
                  <li>• Steps: 20</li>
                  <li>• Denoising: 0.46</li>
                  <li>• Sampler: DPM++ 2M Karras</li>
                  <li>• Model: DreamShaper 8</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Generated Result */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">✨ Your Christmas Avatar</h2>
            
            {loading && (
              <div className="flex flex-col items-center justify-center h-96 bg-black/20 rounded-lg">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500"></div>
                  <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-t-4 border-red-500" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <p className="text-white font-bold text-xl mb-2">🎄 Creating your Christmas avatar...</p>
                <p className="text-gray-300 text-sm">Adding Christmas trees, lights & snow ❄️</p>
                <p className="text-gray-400 text-xs mt-4">This usually takes 15-30 seconds</p>
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
                    }}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    🔄 Generate Another
                  </button>
                </div>
              </div>
            )}

            {!generatedImage && !loading && (
              <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-white/30 rounded-lg bg-black/20">
                <div className="text-center px-6">
                  <p className="text-gray-300 text-xl mb-3">🎁 Your Christmas avatar will appear here</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload a photo and click generate to create your festive NFT avatar
                  </p>
                  <div className="text-6xl mb-4">🎄</div>
                  <p className="text-gray-500 text-xs">
                    Complete with Christmas trees, glowing lights, and falling snow!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 text-center">
            <div className="text-3xl mb-2">🎄</div>
            <h3 className="text-white font-bold mb-2">Christmas Background</h3>
            <p className="text-gray-300 text-sm">
              Decorated trees, glowing lights, and falling snow in every avatar
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 text-center">
            <div className="text-3xl mb-2">🏷️</div>
            <h3 className="text-white font-bold mb-2">SEISMIC Branding</h3>
            <p className="text-gray-300 text-sm">
              Official watermark included for authenticity
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-white font-bold mb-2">Fast Generation</h3>
            <p className="text-gray-300 text-sm">
              Optimized for speed - ready in 15-30 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}