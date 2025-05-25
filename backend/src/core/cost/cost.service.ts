// File: backend/src/core/cost/cost.service.ts

/**
 * @file Manages and tracks API usage costs for different services.
 * @version 1.1.0 - Added DISABLE_COST_LIMITS environment variable check.
 * @description This service provides a centralized way to record costs
 * associated with LLM interactions, STT transcriptions, TTS synthesis,
 * and other potentially costly API calls. It supports per-user session
 * cost tracking and global thresholds.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../../'); // Adjusted path
dotenv.config({ path: path.join(__projectRoot, '.env'), override: true });


/**
 * Represents a single cost entry.
 */
export interface ICostEntry {
  /** Unique identifier for the cost entry (e.g., timestamp or UUID). */
  id: string;
  /** Identifier for the user associated with this cost. */
  userId: string;
  /** Type of service that incurred the cost (e.g., 'llm', 'stt', 'tts', 'diagram'). */
  serviceType: 'llm' | 'stt' | 'tts' | 'diagram' | 'general_api' | string;
  /** Specific model or sub-service used, if applicable (e.g., 'gpt-4o-mini', 'whisper-1'). */
  modelOrSubType?: string;
  /** The cost incurred for this specific entry in USD. */
  costUSD: number;
  /** Timestamp of when the cost was incurred. */
  timestamp: Date;
  /** Number of input units (e.g., tokens, characters, seconds). */
  inputUnits?: number;
  /** Number of output units (e.g., tokens, characters, seconds). */
  outputUnits?: number;
  /** Additional metadata related to the cost entry. */
  metadata?: Record<string, any>;
}

/**
 * Represents the detailed cost breakdown for a user's session.
 */
export interface ISessionCostDetail {
  /** Identifier for the user. */
  userId: string;
  /** Total cost accumulated in the current session in USD. */
  totalCost: number;
  /** Breakdown of costs by service type. */
  costsByService: {
    [serviceType: string]: number;
  };
  /** List of individual cost entries for the session. */
  entries: ICostEntry[];
  /** Timestamp of when the session tracking started or last reset. */
  sessionStartTime: Date;
}

const sessionCosts: Map<string, ISessionCostDetail> = new Map();
let globalMonthlyCostUSD: number = 0;
const GLOBAL_COST_THRESHOLD_USD_PER_MONTH = parseFloat(
  process.env.GLOBAL_COST_THRESHOLD_USD_PER_MONTH || '100.00'
);
const DEFAULT_SESSION_COST_THRESHOLD_USD = parseFloat(
  process.env.COST_THRESHOLD_USD_PER_SESSION || '2.00'
);

export class CostService {
  /**
   * Tracks a cost entry for a specific user and service.
   *
   * @static
   * @param {string} userId - The identifier of the user.
   * @param {'llm' | 'stt' | 'tts' | 'diagram' | string} serviceType - The type of service.
   * @param {number} costUSD - The cost incurred in USD.
   * @param {string} [modelOrSubType] - The specific model or sub-service used.
   * @param {number} [inputUnits] - Number of input units.
   * @param {number} [outputUnits] - Number of output units.
   * @param {Record<string, any>} [metadata] - Additional metadata.
   * @returns {ICostEntry} The created cost entry.
   */
  public static trackCost(
    userId: string,
    serviceType: 'llm' | 'stt' | 'tts' | 'diagram' | string,
    costUSD: number,
    modelOrSubType?: string,
    inputUnits?: number,
    outputUnits?: number,
    metadata?: Record<string, any>
  ): ICostEntry {
    if (costUSD < 0) {
      console.warn(`CostService: Attempted to track negative cost ($${costUSD}) for user ${userId}, service ${serviceType}. Cost will be treated as 0.`);
      costUSD = 0;
    }

    const entry: ICostEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      serviceType,
      modelOrSubType,
      costUSD,
      timestamp: new Date(),
      inputUnits,
      outputUnits,
      metadata,
    };

    if (!sessionCosts.has(userId)) {
      sessionCosts.set(userId, {
        userId,
        totalCost: 0,
        costsByService: {},
        entries: [],
        sessionStartTime: new Date(),
      });
    }

    const userSession = sessionCosts.get(userId)!;
    userSession.totalCost += costUSD;
    userSession.costsByService[serviceType] = (userSession.costsByService[serviceType] || 0) + costUSD;
    userSession.entries.push(entry);

    globalMonthlyCostUSD += costUSD;

    console.log(`CostService: User [${userId}] ${serviceType} (${modelOrSubType || 'N/A'}) cost: $${costUSD.toFixed(6)}. Session total: $${userSession.totalCost.toFixed(6)}. Global monthly: $${globalMonthlyCostUSD.toFixed(2)}`);
    
    if (process.env.DISABLE_COST_LIMITS !== 'true' && globalMonthlyCostUSD > GLOBAL_COST_THRESHOLD_USD_PER_MONTH) {
        console.warn(`CostService: GLOBAL MONTHLY COST THRESHOLD EXCEEDED! Current: $${globalMonthlyCostUSD.toFixed(2)}, Threshold: $${GLOBAL_COST_THRESHOLD_USD_PER_MONTH.toFixed(2)}`);
        // Implement alerting or service degradation logic here for production
    }

    return entry;
  }

  /**
   * Retrieves the current session cost details for a user.
   *
   * @static
   * @param {string} userId - The identifier of the user.
   * @returns {ISessionCostDetail} The session cost details. If no costs tracked, returns a zeroed detail object.
   */
  public static getSessionCost(userId: string): ISessionCostDetail {
    if (!sessionCosts.has(userId)) {
      return {
        userId,
        totalCost: 0,
        costsByService: {},
        entries: [],
        sessionStartTime: new Date(),
      };
    }
    return sessionCosts.get(userId)!;
  }

  /**
   * Checks if the user's current session cost has reached or exceeded a given threshold.
   * Respects the `DISABLE_COST_LIMITS` environment variable.
   *
   * @static
   * @param {string} userId - The identifier of the user.
   * @param {number} [explicitThresholdUSD] - The specific threshold to check against. If not provided, `DEFAULT_SESSION_COST_THRESHOLD_USD` is used.
   * @returns {boolean} True if the threshold is reached, false otherwise or if limits are disabled.
   */
  public static isSessionCostThresholdReached(userId: string, explicitThresholdUSD?: number): boolean {
    if (process.env.DISABLE_COST_LIMITS === 'true') {
      console.log("CostService: Cost limit checks are disabled via DISABLE_COST_LIMITS=true.");
      return false;
    }

    const thresholdToUse = explicitThresholdUSD ?? DEFAULT_SESSION_COST_THRESHOLD_USD;
    const userSession = sessionCosts.get(userId);

    if (!userSession) {
      return false; // No costs tracked yet, so threshold not reached.
    }
    
    const reached = userSession.totalCost >= thresholdToUse;
    if (reached) {
        console.warn(`CostService: User [${userId}] session cost $${userSession.totalCost.toFixed(2)} has reached/exceeded threshold $${thresholdToUse.toFixed(2)}.`);
    }
    return reached;
  }

  /**
   * Resets the session cost for a specific user.
   *
   * @static
   * @param {string} userId - The identifier of the user.
   * @returns {void}
   */
  public static resetSessionCost(userId: string): void {
    if (sessionCosts.has(userId)) {
      sessionCosts.set(userId, {
        userId,
        totalCost: 0,
        costsByService: {},
        entries: [],
        sessionStartTime: new Date(),
      });
      console.log(`CostService: Session cost reset for user ${userId}.`);
    } else {
      console.log(`CostService: No session found for user ${userId} to reset.`);
    }
  }

  /**
   * Retrieves the current global monthly accumulated cost.
   * @static
   * @returns {number} The total global cost in USD tracked this month.
   */
  public static getGlobalMonthlyCost(): number {
    return globalMonthlyCostUSD;
  }

  /**
   * Resets the global monthly cost.
   * Typically called at the beginning of a new billing cycle.
   * @static
   */
  public static resetGlobalMonthlyCost(): void {
    globalMonthlyCostUSD = 0;
    console.log("CostService: Global monthly cost reset.");
  }

  /**
   * Clears all tracked session costs.
   * Useful for development or specific reset scenarios.
   * @static
   */
  public static clearAllSessionCosts(): void {
    sessionCosts.clear();
    console.log("CostService: All session costs cleared.");
  }
}