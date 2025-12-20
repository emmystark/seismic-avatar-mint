// lib/quickTest.ts
import { StableDiffusionOptimized } from './stableDiffusionOptimized';

async function test() {
  console.log('\n🧪 Testing SD Setup...\n');

  const client = new StableDiffusionOptimized();
  
  // Test 1: Connection
  console.log('1. Testing connection...');
  const connected = await client.checkConnection();
  
  if (!connected) {
    console.log('❌ Failed! Start SD with: ./webui.sh --api --listen\n');
    return;
  }
  
  console.log('✅ Connected!\n');

  // Test 2: Generate
  console.log('2. Generating test image (30s)...');
  
  try {
    const start = Date.now();
    const blob = await client.generateNFTImage({
      profile: { username: 'test' },
      personality: { tone: 'professional', topics: ['tech'] }
    });
    const time = ((Date.now() - start) / 1000).toFixed(1);
    
    console.log(`✅ Success! (${time}s, ${(blob.size/1024).toFixed(0)}KB)\n`);
    console.log('🎉 Everything works!\n');
  } catch (err: any) {
    console.log('❌ Failed:', err.message, '\n');
  }
}

test();