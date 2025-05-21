import { Request, Response } from 'express';
import { getSessionCost, getSessionDetails, resetSessionCost } from '../utils/cost.js';

// Get session cost information
export async function GET(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string || 'default';
    
    const sessionDetails = getSessionDetails(userId);
    
    return res.status(200).json({
      userId,
      sessionCost: getSessionCost(userId),
      sessionDetails
    });
  } catch (error) {
    console.error('Error in cost endpoint:', error);
    return res.status(500).json({
      message: 'Error retrieving cost information',
      error: (error as Error).message
    });
  }
}

// Reset session cost
export async function POST(req: Request, res: Response) {
  try {
    const { userId = 'default' } = req.body;
    
    resetSessionCost(userId);
    
    return res.status(200).json({
      message: 'Session cost reset successfully',
      userId,
      sessionCost: 0
    });
  } catch (error) {
    console.error('Error resetting cost:', error);
    return res.status(500).json({
      message: 'Error resetting session cost',
      error: (error as Error).message
    });
  }
}