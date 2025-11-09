import { describe, it, expect } from 'vitest';
import { TEMPLATE_CLASSGuardrail } from '../src/index';
import { GuardrailAction } from '@agentos/core/guardrails/IGuardrailService';

describe('TEMPLATE_CLASSGuardrail', () => {
  it('evaluates input correctly', async () => {
    const guard = new TEMPLATE_CLASSGuardrail({
      exampleField: 'test',
    });

    const result = await guard.evaluateInput({
      context: { userId: 'user-1', sessionId: 'session-1' },
      input: { textInput: 'test input' },
    } as any);

    // TODO: Add your test assertions
    expect(result).toBeDefined();
  });

  it('evaluates output correctly', async () => {
    const guard = new TEMPLATE_CLASSGuardrail({
      exampleField: 'test',
    });

    const result = await guard.evaluateOutput({
      context: { userId: 'user-1', sessionId: 'session-1' },
      chunk: {
        type: 'final_response',
        finalResponseText: 'test output',
      },
    } as any);

    // TODO: Add your test assertions
    expect(result).toBeDefined();
  });
});

