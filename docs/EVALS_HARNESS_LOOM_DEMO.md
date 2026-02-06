# Full-Stack Eval Harness: Loom Demo Script

> **Duration target:** 6-8 minutes
> **App URLs:** Frontend `http://localhost:3020` | Backend `http://localhost:3021/api`
> **Pre-flight:** Both `evals-backend` and `evals-frontend` PM2 processes running, LLM configured in Settings

---

## Pre-Demo Checklist

Before recording:

1. Hard-refresh the browser (`Cmd+Shift+R`) to clear stale chunks
2. Verify the app loads at `http://localhost:3020`
3. Confirm LLM is configured: go to **Settings** (About dropdown > Settings) and verify the provider/model/API key are set and the connection test passes
4. Delete any old experiments: **Experiments** tab > **Clear All** (if you want a clean slate)
5. Set browser to a clean window, no other tabs visible
6. Dark mode recommended (click the moon/sun icon in the top-right)

---

## Demo Flow (~6-8 min)

### ACT 1: Introduction & Navigation (30 sec)

**Narration:**

> "This is the Full-Stack Eval Harness — a lightweight tool for testing and comparing LLM prompts against datasets with configurable graders. It supports both prompt evaluation and RAG evaluation out of the box — any dataset with a context column enables RAGAS-style metrics like faithfulness and answer relevance. It's built with Next.js and NestJS, uses SQLite for runtime data, and stores all definitions — datasets, prompts, and graders — as files on disk."

**UI Steps:**

1. Start on the landing page (which redirects to Datasets)
2. Briefly point to the top navigation: **About**, **Datasets**, **Graders**, **Candidates**, **Experiments**
3. Click the **About** dropdown to show the sub-links: About page, API Docs (Swagger), Repository link, Settings

---

### ACT 2: Datasets Tab (1 min)

**Narration:**

> "Let's start with Datasets. Each dataset is a CSV file loaded from disk. Every row is a record — or test case — with an input, expected output, optional context, and optional metadata. The context column is key for RAG evaluation — it holds the retrieved documents or passages that get passed to faithfulness and context graders. Any dataset with a context column automatically enables RAG metrics."

**UI Steps:**

1. Click **Datasets** tab
2. Point out the dataset cards — you should see 4 datasets:
   - **Q&A with Context** (8 records) — question-answer pairs with supporting context passages
   - **Research Paper Extraction** (5 records) — real research paper abstracts
   - **Summarization Dataset** (6 records) — news articles, research findings, technical content
   - **Text Rewriting Dataset** (6 records) — sentences to rewrite in different styles
3. Click into **Q&A with Context** to show the detail page
4. Point out: the editable table of records (input, expected output, context, metadata columns), the record count, the file path shown at top, the "Save to Disk" button, the CSV/JSON export buttons
5. Mention: "You can edit records directly in the browser and save back to the CSV file, or upload new CSVs."
6. Click the expandable "How datasets work" guide on the list page if time permits
7. Navigate back to the Datasets list

**Quick Generate Demo (optional, 30 sec):**

> "You can also generate synthetic test data with AI."

1. Click **Generate** button
2. Fill in: Name = "Demo Physics", Topic = "Basic physics concepts", Style = Q&A, Count = 3
3. Click **Generate** — the AI creates test cases and saves them as a new CSV
4. Show the new dataset appears in the list

---

### ACT 3: Graders Tab (1 min)

**Narration:**

> "Graders define how we score LLM outputs. We ship 5 graders covering the key evaluation dimensions — but the system supports many more. The promptfoo grader type alone gives you access to 20+ assertion types including all four RAGAS metrics, ROUGE, BLEU, and safety checks. To add one, you just create a YAML file. We ship Faithfulness for hallucination detection, LLM Judge for helpfulness, Semantic Similarity for answer closeness, and two extraction graders for JSON tasks."

**UI Steps:**

1. Click **Graders** tab
2. Point out the grader cards — you should see 5 graders:
   - **Faithfulness** — promptfoo-backed, checks that outputs are grounded in provided context
   - **LLM Judge (Helpful)** — built-in LLM judge scoring overall response quality
   - **Semantic Similarity** — built-in embedding-based similarity to expected output
   - **Extraction Schema** — built-in JSON schema validation for structured outputs
   - **Extraction Completeness** — built-in LLM judge checking all fields are populated
3. Click into one grader (e.g., **Faithfulness**) to show the detail page
4. Point out: the YAML preview showing the full grader config, the type badge, threshold settings, description, inspiration/reference links
5. Mention: "Each grader is a YAML file on disk. You can edit thresholds and config here, or edit the YAML directly. Additional graders like Answer Relevance or Context Recall can be added by creating new YAML files with promptfoo assertion types."
6. Navigate back to the Graders list
7. Optionally show "Load Preset" to demonstrate seeding the starter grader set

---

### ACT 4: Candidates Tab — Prompt Families & Variants (1.5 min)

**Narration:**

> "Candidates are the prompt configurations we want to evaluate. Each one is a markdown file with YAML frontmatter defining the system prompt, model settings, and which graders and datasets it's designed for. The key feature here is prompt variants — clones of a parent prompt with tweaked instructions for A/B testing."

**UI Steps:**

1. Click **Candidates** tab
2. Point out the family groupings:
   - **Text Summarizer** (parent) with 3 variants: Concise, Bullet-Point, Detailed
   - **Text Rewriter** (parent) with 2 variants: Formal, Casual
   - **Full Structured Analyst** (parent) with 1 variant: Citation-Focused
   - **Strict JSON Extractor** (parent) with 1 variant: Loose
   - **Q&A Assistant** — standalone, no variants yet (we'll use this for AI generation)
3. Click into **Text Summarizer** to show the detail page
4. Point out: the system prompt editor, frontmatter preview, recommended graders with weights, recommended datasets, grader rationale, variant list at the bottom
5. Mention: "Each prompt declares which graders matter most with weights — for example, this summarizer weighs Faithfulness at 40%, Semantic Similarity at 30%, Helpfulness at 30%. The experiment uses these weights to compute a weighted score."

---

### ACT 5: AI Variant Generation (1 min)

**Narration:**

> "Now here's a powerful feature — we can use AI to automatically generate prompt variants. Let's take the Q&A Assistant, which has no variants yet, and generate some."

**UI Steps:**

1. Still on the Candidates tab, find the **Q&A Assistant** card
2. Click the **+ Generate Variants** button (the wand icon)
3. In the generation modal:
   - Count: 2 or 3
   - Optionally add custom instructions like "Create one concise variant and one detailed variant"
4. Click **Generate** — the AI creates new variant markdown files
5. Show the new variants appear under the Q&A Assistant family
6. Click into one of the generated variants to show how the AI modified the system prompt

---

### ACT 6: Running an Experiment (2 min) — THE MAIN EVENT

**Narration:**

> "Now let's run an actual experiment. This is where everything comes together — dataset, candidates, and graders."

**UI Steps:**

1. Click **Experiments** tab
2. Optionally expand the "Quick start guide" to briefly show the 4-step walkthrough
3. **Select Dataset:** Choose **Summarization Dataset** (6 records)
   - Point out: candidates auto-select when you pick a dataset — the ones designed for this dataset light up with a star
4. **Select Graders:** Toggle on **Faithfulness** and **Semantic Similarity** (and optionally **LLM Judge Helpful**)
5. **Select Candidates:** The summarizer family should be auto-selected. Point out:
   - The family grouping with BASE tag and v:concise, v:bullets, v:verbose labels
   - "Select all" for the family, or toggle individual members
   - The estimated evaluations count at the bottom (e.g., "72 evaluations = 6 records x 4 candidates x 3 graders")
6. **Click "Run Experiment"**
7. Show the **real-time progress bar** as results stream in via SSE
8. When complete, show the **results table**:
   - Each row is a test case input (truncated)
   - Columns are grouped by candidate, sub-columns by grader
   - Each cell shows **Pass/Fail badge** — hover over any cell to see the score percentage, reason text, and generated output preview
9. Point out the **candidate score summary** above the table:
   - Each candidate shows Avg score, Weighted score (if weights differ), and pass count
   - The **Best** badge on the top performer
   - Mention: "The weighted score uses each prompt's own grader weight configuration, so you can see what actually matters for each prompt style."

---

### ACT 7: Candidate Comparison (30 sec)

**Narration:**

> "We can also do a structured comparison between any two candidates."

**UI Steps:**

1. In the results view, find the **Baseline / Challenger** dropdowns
2. Select e.g., **Text Summarizer** (base) as Baseline and **Concise Summarizer** as Challenger
3. Click **Compare**
4. Show the comparison table:
   - Pass rates for each, delta percentage
   - Per-test-case breakdown with Improved/Regressed/Same badges
   - "This tells us exactly which test cases improved or regressed when we switched from the base prompt to the concise variant."

---

### ACT 8: Experiment Management & Export (30 sec)

**Narration:**

> "All experiments are saved with timestamps. You can export individual results or everything at once."

**UI Steps:**

1. Scroll down to **Past Experiments** section
2. Point out: timestamps, status badges, per-experiment CSV/JSON export icons, delete buttons
3. Click **Export All CSV** — downloads a consolidated CSV of all experiments
4. Mention: "You can also access the Swagger API docs for programmatic access" (point to About > API Docs)

---

### ACT 9: Settings & Wrap-up (30 sec)

**Narration:**

> "Finally, Settings lets you configure which LLM provider to use — OpenAI, Anthropic, or Ollama for local models. All graders that need an LLM use this configuration."

**UI Steps:**

1. Click About dropdown > **Settings**
2. Show the provider dropdown, model field, API key field
3. Point out the **Test Connection** button
4. Mention: "Settings are stored in SQLite, so they persist across restarts. All definition files — datasets, prompts, graders — live on disk as CSV, Markdown, and YAML files."

**Closing:**

> "That's the Full-Stack Eval Harness — file-based definitions, real-time experiment streaming, weighted scoring, prompt variant A/B testing, AI-powered generation, and built-in RAG evaluation support. Everything runs locally with a single backend and frontend."

---

## Key Talking Points to Weave In

- **File-based architecture:** Datasets (CSV, flat), Prompts (Markdown, folder-per-family), Graders (YAML, flat) — all editable on disk or via the UI. Prompts use `base.md` for parents and variant filenames derive IDs automatically.
- **Weighted scoring:** Each prompt declares which graders matter most with rationale
- **Prompt variants for A/B testing:** Clone and tweak prompts, run them side-by-side
- **AI generation:** Generate synthetic datasets and prompt variants using the configured LLM
- **RAG evaluation built-in:** Add a `context` column to any CSV dataset and it becomes a RAG eval. Context flows end-to-end from dataset through candidates to graders. Faithfulness ships today; the other three RAGAS metrics (Answer Relevance, Context Relevance, Context Recall) are one YAML file each — no code changes.
- **Promptfoo integration:** MIT-licensed assertion engine under the hood. One grader type (`promptfoo`) gives access to 20+ assertions — RAGAS metrics, ROUGE/BLEU, LLM rubrics, safety checks. All configurable via YAML.
- **Two-layer extensibility:** Layer 1 = drop a YAML file for anything promptfoo supports (no code). Layer 2 = extend `BaseGrader` + register in factory for fully custom metrics. Plus: `IDbAdapter` for swapping databases, `LlmService` for adding LLM providers.
- **Real-time streaming:** SSE for live experiment progress
- **Export everything:** CSV and JSON exports for individual experiments and consolidated

---

## Troubleshooting During Demo

| Issue                            | Fix                                                            |
| -------------------------------- | -------------------------------------------------------------- |
| Page shows blank/404 chunk error | Hard refresh: `Cmd+Shift+R`                                    |
| "No graders available"           | Go to Graders tab > Load Preset > seed graders                 |
| Experiment fails with FK error   | Delete `backend/data/evals.sqlite` and restart backend         |
| LLM calls fail                   | Check Settings > Test Connection, verify API key               |
| Slow responses                   | Ollama local models are slower; use OpenAI/Anthropic for demos |

---

## Architecture Quick Reference

```
packages/fullstack-evals-harness-example/
  backend/                    # NestJS (port 3021)
    datasets/*.csv            # Dataset files (flat)
    prompts/                  # Candidate prompt files (folder-per-family)
      summarizer/             #   base.md + concise.md, bullets.md, verbose.md
      text-rewriter/          #   base.md + formal.md, casual.md
      analyst/                #   base.md + citations.md
      json-extractor/         #   base.md + loose.md
      qa-assistant/           #   base.md (standalone, no variants)
    graders/*.yaml            # Grader definition files (flat)
    data/evals.sqlite         # Runtime DB (experiments, results, settings)
    src/
      candidates/             # Prompt loading, running, variant generation
      datasets/               # CSV loading, export
      graders/                # YAML loading, grading engine
      experiments/            # Experiment orchestration, SSE streaming
      settings/               # LLM provider config
      database/               # SQLite adapter (Drizzle ORM)
  frontend/                   # Next.js 15 (port 3020)
    src/app/
      datasets/               # Dataset list & detail pages
      graders/                # Grader list & detail pages
      candidates/             # Candidate list & detail pages
      experiments/            # Experiment runner & results
      settings/               # LLM settings page
      about/                  # Documentation & FAQ
```

---

## RAG Evaluation: How It Works & How to Extend It

### The Big Picture

This harness evaluates **two things**: (1) how good your prompts are, and (2) how good your RAG pipeline's outputs are. Both use the same experiment flow — the difference is whether your dataset includes a **context column**.

- **Prompt evaluation** = "Given this input, does the LLM produce a good output?" (no context needed)
- **RAG evaluation** = "Given this input _and these retrieved documents_, does the LLM produce a faithful, relevant output?" (context column required)

The context column in your CSV dataset represents the **retrieved documents** from your RAG pipeline. When it's present, graders like Faithfulness can check whether the LLM's answer actually comes from those documents or if it's hallucinating.

### What Ships Today

We ship **one RAG-specific grader** out of the box: **Faithfulness** (`backend/graders/faithfulness.yaml`). It uses [promptfoo](https://promptfoo.dev)'s `context-faithfulness` assertion under the hood. This is the RAGAS Faithfulness metric — it extracts atomic claims from the LLM output and checks whether each claim is supported by the provided context. If the LLM makes something up that isn't in the context, faithfulness catches it.

The **Q&A with Context** dataset ships with context passages in every row, so you can run Faithfulness grading immediately.

### What You Can Add Without Writing Code

The `promptfoo` grader type is a **pass-through to promptfoo's assertion engine** — it supports 20+ assertion types. To add any of them, you just drop a new YAML file in `backend/graders/`. No code changes, no deploys. The backend auto-loads grader YAMLs from disk on startup.

**The four RAGAS metrics** (the standard RAG evaluation framework from [Es et al., 2023](https://arxiv.org/abs/2309.15217)):

| Metric                | Assertion type         | What it answers                                                                  | We ship it?               |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------- | ------------------------- |
| **Faithfulness**      | `context-faithfulness` | "Is the answer grounded in the retrieved context, or is it hallucinating?"       | Yes — `faithfulness.yaml` |
| **Answer Relevance**  | `answer-relevance`     | "Does the answer actually address what was asked?"                               | Add via YAML              |
| **Context Relevance** | `context-relevance`    | "Is the retrieved context relevant to the question?" (evaluates your retriever)  | Add via YAML              |
| **Context Recall**    | `context-recall`       | "Does the retrieved context contain the information needed to answer correctly?" | Add via YAML              |

**To add any of these**, create a YAML file like this — e.g. `backend/graders/answer-relevance.yaml`:

```yaml
name: 'Answer Relevance'
description: 'Checks that the response directly addresses the input query'
type: promptfoo
config:
  assertion: answer-relevance
  threshold: 0.7
inspiration: 'RAGAS framework (Es et al., 2023)'
reference: 'https://arxiv.org/abs/2309.15217'
```

Restart the backend (or it picks it up on next load) and it appears in the UI.

**Beyond RAGAS**, promptfoo also gives you:

| Category          | Assertions                                                    | What they're for                                            |
| ----------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| **LLM-as-Judge**  | `llm-rubric`, `g-eval`, `factuality`, `model-graded-closedqa` | Custom rubric scoring, chain-of-thought eval, fact-checking |
| **Semantic**      | `similar`, `classifier`                                       | Embedding similarity, ML classification                     |
| **NLP Metrics**   | `rouge-n`, `bleu`, `levenshtein`                              | Traditional text overlap scores                             |
| **Deterministic** | `equals`, `contains`, `regex`, `is-json`                      | Exact checks, format validation                             |
| **Safety**        | `is-refusal`, `guardrails`                                    | Refusal detection, harmful content                          |

All of these work the same way — `type: promptfoo` + `config.assertion: <type>` in a YAML file.

### How Context Flows Through the System

Understanding this helps if you want to extend or debug. The short version: **context travels with each test case from CSV all the way through to the grader**.

```
1. CSV file has a "context" column
   ↓
2. DatasetLoaderService parses it into LoadedTestCase.context
   ↓
3. CandidateRunnerService receives it — prompts can use {{context}} in their template
   ↓
4. ExperimentsService builds EvalInput { input, output, expected, context }
   ↓
5. Each grader's evaluate() receives the full EvalInput including context
   ↓
6. PromptfooGrader passes context to promptfoo as vars.context
   ↓
7. Promptfoo runs the assertion (e.g., faithfulness) against that context
```

**The key insight:** The harness doesn't do retrieval itself — it evaluates the _results_ of retrieval. You bring your own retrieved context in the CSV, and the graders score how well the LLM used it. This means you can evaluate any RAG pipeline: just export your pipeline's (question, context, answer) triples into a CSV and run experiments.

### The Grader System: Two Layers

There are **two ways** to add graders, depending on what you need:

**Layer 1: YAML-only (no code)** — For anything promptfoo already supports. Create a `.yaml` file in `backend/graders/` with `type: promptfoo` and pick an assertion type from the table above. This covers all RAGAS metrics, NLP scores, LLM rubrics, and safety checks.

**Layer 2: Custom code** — For metrics that don't exist in promptfoo. The grader system is built on an abstract class pattern:

- `BaseGrader` (in `backend/src/eval-engine/base.grader.ts`) — abstract class every grader extends. Defines the `evaluate(evalInput)` interface where `evalInput` includes `{ input, output, expected, context }`.
- `createGrader()` factory (in `backend/src/eval-engine/index.ts`) — switch statement that maps grader types to implementations. Add your custom type here.
- `GraderType` union (in `backend/src/graders/grader-loader.service.ts`) — the type enum: `exact-match | llm-judge | semantic-similarity | contains | regex | json-schema | promptfoo`. Extend this for new types.
- `LlmService` (in `backend/src/llm/llm.service.ts`) — injected into graders that need LLM calls or embeddings. Supports OpenAI, Anthropic, Ollama.

**Example: writing a custom retrieval quality grader:**

```typescript
// 1. backend/src/eval-engine/retrieval-quality.grader.ts
export class RetrievalQualityGrader extends BaseGrader {
  async evaluate(evalInput: EvalInput): Promise<GraderResult> {
    const { input, output, expected, context } = evalInput;
    // context = the retrieved documents from your RAG pipeline
    // score how well the retrieval matches the query
  }
  get type() { return 'retrieval-quality'; }
}

// 2. Register in backend/src/eval-engine/index.ts
case 'retrieval-quality':
  return new RetrievalQualityGrader(config, llmService);

// 3. Create backend/graders/retrieval-quality.yaml
// name: "Retrieval Quality"
// type: retrieval-quality
// config: { minRelevantChunks: 2 }
```

### Other Extension Points

- **Database adapter** (`backend/src/database/interfaces/db-adapter.interface.ts`): The `IDbAdapter` interface abstracts all DB operations. Currently uses SQLite via Drizzle ORM. Implement the interface for Postgres or MySQL to swap backends.
- **LLM provider** (`backend/src/llm/llm.service.ts`): All graders get LLM access through this service. It reads provider config from Settings (stored in SQLite). Supports `complete()` for text and `embed()` for embeddings.
- **Candidate runners** (`backend/src/candidates/candidate-runner.service.ts`): Currently supports `llm_prompt` (call an LLM) and `http_endpoint` (call an external API). Add new runner types to evaluate custom pipelines.

### Key Files Reference

| File                                                      | Role                                                                 |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `backend/graders/faithfulness.yaml`                       | The shipped RAG grader — promptfoo context-faithfulness              |
| `backend/prompts/{family}/base.md`                        | Parent prompts — ID derived from folder name                         |
| `backend/src/eval-engine/promptfoo.grader.ts`             | Wraps promptfoo's assertion engine, passes context as `vars.context` |
| `backend/src/eval-engine/base.grader.ts`                  | `BaseGrader` abstract class — extend this for custom graders         |
| `backend/src/eval-engine/index.ts`                        | `createGrader()` factory — register new grader types here            |
| `backend/src/graders/grader-loader.service.ts`            | Loads YAML files from `backend/graders/`, defines `GraderType`       |
| `backend/src/experiments/experiments.service.ts`          | Orchestrates the eval loop, builds `EvalInput` with context          |
| `backend/src/candidates/candidate-runner.service.ts`      | Runs candidates, passes context via `{{context}}` template           |
| `backend/src/datasets/dataset-loader.service.ts`          | Parses CSV `context` column                                          |
| `backend/src/database/schema.ts`                          | `test_cases` table schema with `context` column                      |
| `backend/src/database/interfaces/db-adapter.interface.ts` | `IDbAdapter` — database abstraction layer                            |
| `backend/src/llm/llm.service.ts`                          | Multi-provider LLM service (OpenAI, Anthropic, Ollama)               |

### Summary: What's Ready vs. What's One Step Away

| Capability                             | Status                      | What to do                                         |
| -------------------------------------- | --------------------------- | -------------------------------------------------- |
| Faithfulness (hallucination detection) | **Ships today**             | Already in `faithfulness.yaml`                     |
| Answer Relevance                       | **Drop a YAML file**        | `type: promptfoo`, `assertion: answer-relevance`   |
| Context Relevance                      | **Drop a YAML file**        | `type: promptfoo`, `assertion: context-relevance`  |
| Context Recall                         | **Drop a YAML file**        | `type: promptfoo`, `assertion: context-recall`     |
| LLM Rubric (custom criteria)           | **Drop a YAML file**        | `type: promptfoo`, `assertion: llm-rubric`         |
| ROUGE / BLEU / Levenshtein             | **Drop a YAML file**        | `type: promptfoo`, `assertion: rouge-n` etc.       |
| Custom retrieval scorer                | **Write one class**         | Extend `BaseGrader`, register in factory, add YAML |
| Custom embedding model                 | **Edit one service**        | Modify `LlmService.embed()`                        |
| Postgres / MySQL                       | **Implement one interface** | Implement `IDbAdapter` for target DB               |
