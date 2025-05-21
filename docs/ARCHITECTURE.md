# Voice Coding Assistant Architecture

This document provides a comprehensive overview of the Voice Coding Assistant architecture, intended for developers who want to understand how the application works or contribute to its development.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Flow](#data-flow)
- [Key Components](#key-components)
- [External Dependencies](#external-dependencies)
- [Security Considerations](#security-considerations)

## Overview

Voice Coding Assistant is a full-stack web application built with:

- **Frontend**: Vue 3, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **External APIs**: OpenAI API, OpenRouter API

The application follows a client-server architecture where the frontend handles UI interactions and the backend processes API requests to external services.

## System Architecture
```
┌─────────────┐     ┌─────────────┐     ┌───────────────────┐
│             │     │             │     │                   │
│   Browser   │◄────┤   Frontend  │◄────┤   Backend API     │
│   (User)    │     │   (Vue.js)  │     │   (Node.js)       │
│             │     │             │     │                   │
└─────────────┘     └─────────────┘     └───────────────────┘
         │
         │
         ▼
┌───────────────────────────────────────┐
│                                       │
│      External APIs                    │
│      - OpenAI API                     │
│      - OpenRouter API                 │
│                                       │
└───────────────────────────────────────┘
```

## Frontend Architecture

The frontend is built using Vue 3 with the Composition API and follows a component-based architecture.

### Key Frontend Components

1. **App.vue**: Root component, handles theme (dark/light mode)
2. **Views**:
   - **Home.vue**: Main chat interface
   - **Login.vue**: Authentication page
   - **Settings.vue**: User preferences

3. **Components**:
   - **Header.vue**: App header with controls and session cost
   - **ChatWindow.vue**: Displays conversation history
   - **Message.vue**: Renders individual messages with markdown and code highlighting
   - **VoiceInput.vue**: Handles speech recognition
   - **DiagramViewer.vue**: Renders Mermaid diagrams

### Frontend State Management

The application uses local storage for persisting user preferences via `useStorage` from VueUse:

- Theme preference (dark/light mode)
- Selected mode (coding, system design, meeting)
- Programming language preference
- Diagram generation toggle
- Speech recognition method
- Session cost threshold

### Frontend Routes

- `/`: Main chat interface (requires authentication)
- `/login`: Authentication page
- `/settings`: Settings page (requires authentication)

## Backend Architecture

The backend is built with Node.js and Express, using TypeScript for type safety. It follows a modular structure with file-based routing.

### Directory Structure
```
backend/
├── config/
│   ├── models.ts        (Model configuration)
│   └── router.ts        (Dynamic route loader)
├── middleware/
│   └── auth.ts          (Authentication middleware)
├── routes/
│   ├── auth.ts          (Authentication endpoint)
│   ├── chat.ts          (AI chat endpoint)
│   ├── speech.ts        (Speech transcription)
│   ├── diagram.ts       (Diagram generation)
│   └── cost.ts          (Cost tracking)
├── utils/
│   ├── llm.ts           (LLM API client)
│   ├── audio.ts         (Audio processing utilities)
│   └── cost.ts          (Cost calculation utilities)
├── server.ts            (Main entry point)
└── tsconfig.json        (TypeScript configuration)
```

### Backend Routes

- `POST /api/auth`: Authenticates users with a password
- `POST /api/chat`: Processes chat messages and returns AI responses
- `POST /api/speech`: Transcribes audio using Whisper API
- `POST /api/diagram`: Generates diagram code from text descriptions
- `GET /api/cost`: Retrieves current session cost
- `POST /api/cost`: Resets session cost

## Data Flow

1. **Voice Input Flow**:
   - User clicks microphone button
   - Browser records audio via MediaRecorder API
   - Audio is sent to `/api/speech` endpoint
   - Backend transcribes audio using Whisper API
   - Transcription is returned to frontend

2. **Chat Flow**:
   - User text/transcription is sent to `/api/chat` endpoint
   - Backend selects appropriate AI model based on mode
   - Backend sends prompt to OpenAI/OpenRouter API
   - Response is processed and returned to frontend
   - Frontend renders formatted text, code, and diagrams

3. **Diagram Flow**:
   - If diagram generation is enabled, backend extracts diagram descriptions
   - Diagram code is generated via AI model
   - Frontend renders diagrams using Mermaid.js

## Key Components

### Speech Recognition

The application supports two speech recognition methods:

1. **Web Speech API**: Browser-based recognition (free, less accurate)
   - Used when `speechPreference` is set to "webspeech"
   - Provides real-time interim results

2. **OpenAI Whisper**: Cloud-based recognition (better accuracy)
   - Used when `speechPreference` is set to "whisper"
   - Audio is sent to backend and processed via OpenAI API

### LLM API Integration

The application can use two AI providers:

1. **OpenAI API**: Primary provider
   - Used when `OPENAI_API_KEY` is configured
   - Supports GPT-4o, GPT-4o-mini, etc.

2. **OpenRouter API**: Alternative provider
   - Used as a fallback or when explicitly configured
   - Provides access to various AI models

### Prompt Management

The application uses specialized prompts for different modes:

1. **Coding Q&A**: Optimized for programming questions
2. **System Design**: Optimized for architectural discussions
3. **Meeting Summary**: Optimized for summarizing transcripts

Prompts are stored as markdown files in the `prompts/` directory.

### Cost Tracking

The application tracks token usage and calculates costs based on model pricing:

- Input/output tokens are counted for each API call
- Costs are calculated using current pricing rates
- Session total is displayed in the UI
- Cost threshold can be set to limit usage

## External Dependencies

### Frontend Dependencies

- **Vue 3**: UI framework
- **Vite**: Build tool
- **TailwindCSS**: Utility-first CSS framework
- **Marked**: Markdown parsing
- **Highlight.js**: Code syntax highlighting
- **Mermaid**: Diagram rendering
- **VueUse**: Vue Composition Utilities
- **Axios**: HTTP client

### Backend Dependencies

- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **OpenAI Node.js SDK**: OpenAI API client
- **Axios**: HTTP client
- **Multer**: Multipart/form-data handling
- **Dotenv**: Environment variable management

## Security Considerations

- **Authentication**: Simple password-based authentication
- **API Keys**: Stored in environment variables, not exposed to frontend
- **CORS**: Configured to allow only the frontend origin
- **Rate Limiting**: Implemented to prevent abuse
- **Content Security**: Input validation for API requests