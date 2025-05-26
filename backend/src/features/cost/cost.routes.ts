/**
 * @file Cost API route handlers.
 * @description Handles requests to the /api/cost endpoint for cost tracking and management.
 * @version 1.1.1 - Removed usageBreakdown from response as it's not in ISessionCostDetail.
 */

import { Request, Response } from 'express';
// Assuming .js extension is intentional for the user's specific build/runtime environment.
import { CostService, ISessionCostDetail } from '../../core/cost/cost.service.js';

/**
 * Handle GET /api/cost - Get current session cost and related details.
 */
export async function GET(req: Request, res: Response): Promise<void> {
  try {
    // @ts-ignore - req.user is a custom property potentially set by auth middleware
    const userId = req.user?.id || req.query.userId as string || 'default_user_cost_check';
    const sessionCostDetail: ISessionCostDetail = CostService.getSessionCost(userId);
    
    console.log(`CostRoutes: GET request for userId: ${userId}. Session cost: $${sessionCostDetail.totalCost.toFixed(6)}`);

    res.status(200).json({
      userId: userId,
      sessionCost: sessionCostDetail.totalCost,
      costsByService: sessionCostDetail.costsByService,
      // Removed: usageBreakdown: sessionCostDetail.usageBreakdown, // Property 'usageBreakdown' does not exist on type 'ISessionCostDetail'.
      sessionStartTime: sessionCostDetail.sessionStartTime.toISOString(),
      entryCount: sessionCostDetail.entries.length,
      globalMonthlyCost: CostService.getGlobalMonthlyCost(),
      threshold: parseFloat(process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00'),
      isThresholdReached: CostService.isSessionCostThresholdReached(userId)
    });
  } catch (error: any) {
    console.error('Cost Routes: Error in GET /api/cost:', error.message, error.stack ? `\nStack: ${error.stack}` : '');
    res.status(500).json({
      message: 'Error retrieving cost information.',
      error: 'COST_RETRIEVAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Handle POST /api/cost - Reset session cost or perform other cost-related actions.
 */
export async function POST(req: Request, res: Response): Promise<void> {
  try {
    // @ts-ignore - req.user is a custom property potentially set by auth middleware
    const requestingUserId = req.user?.id;
    const { userId: targetUserIdParam, action = 'reset' } = req.body;

    const targetUserId = targetUserIdParam || requestingUserId || 'default_user_cost_reset';
    
    console.log(`CostRoutes: POST request. Action: "${action}" for targetUserId: "${targetUserId}". Requested by: "${requestingUserId || 'N/A'}"`);

    if (action === 'reset') {
      CostService.resetSessionCost(targetUserId);
      const newSessionDetail = CostService.getSessionCost(targetUserId);
      
      res.status(200).json({
        message: `Session cost reset successfully for user '${targetUserId}'.`,
        sessionCost: newSessionDetail.totalCost,
        sessionStartTime: newSessionDetail.sessionStartTime.toISOString(),
        costsByService: newSessionDetail.costsByService,
        // Removed: usageBreakdown: newSessionDetail.usageBreakdown, // Property 'usageBreakdown' does not exist on type 'ISessionCostDetail'.
      });
    } else if (action === 'reset_global') {
      if (process.env.NODE_ENV !== 'development' /* && !isAdmin(requestingUserId) */) {
        console.warn(`CostRoutes: Attempt to reset global costs by user '${requestingUserId || 'anonymous'}' in non-development environment DENIED.`);
        res.status(403).json({
          message: 'Global cost reset is restricted and not allowed under current conditions.',
          error: 'FORBIDDEN_ACTION'
        });
        return;
      }
      
      CostService.resetGlobalMonthlyCost();
      console.log(`CostRoutes: Global monthly cost reset initiated by '${requestingUserId || 'dev_user'}'.`);
      res.status(200).json({
        message: 'Global monthly cost reset successfully.',
        globalMonthlyCost: CostService.getGlobalMonthlyCost()
      });
    } else {
      res.status(400).json({
        message: `Invalid action specified: '${action}'. Supported actions: 'reset', 'reset_global (dev only)'.`,
        error: 'INVALID_ACTION'
      });
    }
  } catch (error: any) {
    console.error('Cost Routes: Error in POST /api/cost:', error.message, error.stack ? `\nStack: ${error.stack}` : '');
    res.status(500).json({
      message: 'Error processing cost action.',
      error: 'COST_ACTION_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}