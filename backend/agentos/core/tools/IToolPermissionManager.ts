/**
 * @fileoverview Defines the IToolPermissionManager interface, responsible for
 * determining if a tool execution is authorized based on various criteria such as
 * Persona capabilities, user subscriptions, and potentially other contextual rules.
 *
 * @module backend/agentos/tools/IToolPermissionManager
 * @see ./ITool.ts for ITool definition (which includes requiredCapabilities).
 * @see ../cognitive_substrate/IGMI.ts for UserContext.
 * @see ../../services/user_auth/IAuthService.ts (conceptual)
 * @see ../../services/user_auth/ISubscriptionService.ts (conceptual)
 */

import { ITool } from './ITool';
import { UserContext } from '../cognitive_substrate/IGMI';
import { IAuthService } from '../../services/user_auth/AuthService'; // Assuming path
import { ISubscriptionService, FeatureFlag } from '../../services/user_auth/SubscriptionService'; // Assuming path and FeatureFlag type

/**
 * Represents the context required for making a permission decision.
 *
 * @interface PermissionCheckContext
 * @property {ITool} tool - The tool for which permission is being checked.
 * @property {string} personaId - The ID of the Persona attempting to use the tool.
 * @property {string[]} personaCapabilities - The capabilities possessed by the Persona.
 * @property {UserContext} userContext - The context of the user associated with the request.
 * @property {string} [gmiId] - The ID of the GMI instance making the request.
 */
export interface PermissionCheckContext {
  tool: ITool;
  personaId: string;
  personaCapabilities: string[];
  userContext: UserContext;
  gmiId?: string;
}

/**
 * Represents the result of a permission check.
 *
 * @interface PermissionCheckResult
 * @property {boolean} isAllowed - True if the action is permitted, false otherwise.
 * @property {string} [reason] - A brief explanation if not allowed, or an "allowed" message.
 * @property {Record<string, any>} [details] - Additional details, e.g., specific capability missing.
 */
export interface PermissionCheckResult {
  isAllowed: boolean;
  reason?: string;
  details?: Record<string, any>;
}

/**
 * Configuration for the ToolPermissionManager.
 *
 * @interface ToolPermissionManagerConfig
 * @property {boolean} [strictCapabilityChecking=true] - If true, all required capabilities must be met.
 * If false, might allow some leniency or alternative checks (not recommended for secure tools).
 * @property {Record<string, FeatureFlag[]>} [toolToSubscriptionFeatures] - Optional mapping of tool IDs or names
 * to specific subscription feature flags that are required for their use.
 * Example: `{ "advanced-code-interpreter": ["FEATURE_ADVANCED_TOOLS", "FEATURE_CODE_EXECUTION_TIER2"] }`
 */
export interface ToolPermissionManagerConfig {
  strictCapabilityChecking?: boolean;
  toolToSubscriptionFeatures?: Record<string, FeatureFlag[]>; // FeatureFlag type from SubscriptionService
}


/**
 * @interface IToolPermissionManager
 * @description Defines the contract for a service that manages and enforces
 * permissions for tool execution. It centralizes the logic for checking
 * Persona capabilities, user subscription features, and any other
 * authorization rules.
 */
export interface IToolPermissionManager {
  /**
   * Initializes the ToolPermissionManager with its configuration and dependencies.
   *
   * @async
   * @param {ToolPermissionManagerConfig} config - Configuration for the permission manager.
   * @param {IAuthService} [authService] - Optional: Service for user authentication details, if needed for complex checks.
   * @param {ISubscriptionService} [subscriptionService] - Optional: Service to check user subscription levels and feature flags.
   * @returns {Promise<void>}
   * @throws {GMIError | Error} If initialization fails.
   */
  initialize(
    config: ToolPermissionManagerConfig,
    authService?: IAuthService,
    subscriptionService?: ISubscriptionService,
  ): Promise<void>;

  /**
   * Checks if the execution of a given tool is permitted based on the provided context.
   * This method should consolidate checks for Persona capabilities, user subscription features,
   * and any other defined permission rules.
   *
   * @async
   * @param {PermissionCheckContext} context - The context containing information about the tool,
   * Persona, user, and GMI.
   * @returns {Promise<PermissionCheckResult>} A promise that resolves with the permission check result,
   * indicating whether the execution is allowed and providing a reason if not.
   *
   * @example
   * const result = await permissionManager.isExecutionAllowed({
   * tool: myToolInstance,
   * personaId: "persona-alpha",
   * personaCapabilities: ["cap:search", "cap:calculate"],
   * userContext: { userId: "user-123", skillLevel: "expert" }
   * });
   * if (result.isAllowed) {
   * // Proceed with execution
   * } else {
   * // Deny execution, log result.reason
   * }
   */
  isExecutionAllowed(context: PermissionCheckContext): Promise<PermissionCheckResult>;

  /**
   * Checks if a specific Persona has all the capabilities required by a tool.
   *
   * @param {string[]} personaCapabilities - The capabilities possessed by the Persona.
   * @param {string[]} toolRequiredCapabilities - The capabilities required by the tool.
   * @returns {boolean} True if all required capabilities are met, false otherwise.
   */
  hasRequiredCapabilities(
    personaCapabilities: string[],
    toolRequiredCapabilities: string[] | undefined,
  ): boolean;

  /**
   * Checks if a user's subscription includes the necessary features/flags for a specific tool.
   * (This is a more specific check that `isExecutionAllowed` would internally use if configured).
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @param {string} toolIdOrName - The ID or name of the tool being checked.
   * @returns {Promise<{isAllowed: boolean, missingFeatures?: FeatureFlag[]}>} Whether access is allowed by subscription.
   * @throws {GMIError} If the subscriptionService is not configured/available but this check is invoked.
   */
  checkToolSubscriptionAccess(
    userId: string,
    toolIdOrName: string
  ): Promise<{isAllowed: boolean, missingFeatures?: FeatureFlag[]}>;


  /**
   * Retrieves the list of feature flags associated with a tool that require subscription checks.
   *
   * @param {string} toolIdOrName - The ID or name of the tool.
   * @returns {FeatureFlag[] | undefined} An array of required feature flags, or undefined if none are mapped.
   */
  getRequiredFeaturesForTool(toolIdOrName: string): FeatureFlag[] | undefined;
}