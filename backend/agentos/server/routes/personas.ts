// agentos/server/routes/personas.ts
import { Express, Request, Response, NextFunction } from 'express';
import { AgentOS } from '../../api/AgentOS';
import { logger } from '../utils/logger';

export function setupPersonaRoutes(
  app: Express,
  basePath: string,
  agentOS: AgentOS
): void {
  app.get(`${basePath}/personas`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const personas = await agentOS.listAvailablePersonas(userId);
      
      res.json({
        success: true,
        data: personas,
        count: personas.length,
      });
    } catch (error) {
      logger.error('Error listing personas:', error);
      next(error);
    }
  });

  app.get(`${basePath}/personas/:personaId`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { personaId } = req.params;
      const userId = req.user?.id;
      
      const personas = await agentOS.listAvailablePersonas(userId);
      const persona = personas.find(p => p.id === personaId);
      
      if (!persona) {
        return res.status(404).json({
          success: false,
          error: 'Persona not found',
        });
      }
      
      res.json({
        success: true,
        data: persona,
      });
    } catch (error) {
      logger.error('Error getting persona:', error);
      next(error);
    }
  });
}