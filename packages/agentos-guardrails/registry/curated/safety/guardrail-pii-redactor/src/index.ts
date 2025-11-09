/**
 * @fileoverview PII Redactor Guardrail
 * @description Redacts personally identifiable information (SSN, email, phone, credit card) from agent outputs.
 * Supports both streaming (real-time) and final-only evaluation modes.
 */

import {
  GuardrailAction,
  type GuardrailContext,
  type GuardrailConfig,
  type GuardrailEvaluationResult,
  type GuardrailInputPayload,
  type GuardrailOutputPayload,
  type IGuardrailService,
} from '@agentos/core/guardrails/IGuardrailService';
import { AgentOSResponseChunkType } from '@agentos/core';

/**
 * Configuration for PII Redactor guardrail.
 */
export interface PIIRedactorConfig {
  /**
   * Enable real-time redaction during streaming (evaluates TEXT_DELTA chunks).
   * When false, only evaluates FINAL_RESPONSE chunks (faster, lower cost).
   * 
   * **Performance Impact:**
   * - Streaming: Adds ~1-5ms latency per TEXT_DELTA chunk
   * - Final-only: Adds ~1-5ms latency once per response
   * 
   * **Cost Impact:**
   * - Streaming: Minimal (regex-based, no LLM calls)
   * - Final-only: Minimal (regex-based, no LLM calls)
   * 
   * @default false (final-only for performance)
   */
  enableStreamingRedaction?: boolean;
  
  /**
   * Maximum number of streaming chunks to evaluate per request.
   * Only applies when enableStreamingRedaction is true.
   * 
   * @default undefined (no limit)
   */
  maxStreamingEvaluations?: number;
  
  /**
   * Whether to evaluate user input for PII.
   * 
   * @default true
   */
  evaluateInput?: boolean;
  
  /**
   * Whether to evaluate agent output for PII.
   * 
   * @default true
   */
  evaluateOutput?: boolean;
  
  /**
   * Custom replacement text for redacted PII.
   * 
   * @default '[REDACTED]'
   */
  replacementText?: string;
  
  /**
   * Enable/disable specific PII types.
   */
  patterns?: {
    /** Redact Social Security Numbers (SSN) */
    ssn?: boolean;
    /** Redact email addresses */
    email?: boolean;
    /** Redact phone numbers */
    phone?: boolean;
    /** Redact credit card numbers */
    creditCard?: boolean;
    /** Redact IP addresses */
    ipAddress?: boolean;
    /** Redact MAC addresses */
    macAddress?: boolean;
  };
}

/**
 * Pre-compiled regex patterns for common PII types.
 */
const PII_PATTERNS = {
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  macAddress: /\b(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})\b/g,
};

/**
 * PII Redactor Guardrail
 * 
 * Redacts personally identifiable information from agent inputs and outputs.
 * Supports real-time streaming redaction for immediate protection.
 * 
 * @example
 * ```typescript
 * const guardrail = new PIIRedactorGuardrail({
 *   enableStreamingRedaction: true, // Real-time redaction
 *   replacementText: '[PII]',
 *   patterns: {
 *     ssn: true,
 *     email: true,
 *     phone: true,
 *   },
 * });
 * 
 * const config: AgentOSConfig = {
 *   guardrailService: guardrail,
 * };
 * ```
 */
export class PIIRedactorGuardrail implements IGuardrailService {
  public readonly config: GuardrailConfig;
  private readonly patterns: Map<string, RegExp>;
  private readonly replacementText: string;
  private readonly evaluateInput: boolean;
  private readonly evaluateOutput: boolean;
  private readonly enableStreaming: boolean;
  private readonly maxStreamingEvals?: number;

  constructor(config: PIIRedactorConfig = {}) {
    const {
      enableStreamingRedaction = false,
      maxStreamingEvaluations,
      evaluateInput = true,
      evaluateOutput = true,
      replacementText = '[REDACTED]',
      patterns = {
        ssn: true,
        email: true,
        phone: true,
        creditCard: true,
        ipAddress: false,
        macAddress: false,
      },
    } = config;

    this.replacementText = replacementText;
    this.evaluateInput = evaluateInput;
    this.evaluateOutput = evaluateOutput;
    this.enableStreaming = enableStreamingRedaction;
    this.maxStreamingEvals = maxStreamingEvaluations;

    // Build pattern map from enabled patterns
    this.patterns = new Map();
    if (patterns.ssn) this.patterns.set('ssn', PII_PATTERNS.ssn);
    if (patterns.email) this.patterns.set('email', PII_PATTERNS.email);
    if (patterns.phone) this.patterns.set('phone', PII_PATTERNS.phone);
    if (patterns.creditCard) this.patterns.set('creditCard', PII_PATTERNS.creditCard);
    if (patterns.ipAddress) this.patterns.set('ipAddress', PII_PATTERNS.ipAddress);
    if (patterns.macAddress) this.patterns.set('macAddress', PII_PATTERNS.macAddress);

    // Set guardrail config for streaming evaluation
    this.config = {
      evaluateStreamingChunks: enableStreamingRedaction,
      maxStreamingEvaluations: maxStreamingEvaluations,
    };
  }

  /**
   * Redacts PII from text using configured patterns.
   */
  private redactPII(text: string): { sanitized: string; detected: string[] } {
    let sanitized = text;
    const detected: string[] = [];

    for (const [type, pattern] of this.patterns.entries()) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        detected.push(type);
        // Reset regex lastIndex for global patterns
        pattern.lastIndex = 0;
        sanitized = sanitized.replace(pattern, this.replacementText);
      }
    }

    return { sanitized, detected };
  }

  /**
   * Evaluate user input for PII.
   */
  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null> {
    if (!this.evaluateInput) {
      return null;
    }

    const text = payload.input.textInput ?? '';
    const { sanitized, detected } = this.redactPII(text);

    if (detected.length === 0) {
      return null; // No PII detected
    }

    return {
      action: GuardrailAction.SANITIZE,
      reason: `PII detected in input: ${detected.join(', ')}`,
      reasonCode: 'PII_INPUT_DETECTED',
      modifiedText: sanitized,
      metadata: {
        detectedTypes: detected,
        originalLength: text.length,
        sanitizedLength: sanitized.length,
      },
    };
  }

  /**
   * Evaluate agent output for PII.
   * Supports both streaming (TEXT_DELTA) and final (FINAL_RESPONSE) chunks.
   */
  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null> {
    if (!this.evaluateOutput) {
      return null;
    }

    const chunk = payload.chunk;
    let text = '';

    // Extract text based on chunk type
    if (chunk.type === AgentOSResponseChunkType.TEXT_DELTA) {
      const deltaChunk = chunk as any;
      text = deltaChunk.textDelta || '';
    } else if (chunk.type === AgentOSResponseChunkType.FINAL_RESPONSE) {
      const finalChunk = chunk as any;
      text = finalChunk.finalResponseText || finalChunk.content || '';
    } else {
      return null; // Not a text chunk
    }

    if (!text.trim()) {
      return null; // Empty text
    }

    const { sanitized, detected } = this.redactPII(text);

    if (detected.length === 0) {
      return null; // No PII detected
    }

    return {
      action: GuardrailAction.SANITIZE,
      reason: `PII detected in output: ${detected.join(', ')}`,
      reasonCode: 'PII_OUTPUT_DETECTED',
      modifiedText: sanitized,
      metadata: {
        detectedTypes: detected,
        chunkType: chunk.type,
        originalLength: text.length,
        sanitizedLength: sanitized.length,
      },
    };
  }
}

