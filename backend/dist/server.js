import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { configureRouter } from './config/router.js';
import { optionalAuthMiddleware } from './middleware/optionalAuth.js';
import { rateLimiter } from './middleware/ratelimiter.js';
import { setupI18nMiddleware } from './middleware/i18n.js';
import { initializeLlmServices } from './src/core/llm/llm.factory.js';
import { NoLlmProviderConfiguredError, LlmConfigService } from './src/core/llm/llm.config.service.js';
import { setLlmBootstrapStatus, getLlmBootstrapStatus, mapAvailabilityToStatus } from './src/core/llm/llm.status.js';
import { sqliteMemoryAdapter } from './src/core/memory/SqliteMemoryAdapter.js';
import { closeAppDatabase } from './src/core/database/appDatabase.js';
import { schedulePredictiveTtsPrewarm } from './src/core/audio/ttsPrewarm.service.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const envCandidatePaths = [
    path.join(projectRoot, '.env'),
    path.resolve(projectRoot, '..', '.env'),
];
for (const candidate of envCandidatePaths) {
    try {
        if (fs.existsSync(candidate)) {
            dotenv.config({ path: candidate });
            console.log(`[Bootstrap] Loaded environment variables from ${candidate}`);
        }
    }
    catch (error) {
        console.warn(`[Bootstrap] Failed to load env file at ${candidate}:`, error);
    }
}
setLlmBootstrapStatus({
    ready: false,
    code: 'BOOTSTRAP_PENDING',
    message: 'LLM services are initializing.',
    timestamp: new Date().toISOString(),
    providers: {},
});
const PORT = process.env.PORT || 3001;
const app = express();
let server;
app.set('trust proxy', 1);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
    origin: [
        frontendUrl,
        'http://localhost:5173',
        ...(process.env.ADDITIONAL_CORS_ORIGINS ? process.env.ADDITIONAL_CORS_ORIGINS.split(',') : [])
    ],
    credentials: true,
    exposedHeaders: ['X-RateLimit-Limit-Day-IP', 'X-RateLimit-Remaining-Day-IP', 'X-RateLimit-Reset-Day-IP', 'X-RateLimit-Status'],
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
async function startServer() {
    console.log('[Bootstrap] Initializing application services...');
    try {
        await initializeLlmServices();
        const availabilitySnapshot = LlmConfigService.getInstance().getProviderAvailabilitySnapshot();
        setLlmBootstrapStatus({
            ready: true,
            code: 'LLM_READY',
            message: 'LLM services initialized successfully.',
            timestamp: new Date().toISOString(),
            providers: mapAvailabilityToStatus(availabilitySnapshot),
        });
    }
    catch (error) {
        if (error instanceof NoLlmProviderConfiguredError) {
            console.error('[LLM Startup] No configured providers detected. Running in degraded mode.', error.availability);
            setLlmBootstrapStatus({
                ready: false,
                code: 'NO_LLM_PROVIDER',
                message: error.message,
                timestamp: new Date().toISOString(),
                providers: mapAvailabilityToStatus(error.availability),
            });
        }
        else {
            setLlmBootstrapStatus({
                ready: false,
                code: 'LLM_INIT_FAILURE',
                message: error?.message || 'Failed to initialize LLM services.',
                timestamp: new Date().toISOString(),
                providers: {},
            });
            throw error;
        }
    }
    await sqliteMemoryAdapter.initialize();
    await rateLimiter.initialize();
    console.log('[Bootstrap] Core services initialized.');
    const i18nHandlers = await setupI18nMiddleware();
    app.use(i18nHandlers);
    console.log('[i18n] Middleware configured.');
    app.use('/api', optionalAuthMiddleware);
    app.use('/api', rateLimiter.middleware());
    console.log('[Security] Authentication and rate limiting configured for /api.');
    const apiRouter = await configureRouter();
    app.use('/api', apiRouter);
    console.log('[Router] API routes configured under /api');
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'UP',
            timestamp: new Date().toISOString(),
            llm: getLlmBootstrapStatus(),
        });
    });
    if (process.env.SERVE_FRONTEND === 'true') {
        const frontendBuildPath = path.join(projectRoot, 'frontend', 'dist');
        const indexPath = path.join(frontendBuildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            app.use(express.static(frontendBuildPath));
            app.get('*', (req, res, next) => {
                if (req.path.startsWith('/api/')) {
                    return next();
                }
                if (req.headers.accept && req.headers.accept.includes('text/html')) {
                    res.sendFile(indexPath);
                }
                else {
                    next();
                }
            });
            console.log(`[Frontend] Serving static assets from ${frontendBuildPath}`);
        }
        else {
            console.warn(`[Frontend] SERVE_FRONTEND is true, but index.html not found at ${indexPath}`);
        }
    }
    app.use((req, res, next) => {
        if (!res.headersSent) {
            if (req.path.startsWith('/api/')) {
                res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
            }
            else {
                res.status(404).type('text/plain').send('Resource not found on this server.');
            }
        }
        else {
            next();
        }
    });
    app.use((err, req, res, next) => {
        console.error("[Server] Unhandled application error:", err.stack || err);
        if (!res.headersSent) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? { name: err.name, message: err.message, stack: err.stack } : { message: 'An unexpected error occurred.' }
            });
        }
        else {
            next(err);
        }
    });
    server = app.listen(PORT, () => {
        console.log(`[Server] Listening on port ${PORT}`);
        console.log(`[Server] Frontend URL (configured): ${frontendUrl}`);
        console.log(`[Server] Node ENV: ${process.env.NODE_ENV || 'development'}`);
        if (process.env.ENABLE_SQLITE_MEMORY === 'true') {
            console.log('[Storage] SQLite memory persistence: ENABLED');
        }
        else {
            console.warn('[Storage] SQLite memory persistence: DISABLED (server is stateless regarding conversation history)');
        }
        if (process.env.DISABLE_COST_LIMITS === 'true') {
            console.warn('[Costs] Cost limits: DISABLED.');
        }
        if (process.env.REDIS_URL) {
            console.log(`[RateLimiter] Redis configured at ${process.env.REDIS_URL}.`);
        }
        else {
            console.warn('[RateLimiter] REDIS_URL not provided. Using in-memory store.');
        }
        const llmStatusAtStart = getLlmBootstrapStatus();
        if (!llmStatusAtStart.ready) {
            console.warn('[LLM Startup] Server running without an active LLM provider. Configure provider credentials to enable chat endpoints.');
        }
        schedulePredictiveTtsPrewarm();
        console.log(`[Server] Ready at http://localhost:${PORT}`);
    }).on('error', (error) => {
        console.error('[Server] Failed to start:', error);
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use.`);
        }
        process.exit(1);
    });
}
async function gracefulShutdown(signal) {
    console.log(`\n🚦 Received ${signal}. Starting graceful shutdown...`);
    if (server) {
        server.close(async () => {
            console.log('🔌 HTTP server closed.');
            try {
                await rateLimiter.disconnectStore();
                console.log('🛡️ Rate limiter store disconnected.');
            }
            catch (e) {
                console.error('Error disconnecting rate limiter:', e);
            }
            try {
                await sqliteMemoryAdapter.disconnect();
                console.log('💾 SQLite Memory Adapter disconnected.');
            }
            catch (e) {
                console.error('Error disconnecting SQLite adapter:', e);
            }
            try {
                await closeAppDatabase();
            }
            catch (e) {
                console.error('Error closing application database:', e);
            }
            console.log('👋 Graceful shutdown complete. Exiting.');
            process.exit(0);
        });
        setTimeout(() => {
            console.error('⏰ Graceful shutdown timeout. Forcing exit.');
            process.exit(1);
        }, 10000);
    }
    else {
        process.exit(0);
    }
}
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
startServer().catch(error => {
    console.error('💥 Failed to start server due to unhandled error during initialization:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map