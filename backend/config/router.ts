// File: backend/config/router.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configures and returns the main API router with dynamically loaded routes.
 * 
 * This function scans the routes directory and automatically registers
 * route handlers based on filename and exported HTTP method functions.
 * 
 * Route files should export functions named after HTTP methods (GET, POST, etc.)
 * that accept (req: Request, res: Response) parameters.
 * 
 * @returns {Promise<Router>} Configured Express router with all routes registered
 */
export async function configureRouter(): Promise<Router> {
  const router = Router();
  const routesDir = path.join(__dirname, '../routes');

  console.log('🔧 Configuring routes from:', routesDir);

  try {
    if (!fs.existsSync(routesDir)) {
      console.error('❌ Routes directory does not exist:', routesDir);
      return router;
    }

    const routeFiles = fs.readdirSync(routesDir);
    console.log('📁 Found route files:', routeFiles);
    
    for (const file of routeFiles) {
      // Only load TypeScript files, excluding type definitions
      if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        const routeName = file.replace(/\.ts$/, '');
        
        try {
          console.log(`🔄 Loading route: ${routeName} from ${file}`);
          
          // **CRITICAL FIX**: Use file:// URL for dynamic imports in ES modules
          const routeFilePath = path.join(routesDir, file);
          const routeFileUrl = new URL(`file://${routeFilePath}`).href;
          
          const routeModule = await import(routeFileUrl);
          console.log(`✅ Route ${routeName} exports:`, Object.keys(routeModule));
          
          const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
          let registeredCount = 0;
          
          for (const method of supportedMethods) {
            if (typeof routeModule[method] === 'function') {
              const routeHandler = async (req: Request, res: Response) => {
                try {
                  console.log(`🌐 Handling ${method} /${routeName}`);
                  await routeModule[method](req, res);
                } catch (error) {
                  console.error(`❌ Error in ${method} /${routeName}:`, error);
                  if (!res.headersSent) {
                    res.status(500).json({
                      message: 'Internal server error',
                      error: process.env.NODE_ENV === 'production' ? undefined : (error as Error).message
                    });
                  }
                }
              };

              // Register the route handler for the specific HTTP method
              // **FIX**: Ensure clean route paths without double slashes
              const routePath = `/${routeName}`;
              
              switch (method.toLowerCase()) {
                case 'get':
                  router.get(routePath, routeHandler);
                  break;
                case 'post':
                  router.post(routePath, routeHandler);
                  break;
                case 'put':
                  router.put(routePath, routeHandler);
                  break;
                case 'delete':
                  router.delete(routePath, routeHandler);
                  break;
                case 'patch':
                  router.patch(routePath, routeHandler);
                  break;
                default:
                  console.warn(`⚠️  Unsupported HTTP method: ${method}`);
                  continue;
              }
              
              registeredCount++;
              console.log(`✅ Registered route: ${method} /api${routePath}`);
            }
          }
          
          if (registeredCount === 0) {
            console.warn(`⚠️  No HTTP methods found in ${routeName} route module`);
          }

        } catch (error) {
          console.error(`❌ Error loading route ${file}:`, error);
          // Continue loading other routes even if one fails
        }
      }
    }

    // Add a test endpoint for debugging
    router.get('/test', (req: Request, res: Response) => {
      res.json({
        message: 'Router is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        routesDirectory: routesDir,
        availableRoutes: routeFiles.filter(file => 
          file.endsWith('.ts') && !file.endsWith('.d.ts')
        )
      });
    });
    console.log('✅ Added test route: GET /api/test');

  } catch (error) {
    console.error('❌ Error setting up routes:', error);
    throw error;
  }

  return router;
}