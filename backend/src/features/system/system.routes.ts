// File: backend/src/features/system/system.routes.ts
/**
 * @file system.routes.ts
 * @description Provides diagnostic routes for system-level status checks (LLM availability, etc.).
 */

import type { Request, Response } from 'express';
import { getLlmBootstrapStatus } from '../../core/llm/llm.status.js';

export function getLlmStatus(req: Request, res: Response): void {
  const status = getLlmBootstrapStatus();
  const httpStatus = status.ready ? 200 : 503;
  res.status(httpStatus).json({
    status: status.ready ? 'ready' : 'unavailable',
    ...status,
  });
}
