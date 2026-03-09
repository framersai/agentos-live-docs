/**
 * Shared types for OpenClaw vs Wunderland CLI comparison tool.
 */

export type CliProduct = 'openclaw' | 'wunderland';

export type StepCategory = 'onboarding' | 'command' | 'chat';

/** A single action to perform in an interactive wizard. */
export interface WizardStepAction {
  /** What prompt text pattern to wait for */
  waitFor: RegExp;
  /** What to send as response */
  response: StepResponse;
  /** Unique step identifier */
  stepId: string;
  /** Human-readable label */
  label: string;
  /** Description for the report */
  description: string;
  /** Delay in ms after sending response before capturing next step */
  postDelay?: number;
}

export type StepResponse =
  | { type: 'select'; index: number } // Arrow down N times + Enter
  | { type: 'multiselect'; indices: number[] } // Space on each + Enter
  | { type: 'text'; value: string } // Type text + Enter
  | { type: 'password'; value: string } // Type masked text + Enter
  | { type: 'confirm'; accept: boolean } // 'y' or 'n' + Enter
  | { type: 'enter' } // Just Enter (accept default)
  | { type: 'wait'; timeoutMs: number }; // Wait for completion (no input)

/** A captured screenshot from one CLI. */
export interface CapturedStep {
  product: CliProduct;
  stepId: string;
  label: string;
  description: string;
  category: StepCategory;
  ansiContent: string;
  pngPath: string;
  timestamp: Date;
}

/** A side-by-side comparison pair. */
export interface ComparisonPair {
  pairId: string;
  label: string;
  description: string;
  category: StepCategory;
  openclaw: CapturedStep | null;
  wunderland: CapturedStep | null;
  differenceNotes: string[];
}

/** Non-interactive command to screenshot on both CLIs. */
export interface CommandSpec {
  label: string;
  openclaw: string | null; // null = N/A
  wunderland: string | null; // null = N/A
  differenceNotes: string[];
}

/** Chat prompt to run on both CLIs. */
export interface ChatPrompt {
  id: string;
  prompt: string;
  description: string;
  timeoutMs: number;
}
