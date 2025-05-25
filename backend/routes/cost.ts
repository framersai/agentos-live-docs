// File: backend/routes/cost.ts
import { Request, Response } from 'express';
import { getSessionCost, resetSessionCost } from '../utils/cost';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

/**
 * Handle GET /api/cost - Get current session cost information
 * @param req - Express request object
 * @param res - Express response object
 */
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    // Get user ID from request (could be from auth middleware or query params)
    const userId = (req as any).userId || req.query.userId as string || 'default_user';
    
    // Get session cost details
    const sessionCost = getSessionCost(userId);
    const costThreshold = parseFloat(process.env.COST_THRESHOLD || '20.00');
    
    console.log(`Cost check for user ${userId}: $${sessionCost.totalCost.toFixed(4)}`);
    
    res.status(200).json({
      message: 'Session cost retrieved successfully',
      userId,
      sessionCost: {
        totalCost: sessionCost.totalCost,
        whisperCost: sessionCost.whisperCost,
        llmCost: sessionCost.llmCost,
        interactions: sessionCost.interactions,
        lastUpdated: sessionCost.lastUpdated
      },
      threshold: costThreshold,
      thresholdReached: sessionCost.totalCost >= costThreshold,
      remainingBudget: Math.max(0, costThreshold - sessionCost.totalCost),
      usage: {
        percentageUsed: Math.min(100, (sessionCost.totalCost / costThreshold) * 100),
        isNearThreshold: sessionCost.totalCost >= (costThreshold * 0.8) // 80% threshold warning
      }
    });
    
  } catch (error) {
    console.error('Error retrieving session cost:', error);
    res.status(500).json({
      message: 'Error retrieving session cost',
      error: process.env.NODE_ENV === 'production' ? 'INTERNAL_ERROR' : (error as Error).message
    });
  }
}

/**
 * Handle POST /api/cost - Reset session cost or update cost tracking
 * @param req - Express request object
 * @param res - Express response object
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const { action = 'reset', userId: bodyUserId } = req.body;
    
    // Get user ID from request body, auth middleware, or default
    const userId = bodyUserId || (req as any).userId || 'default_user';
    
    if (action === 'reset') {
      console.log(`Resetting session cost for user: ${userId}`);
      
      // Reset the session cost
      const resetCost = resetSessionCost(userId);
      
      res.status(200).json({
        message: 'Session cost reset successfully',
        userId,
        sessionCost: {
          totalCost: resetCost.totalCost,
          whisperCost: resetCost.whisperCost,
          llmCost: resetCost.llmCost,
          interactions: resetCost.interactions,
          lastUpdated: resetCost.lastUpdated
        },
        resetAt: new Date().toISOString()
      });
      
    } else {
      // If not reset, just return current cost (same as GET)
      const sessionCost = getSessionCost(userId);
      const costThreshold = parseFloat(process.env.COST_THRESHOLD || '20.00');
      
      res.status(200).json({
        message: 'Session cost retrieved successfully',
        userId,
        sessionCost: {
          totalCost: sessionCost.totalCost,
          whisperCost: sessionCost.whisperCost,
          llmCost: sessionCost.llmCost,
          interactions: sessionCost.interactions,
          lastUpdated: sessionCost.lastUpdated
        },
        threshold: costThreshold,
        thresholdReached: sessionCost.totalCost >= costThreshold
      });
    }
    
  } catch (error) {
    console.error('Error processing cost request:', error);
    res.status(500).json({
      message: 'Error processing cost request',
      error: process.env.NODE_ENV === 'production' ? 'INTERNAL_ERROR' : (error as Error).message
    });
  }
}