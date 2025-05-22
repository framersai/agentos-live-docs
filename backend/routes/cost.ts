// backend/routes/cost.ts
import { Router, Request, Response } from 'express';
import { getSessionCost, resetSessionCost } from '../utils/cost.js';

const router = Router();

// GET current session cost
router.get('/', (req: Request, res: Response) => {
  // In a real app, userId would come from the decoded token or session.
  // For this setup, we rely on the client potentially sending it, or use 'default'.
  const userId = (req as any).user?.id || req.query.userId || 'default_user'; 
  try {
    const costData = getSessionCost(userId as string);
    res.status(200).json({
      userId: userId,
      sessionCost: costData.totalCost, // For direct use in Home.vue
      detailedCost: costData,
      message: 'Session cost retrieved successfully.'
    });
  } catch (error) {
    console.error('Error retrieving session cost:', error);
    res.status(500).json({ message: 'Failed to retrieve session cost', error: (error as Error).message });
  }
});

// POST to reset session cost
router.post('/', (req: Request, res: Response) => {
  const userId = (req as any).user?.id || req.body.userId || 'default_user';
  try {
    const newCostData = resetSessionCost(userId as string);
    res.status(200).json({
      userId: userId,
      sessionCost: newCostData.totalCost,
      detailedCost: newCostData,
      message: 'Session cost reset successfully.'
    });
  } catch (error) {
    console.error('Error resetting session cost:', error);
    res.status(500).json({ message: 'Failed to reset session cost', error: (error as Error).message });
  }
});

export default router;