/**
 * @fileoverview Defines the configuration structure for the ToolOrchestrator.
 * This configuration can include settings related to tool registration, execution
 * timeouts, logging, and other operational parameters for the orchestrator.
 *
 * @module backend/agentos/config/ToolOrchestratorConfig
 * @see ../tools/IToolOrchestrator.ts
 */

/**
 * Configuration for the ToolOrchestrator.
 *
 * @interface ToolOrchestratorConfig
 * @property {string} [orchestratorId] - An optional unique identifier for this orchestrator instance,
 * useful if multiple orchestrators are deployed or for logging. Defaults to a UUID if not provided.
 * @property {number} [defaultToolCallTimeoutMs=30000] - Default timeout in milliseconds for waiting
 * for a tool execution to complete. Individual tools might override this or have their own internal timeouts.
 * @property {number} [maxConcurrentToolCalls=10] - (Future Use) Maximum number of tool calls that can be
 * processed concurrently by this orchestrator instance. Requires an internal queuing or concurrency management mechanism.
 * @property {boolean} [logToolCalls=true] - Whether to log detailed information about each tool call processed
 * (e.g., request, arguments, result, duration).
 * @property {object} [toolRegistrySettings] - Settings related to the tool registry managed by the orchestrator.
 * @property {boolean} [toolRegistrySettings.allowDynamicRegistration=true] - If true, allows tools to be
 * registered or unregistered after the orchestrator has been initialized.
 * @property {boolean} [toolRegistrySettings.persistRegistry=false] - (Future Use) If true, the orchestrator
 * would attempt to persist its tool registry state and reload it on startup. Requires a persistence mechanism.
 * @property {string[]} [globalDisabledTools] - An array of tool names or IDs that are globally disabled,
 * overriding any individual tool's enabled status or persona permissions.
 * @property {Record<string, any>} [customParameters] - Any other custom parameters or feature flags specific
 * to this ToolOrchestrator deployment.
 */
export interface ToolOrchestratorConfig {
  orchestratorId?: string;
  defaultToolCallTimeoutMs?: number;
  maxConcurrentToolCalls?: number; // For future concurrency management
  logToolCalls?: boolean;
  toolRegistrySettings?: {
    allowDynamicRegistration?: boolean;
    persistRegistry?: boolean; // Future use
  };
  globalDisabledTools?: string[]; // Tool names or IDs
  customParameters?: Record<string, any>;
}