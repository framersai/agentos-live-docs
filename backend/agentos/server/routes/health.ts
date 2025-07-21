// agentos/server/routes/health.ts
import { Express, Request, Response } from 'express';

export function setupHealthRoutes(app: Express, basePath: string): void {
  app.get(`${basePath}/health`, (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      service: 'agentos-server',
    });
  });

  app.get(`${basePath}/ready`, (req: Request, res: Response) => {
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'agentos-server',
    });
  });
}