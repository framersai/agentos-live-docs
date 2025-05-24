// File: backend/agentos/core/tools/ToolPermissionManager.ts
/**
 * @fileoverview Implements the ToolPermissionManager, responsible for authorizing
 * tool executions based on Persona capabilities, user subscription features, and other
 * contextual rules. It centralizes permission logic for tool usage within AgentOS.
 *
 * @module backend/agentos/core/tools/ToolPermissionManager
 * @see ./IToolPermissionManager.ts for the interface definition.
 * @see ./ITool.ts for tool definitions including required capabilities.
 * @see ../cognitive_substrate/IGMI.ts for UserContext.
 * @see ../../services/user_auth/IAuthService.ts for authentication context.
 * @see ../../services/user_auth/ISubscriptionService.ts for subscription and feature flags.
 */

import {
  IToolPermissionManager,
  PermissionCheckContext,
  PermissionCheckResult,
  ToolPermissionManagerConfig,
} from './IToolPermissionManager'; // Assumes IToolPermissionManager.ts is in the same directory
import { ITool } from './ITool'; // Assumes ITool.ts is in the same directory
import { UserContext } from '../cognitive_substrate/IGMI'; // Corrected path
import { IAuthService } from '../../services/user_auth/IAuthService'; // Corrected: Import interface from its own file
import { ISubscriptionService, FeatureFlag } from '../../services/user_auth/SubscriptionService'; // Corrected path
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../../utils/errors'; // Corrected path
import { v4 as uuidv4 } from 'uuid';

/**
 * @class ToolPermissionManager
 * @implements {IToolPermissionManager}
 * @description Manages and enforces permissions for tool usage within the AgentOS ecosystem.
 * It evaluates requests against configured policies, Persona capabilities, and user subscription entitlements.
 */
export class ToolPermissionManager implements IToolPermissionManager {
  /**
   * Readonly configuration for this permission manager instance.
   * @private
   * @type {Readonly<Required<ToolPermissionManagerConfig>>}
   */
  private config!: Readonly<Required<ToolPermissionManagerConfig>>; // Initialized in initialize()

  /**
   * Optional authentication service for fetching detailed user roles or attributes.
   * @private
   * @type {IAuthService | undefined}
   */
  private authService?: IAuthService;

  /**
   * Subscription service for checking user feature flags and tier access.
   * @private
   * @type {ISubscriptionService | undefined}
   */
  private subscriptionService?: ISubscriptionService;

  /**
   * Flag indicating if the manager has been successfully initialized.
   * @private
   * @type {boolean}
   */
  private isInitialized: boolean = false;

  /**
   * Unique identifier for this ToolPermissionManager instance.
   * @public
   * @readonly
   * @type {string}
   */
  public readonly managerId: string;

  /**
   * Constructs a ToolPermissionManager instance.
   * The manager is not operational until `initialize()` is called with necessary configurations and service dependencies.
   */
  constructor() {
    this.managerId = `tpm-${uuidv4()}`;
  }

  /**
   * @inheritdoc
   * Initializes the ToolPermissionManager. This method must be called before any permission checks can be performed.
   *
   * @param {ToolPermissionManagerConfig} config - Configuration settings for the permission manager, including
   * strictness of capability checking and mappings of tools to subscription features.
   * @param {IAuthService} [authService] - Optional. An instance of the authentication service, which might be
   * used for more complex permission rules based on user roles or specific authentication states.
   * @param {ISubscriptionService} [subscriptionService] - Optional. An instance of the subscription service,
   * crucial for checking if a user's current plan or tier grants access to tools linked to specific feature flags.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {GMIError} If the provided `config` is null or undefined (`GMIErrorCode.CONFIGURATION_ERROR`).
   */
  public async initialize(
    config: ToolPermissionManagerConfig,
    authService?: IAuthService,
    subscriptionService?: ISubscriptionService,
  ): Promise<void> {
    if (this.isInitialized) {
      console.warn(`ToolPermissionManager (ID: ${this.managerId}): Attempting to re-initialize an already initialized instance.`);
      // Potentially reset or re-apply config if re-initialization logic is desired.
    }

    if (!config) {
      throw new GMIError('ToolPermissionManagerConfig cannot be null or undefined during initialization.', GMIErrorCode.CONFIGURATION_ERROR, { managerId: this.managerId });
    }
    
    // Apply defaults to the configuration
    this.config = Object.freeze({
        strictCapabilityChecking: config.strictCapabilityChecking ?? true,
        toolToSubscriptionFeatures: config.toolToSubscriptionFeatures || {},
        ...config, // User-provided config overrides defaults
    });

    this.authService = authService;
    this.subscriptionService = subscriptionService;

    if (Object.keys(this.config.toolToSubscriptionFeatures || {}).length > 0 && !this.subscriptionService) {
      console.warn(`ToolPermissionManager (ID: ${this.managerId}): 'toolToSubscriptionFeatures' mappings are configured, but no ISubscriptionService was provided. Subscription-based tool access checks will be effectively skipped or may default to denial.`);
    }

    this.isInitialized = true;
    console.log(`ToolPermissionManager (ID: ${this.managerId}) initialized successfully. Strict capability checking: ${this.config.strictCapabilityChecking}.`);
  }

  /**
   * Ensures that the permission manager has been properly initialized before use.
   * @private
   * @throws {GMIError} If the manager is not initialized (`GMIErrorCode.NOT_INITIALIZED`).
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIError(
        `ToolPermissionManager (ID: ${this.managerId}) is not initialized. Please call the initialize() method with a valid configuration.`,
        GMIErrorCode.NOT_INITIALIZED,
        { component: 'ToolPermissionManager' }
      );
    }
  }

  /**
   * @inheritdoc
   * Checks if a Persona possesses all the capabilities required by a specific tool.
   *
   * @param {string[]} personaCapabilities - An array of capability strings possessed by the Persona.
   * @param {string[] | undefined} toolRequiredCapabilities - An array of capability strings required by the tool. If undefined or empty, this check passes.
   * @returns {boolean} `true` if the Persona has all required capabilities, `false` otherwise.
   */
  public hasRequiredCapabilities(
    personaCapabilities: string[],
    toolRequiredCapabilities: string[] | undefined,
  ): boolean {
    this.ensureInitialized(); // Should be called in public methods but can be here for internal consistency too.
    if (!toolRequiredCapabilities || toolRequiredCapabilities.length === 0) {
      return true; // Tool requires no specific capabilities.
    }
    if (!personaCapabilities || personaCapabilities.length === 0) {
      return false; // Tool requires capabilities, but Persona has none.
    }

    // Ensure all capabilities are valid strings before checking.
    const validPersonaCapabilities = new Set(personaCapabilities.filter(c => typeof c === 'string'));
    const validToolRequiredCapabilities = toolRequiredCapabilities.filter(c => typeof c === 'string');

    // Strict checking: persona must have ALL capabilities listed by the tool.
    // Advanced matching (e.g., wildcards 'namespace:*', hierarchical capabilities) could be implemented here if needed.
    for (const reqCap of validToolRequiredCapabilities) {
      if (!validPersonaCapabilities.has(reqCap)) {
        return false; // Missing at least one required capability.
      }
    }
    return true; // All required capabilities are present.
  }

  /**
   * @inheritdoc
   * Retrieves the list of feature flags that are specifically configured as required
   * for a given tool ID or name.
   *
   * @param {string} toolIdOrName - The unique ID (`ITool.id`) or functional name (`ITool.name`) of the tool.
   * @returns {FeatureFlag[] | undefined} An array of `FeatureFlag` objects if any are mapped to the tool,
   * otherwise `undefined`.
   */
  public getRequiredFeaturesForTool(toolIdOrName: string): FeatureFlag[] | undefined {
    this.ensureInitialized();
    return this.config.toolToSubscriptionFeatures?.[toolIdOrName];
  }

  /**
   * @inheritdoc
   * Checks if a user's current subscription grants them access to all feature flags
   * required by a specific tool.
   *
   * @param {string} userId - The ID of the user whose subscription is being checked.
   * @param {string} toolIdOrName - The ID or name of the tool for which access is being verified.
   * @returns {Promise<{isAllowed: boolean, missingFeatures?: FeatureFlag[], reason?: string}>}
   * An object indicating if access is allowed. If not allowed, `missingFeatures` will list
   * the features the user lacks, and `reason` may provide context.
   * @throws {GMIError} If the `ISubscriptionService` is not configured but this check is invoked and features are required (`GMIErrorCode.CONFIGURATION_ERROR` or `EXTERNAL_SERVICE_ERROR`).
   */
  public async checkToolSubscriptionAccess(
    userId: string,
    toolIdOrName: string
  ): Promise<{isAllowed: boolean, missingFeatures?: FeatureFlag[], reason?: string}> {
    this.ensureInitialized();
    const requiredFeatures = this.getRequiredFeaturesForTool(toolIdOrName);

    if (!requiredFeatures || requiredFeatures.length === 0) {
      return { isAllowed: true }; // No specific subscription features are mapped as required for this tool.
    }

    if (!this.subscriptionService) {
      const reason = `Subscription check for tool '${toolIdOrName}' cannot be performed: SubscriptionService is not available. Access denied due to missing service.`;
      console.warn(`ToolPermissionManager (ID: ${this.managerId}): ${reason}`);
      // Policy: If features are required but service is missing, deny access for security.
      return { isAllowed: false, missingFeatures: requiredFeatures, reason };
    }

    try {
      const missingFeatures: FeatureFlag[] = [];
      for (const feature of requiredFeatures) {
        // Assuming userHasFeature returns a boolean. The exact signature might vary.
        const hasFeature = await this.subscriptionService.userHasFeature(userId, feature);
        if (!hasFeature) {
          missingFeatures.push(feature);
        }
      }
      if (missingFeatures.length > 0) {
        return { isAllowed: false, missingFeatures, reason: `User lacks required subscription features: ${missingFeatures.map(f=>f.flag).join(', ')}.` };
      }
      return { isAllowed: true };
    } catch (error: unknown) {
      const wrappedError = createGMIErrorFromError(
          error instanceof Error ? error : new Error(String(error)),
          GMIErrorCode.EXTERNAL_SERVICE_ERROR,
          { userId, toolIdOrName, component: 'SubscriptionServiceCheck' },
          `Failed to check subscription features for tool '${toolIdOrName}' due to an external service error.`
      );
      console.error(`ToolPermissionManager (ID: ${this.managerId}): ${wrappedError.message}`, wrappedError.details);
      throw wrappedError; // Propagate as a standardized GMIError
    }
  }

  /**
   * @inheritdoc
   * Determines if a tool execution is permitted based on the full context provided.
   * This method orchestrates checks for Persona capabilities and user subscription features.
   *
   * @param {PermissionCheckContext} context - The comprehensive context for the permission check.
   * @returns {Promise<PermissionCheckResult>} The result of the permission check.
   * @throws {GMIError} Can re-throw errors from `checkToolSubscriptionAccess` if critical failures occur there.
   */
  public async isExecutionAllowed(context: PermissionCheckContext): Promise<PermissionCheckResult> {
    this.ensureInitialized();
    const { tool, personaId, personaCapabilities, userContext } = context;

    // 1. Check Persona Capabilities
    if (!this.hasRequiredCapabilities(personaCapabilities, tool.requiredCapabilities)) {
      const missingCaps = tool.requiredCapabilities?.filter(rc => !personaCapabilities.includes(rc)) || [];
      const reason = `Permission denied: Persona (ID: ${personaId}) lacks required capabilities for tool '${tool.name}'. Missing: [${missingCaps.join(', ')}].`;
      console.warn(`ToolPermissionManager (ID: ${this.managerId}): ${reason}`);
      return {
        isAllowed: false,
        reason,
        details: {
          requiredCapabilities: tool.requiredCapabilities,
          possessedCapabilities: personaCapabilities,
          missingCapabilities: missingCaps,
          toolId: tool.id,
          personaId,
        },
      };
    }

    // 2. Check User Subscription Features (if applicable for the tool)
    // This check is performed even if capabilities are met, as features can be an independent constraint.
    const requiredFeatures = this.getRequiredFeaturesForTool(tool.id) || this.getRequiredFeaturesForTool(tool.name);
    if (requiredFeatures && requiredFeatures.length > 0) {
        const subscriptionCheck = await this.checkToolSubscriptionAccess(userContext.userId, tool.id); // Use tool.id for mapping consistency
        if (!subscriptionCheck.isAllowed) {
            const reason = subscriptionCheck.reason || `User (ID: ${userContext.userId}) subscription does not permit use of tool '${tool.name}'.`;
            console.warn(`ToolPermissionManager (ID: ${this.managerId}): ${reason}`, subscriptionCheck.missingFeatures);
            return {
                isAllowed: false,
                reason,
                details: {
                    requiredFeatures: subscriptionCheck.missingFeatures,
                    toolId: tool.id,
                    userId: userContext.userId,
                }
            };
        }
    }

    // 3. Placeholder for additional custom rules or policy checks
    // Example:
    // if (someGlobalPolicy.isToolRestricted(tool.id, userContext.region)) {
    //   return { isAllowed: false, reason: "Tool usage restricted in your region by global policy." };
    // }

    // If all checks pass
    const successReason = `Execution of tool '${tool.name}' (ID: ${tool.id}) is permitted for Persona '${personaId}' and User '${userContext.userId}'.`;
    if (this.config.logToolCalls) { // Assuming a config option to log successful checks
        console.log(`ToolPermissionManager (ID: ${this.managerId}): ${successReason}`);
    }
    return { isAllowed: true, reason: successReason };
  }
}