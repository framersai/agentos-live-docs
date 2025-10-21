# Environment Variables Update Guide

## 🚨 IMMEDIATE ACTION REQUIRED

You need to update both your local `.env` file and GitHub Secrets to enable the TTS optimizations.

## 1. Update Your Local `.env` File

### Step 1: Open your `.env` file
```bash
# In your project root
code .env  # or use your preferred editor
```

### Step 2: Add these NEW environment variables

Add the following lines to your `.env` file:

```env
# ============================================
# TTS PERFORMANCE OPTIMIZATIONS (NEW - Oct 2024)
# ============================================

# OpenAI TTS Configuration
OPENAI_TTS_DEFAULT_MODEL=tts-1              # tts-1 (faster) or tts-1-hd (higher quality)
OPENAI_TTS_DEFAULT_VOICE=nova               # Options: nova, alloy, echo, fable, onyx, shimmer
OPENAI_TTS_DEFAULT_SPEED=1.15               # Range: 0.25 to 4.0 (1.15 = 15% faster)
OPENAI_TTS_DEFAULT_FORMAT=opus              # Options: mp3, opus, aac, flac (opus = 40% smaller)

# TTS Cache Configuration
TTS_CACHE_MAX_SIZE_MB=100                   # Maximum cache size in megabytes
TTS_CACHE_MAX_ITEMS=500                     # Maximum number of cached audio items
TTS_CACHE_TTL_MS=3600000                    # Cache TTL in milliseconds (3600000 = 1 hour)

# Cost Tracking for TTS (Optional but recommended)
OPENAI_TTS_COST_PER_1M_CHARS_TTS1=15.0     # $15 per million characters for tts-1

# Whisper API Cost (if not already set)
WHISPER_API_COST_PER_MINUTE=0.006          # $0.006 per minute of audio
```

### Step 3: Verify existing variables

Make sure these are still set correctly:

```env
# These should already exist
DEFAULT_SPEECH_PREFERENCE_TTS_PROVIDER=openai_tts
WHISPER_API_ENABLED=true
```

---

## 2. Update GitHub Secrets for Deployment

### Step 1: Go to your GitHub repository settings

1. Navigate to your repository: `https://github.com/[your-username]/voice-chat-assistant`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add new secrets

Click **New repository secret** for each of these:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `OPENAI_TTS_DEFAULT_MODEL` | `tts-1` | TTS model (faster) |
| `OPENAI_TTS_DEFAULT_VOICE` | `nova` | Default voice |
| `OPENAI_TTS_DEFAULT_SPEED` | `1.15` | Playback speed |
| `OPENAI_TTS_DEFAULT_FORMAT` | `opus` | Audio format |
| `TTS_CACHE_MAX_SIZE_MB` | `100` | Cache size limit |
| `TTS_CACHE_MAX_ITEMS` | `500` | Max cached items |
| `TTS_CACHE_TTL_MS` | `3600000` | Cache expiration |

### Step 3: Update existing ENV secret (if using single ENV secret)

If you're using a single `ENV` secret that contains all variables:

1. Click on the existing `ENV` secret
2. Click **Update secret**
3. Add the new variables to the content:

```
# Add these lines to your existing ENV secret content
OPENAI_TTS_DEFAULT_MODEL=tts-1
OPENAI_TTS_DEFAULT_VOICE=nova
OPENAI_TTS_DEFAULT_SPEED=1.15
OPENAI_TTS_DEFAULT_FORMAT=opus
TTS_CACHE_MAX_SIZE_MB=100
TTS_CACHE_MAX_ITEMS=500
TTS_CACHE_TTL_MS=3600000
```

---

## 3. Quick Test Checklist

After updating your environment variables:

### Local Testing:
```bash
# 1. Restart your development server
npm run dev

# 2. Check backend logs for:
[AudioService/OpenAI_TTS] TTS Request - Model: tts-1, Voice: nova, Speed: 1.15, Format: opus

# 3. Make a TTS request and check for cache messages:
[TTSCacheService] Cache HIT for text (X chars), saved API call, hit rate: XX%
```

### Production Testing (after deployment):
```bash
# 1. Trigger a deployment (push to master or manual)
git push origin master

# 2. Check deployment logs in GitHub Actions

# 3. Monitor your production logs for cache hits
```

---

## 4. Configuration Options Explained

### Voice Options (`OPENAI_TTS_DEFAULT_VOICE`)

| Voice | Description | Best For |
|-------|-------------|----------|
| `nova` | **Recommended** - Clear, friendly | General use, clarity |
| `alloy` | Neutral, balanced | Professional content |
| `echo` | Deeper, slower | Authoritative content |
| `fable` | British accent | International appeal |
| `onyx` | Deep, authoritative | Serious content |
| `shimmer` | Softer, feminine | Gentle interactions |

### Speed Settings (`OPENAI_TTS_DEFAULT_SPEED`)

| Speed | Effect | Use Case |
|-------|--------|----------|
| `0.75` | 25% slower | Learning, elderly users |
| `1.0` | Normal speed | Standard conversations |
| `1.15` | **Recommended** - 15% faster | Efficient, natural |
| `1.5` | 50% faster | Quick updates, alerts |
| `2.0` | 2x speed | Testing, debugging |

### Format Options (`OPENAI_TTS_DEFAULT_FORMAT`)

| Format | File Size | Quality | Compatibility |
|--------|-----------|---------|---------------|
| `opus` | **Smallest** (60%) | Good | Modern browsers |
| `mp3` | Standard (100%) | Good | Universal |
| `aac` | Small (70%) | Good | Apple devices |
| `flac` | Large (150%) | Lossless | Audiophiles |

---

## 5. Troubleshooting

### Issue: Changes not taking effect

**Solution:**
```bash
# 1. Ensure .env is saved
# 2. Completely restart the dev server
Ctrl+C  # Stop server
npm run dev  # Start fresh

# 3. Clear browser cache
Ctrl+Shift+R  # Hard refresh
```

### Issue: Cache not working

**Check:**
1. `TTS_CACHE_MAX_SIZE_MB` is set (default: 100)
2. `TTS_CACHE_TTL_MS` is reasonable (3600000 = 1 hour)
3. Backend logs show cache initialization:
   ```
   [TTSCacheService] Initialized with 100MB cache, max 500 items, 3600000ms TTL
   ```

### Issue: Deployment fails

**GitHub Actions fix:**
1. Check Secrets are properly set (no quotes around values)
2. Verify secret names match exactly (case-sensitive)
3. Re-run the deployment workflow

---

## 6. Performance Monitoring

### Check if optimizations are working:

1. **Backend logs should show:**
   ```
   [AudioService/OpenAI_TTS] Cache HIT - Returning cached audio for XXX chars
   [TTSCacheService] Cache HIT for text (XXX chars), saved API call, hit rate: 40.0%
   ```

2. **Network tab should show:**
   - Smaller response sizes (opus vs mp3)
   - Faster response times for cached content
   - `X-TTS-Provider: OpenAI TTS API` header

3. **Cost tracking should show:**
   - Reduced API calls
   - Lower daily costs
   - Higher cache hit rates over time

---

## 7. Optional Advanced Configuration

### Enable Metrics Endpoint (Optional)

Add to `.env`:
```env
ENABLE_TTS_METRICS_ENDPOINT=true
TTS_METRICS_API_KEY=your-secret-metrics-key
```

Then access metrics at: `/api/tts/metrics?key=your-secret-metrics-key`

### Pre-warm Cache on Startup (Optional)

Add to `.env`:
```env
TTS_PREWARM_CACHE=true
TTS_PREWARM_PHRASES="Hello! How can I help you today?,Thank you!,You're welcome!"
```

### Set Different Cache Strategy (Optional)

Add to `.env`:
```env
TTS_CACHE_STRATEGY=aggressive     # Options: conservative, balanced, aggressive
TTS_CACHE_COMPRESSION=true        # Enable gzip compression in cache
```

---

## 8. Rollback Instructions

If you need to disable the optimizations:

### Quick Disable (Keep code, disable features):
```env
# Add to .env
TTS_CACHE_MAX_SIZE_MB=0           # Disables caching
OPENAI_TTS_DEFAULT_FORMAT=mp3     # Back to MP3
OPENAI_TTS_DEFAULT_SPEED=1.0      # Normal speed
```

### Full Rollback:
```bash
# Revert to previous commit
git revert HEAD~1
git push origin master
```

---

## 9. Next Steps After Update

1. **Monitor for 24 hours:**
   - Check cache hit rates
   - Monitor error rates
   - Track cost savings

2. **Tune based on usage:**
   - Increase cache size if hit rate is high
   - Adjust TTL based on content freshness needs
   - Try different voices based on user feedback

3. **Consider next optimizations:**
   - Implement predictive pre-generation (1 day effort)
   - Add Amazon Polly as fallback (1 day effort)
   - Set up CDN distribution (2-3 days effort)

---

## 10. Support

If you encounter issues:

1. Check the detailed guide: [`docs/TTS_OPTIMIZATION_GUIDE.md`](./TTS_OPTIMIZATION_GUIDE.md)
2. Review backend logs for error messages
3. Open an issue on GitHub with:
   - Error messages
   - Environment details
   - Steps to reproduce

---

## Summary Checklist

- [ ] Updated local `.env` file with new TTS variables
- [ ] Updated GitHub Secrets for deployment
- [ ] Restarted development server
- [ ] Verified cache initialization in logs
- [ ] Tested TTS functionality
- [ ] Deployed to production
- [ ] Monitored production logs for cache hits
- [ ] Documented any custom configurations

**Remember:** The optimizations are backward compatible. Your app will work even without these variables, but you'll miss out on the performance improvements!