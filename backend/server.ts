// backend/server.ts
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs'; // Import fs to check for frontend dist path

// Import Prisma client and connection functions
import prisma, { connectToDatabase, disconnectFromDatabase } from './db.js';

// Core AgentOS Services and Managers
import { AIModelProviderManager, AIModelProviderManagerConfig, ProviderConfigEntry } from './agentos/core/llm/providers/AIModelProviderManager.js';
import { PromptEngine } from './agentos/core/llm/PromptEngine.js';
import { AuthService, IAuthService } from './services/user_auth/AuthService.js';
import { SubscriptionService, ISubscriptionService } from './services/user_auth/SubscriptionService.js';
import { UtilityLLMService } from './services/llm_utility/UtilityLLMService.js';
import { GMIManager, GMIManagerConfig } from './agentos/cognitive_substrate/GMIManager.js';
import { LLMModelRouter, LLMModelRouterConfig } from './agentos/core/llm/routing/LLMModelRouter.js';
import { User } from './services/user_auth/User.js'; // For User API key storage

// Import API routes (assuming these are in their respective files)
// We'll define these later, but keep the imports here for structure
import { createAuthRoutes } from './api/authRoutes.js';
import { createGMIRoutes } from './api/gmiRoutes.js';
import { createUtilityLLMRoutes } from './api/utilityLLMRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Essential Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // 'unsafe-inline' temporarily for Vue dev, should be refined
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: [
        "'self'",
        "https://api.openai.com",
        "https://openrouter.ai",
        process.env.OLLAMA_BASE_URL || "http://localhost:11434", // Ensure Ollama URL is included
      ],
      imgSrc: ["'self'", "data:", "blob:"], // Added blob for potential webcam image uploads
      mediaSrc: ["'self'", "blob:"], // For audio/video streams
      frameSrc: ["'self'"], // For sandboxing UI blocks in iframes
    },
  },
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // 'x-user-api-keys' header is deprecated, use Authorization for JWT and body for API keys.
  // We'll add custom middleware to extract user API keys from the authenticated user's session/DB.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.options('*', cors());

// --- Global Services Initialization (asynchronous) ---
let authService: IAuthService;
let subscriptionService: ISubscriptionService;
let providerManager: AIModelProviderManager;
let globalPromptEngine: PromptEngine;
let utilityLLMService: UtilityLLMService;
let gmiManager: GMIManager;
let llmModelRouter: LLMModelRouter | undefined;

async function initializeGlobalServices() {
  console.log("🚀 Initializing global services...");

  // Connect to the database first
  await connectToDatabase();

  // 1. AIModelProviderManager
  const providerConfigs: ProviderConfigEntry[] = [];
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "YOUR_SYSTEM_OPENAI_KEY") {
    providerConfigs.push({
      providerId: 'openai', enabled: true,
      config: { apiKey: process.env.OPENAI_API_KEY, defaultModel: 'gpt-4o-mini' },
      isDefault: !process.env.OPENROUTER_API_KEY && (!process.env.OLLAMA_BASE_URL || process.env.OLLAMA_BASE_URL === "false"),
    });
  }
  if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "YOUR_SYSTEM_OPENROUTER_KEY") {
    providerConfigs.push({
      providerId: 'openrouter', enabled: true,
      config: {
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultModel: 'openai/gpt-3.5-turbo',
        referer: process.env.APP_URL || `http://localhost:${PORT}`,
        appName: 'AgentOS_CognitoSynth_App'
      },
      isDefault: !!process.env.OPENROUTER_API_KEY,
    });
  }
  if (process.env.OLLAMA_BASE_URL && process.env.OLLAMA_BASE_URL !== "false") {
    providerConfigs.push({
      providerId: 'ollama', enabled: true,
      config: { baseURL: process.env.OLLAMA_BASE_URL, defaultModel: 'llama3:latest' },
    });
  }
  if (providerConfigs.length === 0) {
    console.warn("⚠️ No system-level LLM provider API keys found in .env. Some functionalities might be limited to user-provided keys or local models if Ollama is not configured.");
  } else if (!providerConfigs.some(p => p.isDefault)) {
    // If multiple are configured but none marked default, make the first one default.
    if (providerConfigs.length > 0) providerConfigs[0].isDefault = true;
  }

  const providerManagerConfig: AIModelProviderManagerConfig = { providers: providerConfigs };
  providerManager = new AIModelProviderManager();
  await providerManager.initialize(providerManagerConfig);
  console.log("✅ AIModelProviderManager initialized.");

  // 2. PromptEngine
  globalPromptEngine = new PromptEngine();
  await globalPromptEngine.initialize({}); // No specific config needed for basic init
  console.log("✅ Global PromptEngine initialized.");

  // 3. Auth Service (now uses Prisma for user & API key persistence)
  // Pass prisma instance to AuthService
  authService = new AuthService(prisma); 
  console.log("✅ AuthService initialized.");

  // 4. Subscription Service (now uses Prisma for subscription tiers)
  // Pass prisma instance to SubscriptionService
  subscriptionService = new SubscriptionService(authService, prisma); 
  await subscriptionService.ensureDefaultTiersExist(); // Ensure default tiers are in DB on startup
  console.log("✅ SubscriptionService initialized.");

  // 5. UtilityLLMService
  utilityLLMService = new UtilityLLMService(providerManager, globalPromptEngine);
  console.log("✅ UtilityLLMService initialized.");

  // 6. Optional LLMModelRouter
  if (process.env.ROUTING_LLM_PROVIDER_ID && process.env.ROUTING_LLM_MODEL_ID) {
    const routerConfig: LLMModelRouterConfig = {
      routingModelProviderId: process.env.ROUTING_LLM_PROVIDER_ID,
      routingModelId: process.env.ROUTING_LLM_MODEL_ID,
    };
    llmModelRouter = new LLMModelRouter();
    await llmModelRouter.initialize(routerConfig, providerManager, globalPromptEngine);
    console.log("✅ LLMModelRouter initialized.");
  }

  // 7. GMIManager (now passes prisma for future persistent memory/snapshots)
  const gmiManagerConfig: GMIManagerConfig = {
    personaDefinitionPath: path.resolve(__dirname, './agentos/cognitive_substrate/personas/definitions'),
    defaultGMIBaseConfig: {
      providerManager: providerManager,
      promptEngine: globalPromptEngine,
      modelRouter: llmModelRouter,
      prisma: prisma, // Pass prisma client for GMI's internal use (e.g., working memory persistence, snapshots)
    }
  };
  gmiManager = new GMIManager(gmiManagerConfig, subscriptionService, authService /* Pass authService for user API keys */);
  await gmiManager.loadAllPersonaDefinitions();
  console.log("✅ GMIManager initialized and personas loaded.");
}

// --- API Routes Setup ---
// Health check remains accessible without any auth.
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    servicesInitialized: !!gmiManager // Basic check
  });
});

// Mount new API routes under /api/v1
// Authentication is handled within each route module as needed
app.use('/api/v1/auth', (req, res, next) => {
  if (!authService || !subscriptionService) return res.status(503).json({message: "Auth services not ready."});
  createAuthRoutes(authService, subscriptionService)(req, res, next);
});
app.use('/api/v1/gmi', (req, res, next) => {
  if (!gmiManager || !authService || !providerManager) return res.status(503).json({message: "GMI services not ready."});
  createGMIRoutes(gmiManager, authService, providerManager, prisma)(req, res, next); // Pass prisma here for Conversation persistence
});
app.use('/api/v1/utility', (req, res, next) => {
  if (!utilityLLMService || !authService) return res.status(503).json({message: "Utility services not ready."});
  createUtilityLLMRoutes(utilityLLMService, authService)(req, res, next);
});

// The /api/v1/me/api-keys endpoint logic is now handled in authRoutes.ts
// Removed the inline definition here as it will be part of authRoutes.ts

// Catch-all for /api/v1 routes not found
app.use('/api/v1/*', (req: Request, res: Response) => {
  res.status(404).json({
    message: `API V1 endpoint not found: ${req.method} ${req.originalUrl}`,
    error: 'ENDPOINT_NOT_FOUND_V1',
  });
});

// --- Frontend Serving (Production) & Server Start ---
async function startServer() {
  await initializeGlobalServices();

  if (process.env.NODE_ENV === 'production') {
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) { // Check if frontend build exists
      app.use(express.static(frontendDistPath));
      app.get('*', (req: Request, res: Response, next: NextFunction) => {
        if (!req.originalUrl.startsWith('/api')) {
          res.sendFile(path.join(frontendDistPath, 'index.html'));
        } else {
          next(); // Important to pass to API 404 handler if it's an API path
        }
      });
    } else {
      console.warn(`⚠️ Frontend dist folder not found at ${frontendDistPath}. SPA fallback might not work.`);
    }
  }

  // Global Error Handler (should be last middleware)
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error(`🚨 Global error for ${req.method} ${req.originalUrl}:`, err.message);
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
    res.status(err.status || 500).json({
      message: err.message || 'An unexpected server error occurred.',
      error: process.env.NODE_ENV === 'production' ? 'SERVER_ERROR' : {
        type: err.type || err.name || 'UNHANDLED_EXCEPTION',
        message: err.message,
        code: err.code,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      }
    });
  });

  const server = app.listen(PORT, () => {
    console.log(`✨ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    console.log(`🌐 Frontend URL for CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log('API V1 Endpoints at /api/v1/...');
    console.log('  - /auth (register, login, me, api-keys)');
    console.log('  - /gmi (interact/:personaId, etc.)');
    console.log('  - /utility (direct-prompt, summarize, etc.)');
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectFromDatabase();
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectFromDatabase();
      process.exit(0);
    });
  });
}

startServer().catch(error => {
  console.error('❌ FATAL: Failed to initialize services and start server:', error);
  process.exit(1);
});

export default app;