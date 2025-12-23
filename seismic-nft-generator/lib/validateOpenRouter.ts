#!/usr/bin/env node

/**
 * OpenRouter Configuration Validator
 * Run this to validate your OpenRouter setup
 * 
 * Usage: npx tsx lib/validateOpenRouter.ts
 */

import { createOpenRouterClient } from './openrouterClient';
import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('\n🔍 OpenRouter Configuration Validator\n', 'cyan');

  // Check 1: Environment variables
  log('1️⃣  Checking environment variables...', 'blue');
  const apiKey = process.env.OPENROUTER_API_KEY;
  const appName = process.env.OPENROUTER_APP_NAME || 'Seismic Image Generator';
  const siteUrl = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';

  if (!apiKey) {
    log('❌ OPENROUTER_API_KEY not set', 'red');
    log('   Get your key from: https://openrouter.ai/keys', 'yellow');
    process.exit(1);
  }

  if (apiKey.length < 20) {
    log('❌ API key seems too short', 'red');
    process.exit(1);
  }

  if (!apiKey.startsWith('sk-or-')) {
    log('❌ API key format looks incorrect (should start with sk-or-)', 'red');
    process.exit(1);
  }

  log(`✅ OPENROUTER_API_KEY is set (${apiKey.slice(0, 10)}...)`, 'green');
  log(`✅ App Name: ${appName}`, 'green');
  log(`✅ Site URL: ${siteUrl}`, 'green');

  // Check 2: Environment file
  log('\n2️⃣  Checking .env.local file...', 'blue');
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    if (envContent.includes('OPENROUTER_API_KEY')) {
      log('✅ .env.local file exists and contains OPENROUTER_API_KEY', 'green');
    } else {
      log('⚠️  .env.local exists but OPENROUTER_API_KEY not found', 'yellow');
    }
  } else {
    log('⚠️  .env.local file not found (using environment variables)', 'yellow');
  }

  // Check 3: Client initialization
  log('\n3️⃣  Testing OpenRouter client initialization...', 'blue');
  try {
    const client = createOpenRouterClient();
    log('✅ OpenRouter client initialized successfully', 'green');
  } catch (error: any) {
    log(`❌ Failed to initialize client: ${error.message}`, 'red');
    process.exit(1);
  }

  // Check 4: API connectivity
  log('\n4️⃣  Testing API connectivity...', 'blue');
  try {
    const client = createOpenRouterClient();
    const response = await client.chat_text([
      { role: 'user', content: 'Say hello in one word.' }
    ]);

    if (response && response.length > 0) {
      log(`✅ API connection successful`, 'green');
      log(`   Response: "${response}"`, 'cyan');
    } else {
      log('❌ Empty response from API', 'red');
      process.exit(1);
    }
  } catch (error: any) {
    log(`❌ API connection failed`, 'red');
    log(`   Error: ${error.message}`, 'yellow');

    if (error.isAuthError) {
      log('   → Check your API key at: https://openrouter.ai/keys', 'yellow');
    } else if (error.isRateLimited) {
      log('   → Rate limited. Try again in a moment.', 'yellow');
    } else if (error.isServiceError) {
      log('   → OpenRouter service unavailable. Try again later.', 'yellow');
    }

    process.exit(1);
  }

  // Summary
  log('\n✅ All checks passed! OpenRouter is properly configured.', 'green');
  log('\n📚 Next steps:', 'blue');
  log('   • Review OPENROUTER_SETUP.md for detailed documentation', 'cyan');
  log('   • Check the analyze-features API route for usage example', 'cyan');
  log('   • Run your dev server: npm run dev', 'cyan');
  log('   • Visit: http://localhost:3000/generate', 'cyan');
  log('\n');
}

main().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
