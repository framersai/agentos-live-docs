# Code Safety Scanner Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a regex-based code safety scanning guardrail that detects insecure code patterns (OWASP Top 10) in LLM-generated output and tool call arguments using language-aware rule sets.

**Architecture:** `CodeFenceExtractor` parses markdown for code blocks. `CodeSafetyScanner` runs `ICodeSafetyRule` patterns per detected language. `CodeSafetyGuardrail` implements `IGuardrailService` with fence-boundary buffering for streaming + tool call interception. Pure regex, zero dependencies, <1ms per scan.

**Tech Stack:** TypeScript, vitest, regex patterns only (no ML models, no external dependencies)

**Spec:** `docs/superpowers/specs/2026-03-21-code-safety-scanner-design.md`

---

## File Map

All files under `packages/agentos/src/extensions/packs/code-safety/`:

| File                     | Purpose                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`               | `ICodeSafetyRule`, `CodeSafetyCategory`, `CodeBlock`, `CodeSafetyViolation`, `CodeSafetyScanResult`, `CodeSafetyPackOptions`, defaults |
| `CodeFenceExtractor.ts`  | `extractCodeBlocks(text)`, `detectLanguage(code)`                                                                                      |
| `DefaultRules.ts`        | ~25 default rules organized by OWASP category                                                                                          |
| `CodeSafetyScanner.ts`   | Core scanning engine (stateless, sync)                                                                                                 |
| `CodeSafetyGuardrail.ts` | `IGuardrailService` impl with fence-boundary buffering + tool call scanning                                                            |
| `tools/ScanCodeTool.ts`  | `ITool` for on-demand scanning                                                                                                         |
| `index.ts`               | `createCodeSafetyPack()` factory + `createExtensionPack()` bridge                                                                      |
| `code-safety.skill.md`   | SKILL.md for agent awareness                                                                                                           |

Tests under `packages/agentos/tests/extensions/packs/code-safety/`:

| Test File                     | Covers                                                                 |
| ----------------------------- | ---------------------------------------------------------------------- |
| `CodeFenceExtractor.spec.ts`  | Fence extraction, language tags, heuristic detection, edge cases       |
| `DefaultRules.spec.ts`        | Each rule category with positive + negative matches                    |
| `CodeSafetyScanner.spec.ts`   | Full scan flow, language-aware selection, custom rules, disabled rules |
| `CodeSafetyGuardrail.spec.ts` | Output streaming, tool call scanning, scope filtering, reason codes    |
| `ScanCodeTool.spec.ts`        | Tool schema, execute with violations/safe code                         |
| `index.spec.ts`               | Pack factory, descriptors, custom rules, createExtensionPack bridge    |

---

## Task 1: Types + CodeFenceExtractor

**Files:**

- Create: `packages/agentos/src/extensions/packs/code-safety/types.ts`
- Create: `packages/agentos/src/extensions/packs/code-safety/CodeFenceExtractor.ts`
- Create: `packages/agentos/tests/extensions/packs/code-safety/CodeFenceExtractor.spec.ts`

- [ ] **Step 1: Create directories**

```bash
cd packages/agentos
mkdir -p src/extensions/packs/code-safety/tools
mkdir -p tests/extensions/packs/code-safety
```

- [ ] **Step 2: Write types.ts**

All types from the spec:

- `CodeSafetyCategory` type (injection, sql-injection, xss, path-traversal, secrets, crypto, deserialization, ssrf, permissions, other)
- `ICodeSafetyRule` interface (id, name, description, category, severity, patterns: Record<string, RegExp[]>, action?)
- `CodeBlock` interface (code, language, start, end)
- `CodeSafetyViolation` interface (ruleId, ruleName, category, severity, matchedText, language, action)
- `CodeSafetyScanResult` interface (safe, violations, blocksScanned, summary)
- `CodeSafetyPackOptions` interface (customRules, includeDefaultRules, disabledRules, severityActions, codeExecutingTools, codeArgumentMapping, guardrailScope)
- `DEFAULT_SEVERITY_ACTIONS` const
- `DEFAULT_CODE_EXECUTING_TOOLS` const
- `DEFAULT_CODE_ARGUMENT_MAPPING` const

Full TSDoc on everything.

- [ ] **Step 3: Write CodeFenceExtractor tests**

Create `tests/extensions/packs/code-safety/CodeFenceExtractor.spec.ts`:

````typescript
import { describe, it, expect } from 'vitest';
import {
  extractCodeBlocks,
  detectLanguage,
} from '../../../../src/extensions/packs/code-safety/CodeFenceExtractor';

describe('extractCodeBlocks', () => {
  it('extracts a single code block with language tag', () => {
    const text = 'Hello\n```python\nprint("hi")\n```\nBye';
    const blocks = extractCodeBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].language).toBe('python');
    expect(blocks[0].code).toContain('print("hi")');
  });

  it('extracts multiple code blocks', () => {
    const text = '```js\nconst a = 1;\n```\nText\n```sql\nSELECT *\n```';
    const blocks = extractCodeBlocks(text);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].language).toBe('js');
    expect(blocks[1].language).toBe('sql');
  });

  it('handles code blocks without language tag', () => {
    const text = '```\nsome code\n```';
    const blocks = extractCodeBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].language).toBeNull();
  });

  it('returns empty for text without code blocks', () => {
    expect(extractCodeBlocks('no code here')).toHaveLength(0);
  });

  it('handles incomplete/unclosed code fence', () => {
    const text = '```python\nincomplete code';
    const blocks = extractCodeBlocks(text);
    expect(blocks).toHaveLength(0); // unclosed fence is not extracted
  });

  it('preserves start/end offsets', () => {
    const text = 'prefix\n```\ncode\n```\nsuffix';
    const blocks = extractCodeBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].start).toBeGreaterThan(0);
    expect(blocks[0].end).toBeLessThan(text.length);
  });

  it('normalizes language aliases (js → javascript, ts → typescript)', () => {
    const text = '```ts\nconst x = 1;\n```';
    const blocks = extractCodeBlocks(text);
    expect(blocks[0].language).toBe('typescript');
  });
});

describe('detectLanguage', () => {
  it('detects Python', () => {
    expect(detectLanguage('def hello():\n  pass')).toBe('python');
    expect(detectLanguage('import os')).toBe('python');
  });

  it('detects JavaScript', () => {
    expect(detectLanguage('const x = 1;')).toBe('javascript');
    expect(detectLanguage('function foo() {}')).toBe('javascript');
  });

  it('detects SQL', () => {
    expect(detectLanguage('SELECT * FROM users WHERE id = 1')).toBe('sql');
  });

  it('detects Bash', () => {
    expect(detectLanguage('#!/bin/bash\necho hello')).toBe('bash');
  });

  it('returns null for unknown', () => {
    expect(detectLanguage('x = 1')).toBeNull();
  });
});
````

- [ ] **Step 4: Write CodeFenceExtractor**

Create `src/extensions/packs/code-safety/CodeFenceExtractor.ts`:

Key implementation:

- `extractCodeBlocks(text)`: regex for ` ```(\w*)\n([\s\S]*?)``` `, capture language tag + code content + offsets. Normalize aliases (js→javascript, ts→typescript, py→python, sh→bash).
- `detectLanguage(code)`: cascade of keyword regex checks (Python → JS → SQL → Ruby → PHP → Bash → Go → Java → null)

- [ ] **Step 5: Run tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/code-safety/CodeFenceExtractor.spec.ts
```

- [ ] **Step 6: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/code-safety/types.ts src/extensions/packs/code-safety/CodeFenceExtractor.ts tests/extensions/packs/code-safety/CodeFenceExtractor.spec.ts
git commit -m "feat(code-safety): add types, CodeFenceExtractor with language detection"
git push origin master
```

---

## Task 2: DefaultRules (~25 rules)

**Files:**

- Create: `packages/agentos/src/extensions/packs/code-safety/DefaultRules.ts`
- Create: `packages/agentos/tests/extensions/packs/code-safety/DefaultRules.spec.ts`

- [ ] **Step 1: Write DefaultRules**

Create `src/extensions/packs/code-safety/DefaultRules.ts` exporting `DEFAULT_RULES: ICodeSafetyRule[]`.

Organize by category (~25 rules total from the spec):

**Injection (5):** code-injection-eval, command-injection-system, command-injection-backtick (Ruby/Perl/Bash only, NOT JS/TS), code-injection-template, unsafe-reflection

**SQL Injection (3):** sql-injection-concat, sql-injection-format, sql-injection-keywords

**XSS (3):** xss-innerhtml, xss-document-write, xss-dangerously-set

**Path Traversal (2):** path-traversal-dotdot, path-traversal-user-input

**Secrets (4):** hardcoded-aws-key, hardcoded-password, hardcoded-token, hardcoded-private-key

**Crypto (2):** weak-crypto-hash, insecure-random

**Deserialization (2):** insecure-pickle, insecure-yaml (with negative lookahead)

**SSRF (2):** ssrf-unvalidated-url, ssrf-redirect-follow

**Permissions (2):** world-writable, insecure-tmp

Each rule has `patterns: { '*': [...], 'python': [...], 'javascript': [...] }` as applicable.

- [ ] **Step 2: Write DefaultRules tests**

Create `tests/extensions/packs/code-safety/DefaultRules.spec.ts`:

For each category, test at least one positive match and one negative (safe code):

```typescript
import { describe, it, expect } from 'vitest';
import { DEFAULT_RULES } from '../../../../src/extensions/packs/code-safety/DefaultRules';

describe('DefaultRules', () => {
  it('has ~25 rules', () => {
    expect(DEFAULT_RULES.length).toBeGreaterThanOrEqual(20);
    expect(DEFAULT_RULES.length).toBeLessThanOrEqual(30);
  });

  it('all rules have required fields', () => {
    for (const rule of DEFAULT_RULES) {
      expect(rule.id).toBeTruthy();
      expect(rule.name).toBeTruthy();
      expect(rule.category).toBeTruthy();
      expect(rule.severity).toMatch(/^(critical|high|medium|low)$/);
      expect(Object.keys(rule.patterns).length).toBeGreaterThan(0);
    }
  });

  // Per-category positive/negative tests
  describe('injection', () => {
    const evalRule = DEFAULT_RULES.find((r) => r.id === 'code-injection-eval')!;
    it('matches eval()', () => {
      expect(evalRule.patterns['*']!.some((p) => p.test('eval(userInput)'))).toBe(true);
    });
    it('does not match "evaluation"', () => {
      expect(evalRule.patterns['*']!.some((p) => p.test('evaluation report'))).toBe(false);
    });
  });

  describe('sql-injection', () => {
    const concatRule = DEFAULT_RULES.find((r) => r.id === 'sql-injection-concat')!;
    it('matches string concat in SQL', () => {
      const patterns = [
        ...(concatRule.patterns['*'] ?? []),
        ...(concatRule.patterns['python'] ?? []),
      ];
      expect(patterns.some((p) => p.test('"SELECT * FROM users WHERE id = " + userId'))).toBe(true);
    });
  });

  describe('secrets', () => {
    const awsRule = DEFAULT_RULES.find((r) => r.id === 'hardcoded-aws-key')!;
    it('matches AWS access key', () => {
      expect(awsRule.patterns['*']!.some((p) => p.test('AKIAIOSFODNN7EXAMPLE'))).toBe(true);
    });
    it('does not match short strings', () => {
      expect(awsRule.patterns['*']!.some((p) => p.test('AKIA123'))).toBe(false);
    });
  });

  describe('xss', () => {
    const innerRule = DEFAULT_RULES.find((r) => r.id === 'xss-innerhtml')!;
    it('matches innerHTML assignment', () => {
      expect(innerRule.patterns['*']!.some((p) => p.test('element.innerHTML = userInput'))).toBe(
        true
      );
    });
  });

  describe('deserialization', () => {
    const pickleRule = DEFAULT_RULES.find((r) => r.id === 'insecure-pickle')!;
    it('matches pickle.loads', () => {
      expect(pickleRule.patterns['*']!.some((p) => p.test('pickle.loads(data)'))).toBe(true);
    });
  });

  // ... similar for other categories
});
```

- [ ] **Step 3: Run tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/code-safety/DefaultRules.spec.ts
```

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/code-safety/DefaultRules.ts tests/extensions/packs/code-safety/DefaultRules.spec.ts
git commit -m "feat(code-safety): add ~25 default rules covering OWASP Top 10 categories"
git push origin master
```

---

## Task 3: CodeSafetyScanner

**Files:**

- Create: `packages/agentos/src/extensions/packs/code-safety/CodeSafetyScanner.ts`
- Create: `packages/agentos/tests/extensions/packs/code-safety/CodeSafetyScanner.spec.ts`

- [ ] **Step 1: Write CodeSafetyScanner tests**

````typescript
import { describe, it, expect } from 'vitest';
import { CodeSafetyScanner } from '../../../../src/extensions/packs/code-safety/CodeSafetyScanner';

describe('CodeSafetyScanner', () => {
  const scanner = new CodeSafetyScanner();

  it('detects eval() in a Python code block', () => {
    const result = scanner.scan('```python\neval(user_input)\n```');
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThanOrEqual(1);
    expect(result.violations[0].ruleId).toBe('code-injection-eval');
    expect(result.violations[0].severity).toBe('critical');
  });

  it('returns safe for clean code', () => {
    const result = scanner.scan('```python\nprint("hello world")\n```');
    expect(result.safe).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('detects multiple violations across blocks', () => {
    const result = scanner.scan(
      "```python\neval(x)\n```\n```sql\nSELECT * FROM users WHERE id = ' OR 1=1\n```"
    );
    expect(result.violations.length).toBeGreaterThanOrEqual(2);
  });

  it('applies language-specific patterns', () => {
    // os.system is Python-specific, should match in python block
    const pyResult = scanner.scan('```python\nos.system("ls")\n```');
    expect(pyResult.safe).toBe(false);

    // os.system in a JS block should NOT match (it's Python-only)
    const jsResult = scanner.scan('```javascript\nos.system("ls")\n```');
    // This depends on whether os.system is in the '*' patterns or 'python' only
  });

  it('returns safe for text without code blocks', () => {
    const result = scanner.scan('Just some regular text without any code.');
    expect(result.safe).toBe(true);
    expect(result.blocksScanned).toBe(0);
  });

  it('scanCode works with explicit language', () => {
    const violations = scanner.scanCode('eval(user_input)', 'python');
    expect(violations.length).toBeGreaterThanOrEqual(1);
  });

  it('respects custom rules', () => {
    const customScanner = new CodeSafetyScanner([
      {
        id: 'custom-ban-console',
        name: 'No Console',
        description: 'Ban console.log',
        category: 'other',
        severity: 'low',
        patterns: { '*': [/console\.log\(/] },
      },
    ]);
    const result = customScanner.scan('```js\nconsole.log("test")\n```');
    expect(result.safe).toBe(false);
    expect(result.violations[0].ruleId).toBe('custom-ban-console');
  });

  it('builds summary string', () => {
    const result = scanner.scan('```python\neval(x)\n```');
    expect(result.summary).toContain('critical');
  });

  it('sorts violations by severity (critical first)', () => {
    const result = scanner.scan('```python\neval(x)\nopen("/tmp/test")\n```');
    if (result.violations.length >= 2) {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      for (let i = 1; i < result.violations.length; i++) {
        expect(severityOrder[result.violations[i].severity]).toBeGreaterThanOrEqual(
          severityOrder[result.violations[i - 1].severity]
        );
      }
    }
  });
});
````

- [ ] **Step 2: Write CodeSafetyScanner**

Create `src/extensions/packs/code-safety/CodeSafetyScanner.ts`:

Key implementation:

- Constructor takes optional `rules` (defaults to `DEFAULT_RULES`) and `severityActions`
- `scan(text)`: call `extractCodeBlocks(text)`, for each block call `scanBlock(block)`, collect all violations, sort by severity, build summary
- `scanBlock(block)`: determine language (from block.language or `detectLanguage`), run `'*'` patterns + language-specific patterns for the detected language, collect violations
- `scanCode(code, language)`: wrap in a `CodeBlock` and call `scanBlock`
- Each match creates a `CodeSafetyViolation` with the matched text snippet
- Action determined by: rule.action override > severityActions mapping

- [ ] **Step 3: Run tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/code-safety/CodeSafetyScanner.spec.ts
```

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/code-safety/CodeSafetyScanner.ts tests/extensions/packs/code-safety/CodeSafetyScanner.spec.ts
git commit -m "feat(code-safety): add CodeSafetyScanner with language-aware pattern matching"
git push origin master
```

---

## Task 4: CodeSafetyGuardrail + ScanCodeTool

**Files:**

- Create: `packages/agentos/src/extensions/packs/code-safety/CodeSafetyGuardrail.ts`
- Create: `packages/agentos/src/extensions/packs/code-safety/tools/ScanCodeTool.ts`
- Create: `packages/agentos/tests/extensions/packs/code-safety/CodeSafetyGuardrail.spec.ts`
- Create: `packages/agentos/tests/extensions/packs/code-safety/ScanCodeTool.spec.ts`

- [ ] **Step 1: Read existing guardrail interfaces**

Read these files to understand the exact types:

- `src/core/guardrails/IGuardrailService.ts` — GuardrailAction, GuardrailConfig, etc.
- `src/core/tools/ITool.ts` — ITool interface
- `src/api/types/AgentOSResponse.ts` — AgentOSResponseChunkType, TOOL_CALL_REQUEST chunk type, toolCalls field

- [ ] **Step 2: Write CodeSafetyGuardrail**

Implements `IGuardrailService`:

```typescript
config = { evaluateStreamingChunks: true, canSanitize: false };
```

Internal state: `Map<string, FenceState>` keyed by streamId.

`evaluateOutput(payload)`:

- If scope is 'input', return null
- Get chunk. Get streamId from `(chunk as any).streamId`
- **TOOL_CALL_REQUEST handling**: if chunk type is TOOL_CALL_REQUEST, iterate `chunk.toolCalls`, check each `call.name` against codeExecutingTools, extract code via codeArgumentMapping, scan, report
- **TEXT_DELTA handling**: append textDelta to buffer, check for complete code fences, scan when fence closes
- **isFinal handling**: flush remaining buffer, scan any complete blocks
- Return BLOCK/FLAG with appropriate reason code or null

`evaluateInput(payload)`:

- If scope is 'output', return null
- Extract code blocks from textInput, scan, report

- [ ] **Step 3: Write ScanCodeTool**

Implements ITool with id='scan_code', delegates to CodeSafetyScanner.scanCode().

- [ ] **Step 4: Write tests**

CodeSafetyGuardrail.spec.ts:

- Output scanning: detects eval in TEXT_DELTA code fence → BLOCK
- Output scanning: clean code → null
- Tool call scanning: shell_execute with dangerous command → BLOCK
- Tool call scanning: multiple tool calls in one chunk
- scope 'input' disables evaluateOutput
- isFinal flushes buffer
- Reason codes: CODE_SAFETY_CRITICAL, CODE_SAFETY_HIGH
- Non-code TEXT_DELTA passes through (no fence)

ScanCodeTool.spec.ts:

- Tool properties (id, name, category, hasSideEffects)
- execute with violations returns safe=false
- execute with clean code returns safe=true

- [ ] **Step 5: Run tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/code-safety/
```

- [ ] **Step 6: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/code-safety/CodeSafetyGuardrail.ts src/extensions/packs/code-safety/tools/ScanCodeTool.ts tests/extensions/packs/code-safety/CodeSafetyGuardrail.spec.ts tests/extensions/packs/code-safety/ScanCodeTool.spec.ts
git commit -m "feat(code-safety): add CodeSafetyGuardrail with fence-boundary buffering + ScanCodeTool"
git push origin master
```

---

## Task 5: Pack factory + index.ts

**Files:**

- Create: `packages/agentos/src/extensions/packs/code-safety/index.ts`
- Create: `packages/agentos/tests/extensions/packs/code-safety/index.spec.ts`

- [ ] **Step 1: Write index.ts**

```typescript
import type { ExtensionPack, ExtensionPackContext } from '../../manifest';
import { EXTENSION_KIND_GUARDRAIL, EXTENSION_KIND_TOOL } from '../../types';
import type { CodeSafetyPackOptions } from './types';
import { DEFAULT_SEVERITY_ACTIONS } from './types';
import { DEFAULT_RULES } from './DefaultRules';
import { CodeSafetyScanner } from './CodeSafetyScanner';
import { CodeSafetyGuardrail } from './CodeSafetyGuardrail';
import { ScanCodeTool } from './tools/ScanCodeTool';

export function createCodeSafetyPack(options?: CodeSafetyPackOptions): ExtensionPack {
  const opts = options ?? {};

  // Build rule set: default rules (optionally filtered) + custom rules
  const rules = buildRuleSet(opts);
  const severityActions = { ...DEFAULT_SEVERITY_ACTIONS, ...opts.severityActions };
  const scanner = new CodeSafetyScanner(rules, severityActions);

  const guardrail = new CodeSafetyGuardrail(opts, scanner);
  const tool = new ScanCodeTool(scanner);

  // Plain descriptors array (not getter) — intentional.
  // No onActivate/onDeactivate lifecycle needed: pure regex, no shared services.
  return {
    name: 'code-safety',
    version: '1.0.0',
    descriptors: [
      {
        id: 'code-safety-guardrail',
        kind: EXTENSION_KIND_GUARDRAIL,
        priority: 4,
        payload: guardrail,
      },
      { id: 'scan_code', kind: EXTENSION_KIND_TOOL, priority: 0, payload: tool },
    ],
  };
}

export function createExtensionPack(context: ExtensionPackContext): ExtensionPack {
  return createCodeSafetyPack(context.options as CodeSafetyPackOptions);
}

function buildRuleSet(opts: CodeSafetyPackOptions) {
  let rules = opts.includeDefaultRules !== false ? [...DEFAULT_RULES] : [];
  if (opts.disabledRules?.length) {
    const disabled = new Set(opts.disabledRules);
    rules = rules.filter((r) => !disabled.has(r.id));
  }
  if (opts.customRules?.length) {
    rules.push(...opts.customRules);
  }
  return rules;
}

export * from './types';
```

- [ ] **Step 2: Write index tests**

```typescript
describe('createCodeSafetyPack', () => {
  it('returns pack with name and version', () => {
    const pack = createCodeSafetyPack();
    expect(pack.name).toBe('code-safety');
    expect(pack.version).toBe('1.0.0');
  });

  it('provides 2 descriptors: guardrail + tool', () => {
    const pack = createCodeSafetyPack();
    expect(pack.descriptors).toHaveLength(2);
    expect(pack.descriptors[0].kind).toBe('guardrail');
    expect(pack.descriptors[1].kind).toBe('tool');
  });

  it('guardrail has id code-safety-guardrail', () => {
    const pack = createCodeSafetyPack();
    expect(pack.descriptors[0].id).toBe('code-safety-guardrail');
  });

  it('tool has id scan_code', () => {
    const pack = createCodeSafetyPack();
    expect(pack.descriptors[1].id).toBe('scan_code');
  });

  it('supports disabledRules', () => {
    // Pack with a disabled rule should still create without error
    const pack = createCodeSafetyPack({ disabledRules: ['code-injection-eval'] });
    expect(pack.descriptors).toHaveLength(2);
  });

  it('supports custom rules', () => {
    const pack = createCodeSafetyPack({
      customRules: [
        {
          id: 'custom-test',
          name: 'Test',
          description: 'Test rule',
          category: 'other',
          severity: 'low',
          patterns: { '*': [/test/] },
        },
      ],
    });
    expect(pack.descriptors).toHaveLength(2);
  });

  it('createExtensionPack bridges context.options', () => {
    const pack = createExtensionPack({ options: {} } as any);
    expect(pack.name).toBe('code-safety');
  });
});
```

- [ ] **Step 3: Run all code-safety tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/code-safety/
```

- [ ] **Step 4: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/code-safety/index.ts tests/extensions/packs/code-safety/index.spec.ts
git commit -m "feat(code-safety): add createCodeSafetyPack factory"
git push origin master
```

---

## Task 6: Barrel export + package.json + SKILL.md + registry

**Files:**

- Modify: `packages/agentos/src/extensions/index.ts`
- Modify: `packages/agentos/package.json`
- Create: `packages/agentos-skills-registry/registry/curated/code-safety/SKILL.md`
- Modify: `packages/agentos-extensions-registry/src/tool-registry.ts`

- [ ] **Step 1: Agentos submodule exports**

Add to `src/extensions/index.ts`:

```typescript
export {
  createCodeSafetyPack,
  createExtensionPack as createCodeSafetyExtensionPack,
} from './packs/code-safety';
```

Add to `package.json` exports:

```json
"./extensions/packs/code-safety": {
  "import": "./dist/extensions/packs/code-safety/index.js",
  "default": "./dist/extensions/packs/code-safety/index.js",
  "types": "./dist/extensions/packs/code-safety/index.d.ts"
}
```

```bash
cd packages/agentos
git add src/extensions/index.ts package.json
git commit -m "feat(code-safety): add barrel export + package.json exports path"
git push origin master
```

- [ ] **Step 2: SKILL.md + registry (from monorepo root)**

Create SKILL.md at `packages/agentos-skills-registry/registry/curated/code-safety/SKILL.md` with content from spec.

Add to tool-registry.ts in the Security section:

```typescript
{
  packageName: '@framers/agentos-ext-code-safety',
  name: 'code-safety',
  category: 'integration',
  available: true,
  displayName: 'Code Safety Scanner',
  description: 'Language-aware regex code scanning for OWASP Top 10 vulnerabilities in LLM-generated code.',
  requiredSecrets: [],
  defaultPriority: 4,
  envVars: [],
  docsUrl: '/docs/extensions/built-in/code-safety',
},
```

Push submodules first, then monorepo:

```bash
cd packages/agentos-skills-registry && git add registry/curated/code-safety/ && git commit -m "feat(code-safety): add SKILL.md" && git push origin master
cd ../agentos-extensions-registry && git add src/tool-registry.ts && git commit -m "feat(code-safety): register in extension catalog" && git push origin master
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos-skills-registry packages/agentos-extensions-registry
git commit -m "feat(code-safety): add SKILL.md and extension registry entry"
```

---

## Task 7: Full verification

- [ ] **Step 1: Run all code-safety tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/code-safety/
```

- [ ] **Step 2: Run all extension tests (regression)**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/
```

- [ ] **Step 3: Run guardrail dispatcher tests**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/
```

- [ ] **Step 4: Update monorepo submodule pointer and push**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos
git commit -m "chore: update agentos submodule — code safety scanner extension complete"
git push origin master
```
