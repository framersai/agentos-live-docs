import { describe, it, expect } from 'vitest';
import { createExtensionPack } from '../src/index';

describe('Code Safety Extension Pack', () => {
  // -------------------------------------------------------------------------
  // Pack structure
  // -------------------------------------------------------------------------

  it('createExtensionPack returns correct structure', () => {
    const pack = createExtensionPack({ options: {} } as any);

    expect(pack.name).toBe('code-safety');
    expect(pack.version).toBe('1.0.0');
    expect(pack.descriptors).toHaveLength(2);

    const kinds = pack.descriptors.map((d) => d.kind);
    expect(kinds).toContain('guardrail');
    expect(kinds).toContain('tool');

    const ids = pack.descriptors.map((d) => d.id);
    expect(ids).toContain('code-safety-guardrail');
    expect(ids).toContain('scan_code');
  });

  // -------------------------------------------------------------------------
  // Guardrail — evaluateInput
  // -------------------------------------------------------------------------

  describe('guardrail evaluateInput', () => {
    function getGuardrail() {
      const pack = createExtensionPack({ options: {} } as any);
      const desc = pack.descriptors.find((d) => d.kind === 'guardrail');
      return desc!.payload as any;
    }

    it('detects SQL injection in code fence', async () => {
      const guardrail = getGuardrail();
      const result = await guardrail.evaluateInput({
        input: {
          textInput: "```sql\nSELECT * FROM users WHERE id = '' OR 1=1; DROP TABLE users; --\n```",
        },
      });

      expect(result).not.toBeNull();
      expect(['flag', 'block']).toContain(result!.action);
    });

    it('detects eval injection in code fence', async () => {
      const guardrail = getGuardrail();
      const result = await guardrail.evaluateInput({
        input: {
          textInput: '```js\neval(userInput)\n```',
        },
      });

      expect(result).not.toBeNull();
      expect(['flag', 'block']).toContain(result!.action);
    });

    it('allows clean code through', async () => {
      const guardrail = getGuardrail();
      const result = await guardrail.evaluateInput({
        input: { textInput: '```js\nconst x = 1 + 2;\n```' },
      });

      expect(result).toBeNull();
    });
  });
});
