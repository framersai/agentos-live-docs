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
7. [🔐 Authentication](#-authentication)
8. [📡 API Endpoints](#-api-endpoints)
9. [🌊 Streaming API](#-streaming-api)
10. [⚠️ Error Handling](#️-error-handling)
11. [🧪 Testing](#-testing)
12. [🚀 Deployment](#-deployment)
13. [🤝 Contributing](#-contributing)
14. [📚 Further Reading](#-further-reading)

---

## 🚀 Overview

The backend is the central nervous system of the Voice Chat Assistant. It handles:

- **User Authentication**: Secure registration, login (email/password & Google OAuth), session management
- **AgentOS Integration**: Manages Generalized Mind Instances (GMIs), personas, LLM connections, RAG, and tool execution
- **API Services**: Provides RESTful APIs for frontend communication with streaming support
- **Data Persistence**: Uses PostgreSQL via Prisma ORM for all application data
- **Caching**: Utilizes Redis for performance optimization
- **Real-time Communication**: WebSocket integration for features like live transcription and streaming responses

### 🏗️ Architecture Overview

- **RESTful Design**: Built on REST principles for predictable interactions
- **JSON Communication**: Uses JSON for request/response bodies
- **JWT Authentication**: Employs JWT Bearer tokens for secure access
- **Streaming-First**: Core GMI interactions use `application/x-ndjson` streaming
- **Base URL**: All API endpoints are prefixed with `/api/v1`

---

## ✨ Features

### 🔐 Robust Authentication
- JWT-based sessions with secure token management
- OAuth 2.0 (Google) integration
- Secure password handling with bcrypt
- API key management for LLM providers
- Password reset functionality

### 🧠 Modular AgentOS Core
Extensible framework for building and managing sophisticated AI agents:
- **Persona Management**: Dynamic AI personality system
- **LLM Provider Abstraction**: Support for OpenAI, OpenRouter, Ollama
- **Tool Orchestration and Execution**: Extensible tool system
- **Retrieval Augmented Generation (RAG)**: Vector stores with Pinecone
- **Conversation Management**: Persistent memory and context handling
- **Streaming Responses**: Real-time AI interactions

### 💳 Subscription Management
- Integration with LemonSqueezy for payment processing
- Tiered subscription system with feature gating
- Webhook handling for subscription events

### 🛡️ Additional Features
- **Comprehensive Error Handling**: Standardized error codes and responses
- **Health Monitoring**: System health checks and service status
- **Configurable**: Environment-driven configuration
- **Scalable**: Docker-ready with horizontal scaling support

---

## 🏛️ Architecture Highlights

- **TypeScript**: Full type safety and robust development experience
- **Node.js & Express.js**: High-performance web server and API framework
- **Prisma**: Modern ORM with type-safe database operations
- **Service-Oriented Design**: Modular business logic separation
- **Interface-Driven**: Promotes loose coupling and testability
- **Dockerized**: Consistent development and deployment environments
- **Streaming Architecture**: Real-time response handling

---

## 🛠️ Development Setup

Follow these steps to get the backend service running locally.

### Prerequisites

- **Node.js**: Version 20.x or later
- **pnpm** (preferred) or **npm/yarn**: Package management
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Compose**: For running PostgreSQL, Redis, and other services
- **PostgreSQL Instance**: Database server (can be run via Docker)

### Cloning the Repository

```bash
git clone <repository-url>
cd voice-chat-assistant
```

### Environment Variables (.env)

1. Copy the sample environment file:
   ```bash
   cp .env.sample .env
   ```

2. Configure the following variables:

#### Core Configuration
```env
PORT=3001
NODE_ENV=development
APP_URL=http://localhost:3001
```

#### Database & Cache
```env
DATABASE_URL=postgresql://vca_user:yourpassword@postgres:5432/voice_chat_assistant
REDIS_URL=redis://redis:6379
```

#### Security
```env
JWT_SECRET=your-super-long-jwt-secret-at-least-64-characters-long
API_KEY_ENCRYPTION_KEY_HEX=your-32-byte-hex-string-for-api-key-encryption
```

Generate encryption key:
```bash
openssl rand -hex 32
```

#### LLM API Keys
```env
OPENAI_API_KEY=your-openai-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

#### Google OAuth (Optional)
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback
```

#### AgentOS Configuration
```env
PERSONA_DEFINITIONS_PATH=./backend/agentos/cognitive_substrate/personas/definitions
```

### Installing Dependencies

```bash
cd backend
pnpm install
```

### Database Setup (Prisma)

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Apply Migrations**:
   ```bash
   # Development
   npx prisma migrate dev --name init
   
   # Production
   npx prisma migrate deploy
   ```

3. **Seed Database** (Optional):
   ```bash
   npx prisma db seed
   ```

### Running the Backend

```bash
npm run dev
```

The server will start on `http://localhost:3001` with hot-reloading enabled.

### Health Check

Verify the service is running:
```bash
curl http://localhost:3001/health
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── api/                       # API route definitions
│   │   ├── authRoutes.ts         # Authentication routes
│   │   ├── agentosRoutes.ts      # AgentOS interaction routes
│   │   └── personaRoutes.ts      # Persona management routes
│   ├── agentos/                   # AgentOS framework
│   │   ├── api/                   # Public AgentOS API
│   │   ├── cognitive_substrate/   # Core reasoning & memory
│   │   ├── core/                  # Foundational components
│   │   │   ├── llm/              # LLM provider abstractions
│   │   │   └── tools/            # Tool system
│   │   └── rag/                   # RAG implementation
│   ├── config/                    # Application configuration
│   ├── middleware/                # Express middleware
│   ├── prisma/                    # Database schema & migrations
│   ├── services/                  # Business logic
│   │   └── user_auth/            # Authentication services
│   ├── types/                     # TypeScript definitions
│   └── utils/                     # Utility functions
├── locales/                       # Internationalization
├── server.ts                      # Application entry point
├── db.ts                          # Database connection
└── Dockerfile                     # Container definition
```

---

## ⚙️ Core Services

| Service | Location | Responsibility |
|---------|----------|----------------|
| **AuthService** | `services/user_auth/AuthService.ts` | User authentication, JWT management, OAuth integration |
| **SubscriptionService** | `services/user_auth/SubscriptionService.ts` | Subscription tiers, payment processing, feature gates |
| **GMIManager** | `agentos/cognitive_substrate/GMIManager.ts` | GMI lifecycle, state management, conversation handling |
| **AgentOSOrchestrator** | `agentos/api/AgentOSOrchestrator.ts` | Complex AI interactions, tool coordination |
| **AIModelProviderManager** | `agentos/core/llm/providers/implementations/AIModelProviderManager.ts` | LLM provider connections, model routing |
| **ToolOrchestrator** | `agentos/core/tools/ToolOrchestrator.ts` | Tool discovery, execution, result handling |

---

## 🔐 Authentication

The API uses JWT Bearer tokens for authentication with support for multiple authentication methods.

### 🔄 Authentication Flow

1. **Register**: Create account via `POST /api/v1/auth/register`
2. **Login**: Get JWT token via `POST /api/v1/auth/login`
3. **Access**: Include token in requests:
   ```
   Authorization: Bearer <YOUR_JWT_ACCESS_TOKEN>
   ```
4. **Logout**: Invalidate session via `POST /api/v1/auth/logout`

### 🌐 Access Levels

- **Public**: Health checks, public persona listings
- **Authenticated**: Full API access based on subscription tier
- **Guest**: Limited demo access with designated guest userId

---

## 📡 API Endpoints

All endpoints use the base URL `/api/v1`

### 🏥 Health Check
```http
GET /health
```
Returns server operational status and service health.

### 🔑 Authentication Endpoints

#### User Management
```http
POST /auth/register          # Register new user
POST /auth/login             # Authenticate user
POST /auth/logout            # Invalidate session
GET  /auth/me                # Get user profile
```

#### Password Management
```http
POST /auth/me/change-password      # Change password
POST /auth/request-password-reset  # Request reset token
POST /auth/reset-password          # Reset with token
```

#### API Key Management
```http
POST   /auth/me/api-keys                    # Add/update LLM API key
GET    /auth/me/api-keys                    # List user's API keys
DELETE /auth/me/api-keys/:apiKeyRecordId    # Delete API key
```

### 🤖 AgentOS Core Endpoints

#### Chat Interactions (Streaming)
```http
POST /agentos/chat/turn        # Process chat turn with GMI
POST /agentos/chat/tool_result # Submit tool execution result
```

### 🎭 Persona Endpoints
```http
GET /personas                  # List available personas
```

### 💳 Payment Webhooks
```http
POST /webhooks/lemonsqueezy           # Handle payment events
GET  /webhooks/lemonsqueezy/health    # Webhook health check
```

---

## 🌊 Streaming API

Core AgentOS interactions use streaming responses for real-time AI interactions.

### 📡 Streaming Characteristics

- **Content-Type**: `application/x-ndjson` (newline-delimited JSON)
- **Format**: Each line contains a separate JSON object
- **Processing**: Handle chunks incrementally as they arrive
- **Completion**: `isFinal: true` indicates response completion

### 🔄 Client Implementation

```javascript
const response = await fetch('/api/v1/agentos/chat/turn', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.length > 0);
  
  for (const line of lines) {
    const data = JSON.parse(line);
    
    switch (data.type) {
      case 'text_delta':
        appendToChat(data.textDelta);
        break;
      case 'final_response':
        markChatComplete(data.finalResponseText);
        break;
      case 'error':
        handleStreamError(data);
        break;
    }
  }
}
```

### 🚨 Stream Error Handling

- **Pre-stream errors**: Standard HTTP error responses
- **Mid-stream errors**: `AgentOSErrorChunk` objects within stream
- **Connection issues**: Implement retry logic with exponential backoff

---

## ⚠️ Error Handling

The API returns standardized JSON error responses for consistent error handling.

### 📋 Error Response Structure

```json
{
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable error description",
    "details": {},
    "timestamp": "2025-05-24T12:00:00.000Z"
  }
}
```

### 📊 HTTP Status Codes

| Status | Description | Usage |
|--------|-------------|-------|
| **200** | ✅ OK | Request successful |
| **201** | ✅ Created | Resource created successfully |
| **204** | ✅ No Content | Success with empty response |
| **400** | ❌ Bad Request | Invalid input or validation errors |
| **401** | ❌ Unauthorized | Missing or invalid authentication |
| **403** | ❌ Forbidden | Insufficient permissions |
| **404** | ❌ Not Found | Resource doesn't exist |
| **409** | ❌ Conflict | Resource conflict (duplicate email) |
| **500** | ❌ Internal Error | Unexpected server issues |
| **503** | ❌ Service Unavailable | Downstream service issues |

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

### Testing Strategy

- **Unit Tests**: Individual functions and classes
- **Integration Tests**: Service interactions and API endpoints
- **End-to-End Tests**: Complete user workflows
- **Load Tests**: Performance under stress

### Test Configuration

Tests use Vitest with coverage reporting. Ensure tests cover:
- Authentication flows
- AgentOS interactions
- Error handling
- Streaming responses

---

## 🚀 Deployment

### Docker Deployment

1. **Build the image**:
   ```bash
   docker build -t voice-chat-backend:latest -f backend/Dockerfile .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

### Production Configuration

Ensure the following for production:
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper database connections
- Set up Redis for caching
- Configure SSL/TLS termination
- Set up monitoring and logging

### Environment Setup

- **Development**: Use `docker-compose.yml` for local services
- **Staging**: Deploy with production-like configuration
- **Production**: Use managed services for database and cache

---

## 🤝 Contributing

### Development Standards

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Write tests for new features
- **Documentation**: Update API documentation for changes
- **Type Safety**: Maintain full TypeScript coverage

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Code Quality

```bash
npm run lint          # Check code style
npm run format        # Format code
npm run type-check    # Verify TypeScript
npm test              # Run test suite
```

---

## 📚 Further Reading

Explore additional documentation for deeper understanding:

| Topic | Document | Description |
|-------|----------|-------------|
| 🏗️ **Architecture** | `docs/ARCHITECTURE.MD` | System architecture and design patterns |
| 🚀 **Getting Started** | `docs/GETTING-STARTED.MD` | Setup guide and initial API calls |
| 💭 **Prompt Engineering** | `backend/agentos/docs/PROMPTS.MD` | Effective prompt design strategies |
| 🔍 **RAG System** | `backend/agentos/docs/RAG.MD` | Retrieval Augmented Generation implementation |
| 🛠️ **Tools** | `backend/agentos/docs/TOOLS.MD` | Available tools and system architecture |
| 🧠 **Memory Lifecycle** | `backend/agentos/docs/MEMORY_LIFECYCLE.MD` | Memory management and persistence |

---

## 📞 Support & Community

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas
- **Documentation**: Contribute to documentation improvements
- **Security**: Report security issues privately to the maintainers

---

**Voice Chat Assistant Backend v1.0.0**  
*Built with ❤️ for the AgentOS Community*