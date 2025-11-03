import { Router } from 'express';
import { marketplaceService } from './marketplace.service.js';

export const marketplaceRouter = Router();

marketplaceRouter.get('/agents', async (_req, res, next) => {
  try {
    const agents = await marketplaceService.listAgents();
    res.json({ agents });
  } catch (error) {
    next(error);
  }
});

marketplaceRouter.get('/agents/:id', async (req, res, next) => {
  try {
    const agent = await marketplaceService.getAgentById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Marketplace agent not found.' });
    }
    res.json({ agent });
  } catch (error) {
    next(error);
  }
});
