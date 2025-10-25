import type { ISubscriptionService } from '../../../services/user_auth/SubscriptionService';
import { PLAN_CATALOG, type PlanId } from '../../../shared/planCatalog.js';
import { resolveUserAccessLevel, compareAccessLevels } from './agentos.access-control.js';
import type { AgentOSAccessLevel } from './agentos.persona-registry.js';

const ACCESS_LEVEL_TO_PLAN: Record<AgentOSAccessLevel, PlanId> = {
  public: 'free',
  metered: 'basic',
  global: 'global-pass',
  unlimited: 'organization',
};

export interface AgentOSSubscription {
  userId: string;
  planId: PlanId;
  tier: AgentOSAccessLevel;
  isActive: boolean;
  features: string[];
}

export class AgentOSSubscriptionAdapter implements ISubscriptionService {
  async initialize(): Promise<void> {
    // No-op for now; plan catalog is already loaded.
  }

  async getUserSubscription(userId: string): Promise<AgentOSSubscription> {
    const level = resolveUserAccessLevel(userId);
    const planId = ACCESS_LEVEL_TO_PLAN[level] ?? 'free';
    const plan = PLAN_CATALOG[planId];
    return {
      userId,
      planId,
      tier: level,
      isActive: level !== 'public',
      features: plan?.bullets ?? [],
    };
  }

  async validateAccess(userId: string, feature: string): Promise<boolean> {
    const level = resolveUserAccessLevel(userId);
    const required = parseFeatureRequirement(feature);
    if (!required) return true;
    return compareAccessLevels(level, required);
  }
}

const parseFeatureRequirement = (feature: string): AgentOSAccessLevel | null => {
  if (feature.startsWith('persona:')) {
    const [, requirement] = feature.split(':');
    if (requirement && ['public', 'metered', 'global', 'unlimited'].includes(requirement)) {
      return requirement as AgentOSAccessLevel;
    }
  }
  return null;
};

export const createAgentOSSubscriptionAdapter = (): ISubscriptionService => new AgentOSSubscriptionAdapter();
