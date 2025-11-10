import { sqlKnowledgeBaseService } from '../../core/knowledge/SqlKnowledgeBaseService.js';
import { userAgentsRepository } from './userAgents.repository.js';
import { getPlanAgentLimits, resolvePlanIdForUser } from './userAgents.service.js';
import { findUserById } from '../auth/user.repository.js';

export interface CreateKnowledgeInput {
  type: string;
  tags?: string[];
  content: string;
  metadata?: Record<string, unknown>;
}

const ensureAgentOwnership = async (userId: string, agentId: string) => {
  const agent = await userAgentsRepository.getById(userId, agentId);
  if (!agent) {
    const error: any = new Error('Agent not found.');
    error.statusCode = 404;
    error.code = 'AGENT_NOT_FOUND';
    throw error;
  }
  return agent;
};

const assertKnowledgeCapacity = async (userId: string, agentId: string) => {
  const user = await findUserById(userId);
  const planId = resolvePlanIdForUser(user ?? null);
  const limits = getPlanAgentLimits(planId);
  const allowance = limits.knowledgeDocumentsPerAgent ?? 0;

  if (allowance <= 0) {
    const error: any = new Error('Knowledge uploads are not available on your current plan.');
    error.statusCode = 403;
    error.code = 'KNOWLEDGE_UPLOAD_DISABLED';
    throw error;
  }

  const current = await sqlKnowledgeBaseService.countByAgent(agentId, userId);
  if (current >= allowance) {
    const error: any = new Error('Knowledge document limit reached for this agent. Upgrade your plan to add more.');
    error.statusCode = 403;
    error.code = 'KNOWLEDGE_LIMIT_REACHED';
    throw error;
  }
};

export const userAgentKnowledgeService = {
  async list(userId: string, agentId: string) {
    await ensureAgentOwnership(userId, agentId);
    return sqlKnowledgeBaseService.listByAgent(agentId, userId);
  },

  async create(userId: string, agentId: string, input: CreateKnowledgeInput) {
    const agent = await ensureAgentOwnership(userId, agentId);
    await assertKnowledgeCapacity(userId, agentId);

    const payload = await sqlKnowledgeBaseService.addKnowledgeItem({
      type: input.type,
      // encode ownership in tags for easy filtering
      tags: [...(input.tags ?? []), `agent:${agent.id}`, `owner:${userId}`],
      content: input.content,
      metadata: { ...(input.metadata ?? {}), agentId: agent.id, ownerUserId: userId },
    });

    return payload;
  },

  async remove(userId: string, agentId: string, knowledgeId: string) {
    await ensureAgentOwnership(userId, agentId);
    const existing = await sqlKnowledgeBaseService.getKnowledgeItemById(knowledgeId);
    const agentTag = `agent:${agentId}`.toLowerCase();
    const ownerTag = `owner:${userId}`.toLowerCase();
    const hasScope =
      !!existing &&
      (existing.tags ?? []).map((t) => t.toLowerCase()).includes(agentTag) &&
      (existing.tags ?? []).map((t) => t.toLowerCase()).includes(ownerTag);
    if (!hasScope) {
      const error: any = new Error('Knowledge document not found.');
      error.statusCode = 404;
      error.code = 'KNOWLEDGE_NOT_FOUND';
      throw error;
    }
    await sqlKnowledgeBaseService.deleteById(knowledgeId);
  },
};
