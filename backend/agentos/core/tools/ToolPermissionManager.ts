/**
 * @fileoverview Implements the ToolPermissionManager, responsible for authorizing
 * tool executions based on Persona capabilities and user subscription features.
 *
 * @module backend/agentos/tools/ToolPermissionManager
 * @see ./IToolPermissionManager.ts for the interface definition.
 */

import {
  IToolPermissionManager,
  PermissionCheckContext,
  PermissionCheckResult,
  ToolPermissionManagerConfig,
} from './IToolPermissionManager';
import { ITool } from './ITool';
import { UserContext } from '../cognitive_substrate/IGMI';
import { IAuthService } from '../../services/user_auth/AuthService';
import { ISubscriptionService, FeatureFlag } from '../../services/user_auth/SubscriptionService';
import { GMIError, GMIErrorCode } from '../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * @class ToolPermissionManager
 * @implements {IToolPermissionManager}
 * Manages and enforces permissions for tool usage.
 */
export class ToolPermissionManager implements IToolPermissionManager {
  private config!: ToolPermissionManagerConfig;
  private authService?: IAuthService;
  private subscriptionService?: ISubscriptionService;
  private isInitialized: boolean = false;
  public readonly managerId: string;

  /**
   * Constructs a ToolPermissionManager instance.
   * The manager is not operational until `initialize` is called.
   */
  constructor() {
    this.managerId = `tpm-${uuidv4()}`;
  }

  /**
   * @inheritdoc
   */
  public async initialize(
    config: ToolPermissionManagerConfig,
    authService?: IAuthService,
    subscriptionService?: ISubscriptionService,
  ): Promise<void> {
    if (this.isInitialized) {
      console.warn(`ToolPermissionManager (ID: ${this.managerId}) already initialized. Re-initializing.`);
    }

    if (!config) {
      throw new GMIError('ToolPermissionManagerConfig cannot be null or undefined.', GMIErrorCode.CONFIG_ERROR);
    }
    this.config = config;
    this.authService = authService; // Optional, store if provided
    this.subscriptionService = subscriptionService; // Optional, store if provided

    if (this.config.toolToSubscriptionFeatures && !this.subscriptionService) {
      console.warn(`ToolPermissionManager (ID: ${this.managerId}): toolToSubscriptionFeatures mapping is configured, but ISubscriptionService was not provided. Subscription checks will be skipped.`);
    }

    this.isInitialized = true;
    console.log(`ToolPermissionManager (ID: ${this.managerId}) initialized successfully.`);
  }

  /**
   * Ensures that the manager has been initialized.
   * @private
   * @throws {GMIError} If not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIError(
        `ToolPermissionManager (ID: ${this.managerId}) is not initialized. Call initialize() first.`,
        GMIErrorCode.NOT_INITIALIZED,
      );
    }
  }

  /**
   * @inheritdoc
   */
  public hasRequiredCapabilities(
    personaCapabilities: string[],
    toolRequiredCapabilities: string[] | undefined,
  ): boolean {
    this.ensureInitialized();
    if (!toolRequiredCapabilities || toolRequiredCapabilities.length === 0) {
      return true; // No capabilities required by the tool
    }
    if (!personaCapabilities || personaCapabilities.length === 0) {
        return false; // Tool requires capabilities, but persona has none
    }

    // Ensure all capabilities are strings for safety, though type system should enforce
    const safePersonaCapabilities = personaCapabilities.filter(c => typeof c === 'string');
    const safeToolRequiredCapabilities = toolRequiredCapabilities.filter(c => typeof c === 'string');


    // Strict checking: persona must have all capabilities listed by the tool.
    // TODO: Implement more advanced capability matching (e.g., wildcards 'namespace:*' or hierarchical if needed)
    return safeToolRequiredCapabilities.every(reqCap =>
      safePersonaCapabilities.includes(reqCap),
    );
  }

  /**
   * @inheritdoc
   */
  public getRequiredFeaturesForTool(toolIdOrName: string): FeatureFlag[] | undefined {
    this.ensureInitialized();
    return this.config.toolToSubscriptionFeatures?.[toolIdOrName];
  }


  /**
   * @inheritdoc
   */
  public async checkToolSubscriptionAccess(
    userId: string,
    toolIdOrName: string
  ): Promise<{isAllowed: boolean, missingFeatures?: FeatureFlag[]}> {
    this.ensureInitialized();
    const requiredFeatures = this.getRequiredFeaturesForTool(toolIdOrName);

    if (!requiredFeatures || requiredFeatures.length === 0) {
      return { isAllowed: true }; // No specific subscription features required for this tool
    }

    if (!this.subscriptionService) {
      console.warn(`ToolPermissionManager (ID: ${this.managerId}): Subscription check needed for tool '${toolIdOrName}', but SubscriptionService is not available. Assuming access is denied for safety.`);
      // Or, based on policy, could default to allowed if service is missing, but safer to deny.
      return { isAllowed: false, missingFeatures: requiredFeatures, reason: "Subscription service unavailable for check." } as any;
    }

    try {
      const missingFeatures: FeatureFlag[] = [];
      for (const feature of requiredFeatures) {
        const hasFeature = await this.subscriptionService.userHasFeature(userId, feature);
        if (!hasFeature) {
          missingFeatures.push(feature);
        }
      }
      if (missingFeatures.length > 0) {
        return { isAllowed: false, missingFeatures };
      }
      return { isAllowed: true };
    } catch (error: any) {
        console.error(`ToolPermissionManager (ID: ${this.managerId}): Error checking subscription features for user '${userId}', tool '${toolIdOrName}'. Error: ${error.message}`, error);
        throw new GMIError(
            `Failed to check subscription access for tool '${toolIdOrName}'.`,
            GMIErrorCode.EXTERNAL_SERVICE_ERROR,
            { userId, toolIdOrName, underlyingError: error.toString()}
        );
    }
  }


  /**
   * @inheritdoc
   */
  public async isExecutionAllowed(context: PermissionCheckContext): Promise<PermissionCheckResult> {
    this.ensureInitialized();
    const { tool, personaId, personaCapabilities, userContext } = context;

    // 1. Check Persona Capabilities
    if (!this.hasRequiredCapabilities(personaCapabilities, tool.requiredCapabilities)) {
      const reason = `Persona (ID: ${personaId}) lacks required capabilities for tool '${tool.name}'.`;
      return {
        isAllowed: false,
        reason,
        details: {
          required: tool.requiredCapabilities,
          possessed: personaCapabilities,
        },
      };
    }

    // 2. Check User Subscription Features (if applicable)
    const subscriptionCheck = await this.checkToolSubscriptionAccess(userContext.userId, tool.id); // Or tool.name
    if (!subscriptionCheck.isAllowed) {
        const reason = `User (ID: ${userContext.userId}) subscription does not permit use of tool '${tool.name}'. Missing features: ${subscriptionCheck.missingFeatures?.join(', ')}.`;
        return {
            isAllowed: false,
            reason,
            details: {
                requiredFeatures: subscriptionCheck.missingFeatures,
                toolId: tool.id
            }
        };
    }

    // 3. Other potential checks (e.g., global tool disable flags, environment restrictions)
    // Placeholder for future extensions
    // if (isToolGloballyDisabled(tool.id)) {
    //   return { isAllowed: false, reason: `Tool '${tool.name}' is globally disabled.` };
    // }

    // If all checks pass
    return {
      isAllowed: true,
      reason: `Execution of tool '${tool.name}' is permitted for Persona '${personaId}' and User '${userContext.userId}'.`,
    };
  }
}