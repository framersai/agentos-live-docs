import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function configureRouter(): Promise<Router> {
  const router = Router();
  const routesDir = path.join(__dirname, '../routes');

  // Read all route files
  const routeFiles = fs.readdirSync(routesDir);
  
  for (const file of routeFiles) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      const routePath = `../routes/${file}`;
      
      try {
        // Import route dynamically
        const routeModule = await import(routePath);
        const routeName = file.replace(/\.(ts|js)$/, '');
        
        // Register HTTP methods if they exist in the module
        const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        
        methods.forEach(method => {
          if (typeof routeModule[method] === 'function') {
            router[method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch'](
              `/${routeName}`,
              async (req: Request, res: Response) => {
                try {
                  await routeModule[method](req, res);
                } catch (error) {
                  console.error(`Error in ${method} ${routeName}:`, error);
                  res.status(500).json({
                    message: 'Internal server error',
                    error: process.env.NODE_ENV === 'production' ? undefined : (error as Error).message
                  });
                }
              }
            );
            console.log(`Registered route: ${method} /${routeName}`);
          }
        });
      } catch (error) {
        console.error(`Error loading route ${file}:`, error);
      }
    }
  }

  return router;
}