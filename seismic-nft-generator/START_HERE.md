# ⚡ OpenRouter - Start Here!

## 🎯 Get Started in 5 Minutes

### Step 1: API Key (2 min)
```
👉 Visit: https://openrouter.ai/keys
✂️ Copy your key (starts with sk-or-v1-)
```

### Step 2: Configuration (1 min)
```bash
# Add to .env.local:
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_APP_NAME=Seismic Avatar Mint
OPENROUTER_SITE_URL=http://localhost:3000
```

### Step 3: Validate (1 min)
```bash
npm run test-openrouter
# ✅ Should see: "All checks passed!"
```

### Step 4: Start (1 min)
```bash
npm run dev
```

## ✅ Done!

Your setup is complete. Visit http://localhost:3000/generate to test.

---

## 📚 Need Help?

### "How do I use this?"
→ Read: [OPENROUTER_QUICK_REF.md](OPENROUTER_QUICK_REF.md)

### "Something isn't working"
→ Run: `npm run test-openrouter`
→ Then read: [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) - Troubleshooting

### "I want to understand everything"
→ Start: [INDEX.md](INDEX.md)

---

## 🔑 Keep Your API Key Safe!
- ✅ Only in `.env.local` (never commit!)
- ✅ Never share or hardcode
- ✅ Regenerate at https://openrouter.ai/keys if exposed

---

## 💻 Quick Code Example

```typescript
import { createOpenRouterClient } from '@/lib/openrouterClient';

const client = createOpenRouterClient();
const result = await client.analyzeImage(
  imageBase64,
  "Analyze facial features",
  { temperature: 0.3, maxTokens: 500 }
);
```

---

**Status**: ✅ Ready to Use  
**Cost**: $0.00 (free tier)  
**Support**: See [INDEX.md](INDEX.md)

👉 **Next**: Open [OPENROUTER_QUICK_REF.md](OPENROUTER_QUICK_REF.md) for code patterns
