/**
 * QUICK TEST SCRIPT
 * Run this first to verify your setup works
 * 
 * Usage:
 *   node quickTest.js
 *   or
 *   npm run test-sd
 */

import { StableDiffusion15Client } from './stableDiffusion15Client';

// Simple test profile analysis
const testAnalysis = {
  profile: {
    username: 'testuser',
    description: 'Testing stable diffusion setup',
    verified: false,
  },
  personality: {
    tone: 'professional',
    topics: ['technology'],
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
  console.log('1. Testing connection...');
  try {
    const connected = await client.checkConnection();
    if (connected) {
      console.log('   ✅ PASS - API is responding\n');
    } else {
      console.log('   ❌ FAIL - Cannot connect to API');
      console.log('   💡 Solution: Run ./webui.sh --api\n');
      return false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Connection error');
    console.log('   Error:', error.message);
    console.log('   💡 Make sure Automatic1111 is running\n');
    return false;
  }

  // Test 2: Models
  console.log('2. Checking models...');
  try {
    const models = await client.getAvailableModels();
    if (models.length > 0) {
      console.log(`   ✅ PASS - Found ${models.length} model(s)`);
      console.log(`   Models: ${models.join(', ')}\n`);
    } else {
      console.log('   ❌ FAIL - No models found');
      console.log('   💡 Place models in: stable-diffusion-webui/models/Stable-diffusion/\n');
      return false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Could not check models');
    console.log('   Error:', error.message, '\n');
    return false;
  }

  // Test 3: Simple generation
  console.log('3. Testing generation (this takes 20-40 seconds)...');
  console.log('   ⏳ Generating a simple test image...');
  
  try {
    const startTime = Date.now();
    
    // Use fetch directly for a very simple test
    const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'a simple red circle',
        negative_prompt: 'blurry',
        steps: 10,
        cfg_scale: 7,
        width: 256,
        height: 256,
        sampler_name: 'Euler a',
        seed: -1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.status}`);
    }

    const data = await response.json();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    if (data.images && data.images.length > 0) {
      console.log(`   ✅ PASS - Generated in ${duration} seconds\n`);
    } else {
      console.log('   ❌ FAIL - No image returned\n');
      return false;
    }
  } catch (error) {
    console.log('   ❌ FAIL - Generation error');
    console.log('   Error:', error.message);
    console.log('   💡 Check Automatic1111 console for details\n');
    return false;
  }

  // All tests passed
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ✅ ALL TESTS PASSED!                 ║');
  console.log('║  Your setup is ready to use           ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log('Next steps:');
  console.log('  1. Import the StableDiffusion15Client');
  console.log('  2. Create an instance');
  console.log('  3. Call generateNFTImage(analysis)');
  console.log('  4. Use the returned Blob\n');

  return true;
}

/**
 * Test with actual NFT generation
 */
async function fullTest() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  FULL NFT GENERATION TEST             ║');
  console.log('╚════════════════════════════════════════╝\n');

  const client = new StableDiffusion15Client();

  console.log('Generating NFT with your configuration...');
  console.log('This will take 30-60 seconds...\n');

  try {
    const startTime = Date.now();
    const blob = await client.generateNFTImage(testAnalysis);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    console.log(`✅ SUCCESS!`);
    console.log(`Generated in ${duration} seconds`);
    console.log(`Image size: ${blob.size} bytes`);
    console.log(`Image type: ${blob.type}\n`);

    // Convert to base64 for display
    const base64 = await client.blobToBase64(blob);
    console.log('To display in HTML:');
    console.log(`<img src="data:image/png;base64,${base64.substring(0, 50)}..." />\n`);

    console.log('✅ Full test completed successfully!\n');
    return true;
  } catch (error) {
    console.log('❌ Full test failed');
    console.log('Error:', error.message, '\n');
    return false;
  }
}

/**
 * Interactive menu
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--full')) {
    await fullTest();
  } else if (args.includes('--help')) {
    console.log('Usage:');
    console.log('  node quickTest.js          - Run simple connection test');
    console.log('  node quickTest.js --full   - Run full NFT generation test');
    console.log('  node quickTest.js --help   - Show this help\n');
  } else {
    const success = await simpleTest();
    
    if (success) {
      console.log('Want to test full NFT generation?');
      console.log('Run: node quickTest.js --full\n');
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