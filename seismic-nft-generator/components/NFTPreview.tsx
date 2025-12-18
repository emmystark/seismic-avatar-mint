import React from 'react';

export default function NFTCardPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
        <div className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse delay-500" />
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-md">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-3xl animate-pulse" />
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border-2 border-purple-500/40 shadow-2xl backdrop-blur-xl">
          
          {/* Seismic Logo Header */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-2 rounded-full shadow-lg">
              <h3 className="text-white font-bold text-xl tracking-wider">⚡ SEISMIC</h3>
            </div>
          </div>

          {/* Username label */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl px-4 py-3 mb-4 border border-blue-500/40">
            <p className="text-white font-bold text-center text-xl tracking-wide">
              @YourUsername
            </p>
          </div>

          {/* NFT Image Container - DYNAMIC CONTENT AREA */}
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-purple-500/50 shadow-2xl">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/40 z-10" />
            
            {/* Placeholder - Replace with actual NFT */}
            <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎨</div>
                <p className="font-bold text-2xl mb-2">Your NFT Here</p>
                <p className="text-sm opacity-80">Generated dynamically</p>
              </div>
            </div>

            {/* Seismic watermark */}
            <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-500/50">
              <p className="text-purple-400 text-xs font-bold">⚡ SEISMIC</p>
            </div>

            {/* Sparkle effects */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping" />
            <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-8 left-6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          </div>

          {/* Personality Badge */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-purple-500/40">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl border-2 border-white/20 shadow-lg">
                ⚡
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Technical Poster</p>
                <p className="text-gray-400 text-xs">Active on X • High Engagement</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Tech-savvy, innovative, builder. Master of cutting-edge technology and Web3 innovation.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30 text-center hover:bg-blue-500/20 transition-colors">
              <p className="text-blue-400 text-xs font-semibold mb-1">Posts</p>
              <p className="text-white text-lg font-bold">1.2K</p>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30 text-center hover:bg-purple-500/20 transition-colors">
              <p className="text-purple-400 text-xs font-semibold mb-1">Followers</p>
              <p className="text-white text-lg font-bold">850</p>
            </div>
            <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-500/30 text-center hover:bg-pink-500/20 transition-colors">
              <p className="text-pink-400 text-xs font-semibold mb-1">Avg Likes</p>
              <p className="text-white text-lg font-bold">42</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center border border-white/20 shadow-md">
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
              <p className="text-gray-400 text-xs font-semibold">Seismic Cards</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-500/40">
              <p className="text-yellow-400 text-xs font-bold">✨ RARE</p>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-400/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-400/50 rounded-bl-lg" />
          
          {/* Top left glow */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -translate-x-12 -translate-y-12" />
          {/* Bottom right glow */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl translate-x-12 translate-y-12" />
        </div>

        {/* Floating crystals */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 -left-12 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-lg opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Info text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-gray-400 text-sm mb-2">
          ⬆️ Static Frame • Dynamic NFT Inside
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>✨ Seismic Branded</span>
          <span>🎨 Custom Generated</span>
          <span>⚡ Web3 Ready</span>
        </div>
      </div>
    </div>
  );
}