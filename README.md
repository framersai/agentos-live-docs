# Voice Coding Assistant

<p align="center">
  <img src="./frontend/src/assets/logo.svg" alt="Voice Coding Assistant Logo" width="120">
</p>

<p align="center">
  A real-time voice-driven coding assistant web app built with Vue.js and Node.js.
</p>

## Overview

Voice Coding Assistant is a full-stack web application that lets you use your voice to get coding help, system design advice, and meeting summaries. Leveraging AI models through OpenAI and OpenRouter APIs, it transcribes your voice input and provides detailed responses with code examples and diagrams.

### Key Features

- **Voice Recognition**: Uses both browser's Web Speech API and OpenAI Whisper for accurate transcription
- **Multiple Modes**: Specialized prompts for coding questions, system design, and meeting summaries
- **Code Highlighting**: Automatic syntax highlighting for various programming languages
- **Diagrams**: Generates and renders Mermaid diagrams for system design and architecture
- **Cost Tracking**: Monitors and displays API usage costs in real-time
- **Responsive Design**: Works on desktop and mobile in both portrait and landscape orientations
- **Dark/Light Theme**: Toggle between light and dark mode based on preference

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- (Optional) OpenRouter API key

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voice-coding-assistant.git
   cd voice-coding-assistant
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_key_here
   OPENROUTER_API_KEY=your_openrouter_key_here
   PASSWORD=your_password_here
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   SPEECH_PREFERENCE=whisper
   MODEL_PREF_CODING=gpt-4o
   MODEL_PREF_SYSTEM_DESIGN=gpt-4o
   MODEL_PREF_SUMMARY=gpt-4o-mini
   COST_THRESHOLD=5.00
   DEFAULT_LANGUAGE=python
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at http://localhost:3000

### Docker Installation

To run using Docker:

```bash
docker-compose up -d
```

This will build and start both the frontend and backend containers.

## Usage

1. **Login**: Enter the password you configured in the `.env` file.
2. **Select Mode**: Choose from:
   * **Coding Q&A**: For programming questions and code examples
   * **System Design**: For architectural design questions and diagrams
   * **Meeting Summary**: For summarizing meeting notes or transcripts
3. **Voice Input**: Click the microphone button and speak your question. The application will transcribe your speech and send it to the AI.
4. **View Results**: The AI will respond with formatted text, code examples, and diagrams when appropriate.
5. **Settings**: Configure preferences like speech recognition method, dark/light mode, and cost thresholds in the settings page.

## Configuration

See `CONFIGURATION.md` for detailed configuration options.

## Architecture

The application follows a modern client-server architecture:
* **Frontend**: Vue 3, Vite, TailwindCSS
* **Backend**: Node.js, Express, TypeScript
* **External APIs**: OpenAI API, OpenRouter API

For detailed architecture documentation, see `ARCHITECTURE.md`.

## API Documentation

### Backend API Endpoints

* `POST /api/auth`: Authentication endpoint
* `POST /api/chat`: Send messages to AI models
* `POST /api/speech`: Transcribe audio with Whisper
* `POST /api/diagram`: Generate diagrams from descriptions
* `GET/POST /api/cost`: Retrieve or reset session cost

For complete API documentation, see `API.md`.

## Contributing

Contributions are welcome! Please read our `CONTRIBUTING.md` for details on the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.