'use client';

import { NFTMetadata, ProfileAnalysis } from '@/types';

interface NFTCardProps {
  nft: NFTMetadata;
  analysis: ProfileAnalysis;
}

export default function NFTCard({ nft, analysis }: NFTCardProps) {
  const getPersonalityIcon = () => {
    const icons = {
      professional: '💼',
      casual: '😎',
      humorous: '😂',
      inspirational: '✨',
      technical: '⚡',
    };
    return icons[analysis.personality.tone as keyof typeof icons] || '⚡';
  };

  const getPersonalityDescription = () => {
    const descriptions = {
      professional: 'Strategic, ambitious, and results-driven. Master of professional networking.',
      casual: 'Laid-back vibes, authentic content. Master of staying real and relatable.',
      humorous: 'Witty, entertaining, meme lord. Master of making people laugh.',
      inspirational: 'Visionary, motivational, uplifting. Master of inspiring change.',
      technical: 'Tech-savvy, innovative, builder. Master of cutting-edge technology.',
    };
    return descriptions[analysis.personality.tone as keyof typeof descriptions];
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />
      
      {/* Main card container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border-2 border-purple-500/30 shadow-2xl backdrop-blur-xl">
        
        {/* Seismic Logo Header */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-full">
            <h3 className="text-white font-bold text-lg tracking-wider">⚡ SEISMIC</h3>
          </div>
        </div>

        {/* Username label */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl px-4 py-3 mb-4 border border-blue-500/30">
          <p className="text-white font-bold text-center text-xl tracking-wide">
            @{analysis.profile.username}
          </p>
        </div>

        {/* NFT Image Container - THIS IS WHERE THE DYNAMIC IMAGE GOES */}
        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-purple-500/50 shadow-xl">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/30 z-10" />
          
          {/* Dynamic NFT Image */}
          <img 
            src={nft.imageUrl} 
            alt={nft.name}
            className="w-full h-full object-cover"
          />

          {/* Seismic watermark overlay */}
          <div className="absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-500/50">
            <p className="text-purple-400 text-xs font-bold">⚡ SEISMIC</p>
          </div>

          {/* Sparkle effects */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-100" />
          <div className="absolute bottom-8 left-6 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-200" />
        </div>

        {/* Personality Badge */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl border-2 border-white/20 shadow-lg">
              {getPersonalityIcon()}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm capitalize">
                {analysis.personality.tone} Poster
              </p>
              <p className="text-gray-400 text-xs">
                Active on X • {analysis.personality.engagement} Engagement
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            {getPersonalityDescription()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/30 text-center">
            <p className="text-blue-400 text-xs font-semibold">Posts</p>
            <p className="text-white text-sm font-bold">
              {analysis.profile.tweetCount > 1000 
                ? `${(analysis.profile.tweetCount / 1000).toFixed(1)}K` 
                : analysis.profile.tweetCount}
            </p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-2 border border-purple-500/30 text-center">
            <p className="text-purple-400 text-xs font-semibold">Followers</p>
            <p className="text-white text-sm font-bold">
              {analysis.profile.followersCount > 1000 
                ? `${(analysis.profile.followersCount / 1000).toFixed(1)}K` 
                : analysis.profile.followersCount}
            </p>
          </div>
          <div className="bg-pink-500/10 rounded-lg p-2 border border-pink-500/30 text-center">
            <p className="text-pink-400 text-xs font-semibold">Avg Likes</p>
            <p className="text-white text-sm font-bold">
              {analysis.engagementStats.avgLikes}
            </p>
          </div>
        </div>

        {/* Seismic Cards Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center border border-white/20">
              <span className="text-white text-xs font-bold">⚡</span>
            </div>
            <p className="text-gray-400 text-xs font-semibold">Seismic Cards</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-500/30">
            <p className="text-purple-400 text-xs font-bold">RARE</p>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-purple-500/50 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-purple-500/50 rounded-bl-lg" />
      </div>

      {/* Floating crystals decoration */}
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse delay-200" />
    </div>
  );
}