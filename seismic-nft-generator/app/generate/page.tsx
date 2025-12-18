'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProfileAnalysis, NFTMetadata } from '@/types';
import NFTCard from '@/components/NFTCard';

export default function GeneratePage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'analyzing' | 'generating' | 'complete'>('input');
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [nft, setNft] = useState<NFTMetadata | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    await analyzeProfile();
  };

  const analyzeProfile = async () => {
    setLoading(true);
    setStep('analyzing');

    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', '') }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze profile');
      }

      setAnalysis(data.analysis);
      await generateNFT(data.analysis);
    } catch (err: any) {
      setError(err.message);
      setStep('input');
      setLoading(false);
    }
  };

  const generateNFT = async (profileAnalysis: ProfileAnalysis) => {
    setStep('generating');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: profileAnalysis }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate NFT');
      }

      setNft(data.nft);
      setStep('complete');
    } catch (err: any) {
      setError(err.message);
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (nft?.imageUrl) {
      const link = document.createElement('a');
      link.href = nft.imageUrl;
      link.download = `${nft.username}-seismic-nft.png`;
      link.click();
    }
  };

  const handleReset = () => {
    setUsername('');
    setAnalysis(null);
    setNft(null);
    setError('');
    setStep('input');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            ← Seismic NFT
          </Link>
          <a 
            href="https://x.com/SeismicSys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            @SeismicSys
          </a>
        </div>

        {/* Input Step */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Generate Your NFT
            </h1>
            <p className="text-gray-300 text-center mb-8">
              Enter your X (Twitter) username to create a personalized NFT avatar
            </p>

            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <label className="block mb-4">
                <span className="text-lg font-semibold mb-2 block">X Username</span>
                <div className="flex gap-2">
                  <span className="bg-white/20 px-4 py-3 rounded-lg">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="flex-1 bg-white/20 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>

              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Generate NFT'}
              </button>
            </form>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">Analyzing Your Profile</h2>
              <p className="text-gray-300">
                Reading your tweets, understanding your personality...
              </p>
            </div>
          </div>
        )}

        {/* Generating Step */}
        {step === 'generating' && analysis && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-lg">Generating your unique NFT artwork...</p>
              </div>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && nft && analysis && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
              Your Seismic Card is Ready! ⚡
            </h1>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: NFT Card Display */}
              <div className="flex flex-col gap-6">
                <NFTCard nft={nft} analysis={analysis} />
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">⬇️</span>
                    Download Card
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">🔄</span>
                    Create New
                  </button>
                </div>
              </div>

              {/* Right: Profile Stats & Info */}
              <div className="space-y-6">
                {/* User Profile Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={analysis.profile.profileImageUrl} 
                      alt={analysis.profile.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{analysis.profile.name}</h2>
                      <p className="text-blue-400">@{analysis.profile.username}</p>
                      {analysis.profile.verified && (
                        <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{analysis.profile.description}</p>
                </div>

                {/* X Activity Stats */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-blue-400">𝕏</span> Activity Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Total Posts</p>
                      <p className="text-3xl font-bold">{formatNumber(analysis.profile.tweetCount)}</p>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Followers</p>
                      <p className="text-3xl font-bold">{formatNumber(analysis.profile.followersCount)}</p>
                    </div>
                    <div className="bg-pink-500/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Following</p>
                      <p className="text-3xl font-bold">{formatNumber(analysis.profile.followingCount)}</p>
                    </div>
                    <div className="bg-cyan-500/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Engagement</p>
                      <p className="text-3xl font-bold capitalize">{analysis.personality.engagement}</p>
                    </div>
                  </div>
                  
                  {/* Recent Engagement Stats */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm font-semibold mb-3 text-gray-400">Recent 20 Posts Average:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-red-500/10 rounded p-2">
                        <p className="text-lg font-bold text-red-400">{formatNumber(analysis.engagementStats.avgLikes)}</p>
                        <p className="text-xs text-gray-400">❤️ Likes</p>
                      </div>
                      <div className="text-center bg-green-500/10 rounded p-2">
                        <p className="text-lg font-bold text-green-400">{formatNumber(analysis.engagementStats.avgRetweets)}</p>
                        <p className="text-xs text-gray-400">🔄 Retweets</p>
                      </div>
                      <div className="text-center bg-blue-500/10 rounded p-2">
                        <p className="text-lg font-bold text-blue-400">{formatNumber(analysis.engagementStats.avgReplies)}</p>
                        <p className="text-xs text-gray-400">💬 Replies</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seismic Activity (Mock Data - Replace with real data) */}
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    ⚡ Seismic Activity
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">12</p>
                      <p className="text-xs text-gray-400">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">45</p>
                      <p className="text-xs text-gray-400">Retweets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">89</p>
                      <p className="text-xs text-gray-400">Comments</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400 text-center">
                      Member since {new Date(analysis.profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* NFT Traits */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">NFT Traits</h3>
                  <div className="space-y-2">
                    {nft.attributes.map((attr, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <span className="text-gray-400 text-sm">{attr.trait_type}</span>
                        <span className="font-semibold text-sm capitalize">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seismic Badge */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-center">
                  <p className="text-2xl font-bold mb-2">⚡ Seismic Certified</p>
                  <p className="text-sm opacity-90">
                    This NFT is officially branded by Seismic
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}