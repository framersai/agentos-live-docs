// agentos/server/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKeyHeader = process.env.AGENTOS_API_KEY_HEADER || 'x-agentos-api-key';
    const apiKey = req.headers[apiKeyHeader] as string;
    const authHeader = req.headers.authorization;

    if (apiKey) {
      // API Key authentication
      const validApiKey = await validateApiKey(apiKey);
      if (validApiKey) {
        req.user = { id: validApiKey.userId };
        return next();
      }
    }

    if (authHeader?.startsWith('Bearer ')) {
      // JWT authentication
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.AGENTOS_JWT_SECRET || 'secret');
      req.user = decoded as any;
      return next();
    }

    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required. Provide API key or Bearer token.',
      },
    });
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Authentication failed',
      },
    });
  }
}

async function validateApiKey(apiKey: string): Promise<{ userId: string } | null> {
  // This should integrate with your actual API key validation system
  // For now, this is a simple placeholder
  if (apiKey === process.env.AGENTOS_MASTER_API_KEY) {
    return { userId: 'system' };
  }
  
  // In a real implementation, you'd check against a database
  // return await apiKeyService.validate(apiKey);
  return null;
}