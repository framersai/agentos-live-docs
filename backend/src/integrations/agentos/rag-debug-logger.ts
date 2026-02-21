/**
 * @file rag-debug-logger.ts
 * @description Lightweight per-request debug logger for the RAG pipeline.
 * Zero overhead when disabled (early return in step()).
 */

export interface RagDebugStep {
  step: string;
  data: Record<string, unknown>;
  ms: number;
}

export class RagDebugLogger {
  private readonly enabled: boolean;
  private readonly steps: RagDebugStep[] = [];
  private readonly startTime: number;

  constructor(enabled: boolean) {
    this.enabled = enabled;
    this.startTime = Date.now();
  }

  step(name: string, data: Record<string, unknown>): void {
    if (!this.enabled) return;
    const ms = Date.now() - this.startTime;
    this.steps.push({ step: name, data, ms });
    console.log(`[RAG Debug] [+${ms}ms] ${name}:`, JSON.stringify(data));
  }

  getSummary(): RagDebugStep[] | undefined {
    if (!this.enabled || this.steps.length === 0) return undefined;
    return this.steps;
  }

  getTotalMs(): number {
    return Date.now() - this.startTime;
  }
}

export function isRagDebugEnabled(requestDebug?: boolean): boolean {
  if (requestDebug === true) return true;
  const envVal = (process.env.AGENTOS_RAG_DEBUG ?? '').trim().toLowerCase();
  return envVal === 'true' || envVal === '1' || envVal === 'yes';
}
