import { describe, it, expect } from 'vitest';
import { PIIRedactorGuardrail } from '../src/index';
import { GuardrailAction, AgentOSResponseChunkType } from '@agentos/core';

describe('PIIRedactorGuardrail', () => {
  describe('evaluateInput', () => {
    it('redacts SSN from input', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateInput: true,
        replacementText: '[REDACTED]',
      });

      const result = await guard.evaluateInput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        input: { textInput: 'My SSN is 123-45-6789' },
      } as any);

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.modifiedText).toContain('[REDACTED]');
      expect(result?.modifiedText).not.toContain('123-45-6789');
      expect(result?.metadata?.detectedTypes).toContain('ssn');
    });

    it('redacts email from input', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateInput: true,
      });

      const result = await guard.evaluateInput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        input: { textInput: 'Contact me at john@example.com' },
      } as any);

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.modifiedText).not.toContain('john@example.com');
      expect(result?.metadata?.detectedTypes).toContain('email');
    });

    it('redacts phone number from input', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateInput: true,
      });

      const result = await guard.evaluateInput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        input: { textInput: 'Call me at 555-123-4567' },
      } as any);

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.modifiedText).not.toContain('555-123-4567');
      expect(result?.metadata?.detectedTypes).toContain('phone');
    });

    it('redacts multiple PII types', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateInput: true,
      });

      const result = await guard.evaluateInput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        input: { textInput: 'SSN: 123-45-6789, Email: test@example.com, Phone: 555-123-4567' },
      } as any);

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.metadata?.detectedTypes).toContain('ssn');
      expect(result?.metadata?.detectedTypes).toContain('email');
      expect(result?.metadata?.detectedTypes).toContain('phone');
    });

    it('allows safe input without PII', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateInput: true,
      });

      const result = await guard.evaluateInput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        input: { textInput: 'This is safe content without any PII' },
      } as any);

      expect(result).toBeNull();
    });

    it('respects evaluateInput: false', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateInput: false,
      });

      const result = await guard.evaluateInput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        input: { textInput: 'My SSN is 123-45-6789' },
      } as any);

      expect(result).toBeNull();
    });
  });

  describe('evaluateOutput', () => {
    it('redacts PII from FINAL_RESPONSE chunk', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateOutput: true,
      });

      const result = await guard.evaluateOutput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        chunk: {
          type: AgentOSResponseChunkType.FINAL_RESPONSE,
          finalResponseText: 'Your SSN is 123-45-6789',
          isFinal: true,
        } as any,
      });

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.modifiedText).not.toContain('123-45-6789');
      expect(result?.modifiedText).toContain('[REDACTED]');
    });

    it('redacts PII from TEXT_DELTA chunk when streaming enabled', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateOutput: true,
        enableStreamingRedaction: true,
      });

      const result = await guard.evaluateOutput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        chunk: {
          type: AgentOSResponseChunkType.TEXT_DELTA,
          textDelta: 'Your email is test@example.com',
          isFinal: false,
        } as any,
      });

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.modifiedText).not.toContain('test@example.com');
      expect(result?.modifiedText).toContain('[REDACTED]');
    });

    it('uses custom replacement text', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateOutput: true,
        replacementText: '[PII]',
      });

      const result = await guard.evaluateOutput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        chunk: {
          type: AgentOSResponseChunkType.FINAL_RESPONSE,
          finalResponseText: 'SSN: 123-45-6789',
          isFinal: true,
        } as any,
      });

      expect(result?.modifiedText).toContain('[PII]');
      expect(result?.modifiedText).not.toContain('[REDACTED]');
    });

    it('respects pattern configuration', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateOutput: true,
        patterns: {
          ssn: true,
          email: false, // Disabled
          phone: false, // Disabled
        },
      });

      const result = await guard.evaluateOutput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        chunk: {
          type: AgentOSResponseChunkType.FINAL_RESPONSE,
          finalResponseText: 'SSN: 123-45-6789, Email: test@example.com',
          isFinal: true,
        } as any,
      });

      expect(result?.action).toBe(GuardrailAction.SANITIZE);
      expect(result?.metadata?.detectedTypes).toContain('ssn');
      expect(result?.metadata?.detectedTypes).not.toContain('email');
      expect(result?.modifiedText).toContain('test@example.com'); // Email not redacted
    });

    it('respects evaluateOutput: false', async () => {
      const guard = new PIIRedactorGuardrail({
        evaluateOutput: false,
      });

      const result = await guard.evaluateOutput({
        context: { userId: 'user-1', sessionId: 'session-1' },
        chunk: {
          type: AgentOSResponseChunkType.FINAL_RESPONSE,
          finalResponseText: 'SSN: 123-45-6789',
          isFinal: true,
        } as any,
      });

      expect(result).toBeNull();
    });
  });

  describe('streaming configuration', () => {
    it('sets config.evaluateStreamingChunks when enabled', () => {
      const guard = new PIIRedactorGuardrail({
        enableStreamingRedaction: true,
      });

      expect(guard.config?.evaluateStreamingChunks).toBe(true);
    });

    it('sets config.maxStreamingEvaluations when provided', () => {
      const guard = new PIIRedactorGuardrail({
        enableStreamingRedaction: true,
        maxStreamingEvaluations: 50,
      });

      expect(guard.config?.maxStreamingEvaluations).toBe(50);
    });

    it('defaults to final-only evaluation', () => {
      const guard = new PIIRedactorGuardrail();

      expect(guard.config?.evaluateStreamingChunks).toBe(false);
    });
  });
});

