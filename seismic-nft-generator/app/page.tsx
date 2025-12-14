import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Seismic NFT Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your X (Twitter) personality into a unique, AI-generated NFT. 
            Each artwork is crafted based on your profile, tweets, and digital presence.
          </p>
          <Link 
            href="/generate"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Generate Your NFT
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Art</h3>
            <p className="text-gray-300">
              Advanced AI analyzes your tweets and profile to create personalized artwork
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">Personality Analysis</h3>
            <p className="text-gray-300">
              Deep learning algorithms understand your unique online personality
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Seismic Branded</h3>
            <p className="text-gray-300">
              Every NFT carries the exclusive Seismic identity and branding
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold mb-2">Enter Username</h4>
              <p className="text-sm text-gray-300">Provide your X (Twitter) username</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-300">We analyze your profile and tweets</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold mb-2">Generate Art</h4>
              <p className="text-sm text-gray-300">AI creates your unique NFT</p>
            </div>

            <div className="text-center">
              <div className="bg-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold mb-2">Download & Share</h4>
              <p className="text-sm text-gray-300">Get your personalized NFT</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Powered by <span className="text-blue-400 font-bold">Seismic</span></p>
          <a 
            href="https://x.com/SeismicSys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            @SeismicSys
          </a>
        </div>
      </div>
    </main>
  );
}