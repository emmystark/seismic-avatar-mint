# OpenRouter Configuration Guide

## Overview
This guide helps you properly configure OpenRouter for the Seismic Avatar Mint project. OpenRouter provides free access to Gemini 2.0 Flash and other LLMs through a unified API.

## ✅ Setup Checklist

### 1. Get Your API Key
- Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
- Sign up or log in
- Create a new API key
- Copy the key (starts with `sk-or-v1-`)

### 2. Configure Environment Variables
Add these to your `.env.local` file:

```env
# OpenRouter API (for Gemini 2.0 Flash - FREE)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Optional: Your site info for OpenRouter rankings
OPENROUTER_APP_NAME=Seismic Avatar Mint
OPENROUTER_SITE_URL=http://localhost:3000
```

### 3. Verify Configuration
Run this test to validate your setup:

```bash
npm run test-openrouter
```

Or manually test:

```bash
curl -X POST http://localhost:3000/api/analyze-features \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

## 🔑 Available Models

### Free Models
- `google/gemini-2.0-flash-exp:free` - FREE, excellent for most tasks
- Other free models rotate, check [https://openrouter.ai/models](https://openrouter.ai/models)

### Paid Models (Optional)
- `google/gemini-2.0-flash` - Premium version with higher limits
- `openai/gpt-4-turbo` - GPT-4 access
- Many others available on OpenRouter

## 🚀 Usage Examples

### In API Routes

```typescript
import { createOpenRouterClient } from '@/lib/openrouterClient';

// Analyze an image
const client = createOpenRouterClient();
const response = await client.analyzeImage(
  base64Image,
  "What do you see in this image?",
  { temperature: 0.3, maxTokens: 500 }
);

// Text-only chat
const textResponse = await client.chat_text([
  { role: 'user', content: 'Hello!' }
]);
```

### In Server Components

```typescript
import { createOpenRouterClient } from '@/lib/openrouterClient';

export default async function MyComponent() {
  const client = createOpenRouterClient();
  const response = await client.chat_text([
    { role: 'user', content: 'Hello!' }
  ]);
  
  return <div>{response}</div>;
}
```

## 🐛 Troubleshooting

### Error: "OPENROUTER_API_KEY environment variable is not set"
**Solution:** Add your API key to `.env.local` and restart your dev server.

### Error: "Authentication failed: Invalid or expired OpenRouter API key"
**Solution:** 
1. Check that your API key is correct and not expired
2. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys) to verify
3. Generate a new key if needed
4. Restart your dev server

### Error: "Rate limit exceeded"
**Solution:** The client automatically retries with exponential backoff. If you still hit limits:
1. Check your usage at [https://openrouter.ai/account/usage](https://openrouter.ai/account/usage)
2. Reduce request frequency
3. Use a smaller `max_tokens` value
4. Consider upgrading your OpenRouter plan

### Error: "Service unavailable"
**Solution:** OpenRouter API is temporarily down. The client retries automatically. Try again in a moment.

### Timeout Error
**Solution:** The request took too long (30 second timeout). Try:
1. Reduce image size
2. Lower `max_tokens` value
3. Use simpler prompts
4. Try again later if service is slow

## 📊 Request Configuration

The OpenRouter client is pre-configured with optimal settings:

- **Max Retries:** 3 (with exponential backoff)
- **Request Timeout:** 30 seconds
- **Headers:** Includes `X-Max-Retries` and `HTTP-Referer` for better ranking

## 🔒 Security Best Practices

1. **Never commit API keys** - Use `.env.local` which is gitignored
2. **Rotate keys regularly** at [https://openrouter.ai/keys](https://openrouter.ai/keys)
3. **Monitor usage** to detect unauthorized access
4. **Use rate limiting** in production (implement on your API routes)
5. **Validate inputs** before sending to OpenRouter

## 💰 Cost Management

- **Free tier:** Gemini 2.0 Flash is completely FREE
- **Usage limits:** Depends on OpenRouter's fair use policy
- **Monitor:** Check [https://openrouter.ai/account/usage](https://openrouter.ai/account/usage)
- **Limits:** If you hit free tier limits, consider:
  - Optimizing prompts for fewer tokens
  - Using smaller images for vision tasks
  - Implementing caching for repeated requests
  - Upgrading to a paid plan

## 📚 Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Available Models](https://openrouter.ai/models)
- [Pricing Information](https://openrouter.ai/pricing)
- [API Status](https://status.openrouter.io/)
- [OpenRouter Discord Community](https://discord.gg/openrouter)

## 🧪 Testing

### Test Image Analysis
```bash
curl -X POST http://localhost:3000/api/analyze-features \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "data:image/png;base64,YOUR_BASE64_IMAGE"
  }'
```

### Expected Success Response
```json
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
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review [OpenRouter documentation](https://openrouter.ai/docs)
3. Check [API Status](https://status.openrouter.io/) for outages
4. Contact OpenRouter support through their dashboard
