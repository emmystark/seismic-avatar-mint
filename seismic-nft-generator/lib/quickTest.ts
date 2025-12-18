// seismic-nft-generator/lib/quickTest.ts

/**
 * QUICK TEST SCRIPT
 * Run this first to verify your Stable Diffusion setup works
 * 
 * Usage:
 *   npm run test-sd
 *   or
 *   node lib/quickTest.js
 */

import { StableDiffusion15Client } from './stableDiffusion15Client';

// Simple test profile analysis matching your ProfileAnalysis type
const testAnalysis = {
  profile: {
    username: 'testuser',
    name: 'Test User',
    description: 'Testing stable diffusion setup',
    followers: 100,
    following: 50,
    tweets: 10,
    verified: false,
    profileImageUrl: '',
    bannerImageUrl: '',
    joinDate: '2024',
    location: '',
    website: '',
  },
  personality: {
    tone: 'professional',
    topics: ['technology'],
    traits: ['innovative', 'tech-savvy'],
    sentiment: 'positive',
    communicationStyle: 'clear and concise',
  },
  insights: {
    primaryFocus: 'technology',
    expertise: ['software development'],
    audience: 'tech professionals',
    contentStrategy: 'educational and informative',
  },
};

/**
 * Simple visual test - just checks if everything connects
 */
async function simpleTest() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  STABLE DIFFUSION QUICK TEST          ║');
  console.log('╚════════════════════════════════════════╝\n');

  const client = new StableDiffusion15Client(
    'http://localhost:7860',
    'v1-5-pruned-emaonly.safetensors'
  );

  // Test 1: Connection
  console.log('1️⃣  Testing connection...');
  try {
    const connected = await client.checkConnection();
    if (connected) {
      console.log('   ✅ PASS - API is responding\n');
    } else {
      console.log('   ❌ FAIL - Cannot connect to API');
      console.log('   💡 Solution: Run ./webui.sh --api (or webui.bat --api on Windows)\n');
      return false;
    }
  } catch (error: any) {
    console.log('   ❌ FAIL - Connection error');
    console.log('   Error:', error.message);
    console.log('   💡 Make sure Automatic1111 is running on http://localhost:7860\n');
    return false;
  }

  // Test 2: Models
  console.log('2️⃣  Checking models...');
  try {
    const models = await client.getAvailableModels();
    if (models.length > 0) {
      console.log(`   ✅ PASS - Found ${models.length} model(s)`);
      console.log(`   📦 Models: ${models.slice(0, 3).join(', ')}${models.length > 3 ? '...' : ''}\n`);
      
      // Check if target model exists
      const hasTargetModel = models.some(m => 
        m.includes('v1-5-pruned-emaonly') || m.includes('v1-5')
      );
      
      if (hasTargetModel) {
        console.log('   ✅ Target model (v1-5-pruned-emaonly) found\n');
      } else {
        console.log('   ⚠️  v1-5-pruned-emaonly.safetensors not found in list');
        console.log('   💡 Using first available model for testing\n');
      }
    } else {
      console.log('   ❌ FAIL - No models found');
      console.log('   💡 Place .safetensors files in: stable-diffusion-webui/models/Stable-diffusion/\n');
      return false;
    }
  } catch (error: any) {
    console.log('   ❌ FAIL - Could not check models');
    console.log('   Error:', error.message, '\n');
    return false;
  }

  // Test 3: Current Model
  console.log('3️⃣  Checking current model...');
  try {
    const currentModel = await client.getCurrentModel();
    if (currentModel) {
      console.log(`   ✅ PASS - Currently using: ${currentModel}\n`);
    } else {
      console.log('   ⚠️  No model currently selected');
      console.log('   💡 Select a model in the Automatic1111 UI\n');
    }
  } catch (error: any) {
    console.log('   ❌ Could not check current model:', error.message, '\n');
  }

  // Test 4: Simple generation
  console.log('4️⃣  Testing simple generation...');
  console.log('   ⏳ Generating a test image (this takes 20-40 seconds)...\n');
  
  try {
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'a simple red circle on white background',
        negative_prompt: 'blurry, low quality',
        steps: 10,
        cfg_scale: 7,
        width: 256,
        height: 256,
        sampler_name: 'Euler a',
        seed: -1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation failed with status ${response.status}`);
    }

    const data = await response.json();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    if (data.images && data.images.length > 0) {
      console.log(`   ✅ PASS - Generated in ${duration}s`);
      console.log(`   📊 Image size: ~${Math.round(data.images[0].length / 1024)}KB\n`);
    } else {
      console.log('   ❌ FAIL - No image returned\n');
      return false;
    }
  } catch (error: any) {
    console.log('   ❌ FAIL - Generation error');
    console.log('   Error:', error.message);
    console.log('   💡 Check Automatic1111 console for detailed error messages\n');
    return false;
  }

  // All tests passed
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ✅ ALL TESTS PASSED!                 ║');
  console.log('║  Your setup is ready to use           ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log('📝 Next steps:');
  console.log('  1. Update your generate-image API to use StableDiffusion15Client');
  console.log('  2. Test full NFT generation with: npm run test-sd --full');
  console.log('  3. Integrate into your app/api/generate-image route\n');

  return true;
}

/**
 * Test with actual NFT generation using your personality analyzer
 */
async function fullTest() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  FULL NFT GENERATION TEST             ║');
  console.log('╚════════════════════════════════════════╝\n');

  const client = new StableDiffusion15Client();

  console.log('🎨 Generating NFT with profile analysis...');
  console.log('⏳ This will take 30-60 seconds...\n');

  try {
    const startTime = Date.now();
    const blob = await client.generateNFTImage(testAnalysis);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    console.log(`✅ SUCCESS!`);
    console.log(`⏱️  Generated in ${duration} seconds`);
    console.log(`📦 Image size: ${(blob.size / 1024).toFixed(2)} KB`);
    console.log(`📄 Image type: ${blob.type}\n`);

    // Show how to use it
    console.log('💡 To use this in your app:');
    console.log('   const blob = await client.generateNFTImage(analysis);');
    console.log('   const url = URL.createObjectURL(blob);');
    console.log('   // Use url in <img> or download\n');

    console.log('✅ Full test completed successfully!\n');
    return true;
  } catch (error: any) {
    console.log('❌ Full test failed');
    console.log('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure Automatic1111 is running: ./webui.sh --api');
    console.log('   2. Check if model is loaded in the UI');
    console.log('   3. Look at Automatic1111 console for errors\n');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--full')) {
    await fullTest();
  } else if (args.includes('--help')) {
    console.log('Stable Diffusion Test Suite\n');
    console.log('Usage:');
    console.log('  npm run test-sd          - Run basic connection test');
    console.log('  npm run test-sd --full   - Run full NFT generation test');
    console.log('  npm run test-sd --help   - Show this help\n');
  } else {
    const success = await simpleTest();
    
    if (success) {
      console.log('💡 Want to test full NFT generation?');
      console.log('   Run: npm run test-sd --full\n');
    }
  }
}

// Export for use in other files
export { simpleTest, fullTest };

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
}