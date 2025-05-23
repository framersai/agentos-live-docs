// backend/config/router.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function configureRouter(): Promise<Router> {
  const router = Router();
  const routesDir = path.join(__dirname, '../routes');

  console.log('üîß Configuring routes from:', routesDir);

  try {
    if (!fs.existsSync(routesDir)) {
      console.error('‚ùå Routes directory does not exist:', routesDir);
      return router;
    }

    const routeFiles = fs.readdirSync(routesDir);
    console.log('üìÅ Found route files:', routeFiles);
    
    for (const file of routeFiles) {
      // **CHANGE THIS LINE:** Only load .js files in production.
      // During compilation, .ts files are converted to .js files.
      // .d.ts files are type declarations and should not be loaded at runtime.
      if (file.endsWith('.js') && !file.endsWith('.d.js') && !file.endsWith('.map')) { // Exclude .d.js and .map files too
        const routePath = `../routes/${file}`;
        const routeName = file.replace(/\.js$/, ''); // Adjust regex to match .js only
        
        try {
          console.log(`üîÑ Loading route: ${routeName} from ${routePath}`);
          const routeModule = await import(routePath);
          console.log(`üìã Route ${routeName} exports:`, Object.keys(routeModule));
          
          const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
          let registeredCount = 0;
          
          methods.forEach(method => {
            if (typeof routeModule[method] === 'function') {
              const routeHandler = async (req: Request, res: Response) => {
                try {
                  console.log(`üì® Handling ${method} /${routeName}`);
                  await routeModule[method](req, res);
                } catch (error) {
                  console.error(`‚ùå Error in ${method} /${routeName}:`, error);
                  res.status(500).json({
                    message: 'Internal server error',
                    error: process.env.NODE_ENV === 'production' ? undefined : (error as Error).message
                  });
                }
              };

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
                  console.warn(`‚ö†Ô∏è  Unsupported HTTP method: ${method}`);
                  return;
              }
              
              registeredCount++;
              console.log(`‚úÖ Registered route: ${method} /api/${routeName}`);
            }
          });
          if (registeredCount === 0) {
            console.warn(`‚ö†Ô∏è  No HTTP methods found in ${routeName} route module`);
          }

        } catch (error) {
          console.error(`‚ùå Error loading route ${file}:`, error);
        }
      }
    }

    router.get('/test', (req: Request, res: Response) => {
      res.json({
        message: 'Router is working!',
        timestamp: new Date().toISOString(),
        availableRoutes: routeFiles
      });
    });
    console.log('‚úÖ Added test route: GET /api/test');

  } catch (error) {
    console.error('‚ùå Error setting up routes:', error);
    throw error;
  }

  return router;
}