import { describe, it, expect, vi } from 'vitest';

/**
 * Mock @framers/agentos to provide SharedServiceRegistry and other imports.
 * The real agentos barrel uses .js extensions in some re-exports which vitest
 * cannot resolve from source, so we supply lightweight stubs here.
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

import { createExtensionPack } from '../src/index';

describe('Grounding Guard Extension Pack', () => {
  // -------------------------------------------------------------------------
  // Pack structure
  // -------------------------------------------------------------------------

  it('createExtensionPack returns correct structure', () => {
    const pack = createExtensionPack({ options: {} } as any);

    expect(pack.name).toBe('grounding-guard');
    expect(pack.version).toBe('1.0.0');
    expect(pack.descriptors).toHaveLength(2);

    const kinds = pack.descriptors.map((d) => d.kind);
    expect(kinds).toContain('guardrail');
    expect(kinds).toContain('tool');

    const ids = pack.descriptors.map((d) => d.id);
    expect(ids).toContain('grounding-guardrail');
    expect(ids).toContain('check_grounding');
  });

  // -------------------------------------------------------------------------
  // Guardrail — evaluateInput (output-only guardrail)
  // -------------------------------------------------------------------------

  describe('guardrail evaluateInput', () => {
    it('returns null because grounding is output-only', async () => {
      const pack = createExtensionPack({ options: {} } as any);
      const desc = pack.descriptors.find((d) => d.kind === 'guardrail');
      const guardrail = desc!.payload as any;

      const result = await guardrail.evaluateInput({
        input: { textInput: 'This is a claim that could be verified' },
      });

      expect(result).toBeNull();
    });
  });
});
