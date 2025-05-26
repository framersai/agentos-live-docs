Okay, I've merged the information from your original README with the details from the recent revamp. Here's the updated README:
Voice Coding Assistant - Backend
Overview

This backend server powers the Voice Coding Assistant application. It handles API requests for chat interactions with Large Language Models (LLMs), audio transcription (Speech-to-Text), speech synthesis (Text-to-Speech), diagram generation, and cost tracking for these services. It's built with Node.js, Express, and TypeScript, featuring a modular architecture for flexibility and scalability.
Prerequisites

    Node.js (v18.x or later recommended)
    npm or yarn
    A .env file configured with necessary API keys and settings (see Environment Variables)

Project Structure

The backend is organized into several key directories:

    backend/config/: Contains application-level configurations, including router setup (e.g., express.config.ts) and model/pricing preferences (models.config.ts).
    backend/middleware/: Houses Express middleware, such as authentication (auth.middleware.ts).
    backend/src/core/: Core services decoupled from specific route logic, designed for reusability.
        audio/: Services and interfaces for STT (Speech-to-Text) and TTS (Text-to-Speech) (e.g., audio.service.ts, stt.interfaces.ts, tts.interfaces.ts).
        cost/: Service for tracking API usage costs (cost.service.ts).
        llm/: Services and interfaces for interacting with Large Language Models, including provider configurations, a factory for service instances, and standardized interfaces (e.g., llm.config.service.ts, llm.factory.ts, llm.interfaces.ts, openai.llm.service.ts).
    backend/src/features/: Contains feature-specific route handlers and domain logic. Each subdirectory typically represents a feature (e.g., auth/, chat/, speech/, diagram/, cost/).
    backend/prompts/: Stores customizable Markdown prompt templates used for different LLM interaction modes (e.g., coding.md, diary.md).
    backend/utils/: (Legacy, to be phased out or for very generic utilities) Current core logic is primarily in src/core/.

Setup and Installation

    Clone the repository:
    Bash

git clone <repository-url>
cd <repository-folder>/backend

Install dependencies:
Bash

npm install
# or
yarn install

Create and configure .env file:
Copy .env.example (if available) to .env in the backend directory. Then, edit .env to fill in your specific API keys, passwords, and other configuration values.
Bash

    cp .env.example .env # If .env.example exists
    # Then edit .env with your values

Environment Variables ⚙️

Key environment variables to configure in your backend/.env file:

    Server & App:
        PORT: Port for the backend server (e.g., 3001).
        NODE_ENV: Application environment (development or production).
        FRONTEND_URL: URL of the frontend application (for CORS).
        APP_URL: Public base URL of this backend application (used by OpenRouter for HTTP-Referer).
        APP_NAME: Name of your application (used by OpenRouter for X-Title, e.g., Voice Coding Assistant).
    Authentication:
        PASSWORD: The master password for basic authentication.
        JWT_SECRET: Secret key for signing JWTs (if JWT authentication is fully implemented).
    LLM Provider API Keys & Config:
        OPENAI_API_KEY: Your API key for OpenAI services.
        OPENAI_API_BASE_URL: (Optional) Override OpenAI base URL.
        OPENROUTER_API_KEY: Your API key for OpenRouter.ai.
        OPENROUTER_API_BASE_URL: (Optional) Override OpenRouter base URL.
        ANTHROPIC_API_KEY: (Optional) Your API key for Anthropic (Claude).
        ANTHROPIC_API_BASE_URL: (Optional) Override Anthropic base URL.
        OLLAMA_BASE_URL: (Optional) Base URL for a local Ollama instance (e.g., http://localhost:11434).
    LLM Routing & Behavior:
        ROUTING_LLM_PROVIDER_ID: Preferred primary LLM provider (e.g., openrouter, openai).
        ROUTING_LLM_MODEL_ID: Preferred primary model ID for the routing provider.
        FALLBACK_LLM_PROVIDER_ID: Preferred fallback LLM provider if the primary fails.
        MODEL_PREF_OPENAI_DEFAULT: (e.g., gpt-4o-mini)
        MODEL_PREF_OPENROUTER_DEFAULT: (e.g., openai/gpt-4o-mini)
        MODEL_PREF_ANTHROPIC_DEFAULT: (e.g., claude-3-haiku-20240307)
        MODEL_PREF_OLLAMA_DEFAULT: (e.g., llama3:latest)
        (Other MODEL_PREF_* variables for specific modes, defined in config/models.config.ts and potentially referenced by mode keys)
    Chat Feature Configuration:
        MAX_CONVERSATIONAL_HISTORY_MESSAGES: Absolute max user/assistant message pairs stored long-term (e.g., 100).
        DEFAULT_MAX_HISTORY_MESSAGES: Default user/assistant message pairs sent to LLM per request (e.g., 10).
        DEFAULT_MAX_PROMPT_TOKENS: Max estimated tokens for the prompt sent to LLM (e.g., 8000).
        LLM_DEFAULT_TEMPERATURE: Default temperature for LLM responses (e.g., 0.7).
        LLM_DEFAULT_MAX_TOKENS: Default max completion tokens from LLM (e.g., 2048).
        DEFAULT_LANGUAGE: Default programming language for coding modes (e.g., python).
    Audio Services (OpenAI Specific):
        WHISPER_MODEL_DEFAULT: (e.g., whisper-1)
        OPENAI_TTS_DEFAULT_MODEL: (e.g., tts-1)
        OPENAI_TTS_DEFAULT_VOICE: (e.g., alloy)
        OPENAI_TTS_DEFAULT_SPEED: (e.g., 1.0)
    Cost Control:
        COST_THRESHOLD_USD_PER_SESSION: Max cost per user session (e.g., 2.00).
        DISABLE_COST_LIMITS: Set to true to disable session cost checking.
        GLOBAL_COST_THRESHOLD_USD_PER_MONTH: (Informational, actual enforcement might vary) Overall monthly budget.
        WHISPER_API_COST_PER_MINUTE: (e.g., 0.006)
        OPENAI_TTS_COST_PER_1M_CHARS: (e.g., 15.0 for $15 per 1M Chars)

Running the Server

    Development Mode (with Nodemon for auto-reloading):
    Bash

npm run dev

This typically uses nodemon to watch for file changes and restart the server.

Production Mode:
Bash

    npm run build  # Transpile TypeScript to JavaScript (output to `dist` folder)
    npm start      # Run the compiled JavaScript from the `dist` folder

The server will start on the port specified in your .env file (or 3001 if PORT is not set).
API Endpoints Summary Endpoints 🧭

All API endpoints are prefixed with /api. Authentication (if implemented beyond basic password) may protect certain routes.
Authentication (/api/auth)

    POST /api/auth: Login
        Description: Authenticates a user.
        Request Body: { "password": "your_password", "rememberMe": boolean (optional) }
        Response (Success 200): { "message": "Authentication successful", "token": "...", "user": { "id": "..." } }

    GET /api/auth: Check Authentication Status
        Description: Verifies if the current user is authenticated.
        Response (Success 200): { "authenticated": true, "user": { "id": "..." } }

    DELETE /api/auth: Logout
        Description: Clears authentication state.
        Response (Success 200): { "message": "Logout successful." }

Chat (/api/chat)

    POST /api/chat: Process Chat Message
        Description: Sends user messages to an LLM based on the specified mode, maintaining conversational history.
        Request Body:
        JSON

{
  "mode": "coding", // e.g., general, coding, diary, tutor, business_meeting, coding_tutor, coding_interviewer
  "messages": [{ "role": "user", "content": "Hello!" }], // Array of IChatMessage
  "language": "typescript", // Optional, for coding modes
  "conversationId": "unique-session-id", // Optional, generated if not provided. Persist for continuous chat.
  "maxHistoryMessages": 10, // Optional, number of user/assistant PAIRS to consider from history
  "systemPromptOverride": "You are an expert cat.", // Optional, replaces template-based system prompt
  "tutorLevel": "beginner", // Optional, for tutor modes
  "interviewMode": false, // Optional, specific flag for coding_interviewer sub-mode
  "tutorMode": false // Optional, specific flag for coding_tutor sub-mode
}

Response (Success 200):
JSON

        {
          "content": "AI response text",
          "model": "llm_model_used_id", // e.g., openai/gpt-4o-mini
          "usage": { "prompt_tokens": 50, "completion_tokens": 5, "total_tokens": 55 },
          "sessionCost": { "totalCost": 0.0012, "costsByService": {...} /* ISessionCostDetail object */ },
          "costOfThisCall": 0.00015,
          "conversationId": "unique-session-id",
          "historySize": 12 // Total messages in conversation history for this sessionId
        }

        Response (Error 400/403/429/500/503): JSON error message.

Diagram Generation (/api/diagram)

    POST /api/diagram: Generate Diagram
        Description: Generates diagram code (e.g., Mermaid syntax) from a textual description.
        Request Body:
        JSON

{
  "description": "Textual description of the diagram (e.g., User -> System: Request data)",
  "type": "mermaid", // Optional, defaults to "mermaid". Others like "plantuml" might be supported by LLM.
  "userId": "string" // Optional, for cost tracking if not derived from auth
}

Response (Success 200):
JSON

        {
          "diagramCode": "sequenceDiagram\nUser->>System: Request data",
          "type": "mermaid",
          "model": "llm_model_used_id",
          "usage": { "prompt_tokens": 30, "completion_tokens": 25, "total_tokens": 55 },
          "sessionCost": { /* ISessionCostDetail object */ },
          "cost": 0.00010 // Cost of this specific diagram generation call
        }

        Response (Error 400/403/500/502): JSON error message.

Speech-to-Text (STT) (/api/stt)

    POST /api/stt: Transcribe Audio
        Description: Transcribes an uploaded audio file to text using AudioService (e.g., OpenAI Whisper).
        Request Body: FormData with:
            audio: The audio file (e.g., .wav, .mp3, .webm).
            (Optional fields in FormData, parsed as strings): language (e.g., "en"), model, prompt, responseFormat (e.g., "verbose_json"), temperature, userId.
        Response (Success 200):
        JSON

    {
      "message": "Audio transcribed successfully.",
      "transcription": "Transcribed text...",
      "durationSeconds": 10.5,
      "cost": 0.00105,
      "sessionCost": 1.2345, // Total current session cost for the user
      "usage": { "durationMinutes": 0.175, "modelUsed": "whisper-1" },
      "analysis": { "duration": 10.5, "fileSize": 168000, /* ...IAudioAnalysis */ },
      "metadata": { "originalFilename": "audio.wav", "mimeType": "audio/wav" }
    }

    Response (Error 400/403/415/429/500/503): JSON error message.

GET /api/stt/stats: Get STT & Audio Service Statistics

    Description: Retrieves statistics about the audio services (STT/TTS), such as pricing and default settings.
    Response (Success 200):
    JSON

        {
          "sttProvider": "OpenAI Whisper API",
          "defaultTtsProvider": "openai_tts",
          "availableTtsProviders": ["browser_tts", "openai_tts"],
          "whisperCostPerMinute": "$0.006",
          "openAITTSCostInfo": "$0.000015 per 1K characters",
          "openaiTtsDefaultModel": "tts-1",
          "openaiTtsDefaultVoice": "alloy",
          "openaiTtsDefaultSpeed": 1.0,
          "currentSessionCost": 0.5678,
          "sessionCostThreshold": 2.00
        }

Text-to-Speech (TTS) (/api/tts)

    POST /api/tts: Synthesize Speech
        Description: Converts text to speech using AudioService (e.g., OpenAI TTS).
        Request Body:
        JSON

    {
      "text": "Text to synthesize into speech.",
      "voice": "alloy", // Optional, e.g., alloy, echo, fable, onyx, nova, shimmer for OpenAI
      "model": "tts-1", // Optional, e.g., tts-1, tts-1-hd for OpenAI
      "outputFormat": "mp3", // Optional, e.g., mp3, opus, aac, flac
      "speed": 1.0, // Optional, typically 0.25 to 4.0
      "userId": "string", // Optional
      "providerId": "openai_tts" // Optional
    }

    Response (Success 200): Audio file stream (e.g., audio/mpeg). Custom headers include:
        X-TTS-Cost: Cost of the TTS operation.
        X-TTS-Voice: Voice used.
        X-TTS-Provider: Provider used.
        X-TTS-Duration-Seconds: Estimated duration.
        X-TTS-Model-Used
        X-TTS-Characters
    Response (Error 400/403/429/500/503): JSON error message.

GET /api/tts/voices: List Available TTS Voices

    Description: Retrieves a list of available voices from TTS providers.
    Query Parameters: providerId (optional, e.g., openai_tts) to filter by provider.
    Response (Success 200):
    JSON

        {
          "message": "Available TTS voices fetched successfully.",
          "voices": [{ "id": "alloy", "name": "Alloy", "lang": "en", "gender": "neutral", "provider": "OpenAI TTS API", "isDefault": true }, /* ... */ ],
          "count": 6
        }

Cost Management (/api/cost)

    GET /api/cost: Get Session & Global Cost Details
        Description: Retrieves cost details for the current user's session and global aggregate costs.
        Query Parameters: userId (optional, defaults to authenticated user or a default ID).
        Response (Success 200):
        JSON

    {
      "userId": "some_user_id",
      "sessionCost": 0.0012,
      "costsByService": { "llm": 0.0010, "stt": 0.0002, "tts": 0.0, "diagram": 0.0 },
      "usageBreakdown": { /* Detailed per-service unit counts if CostService provides it */ },
      "sessionStartTime": "2024-05-26T10:00:00.000Z",
      "entryCount": 5, // Number of cost entries in the current session
      "globalMonthlyCost": 10.50, // Example
      "threshold": 2.00,
      "isThresholdReached": false
    }

POST /api/cost: Perform Cost Actions

    Description: Allows resetting session costs or global costs (dev only).
    Request Body:
    JSON

        {
          "userId": "user-to-reset", // Optional for 'reset', targets this user.
          "action": "reset" // Valid actions: "reset", "reset_global" (dev only)
        }

        Response (Success 200 for "reset"): { "message": "Session cost reset...", "sessionCost": 0, ... }
        Response (Success 200 for "reset_global"): { "message": "Global monthly cost reset...", "globalMonthlyCost": 0 }

Health Check

    GET /health: Health Check
        Description: A public endpoint to verify if the server is running and responsive.
        Response (Success 200): { "status": "OK", "timestamp": "...", "port": "..." }

Core Services 🛠️

    LlmConfigService & LlmFactory: Manages configurations for different LLM providers (OpenAI, OpenRouter, Anthropic, Ollama) via LlmConfigService. The LlmFactory (callLlm function) provides a unified interface for making requests, intelligently routing to the appropriate provider based on model ID or environment settings, processing model IDs for provider compatibility, and handling automatic fallbacks.
    AudioService: Handles STT (via OpenAIWhisperProvider or other configured STT providers) and TTS (via OpenAiTtsProvider or a conceptual BrowserTtsProvider), including cost calculations specific to audio processing.
    CostService: Tracks API usage costs across different services (LLM, STT, TTS, Diagram) per user session and globally (monthly). It now includes inputUnitType and outputUnitType (e.g., "tokens", "characters", "bytes", "seconds") for more precise tracking.

Prompt Configuration 📝

    Custom system prompts for different chat modes (/api/chat) are stored as Markdown files in the backend/prompts/ directory (relative to project root).
    Name files according to the mode or promptTemplateName strategy used in chat.routes.ts (e.g., general_chat.md, coding.md, diary.md, coding_tutor.md, coding_interviewer.md).
    Supported placeholders in prompts:
        {{MODE}}: The requested chat mode (e.g., "coding", "diary").
        {{LANGUAGE}}: The preferred programming language (e.g., "python").
        {{GENERATE_DIAGRAM}}: (Legacy or specific use) "true" or "false" if diagram generation hint is active within a chat.
        {{TUTOR_LEVEL}}: e.g., "beginner", "intermediate" for tutor-specific prompts.
        {{ADDITIONAL_INSTRUCTIONS}}: A section where standardized real-time interaction guidelines are injected by chat.routes.ts to emphasize conversational context.

Model Preferences and Pricing 💰

    The mapping of functional modes (like "coding", "diary", "diagram_generation") to specific LLM model IDs is managed in backend/config/models.config.ts via the MODEL_PREFERENCES object.
    This file also contains MODEL_PRICING for calculating costs based on input/output tokens for different LLMs, enabling accurate cost tracking.
    Ensure MODEL_PREFERENCES includes entries for any new modes or specialized model needs (e.g., ensure MODEL_PREFERENCES.diagram_generation or MODEL_PREFERENCES.coding_tutor point to valid model IDs accessible by your configured LLM providers).

Future Enhancements / TODO 🚀

    Implement robust JWT-based authentication as an alternative/replacement for basic password.
    Integrate a proper database (e.g., PostgreSQL, MongoDB) for persistent user management, conversation histories, and long-term cost data.
    Fully implement and integrate AnthropicLlmService and OllamaLlmService into the LlmFactory.
    Expand STT/TTS provider options further (e.g., Google Cloud Speech-to-Text/Text-to-Speech, Azure AI Speech).
    Implement more sophisticated rate limiting (e.g., per user, per IP) beyond basic cost thresholds.
    Consider user-specific API key management if users are to bring their own keys for certain services.
    Refine prompt engineering continuously for optimal LLM responses in all supported modes.
    Add comprehensive unit and integration tests across all modules.
    Implement actual token counting using provider-specific tokenizers (e.g., tiktoken for OpenAI) for more accurate prompt truncation and cost pre-calculation, instead of character-based estimates.
    Explore and implement streaming support for LLM responses to improve perceived responsiveness in chat.
    Develop more granular role-based access control (RBAC) for administrative actions (e.g., reset_global_cost).

<!-- end list -->