# Voice Chat Assistant 🎙️✨

<p align="center">
  <img src="./frontend/src/assets/logo.svg" alt="Voice Chat Assistant Logo" width="150">
</p>

<p align="center">
  <strong>An Intelligent, Voice-First Conversational AI Platform.</strong><br/>
  Experience the future of interaction with AI assistants that not only understand you but also dynamically shape your digital workspace.
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-architecture-overview">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-ai-driven-dynamic-ui">AI-Driven UI</a> •
  <a href="#-platform-extensibility--marketplace-vision">Marketplace Vision</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🚀 Overview

**Voice Chat Assistant** is a cutting-edge, full-stack application that redefines how you interact with AI. Go beyond simple question-and-answer; engage with intelligent AI assistants (powered by the robust AgentOS framework) through natural voice commands and experience an interface that dynamically adapts to your needs. Whether you're coding, designing systems, or summarizing information, Voice Chat Assistant provides a seamless, intuitive, and powerful conversational experience.

This platform is engineered for extensibility, with a vision towards a marketplace of specialized AI assistants, tools, and UI components, making it a versatile foundation for next-generation AI-powered applications.

---

## 🌟 Key Features

* **🎙️ Advanced Voice-First Interaction:**
    * Real-time, highly accurate speech-to-text (OpenAI Whisper & browser Web Speech API).
    * Full application navigation and control using natural voice commands.
    * LLM-powered intent parsing for understanding complex user requests.
* **🤖 AI-Driven Dynamic User Interface:**
    * **Intelligent UI Composition:** AI assistants can dynamically instantiate, arrange, and update UI components in real-time to present contextual information, tools, or results.
    * **Adaptive Workspace:** The UI adapts to the conversation and the AI's tasks, providing a truly responsive experience.
* **🧠 Powerful AI Assistants (Powered by AgentOS):**
    * Utilizes the AgentOS framework for sophisticated AI agent (GMI) management, enabling multiple personas, custom capabilities, and complex reasoning.
    * Specialized modes for: Coding Q&A, System Design (with diagram generation), Meeting Summarization, and more.
* **🎨 Stunning, Themeable Interface:**
    * Modern, mobile-first responsive design built with Vue 3 (Vite) and TailwindCSS.
    * User-selectable themes: Light, Dark, and a unique **Holographic** mode for a futuristic feel.
* **🛠️ Rich Content & Tools:**
    * Automatic syntax highlighting for a wide range of programming languages.
    * On-the-fly Mermaid.js diagram generation and rendering.
* **🔒 Secure User & Access Management:**
    * Comprehensive user registration, authentication, and profile management.
    * (Planned) Subscription tiers offering varied levels of features and usage, with Prisma and LemonSqueezy for backend management.
* **💰 Transparent Cost Tracking:**
    * Real-time monitoring of API usage costs associated with LLM interactions.
    * User-configurable session cost thresholds.
* **📱 Cross-Platform Ready:**
    * Architected for easy packaging into native mobile applications using Capacitor.
* **🌐 Platform Extensibility & Marketplace Vision:**
    * Modular design allowing for the addition of new AI assistant personas, capabilities (tools), and dynamic UI components.
    * Future vision includes a marketplace for users and developers to share and utilize these extensions.

---

## 🏛️ Architecture Overview

Voice Chat Assistant is built on a robust, modern full-stack architecture:

* **Frontend (Vue 3, Vite, Pinia, TailwindCSS):**
    * **Dynamic UI Engine:** Interprets UI manifests from AI assistants to render Vue components or sandboxed content. This includes a `DynamicUiStore`, `DynamicLayoutSlot` components, a `DynamicBlockRenderer`, and a `ComponentRegistry`.
    * **Voice Interaction System:** The `VoiceCommandService` handles STT and orchestrates LLM-based intent parsing. The `UIInteractionService` enables programmatic control over UI elements for voice commands.
    * **Core Services:** Manages API communication (`ApiService`), state (`Pinia`), routing (`Vue Router`), internationalization (`vue-i18n`), theming, and secure local storage.
* **Backend (Node.js, Express, TypeScript):**
    * **AgentOS Framework Integration:** The heart of AI capabilities, managing Generalized Mind Instances (GMIs), personas, LLM provider connections (`AIModelProviderManager`), prompt engineering, and agent tool execution.
    * **API Layer (`/api/v1/...`):** Provides RESTful endpoints for user authentication, GMI interactions, chat processing, speech services, AI utility tasks, and commands for dynamic UI orchestration by AI assistants.
    * **Core Services:** Includes `AuthService`, `SubscriptionService` (managing user tiers), `UtilityLLMService` (for general LLM tasks like intent parsing), and the `UIActionOrchestratorService` (validating and preparing AI-generated UI commands for the frontend).
    * **Database (PostgreSQL & Prisma):** Manages user accounts, API keys, (planned) subscription data, conversation histories, and persistent GMI memory/snapshots.
* **External Services:** Leverages OpenAI & OpenRouter for LLM access, and (conceptually for now) LemonSqueezy for payment processing.

For a detailed architectural breakdown, please see `docs/ARCHITECTURE.md`.

---

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18 or later) & npm
* PostgreSQL Database instance
* OpenAI API Key (essential for most AI features)
* (Recommended) OpenRouter API Key (for broader model access)
* (Optional) LemonSqueezy API Key & Webhook Secret (for subscription features)

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/voice-chat-assistant.git](https://github.com/your-username/voice-chat-assistant.git) # Ensure this is your repository URL
    cd voice-chat-assistant
    ```

2.  **Install All Dependencies:**
    (Assuming a root `package.json` with a script to install for all workspaces, or install manually in root, `backend`, and `frontend`.)
    ```bash
    npm install # If using workspaces or a root install script
    # OR manually:
    # npm install && cd backend && npm install && cd ../frontend && npm install && cd ..
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the **root** project directory. Use `backend/.env.example` as a template or the structure provided in the "AI-Driven UI Orchestration" documentation above (which includes `DATABASE_URL`, API keys, etc.).
    **Crucial variables:** `DATABASE_URL`, `OPENAI_API_KEY`, `FRONTEND_URL`.

4.  **Database & Prisma Setup (from `backend` directory):**
    * Ensure your PostgreSQL server is running and the database from `DATABASE_URL` is created.
    * `npx prisma generate`
    * `npx prisma db push` (to create schema)
    * `npx prisma db seed` (to populate initial data like subscription tiers, admin user)

5.  **Build (Optional for Dev, Required for Prod):**
    If you have a root build script: `npm run build`. Otherwise, build `frontend` and `backend` separately.

6.  **Run the Application:**
    * **Development (Hot Reloading):**
        ```bash
        npm run dev # (Expected to start both frontend and backend dev servers)
        ```
        Frontend typically on `http://localhost:5173` (Vite default), Backend on `http://localhost:3001`.
    * **Production:**
        ```bash
        npm start # (Expected to serve built frontend from backend)
        ```

7.  **Access:** Open your browser to the `FRONTEND_URL` (e.g., `http://localhost:5173`).

### Docker Setup

1.  Configure your root `.env` file.
2.  Run: `docker-compose up --build -d`

---

## 🎤 Usage

1.  **Register/Login:** Create an account or log in.
2.  **Personalize:** Visit Settings to select your preferred theme (Light, Dark, Holographic), voice preferences, and other options.
3.  **Activate Voice:** Enable voice commands. Use the mic icon or a PTT key.
4.  **Converse & Command:**
    * Talk to AI assistants for coding help, system design insights, or meeting summaries.
    * Use voice commands for navigation ("Go to settings"), UI interaction ("Click save"), typing ("Dictate my note: ..."), and even requesting UI changes ("Show me the project overview widget").
5.  **Experience Dynamic UI:** Observe as AI assistants proactively display relevant information, tools, or visualizations directly within your interface.
6.  **Manage Account:** (If subscriptions enabled) Check your subscription status and manage API keys in Settings.

---

## 🧬 AI-Driven Dynamic UI in Voice Chat Assistant

Voice Chat Assistant's AI assistants can intelligently modify and extend the UI in real-time.
* **How it Works:** AI assistants generate UI "manifests" (structured descriptions). The backend validates these and sends commands to the frontend. The frontend's dynamic rendering engine then instantiates the appropriate Vue components or sandboxed content in designated UI "slots."
* **Impact:** This creates a fluid, context-aware interface that can display data visualizations, interactive forms, or contextual help exactly when and where you need it, all orchestrated by the AI.
* Refer to `docs/AI_DRIVEN_UI.md` for a technical overview.

---
## 🚀 Platform Extensibility & Marketplace Vision

Voice Chat Assistant is architected as an extensible platform:

* **Custom Agents:** Develop and integrate new AgentOS personas with unique skills and knowledge domains.
* **Dynamic UI Components:** Create new Vue components that can be registered and dynamically instantiated by AI agents.
* **Agent Tools:** Extend agent capabilities by developing new tools within the AgentOS framework.
* **Marketplace (Future Vision):** A planned ecosystem where developers and users can share, discover, and utilize:
    * Pre-built AI assistant personas.
    * Specialized agent tools.
    * Dynamic UI component packs.
    * Custom themes.

This vision aims to foster a community around extending the capabilities of Voice Chat Assistant.

---

## 📚 Documentation

Comprehensive documentation is key to understanding and extending the Voice Chat Assistant platform:

* **`docs/ARCHITECTURE.md`**: Deep dive into the overall system architecture.
* **`docs/VOICE_INTERACTION_SYSTEM.md`**: Details on voice command processing, LLM intent parsing, and UI control.
* **`docs/AI_DRIVEN_UI.md`**: (You are here) How AI assistants dynamically manage UI components.
* **`docs/CONFIGURATION.md`**: Guide to all environment variables and setup options.
* **`docs/API_REFERENCE.md`**: Full backend API V1 documentation.
* **`docs/THEMING_GUIDE.md`**: Instructions for customizing UI themes.
* **`docs/AGENT_DEVELOPMENT_GUIDE.md`**: How to create and integrate new AgentOS assistants.
* **`docs/GETTING_STARTED.md`**: (This file or a more detailed version).
* **`docs/CONTRIBUTING.md`**: Contribution guidelines.

---

## 🤝 Contributing

Your contributions can help shape the future of Voice Chat Assistant! We're looking for help with feature development, bug fixes, documentation, new agent skills, UI components, and more.

Please read `CONTRIBUTING.md` for our contribution process, code of conduct, and how to get started.

---

## 📄 License

Voice Chat Assistant is licensed under the MIT License. See the `LICENSE` file for more details.