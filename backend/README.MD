# Voice Coding Assistant - Backend

## Overview

This backend server powers the Voice Coding Assistant application. It handles API requests for chat interactions with Large Language Models (LLMs), audio transcription (Speech-to-Text), speech synthesis (Text-to-Speech), diagram generation, and cost tracking for these services. It's built with Node.js, Express, and TypeScript.

## Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- A `.env` file configured with necessary API keys and settings (see [Environment Variables](#environment-variables))

## Project Structure

The backend is organized into several key directories:

-   **`backend/config/`**: Contains application-level configurations, including router setup and model preferences.
-   **`backend/middleware/`**: Houses Express middleware, such as authentication.
-   **`backend/src/core/`**: Core services decoupled from specific route logic.
    -   `audio/`: Services and interfaces for STT (Speech-to-Text) and TTS (Text-to-Speech).
    -   `cost/`: Service for tracking API usage costs.
    -   `llm/`: Services and interfaces for interacting with Large Language Models (OpenAI, OpenRouter).
-   **`backend/src/features/`**: Contains feature-specific route handlers and domain logic. Each subdirectory typically represents a feature (e.g., `auth`, `chat`, `speech`).
-   **`backend/prompts/`**: Stores prompt templates used for interacting with LLMs.
-   **`backend/utils/`**: (Legacy, to be phased out) Utility functions. Current core logic is in `src/core/`.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create and configure `.env` file:**
    Copy the `.env.example` (if available) to `.env` in the `backend` directory and fill in the required environment variables, especially API keys for OpenAI, OpenRouter, and the application password.
    ```bash
    cp .env.example .env # If .env.example exists
    # Then edit .env with your values
    ```

## Environment Variables

Key environment variables to configure in your `.env` file (located in the `backend` directory, but referenced from project root by the application):

-   `PORT`: Port for the backend server (e.g., `3001`).
-   `NODE_ENV`: Application environment (`development` or `production`).
-   `FRONTEND_URL`: URL of the frontend application for CORS configuration.
-   `APP_URL`: Public base URL of the backend application.
-   `PASSWORD`: The master password for basic authentication.
-   `JWT_SECRET`: (If implementing JWT) Secret key for signing JWTs.
-   `OPENAI_API_KEY`: Your API key for OpenAI services (GPT, Whisper, TTS).
-   `OPENROUTER_API_KEY`: Your API key for OpenRouter.ai.
-   `ANTHROPIC_API_KEY`: (Optional) Your API key for Anthropic (Claude).
-   `OLLAMA_BASE_URL`: (Optional) Base URL for a local Ollama instance.
-   `MODEL_PREF_*`: Variables to set preferred models for different modes (e.g., `MODEL_PREF_CODING`).
-   `COST_THRESHOLD_USD_PER_SESSION`: Maximum cost allowed per user session before blocking requests (e.g., `2.00`).
-   `DISABLE_COST_LIMIT`: Set to `true` to disable session cost checking (for development/testing).
-   `GLOBAL_COST_THRESHOLD_USD_PER_MONTH`: Overall monthly budget threshold.

## Running the Server

-   **Development Mode (with Nodemon for auto-reloading):**
    ```bash
    npm run dev
    ```
    This typically uses `nodemon` to watch for file changes and restart the server.

-   **Production Mode:**
    ```bash
    npm run build  # Transpile TypeScript to JavaScript (output to `dist` folder)
    npm start      # Run the compiled JavaScript from the `dist` folder
    ```

The server will start on the port specified in your `.env` file (defaulting to `3001` if `PORT` is not set).

## API Endpoints Summary

All API endpoints are prefixed with `/api`. Authentication is handled by `authMiddleware` for protected routes.

### Authentication (`/api/auth`)

-   **`POST /api/auth`**: Login
    -   **Description**: Authenticates a user based on the provided password. Sets an `authToken` cookie if `rememberMe` is true.
    -   **Request Body**: `{ "password": "your_password", "rememberMe": boolean (optional) }`
    -   **Response (Success 200)**: `{ "message": "Authentication successful", "token": "...", "rememberMe": boolean, "user": { "id": "..." } }`
    -   **Response (Error 400/401/500)**: Error message.

-   **`GET /api/auth`**: Check Authentication Status
    -   **Description**: Verifies if the current user is authenticated (relies on `authToken` cookie or Bearer token).
    -   **Response (Success 200)**: `{ "authenticated": true, "message": "User is currently authenticated.", "user": { "id": "..." } }`
    -   **Response (Error 401)**: `{ "authenticated": false, "message": "User is not authenticated." }`

-   **`DELETE /api/auth`**: Logout
    -   **Description**: Clears the authentication cookie, effectively logging the user out.
    -   **Response (Success 200)**: `{ "message": "Logout successful." }`

### Chat (`/api/chat`)

-   **`POST /api/chat`**: Process Chat Message
    -   **Description**: Sends user messages to an LLM based on the specified mode and language, returning the AI's response.
    -   **Request Body**:
        ```json
        {
          "mode": "coding" | "system_design" | "meeting" | "general_chat",
          "messages": [{ "role": "user" | "assistant" | "system", "content": "..." }],
          "language": "python" (optional),
          "generateDiagram": boolean (optional),
          "userId": "string" (optional)
        }
        ```
    -   **Response (Success 200)**: `{ "message": "AI response text", "content": "AI response text", "model": "model_used", "usage": { ... }, "sessionCost": { ... }, "cost": number }`
    -   **Response (Error 400/403/500)**: Error message.

### Diagram Generation (`/api/diagram`)

-   **`POST /api/diagram`**: Generate Diagram
    -   **Description**: Generates diagram code (e.g., Mermaid syntax) from a textual description using an LLM.
    -   **Request Body**:
        ```json
        {
          "description": "Textual description of the diagram",
          "type": "mermaid" (optional, default),
          "userId": "string" (optional)
        }
        ```
    -   **Response (Success 200)**: `{ "diagramCode": "...", "type": "mermaid", "model": "...", "usage": { ... }, "sessionCost": { ... }, "cost": number }`
    -   **Response (Error 400/403/500/502)**: Error message.

### Speech-to-Text (STT) (`/api/speech`)

-   **`POST /api/speech`**: Transcribe Audio
    -   **Description**: Transcribes an uploaded audio file to text using the configured STT service (e.g., OpenAI Whisper).
    -   **Request Body**: `FormData` with an `audio` field containing the audio file. Optional fields: `language` (e.g., "en"), `userId`.
    -   **Response (Success 200)**:
        ```json
        {
          "message": "Audio transcribed successfully.",
          "transcription": "Transcribed text...",
          "durationSeconds": 10.5,
          "language": "en",
          "cost": 0.00105,
          "sessionCost": { /* ISessionCostDetail object */ },
          "usage": { "durationMinutes": 0.175, "costPerMinute": 0.006 },
          "analysis": { /* IAudioAnalysisResult object */ },
          "metadata": { "originalFilename": "...", "mimeType": "..." }
        }
        ```
    -   **Response (Error 400/403/415/500)**: Error message.

### Text-to-Speech (TTS) (`/api/tts`)

-   **`POST /api/tts`**: Synthesize Speech
    -   **Description**: Converts text to speech using the configured TTS service.
    -   **Request Body**:
        ```json
        {
          "text": "Text to synthesize",
          "voice": "alloy" (optional),
          "model": "tts-1" (optional),
          "outputFormat": "mp3" (optional),
          "userId": "string" (optional)
        }
        ```
    -   **Response (Success 200)**: Audio file stream (e.g., `audio/mpeg`). Headers include `X-TTS-Cost`, `X-TTS-Voice`.
    -   **Response (Error 400/403/500)**: JSON error message.

-   **`GET /api/tts/voices`**: List Available TTS Voices
    -   **Description**: Retrieves a list of available voices from the configured TTS provider.
    -   **Response (Success 200)**: `{ "message": "...", "voices": [{ "id": "...", "name": "...", "provider": "..." }] }`
    -   **Response (Error 500)**: JSON error message.

### Speech-to-Text (STT) (`/api/stt` or `/api/speech`)

*(Path depends on router configuration. The handlers are now in `backend/src/features/speech/stt.routes.ts`)*

-   **`POST /api/stt`** (or `POST /api/speech`): Transcribe Audio
    -   **Description**: Transcribes an uploaded audio file to text using the configured STT service (e.g., OpenAI Whisper via `AudioService`).
    -   **Request Body**: `FormData` with an `audio` field (the audio file). Optional JSON fields in FormData: `language` (e.g., "en"), `model` ("whisper-1"), `prompt`, `userId`.
    -   **Response (Success 200)**:
        ```json
        {
          "message": "Audio transcribed successfully.",
          "transcription": "Transcribed text...",
          "durationSeconds": 10.5, // Duration of the transcribed audio
          "cost": 0.00105,         // Cost of this specific STT operation
          "sessionCost": 1.2345,   // Total current session cost for the user
          "usage": { /* STT provider specific usage details */ },
          "analysis": { /* IAudioAnalysis object */ },
          "metadata": { "originalFilename": "...", "mimeType": "..." }
        }
        ```
    -   **Response (Error 400/403/415/429/500/503)**: JSON error message with `error` code (e.g., `NO_FILE_UPLOADED`, `COST_THRESHOLD_EXCEEDED`, `UNSUPPORTED_FORMAT`, `API_KEY_ERROR`).

-   **`GET /api/stt/stats`** (or `GET /api/speech/stats`): Get STT Statistics
    -   **Description**: Retrieves statistics about the STT service, such as pricing and supported formats.
    -   **Response (Success 200)**:
        ```json
        {
          "message": "Speech processing statistics",
          "userId": "default_user_stt_stats",
          "whisperPricing": {
            "costPerMinute": 0.006,
            "maxFileSizeMB": 25,
            "minAudioDurationSeconds": 0.1
          },
          "supportedFormats": ["audio/webm", /* ... */],
          "limits": { /* ... */ },
          "currentSessionCost": 0.5678, // Current total session cost for the user
          "sessionCostThreshold": 2.00
        }
        ```
    -   **Response (Error 500)**: JSON error message.

### Cost Management (`/api/cost`)
*(Note: Route handlers for `/api/cost` need to be explicitly created in `backend/src/features/cost/cost.routes.ts` if not already present. The server.ts log implies their existence.)*

-   **`GET /api/cost`**: Get Session Cost
    -   **Description**: Retrieves the current cost details for the authenticated user's session.
    -   **Response (Success 200)**: `ISessionCostDetail` object.
    -   **Response (Error 401/500)**: Error message.

-   **`POST /api/cost`** (or `DELETE /api/cost`): Reset Session Cost
    -   **Description**: Resets the session cost for the authenticated user.
    -   **Request Body**: (Potentially `{ "action": "reset" }` or none if implicit)
    -   **Response (Success 200)**: Confirmation message and updated (zeroed) `ISessionCostDetail`.
    -   **Response (Error 401/500)**: Error message.

### Health Check

-   **`GET /health`**: Health Check
    -   **Description**: A public endpoint to verify if the server is running.
    -   **Response (Success 200)**: `{ "status": "OK", "timestamp": "...", "port": "..." }`

## Core Services

-   **LlmConfigService & LlmServiceFactory**: Manage configurations for different LLM providers (OpenAI, OpenRouter) and provide a unified interface (`callLlm`) for making requests.
-   **AudioService**: Handles STT (via `OpenAIWhisperProvider`) and TTS (via `OpenAiTtsProvider`), including cost calculations specific to audio processing.
-   **CostService**: Tracks API usage costs across different services (LLM, STT, TTS) per user session and globally.

## Future Enhancements / TODO

-   Implement robust JWT-based authentication instead of basic password/token.
-   Integrate a proper database for user management and persistent session/cost data.
-   Expand STT/TTS provider options (e.g., Google Speech, Azure Speech).
-   Add more sophisticated rate limiting.
-   Implement user-specific API key management.
-   Refine prompt engineering for better LLM responses in various modes.
-   Add comprehensive unit and integration tests.

