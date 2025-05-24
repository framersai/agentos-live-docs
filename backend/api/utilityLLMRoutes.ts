// File: backend/api/utilityLLMRoutes.ts
/**
 * @fileoverview Utility LLM routes with syntax fixes
 * FIXES: Line terminator arrow function syntax error
 */

import { Router, Request, Response } from 'express';

// Temporary interfaces until proper types are implemented
interface UtilityLLMService {
  processDirectPrompt(request: DirectPromptRequest): Promise<any>;
  summarizeText(request: SummarizationTaskRequest): Promise<string | null>;
}

interface DirectPromptRequest {
  prompt: string;
  completionOptions?: any;
}

interface SummarizationTaskRequest {
  textToSummarize: string;
  maxLength?: number;
  style?: string;
}

interface IAuthService {
  validateToken(token: string): Promise<any>;
}

// FIXED: Arrow function syntax error - removed line terminator before arrow
const authenticateUtilityLLMRequest = (authService: IAuthService) => 
  async (req: Request, res: Response, next: Function) => {
    // Example: Implement token validation if these routes need protection
    // For now, assuming public or separately managed access for these utilities
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (token) {
    //   const user = await authService.validateToken(token);
    //   if (user) (req as any).user = user;
    // }
    next();
  };

export const createUtilityLLMRoutes = (utilityLLMService: UtilityLLMService, authService: IAuthService): Router => {
  const router = Router();

  // Middleware for all utility routes (optional authentication/rate limiting)
  router.use(authenticateUtilityLLMRequest(authService));

  router.post('/direct-prompt', async (req: Request, res: Response) => {
    try {
      const requestData: DirectPromptRequest = req.body;
      if (!requestData.prompt) {
        return res.status(400).json({ message: 'Prompt is required.' });
      }
      const result = await utilityLLMService.processDirectPrompt(requestData);
      if (result.error) {
        // FIXED: Access message property properly
        return res.status(500).json({ 
          message: `LLM Provider Error: ${result.error.message || 'Unknown error'}`, 
          details: result.error 
        });
      }
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Direct prompt error:", error);
      return res.status(500).json({ message: error.message || 'Failed to process direct prompt.' });
    }
  });

  router.post('/summarize', async (req: Request, res: Response) => {
    try {
      const requestData: SummarizationTaskRequest = req.body;
      if (!requestData.textToSummarize) {
        return res.status(400).json({ message: 'textToSummarize is required.' });
      }
      const summary = await utilityLLMService.summarizeText(requestData);
      if (summary === null) {
        return res.status(500).json({
          message: 'Failed to generate summary due to an internal error or empty LLM response.'
        });
      }
      return res.status(200).json({ summary });
    } catch (error: any) {
      console.error("Summarization error:", error);
      return res.status(500).json({ message: error.message || 'Failed to summarize text.' });
    }
  });

  // Add more routes for other utility functions (e.g., /classify, /translate)

  return router;
};