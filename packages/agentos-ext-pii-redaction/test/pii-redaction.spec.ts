import { describe, it, expect, vi } from 'vitest';

/**
 * Mock @framers/agentos to provide SharedServiceRegistry and other imports
 * that the pack factory needs at construction time.  The real agentos barrel
 * uses .js extensions in some re-exports which vitest cannot resolve from
 * source, so we supply lightweight stubs here.
 */
vi.mock('@framers/agentos', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@framers/agentos');
  return {
    ...actual,
    SharedServiceRegistry:
      actual.SharedServiceRegistry ??
      class SharedServiceRegistry {
        private instances = new Map();
        async getOrCreate(id: string, factory: () => any) {
          if (this.instances.has(id)) return this.instances.get(id);
          const instance = await factory();
          this.instances.set(id, instance);
          return instance;
        }
        has(id: string) {
          return this.instances.has(id);
        }
        async release() {}
        async releaseAll() {}
      },
    GuardrailAction: actual.GuardrailAction ?? {
      ALLOW: 'allow',
      FLAG: 'flag',
      SANITIZE: 'sanitize',
      BLOCK: 'block',
    },
    EXTENSION_KIND_GUARDRAIL: actual.EXTENSION_KIND_GUARDRAIL ?? 'guardrail',
    EXTENSION_KIND_TOOL: actual.EXTENSION_KIND_TOOL ?? 'tool',
    AgentOSResponseChunkType: actual.AgentOSResponseChunkType ?? {
      TEXT_DELTA: 'TEXT_DELTA',
      FINAL_RESPONSE: 'FINAL_RESPONSE',
    },
  };
});

import { createExtensionPack, createPiiRedactionGuardrail } from '../src/index';

describe('PII Redaction Extension Pack', () => {
  // -------------------------------------------------------------------------
  // Pack structure
  // -------------------------------------------------------------------------

  it('createExtensionPack returns correct structure', () => {
    const pack = createExtensionPack({ options: {} } as any);

    expect(pack.name).toBe('pii-redaction');
    expect(pack.version).toBe('1.0.0');
    expect(pack.descriptors).toHaveLength(3);

    const kinds = pack.descriptors.map((d) => d.kind);
    expect(kinds).toContain('guardrail');
    expect(kinds).toContain('tool');

    const ids = pack.descriptors.map((d) => d.id);
    expect(ids).toContain('pii-redaction-guardrail');
    expect(ids).toContain('pii_scan');
    expect(ids).toContain('pii_redact');
  });

  // -------------------------------------------------------------------------
  // Guardrail — evaluateInput
  // -------------------------------------------------------------------------

  describe('guardrail evaluateInput', () => {
    function getGuardrail(entityTypes?: string[]) {
      const pack = createPiiRedactionGuardrail(
        entityTypes ? { entityTypes: entityTypes as any } : undefined
      );
      const desc = pack.descriptors.find((d) => d.kind === 'guardrail');
      return desc!.payload as any;
    }

    it('detects SSN pattern in input', async () => {
      const guardrail = getGuardrail();
      const result = await guardrail.evaluateInput({
        input: { textInput: 'ssn 078-05-1120' },
      });

      expect(result).not.toBeNull();
      expect(result!.action).toBe('sanitize');
      expect(result!.reasonCode).toBe('PII_REDACTED');
    });

    it('detects credit card number in input', async () => {
      const guardrail = getGuardrail();
      const result = await guardrail.evaluateInput({
        input: { textInput: 'credit card 4111111111111111' },
      });

      expect(result).not.toBeNull();
      expect(result!.action).toBe('sanitize');
      expect(result!.reasonCode).toBe('PII_REDACTED');
    });

    it('allows clean short input through', async () => {
      const guardrail = getGuardrail(['SSN', 'CREDIT_CARD', 'EMAIL']);
      const result = await guardrail.evaluateInput({
        input: { textInput: '2' },
      });

      expect(result).toBeNull();
    });
  });
});
