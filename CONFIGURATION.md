# Configuration Guide

## Overview
This guide covers all configuration options for Voice Chat Assistant, including environment variables, application settings, and feature toggles.

## Environment Variables

### Core Settings
Copy `.env.sample` to `.env` and configure the following:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your_secure_jwt_secret_min_64_chars
PASSWORD=yourpassword
```

### Language & Conversation Settings (NEW)

#### Language Detection
```bash
# Response language mode: auto, fixed, or follow-stt
DEFAULT_RESPONSE_LANGUAGE_MODE=auto

# Enable automatic language detection
ENABLE_LANGUAGE_DETECTION=true

# Fixed language for 'fixed' mode
DEFAULT_FIXED_RESPONSE_LANGUAGE=en-US
```

#### Conversation Context Management
```bash
# Maximum messages in context (6-50)
MAX_CONTEXT_MESSAGES=12

# Context strategy: minimal, smart, or full
CONVERSATION_CONTEXT_STRATEGY=smart

# Prevent repetitive responses
PREVENT_REPETITIVE_RESPONSES=true

# Default history messages for simple mode
DEFAULT_HISTORY_MESSAGES_FOR_FALLBACK_CONTEXT=12
```

### API Keys
```bash
# OpenAI (Required for Whisper and GPT models)
OPENAI_API_KEY=your_openai_api_key

# OpenRouter (Optional, for additional models)
OPENROUTER_API_KEY=your_openrouter_api_key

# Anthropic (Optional, for Claude models)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Model Preferences
```bash
# Default models for different tasks
MODEL_PREF_GENERAL_CHAT=openai/gpt-4o-mini
MODEL_PREF_CODING=openai/gpt-4o
MODEL_PREF_INTERVIEW_TUTOR=openai/gpt-4o

# Routing configuration
ROUTING_LLM_PROVIDER_ID=openrouter
ROUTING_LLM_MODEL_ID=openai/gpt-4o-mini
FALLBACK_LLM_PROVIDER_ID=openai
```

### Cost Management
```bash
# Cost thresholds in USD
COST_THRESHOLD_USD_PER_SESSION=2.00
GLOBAL_COST_THRESHOLD_USD_PER_MONTH=100.00

# Disable all cost limits (for development)
DISABLE_COST_LIMITS=true
```

## Application Settings

Access these in the UI under Settings > Memory & Context:

### Response Language Settings
- **Response Language Mode**:
  - `Auto-detect`: Detects user's language and responds in same language
  - `Fixed`: Always responds in a predetermined language
  - `Follow STT`: Uses the Speech-to-Text language setting

### Conversation Context Settings
- **Prevent Repetitive Responses**: Toggle to prevent repeating previous answers
- **Context Mode**:
  - `Minimal`: Last 3-4 messages only
  - `Smart`: Balanced context with relevance scoring (default)
  - `Full`: Maximum available context
- **Maximum History Messages**: Slider (6-50 messages)

### Advanced Memory Management
- **Advanced Chat History**: Enable NLP-based relevance scoring
- **Strategy Presets**:
  - Balanced Hybrid
  - Relevance Focused
  - Recent Conversation
  - Max Context
  - Concise Recent

## Supported Languages

The system automatically detects and responds in:

### High Accuracy (Character-based)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Hebrew (he)
- Russian (ru)
- Hindi (hi)
- Thai (th)

### Good Accuracy (Word-based)
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Italian (it)
- Dutch (nl)

## Voice Input Modes

### Push-to-Talk (Default)
- Click and hold microphone button
- Release to send transcript

### Continuous Mode
- Hands-free conversation
- 2-second silence detection before sending
- Configurable silence timeout (1.5-7 seconds)

### Voice Activation Detection (VAD)
- Wake word activation ("Hey V", "Victoria")
- Customizable wake words
- Command timeout configurable

## Performance Tuning

### For Faster Responses
```bash
MAX_CONTEXT_MESSAGES=6
CONVERSATION_CONTEXT_STRATEGY=minimal
DEFAULT_MAX_PROMPT_TOKENS=2000
```

### For Better Context
```bash
MAX_CONTEXT_MESSAGES=20
CONVERSATION_CONTEXT_STRATEGY=full
DEFAULT_MAX_PROMPT_TOKENS=8000
```

### For Multilingual Use
```bash
DEFAULT_RESPONSE_LANGUAGE_MODE=auto
ENABLE_LANGUAGE_DETECTION=true
```

## Troubleshooting

### Language Detection Issues
1. Ensure `ENABLE_LANGUAGE_DETECTION=true`
2. Provide at least 3-4 words for detection
3. Try `DEFAULT_RESPONSE_LANGUAGE_MODE=fixed` for consistent language

### Repetitive Responses
1. Set `PREVENT_REPETITIVE_RESPONSES=true`
2. Reduce `MAX_CONTEXT_MESSAGES` to 12 or less
3. Use `CONVERSATION_CONTEXT_STRATEGY=smart`

### High API Costs
1. Reduce `MAX_CONTEXT_MESSAGES`
2. Use cheaper models in `MODEL_PREF_*` settings
3. Enable `DISABLE_COST_LIMITS=false` for production

### Voice Recognition Problems
1. Check microphone permissions
2. Try different `DEFAULT_SPEECH_PREFERENCE_STT`
3. For non-English, set appropriate `speechLanguage` in settings

## Migration from Previous Versions

If upgrading from an earlier version:

1. Add new environment variables to your `.env`:
   ```bash
   DEFAULT_RESPONSE_LANGUAGE_MODE=auto
   ENABLE_LANGUAGE_DETECTION=true
   MAX_CONTEXT_MESSAGES=12
   CONVERSATION_CONTEXT_STRATEGY=smart
   PREVENT_REPETITIVE_RESPONSES=true
   ```

2. Clear browser localStorage to reset settings:
   ```javascript
   localStorage.clear();
   ```

3. Restart both frontend and backend servers

## Security Considerations

- Never commit `.env` files to version control
- Use strong JWT secrets (64+ characters)
- Rotate API keys regularly
- Set appropriate CORS origins in production
- Enable rate limiting for public deployments

## Production Deployment

For production environments:

1. Set `NODE_ENV=production`
2. Use secure JWT secret
3. Configure proper CORS origins
4. Enable SSL/TLS
5. Set `DISABLE_COST_LIMITS=false`
6. Configure proper logging levels
7. Use environment-specific API keys

## Additional Resources

- [Language and Context Documentation](./LANGUAGE_AND_CONTEXT_DOCUMENTATION.md)
- [Implementation Plan](./CONVERSATION_IMPROVEMENTS_PLAN.md)
- [API Documentation](./API.md)
- [Contributing Guide](./CONTRIBUTING.md)