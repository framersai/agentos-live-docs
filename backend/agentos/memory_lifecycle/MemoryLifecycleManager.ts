/**
 * @fileoverview Implements the MemoryLifecycleManager (MemoryLifecycleManager),
 * responsible for enforcing data retention and eviction policies on memories
 * stored within the AgentOS RAG system.
 *
 * It interprets configured policies, interacts with Vector Stores (via IVectorStoreManager)
 * to identify and act upon data items, and negotiates with GMI instances via
 * a GMIResolver for decisions regarding potentially critical memories.
 *
 * @module backend/agentos/memory_lifecycle/MemoryLifecycleManager
 * @see ./IMemoryLifecycleManager.ts for the interface definition.
 * @see ../config/MemoryLifecycleManagerConfiguration.ts for configuration.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IMemoryLifecycleManager,
  GMIResolverFunction,
  PolicyEnforcementFilter,
  LifecycleEnforcementReport,
} from './IMemoryLifecycleManager';
import {
  MemoryLifecycleManagerConfig,
  MemoryLifecyclePolicy,
  PolicyAction as ConfigPolicyActionDetails,
} from '../config/MemoryLifecycleManagerConfiguration';
import { IVectorStoreManager } from '../rag/IVectorStoreManager';
import { IVectorStore, VectorDocument, MetadataFilter, RetrievedVectorDocument } from '../rag/IVectorStore';
import { IGMI, MemoryLifecycleEvent, LifecycleAction, LifecycleActionResponse } from '../cognitive_substrate/IGMI';
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';
import { RagMemoryCategory } from '../rag/IRetrievalAugmentor';
import { GMIError, GMIErrorCode } from '../../utils/errors';

// Helper to parse duration strings like "PT24H", "7d", "30m" into milliseconds
const parseDurationToMs = (durationStr: string): number | null => {
    if (!durationStr) return null;
    // Basic parsing, can be expanded for full ISO 8601 duration or more formats
    const matchDays = durationStr.match(/^(\d+)d$/i);
    if (matchDays) return parseInt(matchDays[1], 10) * 24 * 60 * 60 * 1000;
    const matchHours = durationStr.match(/^(\d+)h$/i);
    if (matchHours) return parseInt(matchHours[1], 10) * 60 * 60 * 1000;
    const matchMinutes = durationStr.match(/^(\d+)m$/i);
    if (matchMinutes) return parseInt(matchMinutes[1], 10) * 60 * 1000;
    // TODO: Add more robust ISO 8601 duration parsing if needed e.g. for PT formats
    try { // Attempt ISO 8601 Duration (very basic for PTxH, PTxM, PTxS)
        if (durationStr.startsWith('PT')) {
            let totalMs = 0;
            const hourMatch = durationStr.match(/(\d+)H/);
            if (hourMatch) totalMs += parseInt(hourMatch[1],10) * 3600 * 1000;
            const minuteMatch = durationStr.match(/(\d+)M/);
            if (minuteMatch) totalMs += parseInt(minuteMatch[1],10) * 60 * 1000;
            const secondMatch = durationStr.match(/(\d+)S/);
            if (secondMatch) totalMs += parseInt(secondMatch[1],10) * 1000;
            if (totalMs > 0) return totalMs;
        }
    } catch (e) { /* ignore parse error, fall through */ }
    return null;
};


/**
 * Represents an item targeted by a lifecycle policy.
 * @internal
 */
interface LifecycleCandidateItem {
  id: string; // Item ID in the vector store (chunk ID)
  dataSourceId: string;
  collectionName: string;
  gmiOwnerId?: string;
  personaOwnerId?: string;
  category?: RagMemoryCategory;
  timestamp?: Date; // Creation or last modification timestamp
  metadata: Record<string, any>;
  contentSummary?: string; // Optional, for negotiation
  vectorStoreRef: IVectorStore; // Reference to the store it's in
}


/**
 * @class MemoryLifecycleManager
 * @implements {IMemoryLifecycleManager}
 */
export class MemoryLifecycleManager implements IMemoryLifecycleManager {
  public readonly managerId: string;
  private config!: MemoryLifecycleManagerConfig;
  private vectorStoreManager!: IVectorStoreManager;
  private gmiResolver!: GMIResolverFunction;
  private utilityAI?: IUtilityAI;
  private isInitialized: boolean = false;
  private periodicCheckTimer?: NodeJS.Timeout;

  /**
   * Constructs a MemoryLifecycleManager instance.
   * Not operational until `initialize` is called.
   */
  constructor() {
    this.managerId = `mlm-${uuidv4()}`;
  }

  /**
   * @inheritdoc
   */
  public async initialize(
    config: MemoryLifecycleManagerConfig,
    vectorStoreManager: IVectorStoreManager,
    gmiResolver: GMIResolverFunction,
    utilityAI?: IUtilityAI,
  ): Promise<void> {
    if (this.isInitialized) {
      console.warn(`MemoryLifecycleManager (ID: ${this.managerId}) already initialized. Re-initializing.`);
      await this.shutdown(); // Clear previous state and timers
    }

    if (!config) throw new GMIError('MemoryLifecycleManagerConfig cannot be null.', GMIErrorCode.CONFIG_ERROR);
    if (!vectorStoreManager) throw new GMIError('IVectorStoreManager dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR);
    if (!gmiResolver) throw new GMIError('GMIResolverFunction dependency is missing.', GMIErrorCode.DEPENDENCY_ERROR);

    this.config = config;
    this.vectorStoreManager = vectorStoreManager;
    this.gmiResolver = gmiResolver;
    this.utilityAI = utilityAI;

    // Validate policies (basic checks)
    this.config.policies.forEach(p => {
      if (p.action.type.startsWith('summarize_') && !this.utilityAI) {
        throw new GMIError(`Policy '${p.policyId}' requires summarization but IUtilityAI dependency is not provided.`, GMIErrorCode.CONFIG_ERROR, { policyId: p.policyId });
      }
      if (p.trigger?.type === 'periodic' && p.trigger.checkInterval) {
        if (!parseDurationToMs(p.trigger.checkInterval)) {
            console.warn(`MemoryLifecycleManager (ID: ${this.managerId}): Policy '${p.policyId}' has an invalid periodic checkInterval '${p.trigger.checkInterval}'. It may not run as expected.`);
        }
      }
    });

    this.isInitialized = true;
    this.setupPeriodicChecks();
    console.log(`MemoryLifecycleManager (ID: ${this.managerId}) initialized with ${this.config.policies.length} policies.`);
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIError(`MemoryLifecycleManager (ID: ${this.managerId}) is not initialized.`, GMIErrorCode.NOT_INITIALIZED);
    }
  }

  /**
   * Sets up periodic policy enforcement based on the configuration.
   * @private
   */
  private setupPeriodicChecks(): void {
    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
    }
    const intervalMs = parseDurationToMs(this.config.defaultCheckInterval || "PT6H"); // Default to 6 hours if not specified
    if (intervalMs && intervalMs > 0) {
      this.periodicCheckTimer = setInterval(async () => {
        console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Running periodic policy enforcement...`);
        try {
          await this.enforcePolicies({
            // Filter for policies that have a periodic trigger or are purely age-based without specific trigger
            policyIds: this.config.policies
                            .filter(p => p.isEnabled !== false && (p.trigger?.type === 'periodic' || (!p.trigger && p.retentionDays && p.retentionDays > 0)))
                            .map(p => p.policyId)
          });
        } catch (error: any) {
          console.error(`MemoryLifecycleManager (ID: ${this.managerId}): Error during periodic policy enforcement: ${error.message}`, error);
        }
      }, intervalMs);
      console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Scheduled periodic policy enforcement every ${intervalMs / 1000} seconds.`);
    }
  }

  /**
   * @inheritdoc
   */
  public async enforcePolicies(filter?: PolicyEnforcementFilter): Promise<LifecycleEnforcementReport> {
    this.ensureInitialized();
    const startTime = new Date();
    const report: LifecycleEnforcementReport = {
      startTime,
      endTime: startTime, // Will be updated
      policiesEvaluated: 0,
      itemsScanned: 0,
      itemsAffected: 0,
      policyResults: {},
      errors: [],
      wasDryRun: this.config.dryRunMode === true,
    };

    const policiesToEvaluate = this.config.policies.filter(p =>
      p.isEnabled !== false &&
      (!filter?.policyIds || filter.policyIds.includes(p.policyId))
    ).sort((a, b) => (a.priority || 0) - (b.priority || 0));

    report.policiesEvaluated = policiesToEvaluate.length;

    for (const policy of policiesToEvaluate) {
      report.policyResults![policy.policyId] = { itemsProcessed: 0, actionsTaken: {} };
      try {
        const candidates = await this.findPolicyCandidates(policy, filter);
        report.itemsScanned += candidates.length; // Approximation, actual scan might be different

        for (const candidate of candidates) {
          report.policyResults![policy.policyId].itemsProcessed++;
          const actionToTake = await this.negotiateAndDetermineAction(candidate, policy);

          if (actionToTake && actionToTake !== 'NO_ACTION_TAKEN') { // NO_ACTION_TAKEN could be a valid LifecycleAction
            if (!this.config.dryRunMode) {
              await this.executeLifecycleAction(candidate, policy.action, actionToTake);
            }
            report.itemsAffected++;
            const actionKey = actionToTake as string;
            report.policyResults![policy.policyId].actionsTaken[actionKey] = (report.policyResults![policy.policyId].actionsTaken[actionKey] || 0) + 1;
          }
        }
      } catch (error: any) {
        console.error(`MemoryLifecycleManager (ID: ${this.managerId}): Error enforcing policy '${policy.policyId}': ${error.message}`, error);
        report.errors?.push({ policyId: policy.policyId, message: `Error during policy enforcement: ${error.message}`, details: error.toString() });
      }
    }

    report.endTime = new Date();
    console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Policy enforcement completed. ${report.itemsAffected} items affected (DryRun: ${report.wasDryRun}).`);
    return report;
  }

  /**
   * Finds candidate items that a given policy might apply to.
   * @private
   */
  private async findPolicyCandidates(policy: MemoryLifecyclePolicy, enforcementFilter?: PolicyEnforcementFilter): Promise<LifecycleCandidateItem[]> {
    const candidates: LifecycleCandidateItem[] = [];
    const targetDataSourceIds = new Set<string>();

    // Determine which data sources to scan based on policy and enforcement filter
    if (policy.appliesTo.dataSourceIds && policy.appliesTo.dataSourceIds.length > 0) {
        policy.appliesTo.dataSourceIds.forEach(id => {
            if (!enforcementFilter?.dataSourceIds || enforcementFilter.dataSourceIds.includes(id)) {
                targetDataSourceIds.add(id);
            }
        });
    } else if (enforcementFilter?.dataSourceIds) { // Policy applies to all, but enforcement is filtered
        enforcementFilter.dataSourceIds.forEach(id => targetDataSourceIds.add(id));
    } else { // Policy applies to all, enforcement filter also applies to all known
        this.vectorStoreManager.listDataSourceIds().forEach(id => targetDataSourceIds.add(id));
    }


    for (const dsId of targetDataSourceIds) {
        try {
            const { store, collectionName, dimension } = await this.vectorStoreManager.getStoreForDataSource(dsId);
            
            // Construct metadata filter for querying the store
            // This is complex: combine policy.appliesTo.metadataFilter, policy.appliesTo.categories (needs mapping),
            // retentionDays, and enforcementFilter context (gmiOwnerId, personaOwnerId).
            let combinedFilter: MetadataFilter = { ...policy.appliesTo.metadataFilter };

            if (policy.appliesTo.categories && policy.appliesTo.categories.length > 0) {
                // Assuming a 'category' field in metadata. This is a simplification.
                // A better mapping from RagMemoryCategory to metadata queries might be needed.
                combinedFilter['category'] = { $in: policy.appliesTo.categories as string[] };
            }
            if (policy.retentionDays && policy.retentionDays > 0) {
                const cutoffDate = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000);
                const timestampField = this.config.itemTimestampMetadataField || "creationTimestamp";
                combinedFilter[timestampField] = { $lt: cutoffDate.toISOString() as any }; // Cast as 'any' if type expects number for $lt
            }

            const gmiOwnerField = this.config.gmiOwnerIdMetadataField || "gmiOwnerId";
            const ownerGMI = enforcementFilter?.gmiOwnerId || policy.appliesTo.gmiOwnerId;
            if (ownerGMI) combinedFilter[gmiOwnerField] = ownerGMI;
            
            const personaOwnerField = this.config.personaOwnerIdMetadataField || "personaOwnerId";
            const ownerPersona = enforcementFilter?.personaOwnerId || policy.appliesTo.personaOwnerId;
            if(ownerPersona) combinedFilter[personaOwnerField] = ownerPersona;


            // Fetch ALL documents matching the filter to evaluate. This could be inefficient for large stores.
            // Real-world scenario might use scrolling search or sampling if store supports it.
            // Or, if eviction is based on threshold, get counts first, then select victims by strategy.
            // For age-based retention, a query with date filter is more direct.
            // This simplified version fetches and then filters.
            // A better way for age: `query(collectionName, DUMMY_EMBEDDING_IF_NEEDED_BY_STORE, { filter: combinedFilter, topK: VERY_LARGE_NUMBER })`
            // Some stores allow metadata-only queries without an embedding.
            // For now, let's assume we need to iterate or the store supports metadata-only queries.
            // This part is highly dependent on IVectorStore capabilities for metadata-only iteration/querying.
            // Placeholder: conceptual iteration or broad query.
            // For a robust implementation, this section needs deep integration with IVectorStore search capabilities.
            // For now, we can't fetch ALL without an embedding. This method needs rethinking for how to get candidates.
            //
            // Let's assume a conceptual `store.scan({ filter: combinedFilter })` or similar method.
            // If not, this manager might need to periodically query for a subset of old items.
            //
            // If policy.evictionStrategy and trigger is on_storage_threshold:
            // 1. Get current count/size from store.getStats(collectionName).
            // 2. If threshold exceeded, query for `N` items based on evictionStrategy (e.g., oldest `N` items).
            // This is complex.
            //
            // For now, let's focus on the age-based retention use-case with a filter.
            // The `query` method needs an embedding. This makes policy application difficult without a reference embedding.
            //
            // Simplification: Assume we can get items by metadata filter.
            // If IVectorStore had a `queryByMetadata(filter, options)` method, this would be ideal.
            // Lacking that, this is a conceptual placeholder.
             console.warn(`MemoryLifecycleManager (ID: ${this.managerId}): Finding policy candidates for policy '${policy.policyId}' on data source '${dsId}' is currently conceptual and relies on vector store's ability to efficiently query by metadata combined with date ranges. A full scan or specialized store queries might be needed in practice.`);

            // Conceptual: Fetch items matching combinedFilter from 'store' in 'collectionName'.
            // const matchedItemsFromStore: RetrievedVectorDocument[] = await store.conceptualQueryByMetadata(collectionName, combinedFilter);
            // For each matchedItem:
            // candidates.push({ /* ... populate LifecycleCandidateItem ... */ vectorStoreRef: store });

        } catch (error: any) {
            console.error(`MemoryLifecycleManager (ID: ${this.managerId}): Error accessing data source '${dsId}' for policy '${policy.policyId}': ${error.message}`, error);
            report.errors?.push({ policyId: policy.policyId, message: `Error accessing data source ${dsId}: ${error.message}`});
        }
    }
    return candidates; // This will be empty due to the placeholder above.
  }

  /**
   * Negotiates with the GMI (if applicable) and determines the final lifecycle action.
   * @private
   */
  private async negotiateAndDetermineAction(candidate: LifecycleCandidateItem, policy: MemoryLifecyclePolicy): Promise<LifecycleAction | null> {
    if (policy.gmiNegotiation?.enabled && candidate.gmiOwnerId) {
      const gmiInstance = await this.gmiResolver(candidate.gmiOwnerId, candidate.personaOwnerId);
      if (gmiInstance) {
        const event: MemoryLifecycleEvent = {
          eventId: uuidv4(),
          timestamp: new Date(),
          type: this.mapPolicyActionToEventType(policy.action.type), // e.g., EVICTION_PROPOSED
          gmiId: candidate.gmiOwnerId,
          personaId: candidate.personaOwnerId,
          itemId: candidate.id,
          dataSourceId: candidate.dataSourceId,
          category: candidate.category,
          itemSummary: candidate.contentSummary || `Item ID: ${candidate.id}`, // Needs better summary generation
          reason: policy.description || `Policy '${policy.policyId}' triggered.`,
          proposedAction: policy.action.type as LifecycleAction, // Map config action to LifecycleAction
          negotiable: true,
        };

        try {
          const timeout = policy.gmiNegotiation.timeoutMs || this.config.defaultGMINegotiationTimeoutMs || 30000;
          const negotiationPromise = gmiInstance.onMemoryLifecycleEvent(event);
          const response = await Promise.race([
            negotiationPromise,
            new Promise<LifecycleActionResponse>(resolve => setTimeout(() => resolve({
                gmiId: candidate.gmiOwnerId!,
                eventId: event.eventId,
                actionTaken: policy.gmiNegotiation!.defaultActionOnTimeout || 'ALLOW_ACTION',
                rationale: 'GMI negotiation timed out.',
            }), timeout))
          ]);
          
          console.log(`MemoryLifecycleManager (ID: ${this.managerId}): GMI '${candidate.gmiOwnerId}' responded with '${response.actionTaken}' for item '${candidate.id}'.`);
          return response.actionTaken; // This is the GMI's decision or default on timeout
        } catch (error: any) {
          console.error(`MemoryLifecycleManager (ID: ${this.managerId}): Error negotiating with GMI '${candidate.gmiOwnerId}' for item '${candidate.id}': ${error.message}`, error);
          return policy.gmiNegotiation.defaultActionOnTimeout || 'ALLOW_ACTION'; // Fallback on error
        }
      } else {
        console.warn(`MemoryLifecycleManager (ID: ${this.managerId}): Owning GMI '${candidate.gmiOwnerId}' for item '${candidate.id}' not found or resolved. Applying default action or policy action directly.`);
        return policy.action.type as LifecycleAction; // Or a specific default for unresolved GMI
      }
    }
    // No negotiation, or GMI not applicable/found, apply policy's intended action directly.
    return policy.action.type as LifecycleAction;
  }

  private mapPolicyActionToEventType(actionType: ConfigPolicyActionDetails['type']): MemoryLifecycleEvent['type'] {
      switch (actionType) {
          case 'delete':
          case 'summarize_and_delete':
              return 'EVICTION_PROPOSED';
          case 'archive':
          case 'summarize_and_archive':
              return 'ARCHIVAL_PROPOSED';
          case 'notify_gmi_owner':
              return 'NOTIFICATION'; // Or a more specific type like 'RETENTION_REVIEW_PROPOSED'
          default:
              return 'EVALUATION_PROPOSED'; // Generic
      }
  }

  /**
   * Executes the determined lifecycle action on the item.
   * @private
   */
  private async executeLifecycleAction(candidate: LifecycleCandidateItem, configuredAction: ConfigPolicyActionDetails, determinedAction: LifecycleAction): Promise<void> {
    console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Executing action '${determinedAction}' on item '${candidate.id}' from '${candidate.dataSourceId}/${candidate.collectionName}' (DryRun: ${this.config.dryRunMode}).`);
    
    if (this.config.dryRunMode) {
        return; // Do not execute in dry run mode
    }

    // Map LifecycleAction back to more detailed ConfigPolicyActionDetails if needed, or use determinedAction directly.
    // For now, assume determinedAction is one of 'delete', 'archive', etc.
    
    try {
        switch (determinedAction) {
            case 'DELETE': // Corresponds to policy 'delete' or 'summarize_and_delete' after summary
            case 'SUMMARIZE_AND_DELETE': // Actual summarization step needs to happen first
                if (configuredAction.type.startsWith('summarize_') && this.utilityAI) {
                    // const summary = await this.utilityAI.summarizeDocument(candidate.contentSummary || candidate.id, {}); // Placeholder
                    // If summaryDataSourceId exists, ingest summary there.
                    // console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Item '${candidate.id}' summarized (conceptual).`);
                }
                await candidate.vectorStoreRef.delete(candidate.collectionName, [candidate.id]);
                console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Item '${candidate.id}' deleted.`);
                break;

            case 'ARCHIVE': // Corresponds to 'archive' or 'summarize_and_archive'
            case 'SUMMARIZE_AND_ARCHIVE':
                if (configuredAction.type.startsWith('summarize_') && this.utilityAI) {
                    // Summarize logic...
                }
                // Archival logic: this is complex.
                // It might involve:
                // 1. Retrieving the full document from candidate.vectorStoreRef.
                // 2. Storing it in an archive system (e.g., S3, different DB) identified by configuredAction.archiveTargetId.
                // 3. Deleting it from the original candidate.vectorStoreRef.
                console.warn(`MemoryLifecycleManager (ID: ${this.managerId}): Archival for item '${candidate.id}' is conceptual. Requires archive store integration.`);
                // For now, simulate by deleting if it's summarize_and_archive, else just log.
                if (configuredAction.deleteOriginalAfterSummary !== false || determinedAction === 'ARCHIVE') { // Simplification
                     await candidate.vectorStoreRef.delete(candidate.collectionName, [candidate.id]);
                     console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Item '${candidate.id}' conceptually archived (original deleted).`);
                } else {
                     console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Item '${candidate.id}' conceptually archived (original kept).`);
                }
                break;
            
            case 'ALLOW_ACTION': // GMI allowed the policy's proposed action
                // Re-evaluate policy.action.type and execute that. This is recursive conceptually.
                // For simplicity, assume ALLOW_ACTION means the original `policy.action.type`
                await this.executeLifecycleAction(candidate, configuredAction, configuredAction.type as LifecycleAction);
                break;

            case 'PREVENT_ACTION':
            case 'NO_ACTION_TAKEN': // Explicitly no action or GMI prevented it.
                 console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Action on item '${candidate.id}' prevented or no action taken based on GMI negotiation or policy.`);
                break;
            // Handle PROPOSE_ALTERNATIVE_ACTION - more complex, may involve re-evaluation or different steps.
            default:
                console.warn(`MemoryLifecycleManager (ID: ${this.managerId}): Unknown or unhandled lifecycle action '${determinedAction}' for item '${candidate.id}'.`);
        }
    } catch (error: any) {
        console.error(`MemoryLifecycleManager (ID: ${this.managerId}): Error executing action '${determinedAction}' on item '${candidate.id}': ${error.message}`, error);
        throw new GMIError(`Failed to execute lifecycle action '${determinedAction}' on item '${candidate.id}'.`, GMIErrorCode.PROCESSING_ERROR, { itemId: candidate.id, action: determinedAction, error: error.toString() });
    }
  }

  /**
   * @inheritdoc
   */
  public async processSingleItemLifecycle(itemContext: {
    itemId: string;
    dataSourceId: string;
    gmiOwnerId?: string;
    personaOwnerId?: string;
    category?: RagMemoryCategory;
    metadata?: Record<string, any>;
    contentSummary?: string;
  }, triggeringReason?: string): Promise<{ actionTaken: LifecycleAction; details?: any }> {
    this.ensureInitialized();
    // Find matching policies for this item
    // Construct LifecycleCandidateItem
    // Negotiate and determine action
    // Execute action (if not dry run)
    // This is a complex flow similar to a focused part of enforcePolicies
    console.warn(`MemoryLifecycleManager (ID: ${this.managerId}): processSingleItemLifecycle for '${itemContext.itemId}' triggered by '${triggeringReason}' - conceptual implementation.`);
    // Placeholder:
    // 1. Find relevant policies based on itemContext (category, dsId, metadata)
    // 2. For each policy, check if retentionDays etc. apply
    // 3. If a policy matches, create LifecycleCandidateItem
    // 4. Call negotiateAndDetermineAction
    // 5. Call executeLifecycleAction
    // For now, return a default
    return { actionTaken: 'NO_ACTION_TAKEN', details: "processSingleItemLifecycle is conceptual." };
  }


  /**
   * @inheritdoc
   */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: Record<string, unknown> }> {
    if (!this.isInitialized) {
      return { isHealthy: false, details: { message: `MemoryLifecycleManager (ID: ${this.managerId}) not initialized.` } };
    }
    // Basic check: manager is initialized.
    // Could also check connectivity to VSM or if policies are loaded.
    return {
      isHealthy: true,
      details: {
        managerId: this.managerId,
        status: 'Initialized',
        policyCount: this.config.policies.length,
        dryRunMode: this.config.dryRunMode,
        periodicCheckInterval: this.config.defaultCheckInterval,
      },
    };
  }

  /**
   * @inheritdoc
   */
  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Shutdown called but not initialized.`);
      return;
    }
    console.log(`MemoryLifecycleManager (ID: ${this.managerId}): Shutting down...`);
    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
      this.periodicCheckTimer = undefined;
    }
    this.isInitialized = false;
    console.log(`MemoryLifecycleManager (ID: ${this.managerId}) shut down.`);
  }
}