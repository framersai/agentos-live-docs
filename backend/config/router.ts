// File: backend/config/router.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route handlers directly since dynamic import has issues
import * as authRoutes from '../src/features/auth/auth.routes.js';
import * as chatRoutes from '../src/features/chat/chat.routes.js';
import * as diagramRoutes from '../src/features/chat/diagram.routes.js';
import * as sttRoutes from '../src/features/speech/stt.routes.js';
import * as ttsRoutes from '../src/features/speech/tts.routes.js';
import * as costRoutes from '../src/features/cost/cost.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configures and returns the main API router with all routes registered.
 * Simplified to use direct imports instead of dynamic loading.
 */
export async function configureRouter(): Promise<Router> {
  const router = Router();

  console.log('🔧 Configuring API routes...');

  try {
    // Auth routes
    router.post('/auth', authRoutes.POST);
    router.get('/auth', authRoutes.GET);
    router.delete('/auth', authRoutes.DELETE);
    console.log('✅ Registered auth routes');

    // Chat routes
    router.post('/chat', chatRoutes.POST);
    console.log('✅ Registered chat routes');

    // Diagram routes
    router.post('/diagram', diagramRoutes.POST);
    console.log('✅ Registered diagram routes');

    // STT routes
    router.post('/stt', sttRoutes.POST);
    router.get('/stt/stats', sttRoutes.GET);
    console.log('✅ Registered STT routes');

    // TTS routes
    router.post('/tts', ttsRoutes.POST);
    router.get('/tts/voices', ttsRoutes.GET);
    console.log('✅ Registered TTS routes');

    // Cost routes
    router.get('/cost', costRoutes.GET);
    router.post('/cost', costRoutes.POST);
    console.log('✅ Registered cost routes');

    // Add a test endpoint for debugging
    router.get('/test', (req: Request, res: Response) => {
      res.json({
        message: 'Router is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        availableRoutes: [
          'POST /api/auth',
          'GET /api/auth',
          'DELETE /api/auth',
          'POST /api/chat',
          'POST /api/diagram',
          'POST /api/stt',
          'GET /api/stt/stats',
          'POST /api/tts',
          'GET /api/tts/voices',
          'GET /api/cost',
          'POST /api/cost'
        ]
      });
    });
    console.log('✅ Added test route: GET /api/test');

  } catch (error) {
    console.error('❌ Error setting up routes:', error);
    throw error;
  }

  return router;
}