// File: backend/src/features/cost/cost.routes.ts

/**
 * @file Cost API route handlers.
 * @description Handles requests to the /api/cost endpoint for cost tracking and management.
 */

import { Request, Response } from 'express';
import { CostService } from '../../core/cost/cost.service.js';

/**
 * Handle GET /api/cost - Get current session cost
 */
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id || req.query.userId as string || 'default_user';
    const sessionCostDetail = CostService.getSessionCost(userId);
    
    res.status(200).json({
      sessionCost: sessionCostDetail.totalCost,
      costsByService: sessionCostDetail.costsByService,
      sessionStartTime: sessionCostDetail.sessionStartTime,
      entryCount: sessionCostDetail.entries.length,
      globalMonthlyCost: CostService.getGlobalMonthlyCost(),
      threshold: parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00'),
      isThresholdReached: CostService.isSessionCostThresholdReached(userId)
    });
  } catch (error: any) {
    console.error('Cost Routes: Error in GET /api/cost:', error);
    res.status(500).json({
      message: 'Error retrieving cost information',
      error: 'COST_RETRIEVAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Handle POST /api/cost - Reset session cost
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    const { userId = 'default_user', action = 'reset' } = req.body;
    
    if (action === 'reset') {
      CostService.resetSessionCost(userId);
      const newSessionDetail = CostService.getSessionCost(userId);
      
      res.status(200).json({
        message: 'Session cost reset successfully',
        sessionCost: newSessionDetail.totalCost,
        sessionStartTime: newSessionDetail.sessionStartTime
      });
    } else if (action === 'reset_global') {
      // Only allow in development or with admin auth
      if (process.env.NODE_ENV !== 'development') {
        res.status(403).json({
          message: 'Global cost reset not allowed in production',
          error: 'FORBIDDEN'
        });
        return;
      }
      
      CostService.resetGlobalMonthlyCost();
      res.status(200).json({
        message: 'Global monthly cost reset successfully',
        globalMonthlyCost: 0
      });
    } else {
      res.status(400).json({
        message: 'Invalid action. Supported actions: reset, reset_global',
        error: 'INVALID_ACTION'
      });
    }
  } catch (error: any) {
    console.error('Cost Routes: Error in POST /api/cost:', error);
    res.status(500).json({
      message: 'Error resetting cost',
      error: 'COST_RESET_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}