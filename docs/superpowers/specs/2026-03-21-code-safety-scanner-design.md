# Code Safety Scanner Extension — Design Specification

**Date:** 2026-03-21
**Status:** Approved
**Author:** Claude (brainstorming session)
**Sub-project:** 4 of 5 (SOTA Guardrails Parity)

## Summary

A regex-based code safety scanning guardrail for AgentOS that detects insecure code patterns in LLM-generated output using language-aware rule sets. Scans code blocks in streaming markdown text and code arguments in tool call requests. Covers OWASP Top 10 patterns: SQL injection, command injection, XSS, path traversal, hardcoded secrets, weak crypto, insecure deserialization, and SSRF. Pure regex — no models, no dependencies, <1ms per scan.

Self-contained AgentOS extension pack. No Wunderland dependency.

## Goals

1. **Output code scanning** — extract code blocks from markdown fences in TEXT_DELTA/FINAL_RESPONSE chunks, detect insecure patterns per language
2. **Tool call interception** — scan code arguments in TOOL_CALL_REQUEST chunks before execution (SQL in `run_sql`, commands in `shell_execute`, file contents in `write_file`)
3. **Language-aware regex rules** — universal `'*'` patterns + per-language patterns (Python, JS/TS, SQL, Ruby, PHP, Bash, Go, Java), language detected from fence tags or heuristics
4. **~25 default rules** covering OWASP Top 10 categories with configurable severity and actions
5. **Pluggable rule interface** — `ICodeSafetyRule` for adding custom rules without modifying defaults
6. **Code fence extraction** — lightweight markdown fence parser with language detection fallback
7. **Thorough TSDoc/JSDoc comments** and inline comments everywhere

## Non-Goals

- AST-based analysis (deferred — regex covers 90%+ of LLM-generated insecure patterns without dependencies)
- Full SAST tool replacement (Snyk, Semgrep, SonarQube)
- Code execution sandboxing (SafeGuardrails already handles filesystem/command permissions)
- Input-side code scanning by default (configurable via `guardrailScope: 'both'`)
- Training or using ML models for code vulnerability detection

---

## Architecture

### 1. Core Types

**Location:** `packages/agentos/src/extensions/packs/code-safety/types.ts`

````typescript
/**
 * Categories of code safety issues, aligned with OWASP Top 10
 * and common CWE classifications.
 */
export type CodeSafetyCategory =
  | 'injection' // CWE-78/94: Command/code injection (eval, exec, system)
  | 'sql-injection' // CWE-89: SQL injection via string concatenation
  | 'xss' // CWE-79: Cross-site scripting (innerHTML, document.write)
  | 'path-traversal' // CWE-22: Directory traversal (../ in paths)
  | 'secrets' // CWE-798: Hardcoded credentials (API keys, passwords, tokens)
  | 'crypto' // CWE-327/328: Weak cryptography (MD5, SHA1 for passwords)
  | 'deserialization' // CWE-502: Insecure deserialization (pickle, yaml.load)
  | 'ssrf' // CWE-918: Server-side request forgery
  | 'permissions' // CWE-732: Incorrect permission assignment
  | 'other';

/**
 * A single code safety rule that detects an insecure pattern.
 *
 * Rules have per-language regex variants. The universal `'*'` key matches
 * in any language. Language-specific keys (e.g., `'python'`, `'javascript'`)
 * add patterns that only apply when that language is detected.
 *
 * @example
 * ```typescript
 * const evalRule: ICodeSafetyRule = {
 *   id: 'code-injection-eval',
 *   name: 'Dynamic Code Execution',
 *   description: 'eval() executes arbitrary code, enabling code injection',
 *   category: 'injection',
 *   severity: 'critical',
 *   patterns: {
 *     '*':          [/\beval\s*\(/],
 *     'python':     [/\bexec\s*\(/, /\bcompile\s*\(/],
 *     'javascript': [/new\s+Function\s*\(/, /setTimeout\s*\(\s*['"`]/],
 *   },
 * };
 * ```
 */
export interface ICodeSafetyRule {
  /** Unique rule identifier (e.g., 'sql-injection', 'eval-usage') */
  id: string;
  /** Human-readable name */
  name: string;
  /** What this rule detects and why it's dangerous */
  description: string;
  /** OWASP/CWE category */
  category: CodeSafetyCategory;
  /** Severity: how dangerous is this pattern? */
  severity: 'critical' | 'high' | 'medium' | 'low';
  /**
   * Language-specific regex patterns.
   * Key `'*'` matches in all languages (universal patterns).
   * Language-specific keys add patterns only for that language.
   * When scanning Python code, both `'*'` and `'python'` patterns run.
   */
  patterns: Record<string, RegExp[]>;
  /**
   * Override the default severity-to-action mapping for this rule.
   * If omitted, uses the pack's severityActions config.
   */
  action?: 'flag' | 'block';
}

/**
 * A code block extracted from markdown text.
 */
export interface CodeBlock {
  /** The code content (without fence markers) */
  code: string;
  /** Language tag from the fence (e.g., 'python', 'sql'). null if untagged. */
  language: string | null;
  /** Start character offset in the original text */
  start: number;
  /** End character offset in the original text (exclusive) */
  end: number;
}

/**
 * A single violation found by the code safety scanner.
 */
export interface CodeSafetyViolation {
  /** Which rule was triggered */
  ruleId: string;
  /** Rule display name */
  ruleName: string;
  /** OWASP/CWE category */
  category: CodeSafetyCategory;
  /** Severity level */
  severity: 'critical' | 'high' | 'medium' | 'low';
  /** The matched text snippet */
  matchedText: string;
  /** Detected or declared language of the code block */
  language: string | null;
  /** Action to take for this violation */
  action: 'flag' | 'block';
}

/**
 * Result of scanning text for code safety issues.
 */
export interface CodeSafetyScanResult {
  /** Whether the code is safe (no violations above threshold) */
  safe: boolean;
  /** All violations found, sorted by severity (critical first) */
  violations: CodeSafetyViolation[];
  /** Number of code blocks scanned */
  blocksScanned: number;
  /** Human-readable summary */
  summary: string;
}

/**
 * Configuration for the code safety scanner extension pack.
 */
export interface CodeSafetyPackOptions {
  /**
   * Custom rules to add alongside (or instead of) the defaults.
   */
  customRules?: ICodeSafetyRule[];

  /**
   * Whether to include the default rule set (~25 rules).
   * Set to false to use only custom rules.
   * @default true
   */
  includeDefaultRules?: boolean;

  /**
   * Rule IDs to disable from the default set.
   * Useful for suppressing false positives in specific domains.
   * @example ['weak-crypto-md5'] // allow MD5 for non-security checksums
   */
  disabledRules?: string[];

  /**
   * Action mapping by severity. Overrides per-rule defaults.
   * @default { critical: 'block', high: 'block', medium: 'flag', low: 'flag' }
   */
  severityActions?: Partial<Record<'critical' | 'high' | 'medium' | 'low', 'flag' | 'block'>>;

  /**
   * Tool names whose arguments should be scanned for insecure code.
   * When a TOOL_CALL_REQUEST chunk targets one of these tools,
   * the code/command argument is scanned before execution.
   * @default ['shell_execute', 'run_sql', 'write_file', 'create_file', 'edit_file']
   */
  codeExecutingTools?: string[];

  /**
   * Maps tool names to the argument key containing code and the default language.
   * Used for TOOL_CALL_REQUEST scanning.
   * @default DEFAULT_CODE_ARGUMENT_MAPPING (shell_execute→command/bash, run_sql→query/sql, etc.)
   */
  codeArgumentMapping?: Record<string, { argKey: string; language: string | null }>;

  /**
   * Guardrail scope.
   * Defaults to 'output' — scans agent responses and tool calls for insecure code.
   * Set to 'both' to also scan user-provided code in input messages.
   * When scope includes 'input', evaluateInput extracts code blocks from
   * payload.input.textInput and scans them with the same rules.
   * @default 'output'
   */
  guardrailScope?: 'input' | 'output' | 'both';
}

/**
 * Default severity-to-action mapping.
 */
export const DEFAULT_SEVERITY_ACTIONS: Record<string, 'flag' | 'block'> = {
  critical: 'block',
  high: 'block',
  medium: 'flag',
  low: 'flag',
};

/**
 * Default tools whose arguments should be scanned.
 */
export const DEFAULT_CODE_EXECUTING_TOOLS = [
  'shell_execute',
  'run_sql',
  'write_file',
  'create_file',
  'edit_file',
] as const;
````

---

### 2. Code Fence Extractor

**Location:** `packages/agentos/src/extensions/packs/code-safety/CodeFenceExtractor.ts`

````typescript
/**
 * Extracts code blocks from markdown text.
 *
 * Handles triple-backtick fences with optional language tags:
 *   ```python
 *   import os
 *   os.system("rm -rf /")
 *   ```
 *
 * Returns an array of CodeBlock with the code content, detected language,
 * and character offsets in the original text.
 *
 * When no language tag is present, uses keyword-based heuristics to
 * detect the language (Python, JS, SQL, Ruby, PHP, Bash).
 */
export function extractCodeBlocks(text: string): CodeBlock[];

/**
 * Detect language from code content when fence tag is missing.
 *
 * Uses keyword heuristics — not perfect, but sufficient for
 * selecting the right regex pattern set. Returns null if
 * language cannot be determined (universal patterns still apply).
 *
 * Detection priority (first match wins):
 * 1. Python: def/import/from...import patterns
 * 2. JavaScript/TypeScript: function/const/=>/require patterns
 * 3. SQL: SELECT/INSERT/CREATE TABLE keywords
 * 4. Ruby: class...< / .each do / puts
 * 5. PHP: <?php / $variable =
 * 6. Bash: shebang / if [ ... ]
 * 7. Go: func / package / import ( patterns
 * 8. Java: public class / System.out / import java
 */
export function detectLanguage(code: string): string | null;
````

---

### 3. Default Rules

**Location:** `packages/agentos/src/extensions/packs/code-safety/DefaultRules.ts`

~25 rules organized by category. Each rule has universal `'*'` patterns and language-specific variants where applicable.

#### Injection (5 rules)

| Rule ID                      | Severity | Universal Pattern                                                   | Language-Specific                                                                                                                                                                          |
| ---------------------------- | -------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `code-injection-eval`        | critical | `eval(`                                                             | Python: `exec(`, `compile(`. JS: `new Function(`, `setTimeout("`. PHP: `passthru(`, `shell_exec(`                                                                                          |
| `command-injection-system`   | critical | —                                                                   | Python: `os.system(`, `subprocess.call(shell=True)`, `subprocess.Popen(shell=True)`. Ruby: `system(`, `` `cmd` ``. PHP: `system(`, `exec(`                                                 |
| `command-injection-backtick` | high     | — (no universal pattern — backticks are template literals in JS/TS) | Ruby/Perl/Bash only: `` `cmd` `` backtick execution. Bash: `$(...)` command substitution. **Explicitly excluded for JavaScript/TypeScript** to avoid false positives on template literals. |
| `code-injection-template`    | medium   | —                                                                   | JS: template literal with `${...}` inside eval/Function. Python: f-string in exec                                                                                                          |
| `unsafe-reflection`          | medium   | —                                                                   | Java: `Class.forName(userInput)`. Python: `getattr(obj, userInput)`                                                                                                                        |

#### SQL Injection (3 rules)

| Rule ID                  | Severity | Pattern                                                                                             |
| ------------------------ | -------- | --------------------------------------------------------------------------------------------------- |
| `sql-injection-concat`   | critical | String concatenation in SQL: `"SELECT * FROM " + var`, `f"SELECT...{var}"`, `` `SELECT...${var}` `` |
| `sql-injection-format`   | high     | `.format()` or `%s` in SQL strings                                                                  |
| `sql-injection-keywords` | high     | `' OR 1=1`, `UNION SELECT`, `; DROP TABLE` in string literals                                       |

#### XSS (3 rules)

| Rule ID               | Severity | Pattern                                                             |
| --------------------- | -------- | ------------------------------------------------------------------- |
| `xss-innerhtml`       | high     | `.innerHTML =`, `v-html=`, `[innerHTML]=`                           |
| `xss-document-write`  | high     | `document.write(`, `document.writeln(`                              |
| `xss-dangerously-set` | medium   | `dangerouslySetInnerHTML` (React — flagged for review, not blocked) |

#### Path Traversal (2 rules)

| Rule ID                     | Severity | Pattern                                                     |
| --------------------------- | -------- | ----------------------------------------------------------- |
| `path-traversal-dotdot`     | high     | `../` repeated 2+ times in string literals, `..\\`          |
| `path-traversal-user-input` | medium   | `path.join(userInput`, `os.path.join(request.`, `open(user` |

#### Secrets (4 rules)

| Rule ID                 | Severity | Pattern                                                                   |
| ----------------------- | -------- | ------------------------------------------------------------------------- | --- | ----------------------- |
| `hardcoded-aws-key`     | critical | `AKIA[0-9A-Z]{16}`                                                        |
| `hardcoded-password`    | high     | `password\s*=\s*["'][^"']+["']`, `passwd\s*=`, `secret\s*=\s*["']`        |
| `hardcoded-token`       | high     | `Bearer eyJ`, `token\s*=\s*["']eyJ`, `api_key\s*=\s*["'][a-zA-Z0-9]{20,}` |
| `hardcoded-private-key` | critical | `-----BEGIN (RSA                                                          | EC  | DSA )?PRIVATE KEY-----` |

#### Crypto (2 rules)

| Rule ID            | Severity | Pattern                                                                                      |
| ------------------ | -------- | -------------------------------------------------------------------------------------------- |
| `weak-crypto-hash` | medium   | `md5(`, `MD5.new`, `sha1(`, `SHA1.new`, `hashlib.md5`, `hashlib.sha1` (for password context) |
| `insecure-random`  | medium   | `Math.random()` in security context, `random.random()` for tokens                            |

#### Deserialization (2 rules)

| Rule ID           | Severity | Pattern                                                                                                                                  |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `insecure-pickle` | critical | `pickle.loads(`, `pickle.load(`, `cPickle.loads(`                                                                                        |
| `insecure-yaml`   | high     | `yaml.load(` without `Loader=SafeLoader` or `Loader=yaml.SafeLoader` (requires negative lookahead regex: `yaml\.load\((?!.*Loader\s*=)`) |

#### SSRF (2 rules)

| Rule ID                | Severity | Pattern                                                                 |
| ---------------------- | -------- | ----------------------------------------------------------------------- |
| `ssrf-unvalidated-url` | high     | `fetch(userInput)`, `requests.get(user_`, `urllib.request.urlopen(user` |
| `ssrf-redirect-follow` | medium   | `redirect: 'follow'` with dynamic URL                                   |

#### Permissions (2 rules)

| Rule ID          | Severity | Pattern                                             |
| ---------------- | -------- | --------------------------------------------------- |
| `world-writable` | high     | `chmod 777`, `os.chmod(path, 0o777)`, `chmod(0777,` |
| `insecure-tmp`   | low      | `open('/tmp/` without `tempfile` or `mkstemp`       |

---

### 4. CodeSafetyScanner

**Location:** `packages/agentos/src/extensions/packs/code-safety/CodeSafetyScanner.ts`

```typescript
/**
 * Scans code for insecure patterns using language-aware regex rules.
 *
 * Stateless and synchronous — no models, no network calls.
 * Designed for <1ms per scan at guardrail evaluation speed.
 *
 * Flow:
 * 1. Extract code blocks from markdown text (extractCodeBlocks)
 * 2. Detect language per block (fence tag or heuristic)
 * 3. For each block, run applicable rules (universal '*' + language-specific)
 * 4. Map severity to action via severityActions config
 * 5. Return violations sorted by severity (critical first)
 */
export class CodeSafetyScanner {
  /**
   * @param rules - Rules to apply. Defaults to DEFAULT_RULES if omitted.
   * @param severityActions - Severity-to-action mapping. Defaults to DEFAULT_SEVERITY_ACTIONS.
   */
  constructor(rules?: ICodeSafetyRule[], severityActions?: Record<string, 'flag' | 'block'>);

  /**
   * Scan markdown text for insecure code patterns.
   * Extracts code blocks, detects languages, runs rules.
   *
   * @param text - Markdown text potentially containing code fences
   * @returns Scan result with violations and summary
   */
  scan(text: string): CodeSafetyScanResult;

  /**
   * Scan a pre-extracted code block.
   *
   * @param block - Code block with content and language
   * @returns Violations found in this block
   */
  scanBlock(block: CodeBlock): CodeSafetyViolation[];

  /**
   * Scan raw code string with a known language.
   * Used for tool call argument scanning where
   * the language is inferred from the tool type.
   *
   * @param code - Raw code string
   * @param language - Language identifier (e.g., 'python', 'sql', 'bash')
   * @returns Violations found
   */
  scanCode(code: string, language: string | null): CodeSafetyViolation[];
}
```

---

### 5. CodeSafetyGuardrail

**Location:** `packages/agentos/src/extensions/packs/code-safety/CodeSafetyGuardrail.ts`

````typescript
/**
 * IGuardrailService implementation for code safety scanning.
 *
 * Output evaluation (streaming):
 * - Accumulates text per stream in a fence-tracking buffer
 * - When a code fence closes (``` detected), extracts and scans the block
 * - BLOCK on critical/high severity violations, FLAG on medium/low
 * - Non-code text passes through with zero overhead
 *
 * Tool call interception:
 * - On TOOL_CALL_REQUEST chunks for code-executing tools
 * - Extracts code/command argument, detects language from tool type
 * - Scans with appropriate language patterns
 *
 * Does NOT set canSanitize — runs in Phase 2 (parallel).
 * Pure regex, synchronous — <1ms per scan, no async overhead.
 *
 * Reason codes:
 * - CODE_SAFETY_CRITICAL: critical severity violation
 * - CODE_SAFETY_HIGH: high severity violation
 * - CODE_SAFETY_MEDIUM: medium severity violation
 * - CODE_SAFETY_LOW: low severity violation
 */
export class CodeSafetyGuardrail implements IGuardrailService {
  /**
   * Guardrail config:
   * - evaluateStreamingChunks: true (required to receive TEXT_DELTA chunks
   *   for fence-boundary buffering — without this, only FINAL_RESPONSE is received)
   * - canSanitize: false (runs in Phase 2 parallel, returns BLOCK/FLAG not SANITIZE)
   *
   * The guardrail's evaluateOutput receives ALL chunk types from the pipeline
   * (TEXT_DELTA, TOOL_CALL_REQUEST, FINAL_RESPONSE, etc.). It only acts on
   * TEXT_DELTA (fence buffering), TOOL_CALL_REQUEST (tool arg scanning), and
   * isFinal chunks (flush remaining buffer).
   */
  readonly config: GuardrailConfig = {
    evaluateStreamingChunks: true,
    canSanitize: false,
  };

  constructor(options: CodeSafetyPackOptions, scanner: CodeSafetyScanner);

  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null>;

  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null>;
}
````

**Streaming buffer design:**

Per-stream state tracks whether we're inside a code fence:

```typescript
/**
 * Per-stream state for fence-boundary buffering.
 * Simpler than SlidingWindowBuffer — just tracks fence open/close.
 */
interface FenceState {
  /** Accumulated text since stream started */
  buffer: string;
  /** Whether we're currently inside an open code fence */
  inFence: boolean;
  /** Timestamp for stale cleanup */
  lastSeenAt: number;
}
```

On each TEXT_DELTA:

1. Append `textDelta` to buffer
2. Check if buffer now contains a complete code fence (opening + closing ` ``` `)
3. If yes: extract and scan the code block, report violations
4. If no: continue accumulating (zero-cost passthrough for non-code text)

On `isFinal`: flush buffer, scan any remaining complete code blocks.

Stale cleanup: same lazy pattern (prune when map size > 100).

**Tool call scanning:**

On TOOL_CALL_REQUEST chunks:

The chunk has `toolCalls: ToolCallRequest[]` (array — a chunk can contain multiple tool calls). Each `ToolCallRequest` has `{ id, name, arguments }`.

1. Iterate over `chunk.toolCalls`
2. For each `call`, check if `call.name` is in `codeExecutingTools` list
3. If yes: extract the code argument from `call.arguments` using the `codeArgumentMapping`:
   ```typescript
   /** Maps tool name → { argument key to extract, default language } */
   const DEFAULT_CODE_ARGUMENT_MAPPING: Record<
     string,
     { argKey: string; language: string | null }
   > = {
     shell_execute: { argKey: 'command', language: 'bash' },
     run_sql: { argKey: 'query', language: 'sql' },
     write_file: { argKey: 'content', language: null }, // detect from filename arg
     create_file: { argKey: 'content', language: null },
     edit_file: { argKey: 'content', language: null },
   };
   ```
4. Scan with `scanner.scanCode(code, language)`
5. Report violations — if any tool call has a violation, the entire chunk is flagged/blocked

---

### 6. scan_code Tool

**Location:** `packages/agentos/src/extensions/packs/code-safety/tools/ScanCodeTool.ts`

```typescript
/**
 * Agent-callable tool for on-demand code safety scanning.
 *
 * Lets agents proactively check code before presenting to users,
 * writing to files, or executing.
 *
 * @example
 * → scan_code({ code: "eval(user_input)", language: "python" })
 * ← {
 *     safe: false,
 *     violations: [{ ruleId: 'code-injection-eval', severity: 'critical', ... }],
 *     blocksScanned: 1,
 *     summary: "1 critical issue: Dynamic Code Execution"
 *   }
 */
export class ScanCodeTool implements ITool<ScanCodeInput, CodeSafetyScanResult> {
  readonly id = 'scan_code';
  readonly name = 'scan_code';
  readonly displayName = 'Code Safety Scanner';
  readonly description =
    'Scan code for security vulnerabilities (injection, XSS, hardcoded secrets, etc.) using language-aware pattern rules.';
  readonly category = 'security';
  readonly version = '1.0.0';
  readonly hasSideEffects = false;
  readonly inputSchema = {
    type: 'object',
    properties: {
      code: { type: 'string', description: 'Code to scan for security issues' },
      language: {
        type: 'string',
        description:
          'Programming language (e.g., python, javascript, sql). Auto-detected if omitted.',
      },
    },
    required: ['code'],
  };
}
```

---

### 7. Extension Pack Structure & Factory

**Location:** `packages/agentos/src/extensions/packs/code-safety/`

```
code-safety/
├── index.ts                    # createCodeSafetyPack() + createExtensionPack()
├── types.ts                    # ICodeSafetyRule, CodeSafetyCategory, CodeSafetyPackOptions, etc.
├── CodeSafetyScanner.ts        # Core scanning engine (stateless, sync)
├── CodeFenceExtractor.ts       # Markdown fence extraction + language detection
├── DefaultRules.ts             # ~25 default rules organized by category
├── CodeSafetyGuardrail.ts      # IGuardrailService impl
├── tools/
│   └── ScanCodeTool.ts         # ITool for on-demand scanning
└── code-safety.skill.md        # SKILL.md
```

**Factory:**

```typescript
/**
 * Creates the code safety scanner extension pack.
 *
 * Provides:
 * 1. A guardrail (id: 'code-safety-guardrail') for automatic
 *    code safety scanning on output and tool calls
 * 2. A tool (id: 'scan_code') for on-demand code scanning
 *
 * Pure regex — no models, no dependencies, no ISharedServiceRegistry needed.
 * The simplest pack in the guardrails suite.
 */
export function createCodeSafetyPack(options?: CodeSafetyPackOptions): ExtensionPack {
  const opts = options ?? {};

  const scanner = new CodeSafetyScanner(buildRuleSet(opts), {
    ...DEFAULT_SEVERITY_ACTIONS,
    ...opts.severityActions,
  });

  const guardrail = new CodeSafetyGuardrail(opts, scanner);
  const tool = new ScanCodeTool(scanner);

  // Plain descriptors array (not a getter) is intentional:
  // No onActivate/onDeactivate lifecycle needed for this pack.
  // Pure regex, no shared services, no model loading.
  // If lifecycle hooks are ever needed, migrate to the getter pattern.
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
      {
        id: 'scan_code',
        kind: EXTENSION_KIND_TOOL,
        priority: 0,
        payload: tool,
      },
    ],
  };
}

export function createExtensionPack(context: ExtensionPackContext): ExtensionPack {
  return createCodeSafetyPack(context.options as CodeSafetyPackOptions);
}
```

No `onActivate`/`onDeactivate` lifecycle needed — pure regex, no shared services, no model loading, no per-session state that survives pack reload.

**Descriptors:**

| ID                      | Kind        | Priority | canSanitize | Purpose                        |
| ----------------------- | ----------- | -------- | ----------- | ------------------------------ |
| `code-safety-guardrail` | `guardrail` | 4        | false       | Automatic code safety scanning |
| `scan_code`             | `tool`      | 0        | —           | On-demand code scanning        |

---

### 8. Memory Impact

| Component                            | Memory                 | When             |
| ------------------------------------ | ---------------------- | ---------------- |
| Default rules (~25 compiled regexes) | ~10KB                  | Pack load        |
| Per-stream fence buffer              | ~1KB per active stream | First TEXT_DELTA |
| **Total (100 streams)**              | **~110KB**             | —                |

Negligible compared to PII (~115MB), ML classifiers (~98MB), and topicality (~1.7MB).

---

### 9. Graceful Degradation

| Condition                             | Behavior                                                |
| ------------------------------------- | ------------------------------------------------------- |
| No rules configured (empty set)       | Guardrail is a no-op, returns null                      |
| Regex throws (malformed custom rule)  | That rule skipped, warning logged, other rules continue |
| No code fences in text                | Zero-cost passthrough (no scanning performed)           |
| Unknown language                      | Only universal `'*'` patterns applied                   |
| Tool call for non-code-executing tool | Skipped (not in codeExecutingTools list)                |

---

## Testing Strategy

1. **CodeFenceExtractor tests** — extract from single/multiple fences, language tags, no-tag, nested fences, incomplete fences, inline code, language detection heuristics
2. **DefaultRules tests** — each rule category has at least one positive match and one negative (safe code). Test all ~25 rules individually.
3. **CodeSafetyScanner tests** — scan markdown with code blocks, language-aware pattern selection, custom rules, disabled rules, severity-to-action mapping, empty input
4. **CodeSafetyGuardrail tests** — output scanning (TEXT_DELTA accumulation + fence boundary), tool call scanning (TOOL_CALL_REQUEST), scope filtering, reason codes, stale cleanup
5. **ScanCodeTool tests** — tool schema, execute with violations, execute with safe code
6. **Pack factory tests** — descriptor IDs/kinds, custom rules, disabled rules, createExtensionPack bridge

---

## SKILL.md

```yaml
---
name: code-safety
version: '1.0.0'
description: Scan LLM-generated code for security vulnerabilities using language-aware pattern rules
author: Frame.dev
namespace: wunderland
category: security
tags: [guardrails, code-safety, security, injection, xss, owasp, static-analysis]
requires_tools: [scan_code]
metadata:
  agentos:
    emoji: "\U0001F6E1"
---

# Code Safety Scanner

A guardrail automatically scans code in your responses for security
vulnerabilities. You also have a tool for on-demand code scanning.

## When to Use scan_code

- Before writing code to files via write_file or create_file
- Before executing code via shell_execute
- When reviewing user-submitted code for security issues
- Before presenting code examples that handle user input

## What It Detects

- **Injection**: eval(), exec(), os.system(), command injection
- **SQL Injection**: string concatenation in SQL queries
- **XSS**: innerHTML, document.write, dangerouslySetInnerHTML
- **Path Traversal**: unsanitized ../ in file paths
- **Hardcoded Secrets**: API keys, passwords, tokens in code
- **Weak Crypto**: MD5/SHA1 for passwords, Math.random for security
- **Insecure Deserialization**: pickle.loads, yaml.load without SafeLoader
- **SSRF**: unvalidated URL construction from user input

## Constraints

- Regex-based detection — may have false positives on safe code patterns
- Language detection from code fence tags or heuristics
- Does not perform deep AST analysis
```

---

## Open Questions (Deferred)

1. Should the scanner support **auto-fix suggestions** (e.g., "use parameterized queries instead of string concatenation")? Deferred — would add significant complexity and overlap with LLM-based code review.
2. Should there be a **severity threshold** below which violations are silently ignored (not even logged)? Deferred — all severities are reported, consumers can filter.
3. Should **tree-sitter AST analysis** be added as an optional `ICodeSafetyRule` implementation for deeper analysis? Deferred — regex covers 90%+ of LLM-generated patterns. Add if false negative rate proves too high.

---

## Recommended Implementation Sequence

1. **Types** — `types.ts` with all interfaces, categories, config
2. **CodeFenceExtractor** — fence extraction + language detection
3. **DefaultRules** — ~25 rules organized by category
4. **CodeSafetyScanner** — core scanning engine
5. **CodeSafetyGuardrail** — IGuardrailService impl with fence-boundary buffering + tool call scanning
6. **ScanCodeTool** — ITool for on-demand scanning
7. **Pack factory** — `createCodeSafetyPack()`, barrel exports, package.json exports
8. **SKILL.md + registry**
9. **Verification** — full test suite, push
