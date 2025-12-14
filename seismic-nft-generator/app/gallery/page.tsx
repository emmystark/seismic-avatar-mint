'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// This would typically fetch from a database or IPFS
// For now, we'll use mock data
const mockNFTs = [
  {
    id: '1',
    username: 'elonmusk',
    imageUrl: 'https://via.placeholder.com/400x400/667eea/ffffff?text=NFT+1',
    name: 'Elon Musk - Seismic NFT',
    tone: 'humorous',
  },
  {
    id: '2',
    username: 'vitalikbuterin',
    imageUrl: 'https://via.placeholder.com/400x400/764ba2/ffffff?text=NFT+2',
    name: 'Vitalik Buterin - Seismic NFT',
    tone: 'technical',
  },
  {
    id: '3',
    username: 'naval',
    imageUrl: 'https://via.placeholder.com/400x400/f093fb/ffffff?text=NFT+3',
    name: 'Naval - Seismic NFT',
    tone: 'inspirational',
  },
];

export default function GalleryPage() {
  const [nfts, setNfts] = useState(mockNFTs);
  const [filter, setFilter] = useState<string>('all');

  const filteredNFTs = filter === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.tone === filter);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            ← Seismic NFT
          </Link>
          <Link 
            href="/generate"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Generate NFT
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">NFT Gallery</h1>
          <p className="text-gray-300 text-lg">
            Explore NFTs created by the Seismic community
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {['all', 'professional', 'casual', 'humorous', 'inspirational', 'technical'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNFTs.map((nft) => (
            <div 
              key={nft.id}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-blue-500 transition-all transform hover:scale-105"
            >
              <img 
                src={nft.imageUrl} 
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-gray-400 text-sm mb-2">@{nft.username}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-500/30 px-3 py-1 rounded-full text-xs capitalize">
                    {nft.tone}
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No NFTs found with this filter</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Create Your Own NFT</h2>
            <p className="text-gray-300 mb-6">
              Join the community and generate your personalized NFT today
            </p>
            <Link 
              href="/generate"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}