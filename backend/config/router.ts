// File: backend/config/router.ts
/**
 * @fileoverview Router configuration with import.meta fix
 * FIXES: Replace import.meta with __dirname for CommonJS compatibility
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// FIXED: Use fileURLToPath for ESM to CommonJS conversion instead of import.meta directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function configureRouter(): Promise<Router> {
  const router = Router();
  const routesDir = path.join(__dirname, '../routes');

  console.log('🔧 Configuring routes from:', routesDir);

  try {
    // Check if routes directory exists
    if (!fs.existsSync(routesDir)) {
      console.error('❌ Routes directory does not exist:', routesDir);
      return router;
    }

    // Read all route files
    const routeFiles = fs.readdirSync(routesDir);
    console.log('📁 Found route files:', routeFiles);
    
    for (const file of routeFiles) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const routePath = `../routes/${file}`;
        const routeName = file.replace(/\.(ts|js)$/, '');
        
        try {
          console.log(`🔄 Loading route: ${routeName} from ${routePath}`);
          
          // Import route dynamically
          const routeModule = await import(routePath);
          
          // Log what we found in the module
          console.log(`📋 Route ${routeName} exports:`, Object.keys(routeModule));
          
          // Register HTTP methods if they exist in the module
          const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
          let registeredCount = 0;
          
          methods.forEach(method => {
            if (typeof routeModule[method] === 'function') {
              const routeHandler = async (req: Request, res: Response) => {
                try {
                  console.log(`📨 Handling ${method} /${routeName}`);
                  await routeModule[method](req, res);
                } catch (error) {
                  console.error(`❌ Error in ${method} /${routeName}:`, error);
                  res.status(500).json({
                    message: 'Internal server error',
                    error: process.env.NODE_ENV === 'production' ? undefined : (error as Error).message
                  });
                }
              };

              // Use explicit method calls instead of dynamic access
              switch (method.toLowerCase()) {
                case 'get':
                  router.get(`/${routeName}`, routeHandler);
                  break;
                case 'post':
                  router.post(`/${routeName}`, routeHandler);
                  break;
                case 'put':
                  router.put(`/${routeName}`, routeHandler);
                  break;
                case 'delete':
                  router.delete(`/${routeName}`, routeHandler);
                  break;
                case 'patch':
                  router.patch(`/${routeName}`, routeHandler);
                  break;
                default:
                  console.warn(`⚠️  Unsupported HTTP method: ${method}`);
                  return; // Use return instead of continue in forEach
              }
              
              registeredCount++;
              console.log(`✅ Registered route: ${method} /api/${routeName}`);
            }
          });

          if (registeredCount === 0) {
            console.warn(`⚠️  No HTTP methods found in ${routeName} route module`);
          }

        } catch (error) {
          console.error(`❌ Error loading route ${file}:`, error);
        }
      }
    }

    // Add a test route to verify the router is working
    router.get('/test', (req: Request, res: Response) => {
      res.json({ 
        message: 'Router is working!', 
        timestamp: new Date().toISOString(),
        availableRoutes: routeFiles
      });
    });
    console.log('✅ Added test route: GET /api/test');

  } catch (error) {
    console.error('❌ Error setting up routes:', error);
  }

  return router;
}