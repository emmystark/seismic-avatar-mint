# OpenRouter Quick Reference Card

## 🚀 One-Time Setup (5 minutes)

```bash
# 1. Get API Key
# Visit: https://openrouter.ai/keys
# Copy your key (sk-or-v1-...)

# 2. Configure .env.local
echo 'OPENROUTER_API_KEY=sk-or-v1-your-key-here' >> .env.local
echo 'OPENROUTER_APP_NAME=Seismic Avatar Mint' >> .env.local
echo 'OPENROUTER_SITE_URL=http://localhost:3000' >> .env.local

# 3. Validate
npm run test-openrouter

# 4. Start dev server
npm run dev
```

## 📝 Common Code Patterns

### Pattern 1: Analyze an Image
```typescript
import { createOpenRouterClient } from '@/lib/openrouterClient';

const client = createOpenRouterClient();
const analysis = await client.analyzeImage(
  base64Image,
  "What are the facial features?",
  { temperature: 0.3, maxTokens: 500 }
);
console.log(analysis);
```

### Pattern 2: Text-Only Chat
```typescript
import { createOpenRouterClient } from '@/lib/openrouterClient';

const client = createOpenRouterClient();
const response = await client.chat_text([
  { role: 'user', content: 'Hello!' }
]);
console.log(response);
```

### Pattern 3: With Error Handling
```typescript
import { createOpenRouterClient } from '@/lib/openrouterClient';

try {
  const client = createOpenRouterClient();
  const result = await client.analyzeImage(base64Image, prompt);
  return NextResponse.json({ result });
} catch (error: any) {
  if (error.isAuthError) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }
  if (error.isRateLimited) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }
  throw error;
}
```

## 🔍 Debugging Checklist

| Issue | Check | Solution |
|-------|-------|----------|
| "API key not set" | `cat .env.local \| grep OPENROUTER` | Add key to .env.local, restart |
| "Auth failed" | Visit https://openrouter.ai/keys | Regenerate key, update .env.local |
| "Rate limited" | https://openrouter.ai/account/usage | Wait 1 hour or reduce request rate |
| "Service unavailable" | https://status.openrouter.io/ | Check status, retry in 5 min |
| "Timeout" | Check image size | Use smaller images, shorter prompts |
| "Invalid response" | Check console logs | Verify API key, try again |

## 📊 Performance Tips

```typescript
// ✅ Fast & efficient
analyzeImage(base64Image, "Extract: hair, skin, eyes", {
  temperature: 0.3,      // Lower = consistent
  maxTokens: 300         // Shorter = faster & cheaper
})

// ❌ Slow & expensive
analyzeImage(hugeBase64Image, longVerbosePrompt, {
  temperature: 1.0,      // Higher = slower
  maxTokens: 2000        // Longer = slower & more expensive
})
```

## 💾 Available Models

```typescript
// Free (always available)
'google/gemini-2.0-flash-exp:free'  // ← Currently using

// Premium (if upgraded)
'google/gemini-2.0-flash'           // Better rate limits
'openai/gpt-4-turbo'                // More capable
'anthropic/claude-3-sonnet'         // Alternative
```

## 🧪 Test Commands

```bash
# Validate everything
npm run test-openrouter

# Manual API test (if needed)
curl -X POST http://localhost:3000/api/analyze-features \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"data:image/jpeg;base64,..."}'

# Check logs
tail -f ~/.npm/_logs
```

## 📞 Emergency Support

| Issue | Action |
|-------|--------|
| No internet | Check connection, try `ping openrouter.ai` |
| OpenRouter down | Check https://status.openrouter.io/ |
| API key expired | Generate new at https://openrouter.ai/keys |
| Still stuck | Check [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) |

## 🔐 Security Reminders

```bash
# ✅ Good
.env.local              # Local secrets (in .gitignore)
process.env.OPENROUTER_API_KEY  # Server-side only

# ❌ Bad
const key = "sk-or-..."     # Hardcoded
window.apiKey = key         # Exposed to client
git add .env.local          # Committed to git
```

## 📈 Usage Monitoring

```bash
# Check usage at:
https://openrouter.ai/account/usage

# If you exceed free tier:
# 1. Reduce request frequency
# 2. Use smaller images
# 3. Reduce max_tokens
# 4. Upgrade plan if needed
```

## 🎯 Working with the Current Implementation

The analyze-features endpoint:
- Takes base64 image as input
- Returns structured JSON with facial features
- Auto-retries on transient errors
- Includes full error context

```typescript
// Input
{
  "imageBase64": "data:image/jpeg;base64,/9j/..."
}

// Success Output
{
  "success": true,
  "features": {
    "hairColor": "dark brown",
    "skinTone": "medium",
    "eyeColor": "brown",
    "noseShape": "straight",
    "earShape": "normal sized"
  },
  "model": "google/gemini-2.0-flash-exp:free",
  "timestamp": "2025-12-23T12:00:00.000Z"
}

// Error Output
{
  "error": "Rate limit exceeded",
  "details": "Please try again in a moment"
}
```

## 🚀 Production Checklist

- [ ] API key from https://openrouter.ai/keys
- [ ] .env.local configured (not committed)
- [ ] `npm run test-openrouter` passes
- [ ] Error handling implemented in routes
- [ ] Usage monitoring set up
- [ ] Rate limiting implemented (if high traffic)
- [ ] Logs reviewed for issues
- [ ] Team trained on configuration

---

**Need help?** Check [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) for detailed docs.
