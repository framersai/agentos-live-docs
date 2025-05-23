// backend/agentos/core/llm/routing/ModelRouter.ts

import { IModelRouter, ModelRouteParams, ModelRouteResult } from './IModelRouter';
import { ConversationContext } from '../../conversation/ConversationContext';
import { IProvider } from '../providers/IProvider';
import { AIModelProviderManager } from '../providers/AIModelProviderManager'; // To look up providers
import { AgentConfig } from '../../agents/AgentCore'; // To access agent's model preferences

/**
 * @fileoverview A rule-based implementation of IModelRouter for AgentOS.
 * It selects models based on a configurable set of rules matching query content,
 * agent preferences, required capabilities, and optimization goals.
 * @module agentos/core/llm/routing/ModelRouter
 */

/**
 * Defines a single routing rule.
 */
export interface RoutingRule {
  /** A unique ID for the rule (for logging/debugging). */
  id: string;
  /** Description of the rule's purpose. */
  description?: string;
  /** Priority of the rule (lower numbers evaluated first). @default 0 */
  priority?: number;
  /** Conditions that must ALL be met for this rule to apply. */
  conditions: {
    /** Keywords or regex patterns to match in the user query or task description. Case-insensitive. */
    queryContains?: string[];
    /** Specific agent ID requesting the model. */
    requestingAgentId?: string;
    /** Required capabilities from the model (e.g., "tool_calling", "json_output"). */
    requiredCapabilities?: string[]; // All must be present
    /** Matches the optimization preference. */
    optimizationPreference?: ModelRouteParams['optimizationPreference'];
    /** Matches the specified language. */
    language?: string;
    /** Custom condition evaluator function name (advanced, requires a registry of evaluators). */
    customCondition?: string; // e.g., "isUserPremium"
    /** Parameters for the custom condition. */
    customConditionParams?: Record<string, any>;
  };
  /** Action to take if conditions are met: specify the target model and provider. */
  action: {
    /** ID of the provider to use (must be configured in AIModelProviderManager). */
    providerId: string;
    /** ID of the model to use on that provider. */
    modelId: string;
    /** Optional reasoning for this choice. */
    reasoning?: string;
    /** Optional cost tier. */
    estimatedCostTier?: string;
  };
}

/**
 * Configuration for the RuleBasedModelRouter.
 */
export interface RuleBasedModelRouterConfig {
  /** An array of routing rules, typically loaded from a JSON/YAML file. */
  rules: RoutingRule[];
  /**
   * Default provider ID to use if no rules match or if a matched rule doesn't specify one.
   * Must be a valid providerId configured in AIModelProviderManager.
   */
  defaultProviderId: string;
  /**
   * Default model ID to use if no rules match or if a matched rule doesn't specify one.
   * Must be available on the defaultProviderId.
   */
  defaultModelId: string;
  /** Optional default reasoning if no rules match and defaults are used. */
  defaultReasoning?: string;
  /**
   * A map of custom condition evaluator functions.
   * Key is the `customCondition` string from a rule, value is a function.
   * `(params: ModelRouteParams, conditionParams: Record<string, any>) => boolean`
   */
  customConditionEvaluators?: Record<string, (params: ModelRouteParams, conditionParams: Record<string, any>) => boolean>;
}

/**
 * @class ModelRouter
 * Implements IModelRouter using a declarative, rule-based approach.
 */
export class ModelRouter implements IModelRouter {
  public readonly routerId = 'rule_based_router_v1.0';
  private config!: Required<RuleBasedModelRouterConfig>; // Note: `rules` will be part of this
  private providerManager!: AIModelProviderManager;
  private initialized: boolean = false;

  constructor() {}

  /**
   * Initializes the RuleBasedModelRouter.
   * @param {RuleBasedModelRouterConfig} config - Configuration containing routing rules and defaults.
   * @param {AIModelProviderManager} providerManager - Instance of AIModelProviderManager.
   */
  public async initialize(
    config: RuleBasedModelRouterConfig,
    providerManager: AIModelProviderManager
  ): Promise<void> {
    if (!config.rules || !config.defaultProviderId || !config.defaultModelId) {
      throw new Error("RuleBasedModelRouterConfig requires 'rules', 'defaultProviderId', and 'defaultModelId'.");
    }
    if (!providerManager) {
        throw new Error("RuleBasedModelRouter requires an AIModelProviderManager instance.");
    }

    this.config = {
        defaultReasoning: "Default model selection as no specific rules matched.",
        customConditionEvaluators: {}, // Ensure it's always an object
        ...config, // User config overrides defaults
        rules: [...config.rules].sort((a, b) => (a.priority || 0) - (b.priority || 0)), // Sort rules by priority
    };
    this.providerManager = providerManager;
    this.initialized = true;
    console.log(`ModelRouter (${this.routerId}) initialized with ${this.config.rules.length} rules.`);
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("ModelRouter is not initialized. Call initialize() first.");
    }
  }

  /**
   * Selects a model by evaluating rules in order of priority.
   * @param {ModelRouteParams} params - Parameters for the routing decision.
   * @returns {Promise<ModelRouteResult | null>} The routing result or null if no suitable model is found.
   */
  public async selectModel(params: ModelRouteParams): Promise<ModelRouteResult | null> {
    this.ensureInitialized();

    const queryLower = params.query?.toLowerCase();

    for (const rule of this.config.rules) {
      let conditionsMet = true;

      // Check queryContains
      if (rule.conditions.queryContains && queryLower) {
        if (!rule.conditions.queryContains.some(keyword => queryLower.includes(keyword.toLowerCase()))) {
          conditionsMet = false;
        }
      } else if (rule.conditions.queryContains && !queryLower) {
          conditionsMet = false; // Rule requires query but none provided
      }

      // Check requestingAgentId
      if (conditionsMet && rule.conditions.requestingAgentId && rule.conditions.requestingAgentId !== params.requestingAgentId) {
        conditionsMet = false;
      }

      // Check requiredCapabilities (conceptual - provider/model should declare these)
      if (conditionsMet && rule.conditions.requiredCapabilities) {
        // This would require a way to get capabilities of potential models from providerManager
        // For now, this is a placeholder for a more advanced capability matching.
        // Assume for now that if a rule specifies capabilities, it's pre-vetted that the target model has them.
      }

      // Check optimizationPreference
      if (conditionsMet && rule.conditions.optimizationPreference && rule.conditions.optimizationPreference !== params.optimizationPreference) {
        conditionsMet = false;
      }
      
      // Check language
      if (conditionsMet && rule.conditions.language && rule.conditions.language.toLowerCase() !== params.language?.toLowerCase()) {
        conditionsMet = false;
      }

      // Check customCondition
      if (conditionsMet && rule.conditions.customCondition) {
        const evaluator = this.config.customConditionEvaluators[rule.conditions.customCondition];
        if (evaluator) {
          if (!evaluator(params, rule.conditions.customConditionParams || {})) {
            conditionsMet = false;
          }
        } else {
          console.warn(`ModelRouter: Custom condition evaluator '${rule.conditions.customCondition}' not found for rule '${rule.id}'. Skipping condition.`);
          // conditionsMet = false; // Or treat as true and log warning
        }
      }

      if (conditionsMet) {
        const provider = this.providerManager.getProvider(rule.action.providerId);
        if (provider) {
          // Future: Check if provider.modelIsAvailable(rule.action.modelId)
          console.log(`ModelRouter: Rule '${rule.id}' matched. Selecting model '${rule.action.modelId}' on provider '${rule.action.providerId}'.`);
          return {
            provider: provider,
            modelId: rule.action.modelId,
            reasoning: rule.action.reasoning || rule.description || `Matched rule '${rule.id}'`,
            estimatedCostTier: rule.action.estimatedCostTier,
            confidence: 0.9, // Higher confidence for explicit rule match
            metadata: { matchedRuleId: rule.id },
          };
        } else {
          console.warn(`ModelRouter: Rule '${rule.id}' matched but provider '${rule.action.providerId}' not found.`);
        }
      }
    }

    // If no rules matched, use defaults
    const defaultProvider = this.providerManager.getProvider(this.config.defaultProviderId);
    if (defaultProvider) {
      console.log(`ModelRouter: No specific rules matched. Using default model '${this.config.defaultModelId}' on provider '${this.config.defaultProviderId}'.`);
      return {
        provider: defaultProvider,
        modelId: this.config.defaultModelId,
        reasoning: this.config.defaultReasoning,
        confidence: 0.5, // Lower confidence for default
        metadata: { usingDefaults: true },
      };
    }

    console.error(`ModelRouter: No rules matched AND default provider '${this.config.defaultProviderId}' not found. Cannot select a model.`);
    return null; // No model could be selected
  }
}