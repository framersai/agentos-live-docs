import { BaseGrader, EvalInput, GraderResult, GraderConfig } from './base.grader';
import { evaluate, type Assertion } from 'promptfoo';

/**
 * Promptfoo-backed grader - uses promptfoo's assertion engine.
 *
 * This provides access to promptfoo's battle-tested assertions including:
 * - context-faithfulness (RAGAS faithfulness)
 * - answer-relevance (RAGAS answer relevancy)
 * - context-relevance (RAGAS context relevancy)
 * - context-recall (RAGAS context recall)
 * - similar (semantic similarity via embeddings)
 * - llm-rubric (LLM-as-judge)
 * - factuality (OpenAI factuality)
 * - And 40+ more assertion types
 *
 * Why promptfoo instead of custom implementations?
 * - MIT licensed, actively maintained, used by Shopify/Discord/Microsoft
 * - RAGAS metrics are complex (claim extraction, NLI verification, etc.)
 * - promptfoo's implementations are production-tested
 * - Saves significant development and maintenance effort
 *
 * Reference: https://promptfoo.dev/docs/configuration/expected-outputs/
 */
export class PromptfooGrader extends BaseGrader {
  private assertion: string;
  private threshold: number;
  private provider?: string;

  constructor(
    graderConfig: GraderConfig,
    private openaiApiKey?: string,
  ) {
    super(graderConfig);

    // Get promptfoo assertion type from config
    this.assertion = this.getConfigValue('assertion', 'llm-rubric');
    this.threshold = this.getConfigValue('threshold', 0.7);
    this.provider = this.getConfigValue('provider', undefined);
  }

  get type(): string {
    return 'promptfoo';
  }

  async evaluate(evalInput: EvalInput): Promise<GraderResult> {
    const { input, output, expected, context } = evalInput;

    try {
      // Build the promptfoo assertion based on type
      const assertion = this.buildAssertion(expected, context);

      // Run promptfoo evaluation
      // We use an "echo" provider that just returns the output we already have
      const result = await evaluate({
        prompts: [output], // The output we're evaluating
        providers: [
          {
            id: () => 'echo',
            callApi: async () => ({ output }),
          } as any, // Custom echo provider
        ],
        tests: [{
          vars: {
            query: input,
            context: context || '',
            expected: expected || '',
          },
          assert: [assertion],
        }],
        // Use environment API key or passed key
        env: this.openaiApiKey ? { OPENAI_API_KEY: this.openaiApiKey } : undefined,
      });

      return this.parsePromptfooResult(result);
    } catch (error) {
      return {
        pass: false,
        score: 0,
        reason: `Promptfoo evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Build a promptfoo assertion based on the configured type.
   */
  private buildAssertion(expected?: string, context?: string): Assertion {
    const baseAssertion: Assertion = {
      type: this.assertion as Assertion['type'],
      threshold: this.threshold,
    };

    // Add type-specific configuration
    switch (this.assertion) {
      case 'llm-rubric':
        // Use the grader's rubric for LLM-based evaluation
        return {
          ...baseAssertion,
          value: this.rubric || 'Evaluate if the response is accurate, helpful, and well-structured.',
        };

      case 'similar':
        // Semantic similarity against expected output
        return {
          ...baseAssertion,
          value: expected || '',
        };

      case 'context-faithfulness':
      case 'answer-relevance':
      case 'context-relevance':
      case 'context-recall':
        // RAGAS-style metrics - context is passed via vars
        return baseAssertion;

      case 'contains':
      case 'equals':
      case 'regex':
        // Simple assertions need a value
        return {
          ...baseAssertion,
          value: expected || '',
        };

      case 'factuality':
        // OpenAI factuality check
        return baseAssertion;

      default:
        return baseAssertion;
    }
  }

  /**
   * Parse promptfoo's evaluation result into our GraderResult format.
   */
  private parsePromptfooResult(result: any): GraderResult {
    // Get the first (and only) test result
    const testResult = result.results?.[0];

    if (!testResult) {
      return {
        pass: false,
        score: 0,
        reason: 'No results from promptfoo evaluation',
      };
    }

    // Get assertion results
    const assertionResult = testResult.gradingResult;

    if (!assertionResult) {
      return {
        pass: testResult.success,
        score: testResult.success ? 1 : 0,
        reason: testResult.error || 'Evaluation completed',
      };
    }

    // Build reason from component results
    const reasons: string[] = [];
    if (assertionResult.reason) {
      reasons.push(assertionResult.reason);
    }
    if (assertionResult.componentResults) {
      for (const component of assertionResult.componentResults) {
        if (component.reason) {
          reasons.push(component.reason);
        }
      }
    }

    return {
      pass: assertionResult.pass,
      score: assertionResult.score ?? (assertionResult.pass ? 1 : 0),
      reason: reasons.join('. ') || `${this.assertion} evaluation: ${assertionResult.pass ? 'passed' : 'failed'}`,
    };
  }
}

/**
 * Available promptfoo assertion types for reference.
 * See: https://promptfoo.dev/docs/configuration/expected-outputs/
 */
export const PROMPTFOO_ASSERTIONS = {
  // Deterministic
  equals: 'Exact string match',
  contains: 'Output contains substring',
  regex: 'Output matches regex pattern',
  'is-json': 'Output is valid JSON',
  'is-valid-function-call': 'Valid function call format',

  // Semantic
  similar: 'Cosine similarity via embeddings',
  classifier: 'ML classifier evaluation',

  // LLM-as-Judge
  'llm-rubric': 'LLM evaluates against custom rubric',
  'g-eval': 'Chain-of-thought evaluation',
  factuality: 'OpenAI factuality check',
  'model-graded-closedqa': 'OpenAI closed QA evaluation',

  // RAGAS metrics (RAG evaluation)
  'context-faithfulness': 'Claims grounded in context (hallucination detection)',
  'answer-relevance': 'Answer relevant to query',
  'context-relevance': 'Retrieved context relevant to query',
  'context-recall': 'Ground truth present in context',

  // NLP metrics
  'rouge-n': 'ROUGE-N overlap score',
  bleu: 'BLEU translation quality',
  levenshtein: 'Edit distance score',

  // Safety
  'is-refusal': 'Model refused the task',
  guardrails: 'Harmful content detection',
} as const;

export type PromptfooAssertionType = keyof typeof PROMPTFOO_ASSERTIONS;
