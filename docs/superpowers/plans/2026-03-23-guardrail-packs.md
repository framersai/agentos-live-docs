# Guardrail Extension Packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing guardrail implementations from `agentos-extensions/registry/curated/safety/` into the standalone npm packages, publish them, and add sentence boundary buffering.

**Architecture:** The guardrail implementations already exist in the agentos-extensions monorepo (`registry/curated/safety/{pii-redaction,grounding-guard,code-safety}/`). The standalone npm packages (`agentos-ext-pii-redaction`, etc.) need their `src/` populated with re-exports or copies from these implementations. For packs without existing implementations (`ml-classifiers`, `topicality`), we build them following the established pattern.

**Tech Stack:** Existing IGuardrailService interface, ExtensionPack factory pattern, `@huggingface/transformers` (optional), vitest.

---

## File Structure

| Action  | Package                        | What                                                                              |
| ------- | ------------------------------ | --------------------------------------------------------------------------------- |
| Wire    | `agentos-ext-pii-redaction`    | Copy/re-export from `agentos-extensions/registry/curated/safety/pii-redaction/`   |
| Wire    | `agentos-ext-code-safety`      | Copy/re-export from `agentos-extensions/registry/curated/safety/code-safety/`     |
| Wire    | `agentos-ext-grounding-guard`  | Copy/re-export from `agentos-extensions/registry/curated/safety/grounding-guard/` |
| Build   | `agentos-ext-ml-classifiers`   | New implementation (toxicity + injection ONNX/LLM)                                |
| Build   | `agentos-ext-topicality`       | New implementation (embedding-based topic enforcement)                            |
| Enhance | `agentos/src/core/guardrails/` | Add SentenceBoundaryBuffer                                                        |

---

### Task 1: Wire PII Redaction Pack

**Files:**

- Source: `packages/agentos-extensions/registry/curated/safety/pii-redaction/src/`
- Target: `packages/agentos-ext-pii-redaction/src/`

- [ ] **Step 1: Copy implementation files from agentos-extensions to standalone package**

Copy all `.ts` files from `packages/agentos-extensions/registry/curated/safety/pii-redaction/src/` to `packages/agentos-ext-pii-redaction/src/`. This includes:

- `index.ts` (factory + createExtensionPack bridge)
- `types.ts`
- `PiiRedactionGuardrail.ts`
- `PiiDetectionPipeline.ts`
- `RedactionEngine.ts`
- `tools/PiiScanTool.ts`
- `tools/PiiRedactTool.ts`

Verify imports resolve correctly against `@framers/agentos` peer dep.

- [ ] **Step 2: Update package.json**

Ensure `packages/agentos-ext-pii-redaction/package.json` has:

- `"main": "./dist/index.js"`
- `"types": "./dist/index.d.ts"`
- `"type": "module"`
- `"peerDependencies": { "@framers/agentos": ">=0.1.0" }`
- `"scripts": { "build": "tsc" }`

- [ ] **Step 3: Commit**

```bash
cd packages/agentos-ext-pii-redaction
git add src/ package.json
git commit -m "feat: wire PII redaction guardrail from agentos-extensions"
```

---

### Task 2: Wire Code Safety Pack

Same pattern as Task 1.

- [ ] **Step 1: Copy from `agentos-extensions/registry/curated/safety/code-safety/src/` to `packages/agentos-ext-code-safety/src/`**

If `packages/agentos-ext-code-safety/` doesn't exist as a standalone package, create it with package.json + tsconfig.json.

- [ ] **Step 2: Commit**

```bash
git add packages/agentos-ext-code-safety/
git commit -m "feat: wire code safety guardrail from agentos-extensions"
```

---

### Task 3: Wire Grounding Guard Pack

Same pattern.

- [ ] **Step 1: Copy from `agentos-extensions/registry/curated/safety/grounding-guard/src/` to `packages/agentos-ext-grounding-guard/src/`**

- [ ] **Step 2: Commit**

```bash
git add packages/agentos-ext-grounding-guard/
git commit -m "feat: wire grounding guard from agentos-extensions"
```

---

### Task 4: Build ML Classifiers Pack

This pack doesn't have an existing implementation. Build it from scratch following the established pattern.

**Files:**

- Create: `packages/agentos-ext-ml-classifiers/src/index.ts`
- Create: `packages/agentos-ext-ml-classifiers/src/MLClassifierGuardrail.ts`
- Create: `packages/agentos-ext-ml-classifiers/src/onnx-classifier.ts`
- Create: `packages/agentos-ext-ml-classifiers/src/llm-classifier.ts`
- Create: `packages/agentos-ext-ml-classifiers/src/types.ts`
- Create: `packages/agentos-ext-ml-classifiers/src/tools/ClassifyContentTool.ts`
- Create: `packages/agentos-ext-ml-classifiers/test/ml-classifiers.spec.ts`
- Create: `packages/agentos-ext-ml-classifiers/package.json`
- Create: `packages/agentos-ext-ml-classifiers/tsconfig.json`

- [ ] **Step 1: Create package scaffold**

```json
{
  "name": "@framers/agentos-ext-ml-classifiers",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "peerDependencies": { "@framers/agentos": ">=0.1.0" },
  "optionalDependencies": { "@huggingface/transformers": "^3.0.0" }
}
```

- [ ] **Step 2: Write MLClassifierGuardrail**

Implements `IGuardrailService`:

- `config: { canSanitize: false, evaluateStreamingChunks: false }`
- `evaluateInput()`: classify user input for toxicity/injection
- `evaluateOutput()`: classify on FINAL_RESPONSE only
- Primary: `@huggingface/transformers` ONNX model (lazy-loaded)
- Fallback: LLM-as-judge via `llmInvoker`
- `FLAG` if confidence > 0.5, `BLOCK` if > 0.8
- Categories: `toxic`, `injection`, `nsfw`, `threat`

- [ ] **Step 3: Write ClassifyContentTool**

ITool that exposes classification as an agent tool:

- Name: `classify_content`
- Input: `{ text: string }`
- Output: `{ categories: { name: string, confidence: number }[], flagged: boolean }`

- [ ] **Step 4: Write tests**

- Known toxic input → FLAG/BLOCK
- Clean input → ALLOW
- Fallback behavior when ONNX unavailable

- [ ] **Step 5: Commit**

```bash
git add packages/agentos-ext-ml-classifiers/
git commit -m "feat: implement ML classifiers guardrail pack (toxicity + injection)"
```

---

### Task 5: Build Topicality Pack

New implementation.

**Files:**

- Create: `packages/agentos-ext-topicality/src/index.ts`
- Create: `packages/agentos-ext-topicality/src/TopicalityGuardrail.ts`
- Create: `packages/agentos-ext-topicality/src/embeddings.ts`
- Create: `packages/agentos-ext-topicality/src/types.ts`
- Create: `packages/agentos-ext-topicality/src/tools/CheckTopicTool.ts`
- Create: `packages/agentos-ext-topicality/test/topicality.spec.ts`
- Create: `packages/agentos-ext-topicality/package.json`
- Create: `packages/agentos-ext-topicality/tsconfig.json`

- [ ] **Step 1: Create package scaffold** (same pattern as Task 4)

- [ ] **Step 2: Write TopicalityGuardrail**

- `config: { canSanitize: false, evaluateStreamingChunks: false }`
- Input evaluation only (keeps agent on-topic)
- Options: `allowedTopics: string[]`, `blockedTopics: string[]`, `minSimilarity`, `maxBlockedSimilarity`
- Primary: embed input + topic strings, compute cosine similarity
- Fallback: LLM-as-judge ("Is this about [topics]?")
- `FLAG` if off-topic, `BLOCK` if matches blocked topic

- [ ] **Step 3: Write CheckTopicTool**

- Name: `check_topic`
- Input: `{ text: string }`
- Output: `{ onTopic: boolean, confidence: number, detectedTopic: string }`

- [ ] **Step 4: Write tests + commit**

```bash
git add packages/agentos-ext-topicality/
git commit -m "feat: implement topicality guardrail pack (embedding-based topic enforcement)"
```

---

### Task 6: Sentence Boundary Buffering

**Files:**

- Create: `packages/agentos/src/core/guardrails/SentenceBoundaryBuffer.ts`
- Create: `packages/agentos/tests/core/guardrails/SentenceBoundaryBuffer.spec.ts`
- Modify: `packages/agentos/src/core/guardrails/IGuardrailService.ts` — add `streamingMode` to config
- Modify: `packages/agentos/src/core/guardrails/ParallelGuardrailDispatcher.ts` — integrate buffer

- [ ] **Step 1: Write SentenceBoundaryBuffer**

```typescript
export class SentenceBoundaryBuffer {
  private buffer = '';
  private previousSentence = '';

  push(chunk: string): string | null {
    this.buffer += chunk;
    const idx = this.findBoundary(this.buffer);
    if (idx === -1) return null;
    const sentence = this.buffer.slice(0, idx + 1).trim();
    this.buffer = this.buffer.slice(idx + 1);
    const payload = this.previousSentence ? `${this.previousSentence} ${sentence}` : sentence;
    this.previousSentence = sentence;
    return payload;
  }

  flush(): string | null {
    if (!this.buffer.trim()) return null;
    const result = this.previousSentence
      ? `${this.previousSentence} ${this.buffer.trim()}`
      : this.buffer.trim();
    this.buffer = '';
    return result;
  }

  private findBoundary(text: string): number {
    for (let i = text.length - 1; i >= 0; i--) {
      if ('.?!\n'.includes(text[i])) return i;
    }
    return -1;
  }
}
```

- [ ] **Step 2: Add `streamingMode` to GuardrailConfig**

```typescript
streamingMode?: 'per-chunk' | 'sentence-buffered'; // default: 'per-chunk'
```

- [ ] **Step 3: Integrate into ParallelGuardrailDispatcher streaming evaluation**

When a guardrail has `streamingMode: 'sentence-buffered'`, use a per-guardrail `SentenceBoundaryBuffer`. Only call `evaluateOutput` when the buffer produces a complete sentence.

- [ ] **Step 4: Tests**

- Buffer accumulates chunks until sentence boundary
- Flush returns remaining content
- Overlapping context includes previous sentence
- Integration with dispatcher

- [ ] **Step 5: Commit**

```bash
cd packages/agentos
git add src/core/guardrails/SentenceBoundaryBuffer.ts tests/core/guardrails/SentenceBoundaryBuffer.spec.ts src/core/guardrails/IGuardrailService.ts src/core/guardrails/ParallelGuardrailDispatcher.ts
git commit -m "feat(guardrails): add sentence boundary buffering for streaming evaluation"
```

---

### Task 7: Push All Packages

- [ ] **Step 1: Push agentos-ext-pii-redaction**
- [ ] **Step 2: Push agentos-ext-code-safety**
- [ ] **Step 3: Push agentos-ext-grounding-guard**
- [ ] **Step 4: Push agentos-ext-ml-classifiers** (if new repo needed, create via GitHub)
- [ ] **Step 5: Push agentos-ext-topicality** (if new repo needed, create via GitHub)
- [ ] **Step 6: Push agentos (sentence buffering)**
- [ ] **Step 7: Update parent repo submodule pointers**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/
git commit -m "feat: implement all 5 guardrail packs + sentence boundary buffering"
git push
```
