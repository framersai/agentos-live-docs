/**
 * @file agentos.hitl.routes.ts
 * @description Express routes for AgentOS Human-in-the-Loop (HITL) API.
 * Provides endpoints for managing approvals, clarifications, escalations, and feedback.
 *
 * @module Backend/AgentOS/HITL
 */

import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

// =============================================================================
// Types
// =============================================================================

interface PendingApproval {
  actionId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  agentId: string;
  context: Record<string, unknown>;
  reversible: boolean;
  requestedAt: string;
  expiresAt?: string;
}

interface PendingClarification {
  requestId: string;
  question: string;
  context: string;
  agentId: string;
  clarificationType: 'ambiguity' | 'missing_info' | 'preference' | 'verification' | 'guidance';
  options?: Array<{ optionId: string; label: string; description?: string }>;
  allowFreeform: boolean;
  requestedAt: string;
  expiresAt?: string;
}

interface PendingEscalation {
  escalationId: string;
  reason: string;
  explanation: string;
  agentId: string;
  currentState: Record<string, unknown>;
  attemptedActions: string[];
  recommendations?: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  escalatedAt: string;
}

interface FeedbackEntry {
  feedbackId: string;
  agentId: string;
  feedbackType: 'correction' | 'praise' | 'guidance' | 'preference' | 'complaint';
  aspect: 'accuracy' | 'style' | 'speed' | 'judgment' | 'communication' | 'other';
  content: string;
  importance: number;
  context?: Record<string, unknown>;
  providedBy: string;
  providedAt: string;
}

// In-memory stores (replace with persistent storage in production)
const pendingApprovals = new Map<string, PendingApproval>();
const pendingClarifications = new Map<string, PendingClarification>();
const pendingEscalations = new Map<string, PendingEscalation>();
const feedbackHistory: FeedbackEntry[] = [];
const stats = {
  totalApprovals: 0,
  approved: 0,
  rejected: 0,
  totalClarifications: 0,
  totalEscalations: 0,
  avgResponseTimeMs: 0,
};

// =============================================================================
// Approval Routes
// =============================================================================

/**
 * GET /hitl/approvals
 * List all pending approvals
 */
router.get('/approvals', (req: Request, res: Response) => {
  const approvals = Array.from(pendingApprovals.values());

  res.json({
    success: true,
    data: {
      approvals,
      total: approvals.length,
    },
  });
});

/**
 * POST /hitl/approvals
 * Create a new approval request (called by agents)
 */
router.post('/approvals', (req: Request, res: Response) => {
  const body = req.body as Partial<PendingApproval>;

  if (!body.description || !body.agentId) {
    res.status(400).json({
      success: false,
      error: 'description and agentId are required',
    });
    return;
  }

  const actionId = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const approval: PendingApproval = {
    actionId,
    description: body.description,
    severity: body.severity || 'medium',
    category: body.category,
    agentId: body.agentId,
    context: body.context || {},
    reversible: body.reversible ?? true,
    requestedAt: new Date().toISOString(),
    expiresAt: body.expiresAt,
  };

  pendingApprovals.set(actionId, approval);
  stats.totalApprovals++;

  res.status(201).json({
    success: true,
    data: { approval },
  });
});

/**
 * POST /hitl/approvals/:actionId/approve
 * Approve an action
 */
router.post('/approvals/:actionId/approve', (req: Request, res: Response) => {
  const approval = pendingApprovals.get(req.params.actionId);

  if (!approval) {
    res.status(404).json({
      success: false,
      error: 'Approval request not found',
    });
    return;
  }

  const { decidedBy, instructions, feedback } = req.body;

  pendingApprovals.delete(req.params.actionId);
  stats.approved++;

  res.json({
    success: true,
    data: {
      actionId: req.params.actionId,
      approved: true,
      decidedBy: decidedBy || 'user',
      decidedAt: new Date().toISOString(),
      instructions,
      feedback,
    },
  });
});

/**
 * POST /hitl/approvals/:actionId/reject
 * Reject an action
 */
router.post('/approvals/:actionId/reject', (req: Request, res: Response) => {
  const approval = pendingApprovals.get(req.params.actionId);

  if (!approval) {
    res.status(404).json({
      success: false,
      error: 'Approval request not found',
    });
    return;
  }

  const { decidedBy, reason, feedback, selectedAlternativeId } = req.body;

  pendingApprovals.delete(req.params.actionId);
  stats.rejected++;

  res.json({
    success: true,
    data: {
      actionId: req.params.actionId,
      approved: false,
      decidedBy: decidedBy || 'user',
      decidedAt: new Date().toISOString(),
      rejectionReason: reason,
      selectedAlternativeId,
      feedback,
    },
  });
});

// =============================================================================
// Clarification Routes
// =============================================================================

/**
 * GET /hitl/clarifications
 * List pending clarification requests
 */
router.get('/clarifications', (req: Request, res: Response) => {
  const clarifications = Array.from(pendingClarifications.values());

  res.json({
    success: true,
    data: {
      clarifications,
      total: clarifications.length,
    },
  });
});

/**
 * POST /hitl/clarifications
 * Create a clarification request (called by agents)
 */
router.post('/clarifications', (req: Request, res: Response) => {
  const body = req.body as Partial<PendingClarification>;

  if (!body.question || !body.agentId) {
    res.status(400).json({
      success: false,
      error: 'question and agentId are required',
    });
    return;
  }

  const requestId = `clarify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const clarification: PendingClarification = {
    requestId,
    question: body.question,
    context: body.context || '',
    agentId: body.agentId,
    clarificationType: body.clarificationType || 'ambiguity',
    options: body.options,
    allowFreeform: body.allowFreeform ?? true,
    requestedAt: new Date().toISOString(),
    expiresAt: body.expiresAt,
  };

  pendingClarifications.set(requestId, clarification);
  stats.totalClarifications++;

  res.status(201).json({
    success: true,
    data: { clarification },
  });
});

/**
 * POST /hitl/clarifications/:requestId/respond
 * Submit a clarification response
 */
router.post('/clarifications/:requestId/respond', (req: Request, res: Response) => {
  const clarification = pendingClarifications.get(req.params.requestId);

  if (!clarification) {
    res.status(404).json({
      success: false,
      error: 'Clarification request not found',
    });
    return;
  }

  const { selectedOptionId, freeformResponse, respondedBy } = req.body;

  if (!selectedOptionId && !freeformResponse) {
    res.status(400).json({
      success: false,
      error: 'Either selectedOptionId or freeformResponse is required',
    });
    return;
  }

  pendingClarifications.delete(req.params.requestId);

  res.json({
    success: true,
    data: {
      requestId: req.params.requestId,
      selectedOptionId,
      freeformResponse,
      respondedBy: respondedBy || 'user',
      respondedAt: new Date().toISOString(),
    },
  });
});

// =============================================================================
// Escalation Routes
// =============================================================================

/**
 * GET /hitl/escalations
 * List pending escalations
 */
router.get('/escalations', (req: Request, res: Response) => {
  const escalations = Array.from(pendingEscalations.values());

  res.json({
    success: true,
    data: {
      escalations,
      total: escalations.length,
    },
  });
});

/**
 * POST /hitl/escalations
 * Create an escalation (called by agents)
 */
router.post('/escalations', (req: Request, res: Response) => {
  const body = req.body as Partial<PendingEscalation>;

  if (!body.reason || !body.explanation || !body.agentId) {
    res.status(400).json({
      success: false,
      error: 'reason, explanation, and agentId are required',
    });
    return;
  }

  const escalationId = `esc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const escalation: PendingEscalation = {
    escalationId,
    reason: body.reason,
    explanation: body.explanation,
    agentId: body.agentId,
    currentState: body.currentState || {},
    attemptedActions: body.attemptedActions || [],
    recommendations: body.recommendations,
    urgency: body.urgency || 'medium',
    escalatedAt: new Date().toISOString(),
  };

  pendingEscalations.set(escalationId, escalation);
  stats.totalEscalations++;

  res.status(201).json({
    success: true,
    data: { escalation },
  });
});

/**
 * POST /hitl/escalations/:escalationId/resolve
 * Resolve an escalation
 */
router.post('/escalations/:escalationId/resolve', (req: Request, res: Response) => {
  const escalation = pendingEscalations.get(req.params.escalationId);

  if (!escalation) {
    res.status(404).json({
      success: false,
      error: 'Escalation not found',
    });
    return;
  }

  const { decisionType, guidance, targetAgentId, reason, adjustedParameters, decidedBy } = req.body;

  if (!decisionType) {
    res.status(400).json({
      success: false,
      error: 'decisionType is required (human_takeover, agent_continue, abort, delegate)',
    });
    return;
  }

  pendingEscalations.delete(req.params.escalationId);

  res.json({
    success: true,
    data: {
      escalationId: req.params.escalationId,
      decision: {
        type: decisionType,
        guidance,
        targetAgentId,
        reason,
        adjustedParameters,
      },
      decidedBy: decidedBy || 'user',
      decidedAt: new Date().toISOString(),
    },
  });
});

// =============================================================================
// Feedback Routes
// =============================================================================

/**
 * GET /hitl/feedback
 * Get feedback history
 */
router.get('/feedback', (req: Request, res: Response) => {
  const agentId = req.query.agentId as string | undefined;
  const type = req.query.type as string | undefined;
  const limit = parseInt(req.query.limit as string) || 50;

  let filtered = feedbackHistory;

  if (agentId) {
    filtered = filtered.filter(f => f.agentId === agentId);
  }

  if (type) {
    filtered = filtered.filter(f => f.feedbackType === type);
  }

  res.json({
    success: true,
    data: {
      feedback: filtered.slice(-limit),
      total: filtered.length,
    },
  });
});

/**
 * POST /hitl/feedback
 * Submit feedback for an agent
 */
router.post('/feedback', (req: Request, res: Response) => {
  const body = req.body as Partial<FeedbackEntry>;

  if (!body.agentId || !body.feedbackType || !body.content) {
    res.status(400).json({
      success: false,
      error: 'agentId, feedbackType, and content are required',
    });
    return;
  }

  const feedbackId = `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const feedback: FeedbackEntry = {
    feedbackId,
    agentId: body.agentId,
    feedbackType: body.feedbackType,
    aspect: body.aspect || 'other',
    content: body.content,
    importance: body.importance || 3,
    context: body.context,
    providedBy: body.providedBy || 'user',
    providedAt: new Date().toISOString(),
  };

  feedbackHistory.push(feedback);

  // Limit history size
  if (feedbackHistory.length > 1000) {
    feedbackHistory.shift();
  }

  res.status(201).json({
    success: true,
    data: { feedback },
  });
});

// =============================================================================
// Stats & Health
// =============================================================================

/**
 * GET /hitl/stats
 * Get HITL statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      pending: {
        approvals: pendingApprovals.size,
        clarifications: pendingClarifications.size,
        escalations: pendingEscalations.size,
        total: pendingApprovals.size + pendingClarifications.size + pendingEscalations.size,
      },
      totals: {
        approvals: stats.totalApprovals,
        approved: stats.approved,
        rejected: stats.rejected,
        clarifications: stats.totalClarifications,
        escalations: stats.totalEscalations,
        feedback: feedbackHistory.length,
      },
      approvalRate: stats.totalApprovals > 0 ? (stats.approved / stats.totalApprovals) * 100 : 0,
      avgResponseTimeMs: stats.avgResponseTimeMs,
    },
  });
});

/**
 * GET /hitl/health
 * Health check
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
