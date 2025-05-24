# Voice Chat Assistant - Backend Service

Welcome to the backend service for the Voice Chat Assistant application. This service is built with Node.js, Express.js, and TypeScript, forming the core logic layer that powers AI interactions through the AgentOS framework, manages user data, authentication, and provides APIs for the frontend application.

## 📋 Table of Contents

1. [🚀 Overview](#-overview)
2. [✨ Features](#-features)
3. [🏛️ Architecture Highlights](#️-architecture-highlights)
4. [🛠️ Development Setup](#️-development-setup)
   - [Prerequisites](#prerequisites)
   - [Cloning the Repository](#cloning-the-repository)
   - [Environment Variables (.env)](#environment-variables-env)
   - [Installing Dependencies](#installing-dependencies)
   - [Database Setup (Prisma)](#database-setup-prisma)
   - [Running the Backend](#running-the-backend)
   - [Health Check](#health-check)
5. [📂 Project Structure](#-project-structure)
6. [⚙️ Core Services](#️-core-services)
7. [📡 API Endpoints](#-api-endpoints)
8. [🧪 Testing](#-testing)
9. [🚀 Deployment](#-deployment)
10. [🤝 Contributing](#-contributing)

---

## 🚀 Overview

The backend is the central nervous system of the Voice Chat Assistant. It handles:

- **User Authentication**: Secure registration, login (email/password & Google OAuth), session management
- **AgentOS Integration**: Manages Generalized Mind Instances (GMIs), personas, LLM connections, RAG, and tool execution
- **API Services**: Provides RESTful APIs for frontend communication
- **Data Persistence**: Uses PostgreSQL via Prisma ORM for all application data
- **Caching**: Utilizes Redis for performance optimization
- **Real-time Communication**: (Planned/Conceptual) WebSocket integration for features like live transcription or streaming responses

---

## ✨ Features

### 🔐 Robust Authentication
- JWT-based sessions
- OAuth 2.0 (Google)
- Secure password handling
- API key management

### 🧠 Modular AgentOS Core
Extensible framework for building and managing sophisticated AI agents:
- **Persona Management**
- **LLM Provider Abstraction** (OpenAI, OpenRouter, Ollama)
- **Tool Orchestration and Execution**
- **Retrieval Augmented Generation (RAG)** with Vector Stores (Pinecone)
- **Conversation Management** and Persistent Memory

### 💳 Subscription Management
Integration with LemonSqueezy (conceptual hooks) for handling user subscription tiers and features

### 🛡️ Additional Features
- **Comprehensive Error Handling**: Standardized error codes and responses
- **Configurable**: Behavior driven by environment variables and database configurations

---

## 🏛️ Architecture Highlights

- **TypeScript**: For type safety and robust code
- **Node.js & Express.js**: For the web server and API framework
- **Prisma**: Modern ORM for PostgreSQL database interactions
- **Service-Oriented Design**: Logic encapsulated in services (e.g., `AuthService`, `SubscriptionService`, `GMIManager`)
- **Interface-Driven**: Promotes loose coupling and testability
- **Dockerized**: For consistent development and deployment environments

---

## 🛠️ Development Setup

Follow these steps to get the backend service running locally.

### Prerequisites

- **Node.js**: Version 20.x or later (check `.nvmrc` or `package.json` engines if specified)
- **pnpm** (preferred) or **npm/yarn**: For package management. The project is set up with `pnpm` in its Dockerfiles
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Compose**: For running PostgreSQL, Redis, and potentially other services like Ollama
- **PostgreSQL Instance**: Can be run via Docker (see `docker-compose.yml`) or a local installation

### Cloning the Repository

If you haven't already, clone the main project repository:

```bash
git clone <repository-url>
cd voice-chat-assistant
```

### Environment Variables (.env)

The backend relies on environment variables for configuration.

1. Navigate to the root of the project
2. Copy the `.env.sample` file to a new file named `.env`:
   ```bash
   cp .env.sample .env
   ```

3. Edit the `.env` file in the project root with your specific configurations. Key variables for the backend include:

#### Core Configuration
- `PORT`: Port the backend server will run on (e.g., `3001`)
- `NODE_ENV`: Environment mode (`development`, `production`)
- `APP_URL`: The public base URL of your backend (e.g., `http://localhost:3001`)

#### Database & Cache
- `DATABASE_URL`: Connection string for your PostgreSQL database
  - For local development outside Docker: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`
  - If using docker-compose.yml (recommended for dev): `postgresql://vca_user:yourpassword@postgres:5432/voice_chat_assistant`
- `REDIS_URL`: Connection string for your Redis instance
  - For local development outside Docker: `redis://localhost:6379`
  - If using docker-compose.yml: `redis://redis:6379`

#### Security
- `JWT_SECRET`: A long, strong, random string for signing JWTs (at least 64 characters)
- `API_KEY_ENCRYPTION_KEY_HEX`: A 32-byte (64-character) hex string for encrypting user API keys
  ```bash
  openssl rand -hex 32
  ```

#### LLM API Keys
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`
- etc.

#### Google OAuth Credentials (if testing OAuth)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` (e.g., `http://localhost:3001/api/v1/auth/google/callback`)
  > **Note**: Ensure this matches your Google Cloud Console setup

#### AgentOS Configuration
- `PERSONA_DEFINITIONS_PATH`: Path to persona JSON files, usually relative to the backend directory (e.g., `./backend/agentos/cognitive_substrate/personas/definitions`)

### Installing Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
pnpm install # or npm install / yarn install
```

### Database Setup (Prisma)

Ensure your PostgreSQL server is running and accessible.

1. **Generate Prisma Client**:
   This is often run automatically post-install, but can be run manually:
   ```bash
   npx prisma generate
   ```

2. **Apply Migrations**:
   This will create or update your database schema based on `prisma/schema.prisma`:
   ```bash
   # For development (prompts for name)
   npx prisma migrate dev --name your_migration_name
   
   # For applying existing migrations in CI/CD or production-like setup
   npx prisma migrate deploy
   ```

   If you prefer to directly push schema changes without creating migration files (common in early dev):
   ```bash
   npx prisma db push --skip-generate
   ```

3. **(Optional) Seed the Database**:
   If you have a seed script (`prisma/seed.ts`) to populate initial data (e.g., default subscription tiers, admin user):
   ```bash
   npx prisma db seed
   ```

### Running the Backend

Start the backend development server:

```bash
npm run dev
```

This typically uses `tsx` for hot-reloading TypeScript code. The server will usually run on the port specified in your `.env` file (e.g., `http://localhost:3001`).

### Health Check

Once the server is running, you can check its health status by navigating to:

```
http://localhost:<PORT>/health
```

Example: `http://localhost:3001/health`

This endpoint provides information about the server status, database connectivity, and initialized services.

---

## 📂 Project Structure

A brief overview of key directories within `backend/`:

```
backend/
├── src/ (or /)                    # Main source code
│   ├── api/                       # Route definitions
│   │   ├── authRoutes.ts
│   │   └── agentosRoutes.ts
│   ├── agentos/                   # Core AgentOS framework
│   │   ├── api/                   # AgentOS public-facing API
│   │   ├── cognitive_substrate/   # Core reasoning & memory
│   │   ├── core/                  # Foundational elements
│   │   └── rag/                   # Retrieval Augmented Generation
│   ├── config/                    # Application configuration
│   ├── middleware/                # Custom Express middleware
│   ├── prisma/                    # Database schema & migrations
│   ├── services/                  # Business logic layers
│   ├── types/                     # TypeScript type definitions
│   └── utils/                     # Utility functions
├── locales/                       # Internationalization files
├── server.ts                      # Main application entry point
├── db.ts                          # Prisma client initialization
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
└── Dockerfile                     # Docker image instructions
```

---

## ⚙️ Core Services

| Service | Location | Description |
|---------|----------|-------------|
| **AuthService** | `services/user_auth/AuthService.ts` | Manages all aspects of user authentication and authorization |
| **SubscriptionService** | `services/user_auth/SubscriptionService.ts` | Handles user subscription tiers, features, and limits |
| **GMIManager** | `agentos/cognitive_substrate/GMIManager.ts` | Manages the lifecycle and state of Generalized Mind Instances (GMIs) |
| **AgentOSOrchestrator** | `agentos/api/AgentOSOrchestrator.ts` | Coordinates complex interactions involving GMIs, tools, and conversations |
| **AIModelProviderManager** | `agentos/core/llm/providers/implementations/AIModelProviderManager.ts` | Manages connections and interactions with various LLM providers |
| **ToolOrchestrator** | `agentos/core/tools/ToolOrchestrator.ts` | Manages the availability and execution of tools for agents |

---

## 📡 API Endpoints

The primary API is versioned under `/api/v1/`. Key resource groups include:

### Authentication
- **`/api/v1/auth/`** - User registration, login (email/password, OAuth), logout, profile management

### AgentOS Core
- **`/api/v1/agentos/`** - Core interaction endpoints with AgentOS (e.g., sending messages to GMIs, receiving responses)
- **`/api/v1/personas/`** - Listing and retrieving details about available AI personas
- **`/api/v1/gmi/`** - (If applicable) Direct GMI management or interaction endpoints

### Speech Processing
- **`/api/v1/speech/`** - Endpoints for speech-to-text (e.g., Whisper) and text-to-speech

### Webhooks
- **`/api/webhooks/`** - Webhook handlers for third-party services (e.g., LemonSqueezy)

> **Note**: Refer to API documentation or route definition files (e.g., `api/authRoutes.ts`) for detailed endpoint specifications.

---

## 🧪 Testing

> **Note**: This section should be updated based on actual testing setup

To run tests:

```bash
npm test # Or pnpm test
```

This will execute tests defined using Vitest (as per `package.json`). Ensure tests cover critical services, API endpoints, and AgentOS components.

### Testing Strategy

Consider implementing:

- **Unit tests** for individual functions and classes
- **Integration tests** for service interactions and API endpoints (using tools like Supertest)
- **End-to-end tests** (less common for pure backend, but possible if simulating client calls)

---

## 🚀 Deployment

The backend is designed to be deployed as a Docker container. The Dockerfile in the backend directory defines the build process.

### Building the Docker Image

```bash
docker build -t your-repo/voice-chat-assistant-backend:latest -f backend/Dockerfile .
```

> **Important**: Ensure the build context `.` is the project root if the Dockerfile uses `COPY ../...` or adjust paths accordingly. The provided Dockerfile assumes context is `backend/`.

### Running the Container

The `docker-compose.yml` file in the project root provides a complete setup for running the backend along with its dependencies (PostgreSQL, Redis) for both development and production-like environments.

For production, ensure:
- `NODE_ENV=production` is set
- The production stage of the Dockerfile is used

---

## 🤝 Contributing

Please refer to the main `CONTRIBUTING.md` in the project root for guidelines on how to contribute to the backend development.

### Development Standards

Ensure code adheres to:
- **Linting rules**: `npm run lint`
- **Formatting standards**: `npm run format`
- **Documentation**: Include appropriate documentation and tests
- **Testing**: Write comprehensive tests for new features

---

## 📞 Support

For questions, issues, or contributions, please refer to the project's main documentation or open an issue in the repository.