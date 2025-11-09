/**
 * @fileoverview TEMPLATE_NAME Guardrail
 * @description TEMPLATE_DESCRIPTION
 */

import {
  GuardrailAction,
  type GuardrailContext,
  type GuardrailEvaluationResult,
  type GuardrailInputPayload,
  type GuardrailOutputPayload,
  type IGuardrailService,
} from '@agentos/core/guardrails/IGuardrailService';
import { AgentOSResponseChunkType } from '@agentos/core';

/**
 * Configuration for TEMPLATE_NAME guardrail.
 */
export interface TEMPLATE_CLASSConfig {
  /** Add your config fields here */
  exampleField: string;
}

/**
 * TEMPLATE_DESCRIPTION
 * 
 * @example
 * ```typescript
 * const guard = new TEMPLATE_CLASSGuardrail({
 *   exampleField: 'value',
 * });
 * ```
 */
export class TEMPLATE_CLASSGuardrail implements IGuardrailService {
  constructor(private readonly config: TEMPLATE_CLASSConfig) {}

  /**
   * Evaluate user input.
   * @param payload - Input payload with user text
   * @returns Guardrail decision or null
   */
  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null> {
    const text = payload.input.textInput ?? '';
    
    // TODO: Implement your input evaluation logic here
    
    return null; // No action (allow by default)
  }

  /**
   * Evaluate agent output.
   * @param payload - Output chunk and context
   * @returns Guardrail decision or null
   */
  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null> {
    if (payload.chunk.type !== AgentOSResponseChunkType.FINAL_RESPONSE) {
      return null;
    }

    const finalChunk = payload.chunk as any;
    const text = finalChunk.finalResponseText ?? '';

    // TODO: Implement your output evaluation logic here

    return null; // No action (allow by default)
  }
}

