# Fullstack Evals Harness

A lightweight evaluation harness for testing AI outputs. Run datasets through candidates, grade the results, compare performance.

**Frontend**: http://localhost:3020 | **Backend**: http://localhost:3021 | **API Docs**: http://localhost:3021/api/docs

---

## How It Works

Everything flows through a single pipeline:

```
Datasets (test cases)
    ↓
Candidates (produce output for each test case)
    ↓
Graders (evaluate each output)
    ↓
Experiments (orchestrate the full run)
    ↓
Experiment analytics (pass rates, weighted scores, comparisons)
```

Datasets are **CSV files** in `backend/datasets/` — portable, git-trackable, and editable in any spreadsheet app. Candidates are **markdown files** organized in **family folders** under `backend/prompts/` (each folder = one prompt family with a `base.md` parent and variant files). Graders are **YAML files** in `backend/graders/`. All three are file-based: editable on disk, in the UI, or via API — changes write back to disk immediately.

**SQLite stores only runtime data**: experiment runs, results, and settings. You can safely delete the database and start fresh — all definitions reload from disk automatically.

### The Core Loop

1. A **Dataset** contains test cases: `{input, expectedOutput, context, metadata}`
2. A **Candidate** is a markdown prompt file in `backend/prompts/` defining how to produce output (LLM prompt or HTTP endpoint)
3. A **Grader** defines how to evaluate: exact match, LLM judge, semantic similarity, faithfulness, etc.
4. An **Experiment** = `dataset × candidates × graders` — runs each test case through each candidate, then grades every output with every grader
5. **Experiment stats** show pass rates, weighted scores, and deltas per grader and per candidate

### Weighted Grader Scoring

Each prompt file specifies recommended graders with weights:

```
recommended_graders: faithfulness:0.4, semantic-similarity:0.3, llm-judge-helpful:0.3
grader_rationale: Faithfulness is highest — responses must stay grounded in context.
```

The experiment stats endpoint computes both `avgScore` (equal-weight) and `weightedScore` (using the prompt's configured weights) per candidate. Without explicit weights, all graders default to `1.0` (equal weighting).

Without candidates, experiments fall back to grading `expectedOutput` directly (useful for testing grader behavior).

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
cd packages/fullstack-evals-harness-example

# Install deps (root + backend + frontend)
npm install
npm --prefix backend install
npm --prefix frontend install

# Dev (runs both services with hot reload)
npm run dev
```

Backend config defaults can come from `backend/.env` (see `backend/.env.example`) or from the Settings UI (`/settings`).

### Production

```bash
# Build both backend and frontend
npm run build-all

# Run both in production mode
npm run start-all
```

Or with PM2:

```bash
npm run build-all
pm2 start dist/src/main.js --name evals-backend --cwd backend
pm2 start "npx next start -p 3020" --name evals-frontend --cwd frontend
```

### All Scripts

| Command                | What it does                    |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Both services, hot reload (dev) |
| `npm run build-all`    | Build backend + frontend        |
| `npm run start-all`    | Both services, production mode  |
| `npm run test`         | Run backend tests               |
| `npm run lint`         | Lint both                       |
| `npm run backend:dev`  | Backend only (dev)              |
| `npm run frontend:dev` | Frontend only (dev)             |

### First Run: Optional Presets

This repo already ships example grader YAML files in `backend/graders/`. If you start from an empty graders directory, you can install a small starter set via presets:

```bash
curl -X POST http://localhost:3021/api/presets/seed
```

Presets are convenience templates. Loading a preset creates a YAML grader file on disk (or returns the existing grader if it already exists).

Datasets are loaded automatically from `backend/datasets/` on startup. Prompts are loaded from `backend/prompts/`. Graders are loaded from `backend/graders/`. Or use the UI to load grader presets individually.

---

## Detailed Usage

### Step 1: Configure LLM Settings

Go to **Settings** tab. Set your LLM provider and API key:

| Setting         | Description                        | Example                      |
| --------------- | ---------------------------------- | ---------------------------- |
| Provider        | `openai`, `anthropic`, or `ollama` | `anthropic`                  |
| Model           | Model ID                           | `claude-sonnet-4-5-20250929` |
| API Key         | Your API key                       | `sk-ant-...`                 |
| Ollama Base URL | Local Ollama endpoint              | `http://localhost:11434`     |
| Temperature     | Sampling temperature (0-2)         | `0.7`                        |
| Max Tokens      | Output length limit                | `1024`                       |

Settings are stored in the database — no `.env` file needed. Changes take effect immediately.

**For local testing without API keys**: Use Ollama with a local model. Set Provider=`ollama`, Base URL=`http://localhost:11434`, Model=`llama3:8b`.

### Step 2: Datasets

Go to **Datasets** tab. Datasets are CSV files in `backend/datasets/`.

**Included examples (see `backend/datasets/`):**

- `context-qa.csv` — Q&A with provided context (for faithfulness testing)
- `research-paper-extraction.csv` — AI paper abstracts for structured JSON extraction
- `summarization.csv` — passages for summarization evaluation
- `text-rewriting.csv` — mixed passages for rewriting evaluation
- `text-rewriting-research.csv` — research paper abstract excerpts for rewriting evaluation (sourced to arXiv)

**CSV format** — 4 columns:

```csv
input,expected_output,context,metadata
"What is 2+2?","4","","{""difficulty"":""easy""}"
```

Additional columns are allowed and will be surfaced as per-row custom fields in the dataset editor.

**Add a dataset:**

- Place a `.csv` file in `backend/datasets/` and click "Reload from Disk"
- Or use "Upload CSV" in the UI to import directly
- Or use "Generate" to create synthetic test cases with an LLM

**Optional sidecar** — `my-dataset.meta.json`:

```json
{ "name": "My Dataset", "description": "Description of the dataset" }
```

Without a sidecar, the name is derived from the filename (hyphens → spaces, title case).

**Export:** Download as JSON or CSV from the dataset detail page.

### Step 3: Create or Load Graders

Go to **Graders** tab. Graders are **YAML files** in `backend/graders/`. All CRUD operations write back to YAML on disk. Quick-load templates are also available under `/api/presets/graders`.

**LLM-powered graders (require configured LLM):**

- `Faithfulness` — RAGAS-style, checks claims are grounded in context (threshold adjustable in UI)
- `Helpfulness Judge` — LLM evaluates if response is helpful and accurate
- `Semantic Similarity` — embedding cosine distance (threshold adjustable in UI)
- `Extraction Completeness` — LLM evaluates extraction quality and grounding

**Deterministic grader:**

- `Paper Extraction Schema` — validates JSON output against the research paper schema

**Custom graders:**
Create your own with any type. Thresholds are adjustable per grader in the UI — no need for duplicate strict/moderate variants. For LLM Judge, write a custom rubric describing pass/fail criteria.

### Step 4: Prompt Files (Candidates)

Go to **Candidates** tab. Candidates are markdown files organized in **family folders** under `backend/prompts/` — editable from the prompt detail page or directly on disk.

**Folder structure:**

```
backend/prompts/
  analyst/
    base.md              → ID: analyst (parent)
    citations.md         → ID: analyst-citations (variant)
  summarizer/
    base.md              → ID: summarizer
    concise.md           → ID: summarizer-concise
    ...
```

`base.md` in a folder = parent prompt (ID = folder name). Any other `.md` file = variant (ID = `{folder}-{filename}`).

**Prompt file format:**

```markdown
---
name: Full Structured Analyst
description: Comprehensive analysis with integrity rules
runner: llm_prompt
user_template: '{{input}}'
recommended_graders: faithfulness:0.6, llm-judge-helpful:0.4
recommended_datasets: context-qa
grader_rationale: Faithfulness is highest — the structured analysis must stay grounded in the provided context.
notes: Compare against analyst-citations for structured vs citation-focused output.
---

You are a technical analyst...
```

**Template variables:** `{{input}}`, `{{context}}`, `{{expected}}`, `{{metadata.field}}`

**Prompts included (examples):**

| Prompt                 | Type          | Purpose                                                                        | Datasets                                |
| ---------------------- | ------------- | ------------------------------------------------------------------------------ | --------------------------------------- |
| `qa-assistant`         | Q&A           | General-purpose question answering (no variants — good for AI generation demo) | context-qa                              |
| `analyst`              | Analysis      | Multi-lens structured analysis (7 output sections)                             | context-qa                              |
| `analyst-citations`    | Analysis      | Variant of analyst: citation-grounded with bracket format                      | context-qa                              |
| `json-extractor`       | Extraction    | Grounded JSON extraction, temp 0, nulls for unknowns                           | research-paper-extraction               |
| `json-extractor-loose` | Extraction    | Variant of json-extractor: inferential, fills gaps with reasoning              | research-paper-extraction               |
| `summarizer`           | Summarization | Balanced 1-3 sentence summary                                                  | summarization                           |
| `summarizer-concise`   | Summarization | Variant: ultra-concise single sentence                                         | summarization                           |
| `summarizer-bullets`   | Summarization | Variant: 3-7 bullet points ordered by importance                               | summarization                           |
| `summarizer-verbose`   | Summarization | Variant: 2-4 paragraph detailed structured summary                             | summarization                           |
| `text-rewriter`        | Rewriting     | Style rewrite preserving meaning                                               | text-rewriting, text-rewriting-research |
| `text-rewriter-formal` | Rewriting     | Variant: formal/professional tone                                              | text-rewriting, text-rewriting-research |
| `text-rewriter-casual` | Rewriting     | Variant: casual/conversational tone                                            | text-rewriting, text-rewriting-research |

**Key comparisons to try:**

- **Strict vs Loose extraction** — same schema, but strict leaves null for unknowns while loose infers. Faithfulness grader catches the difference.
- **Analyst vs analyst-citations** — structured multi-lens analysis vs citation-grounded evidence. Which scores higher on faithfulness?
- **Summarizer family** (base vs concise vs bullets vs verbose) — how does output format affect faithfulness and helpfulness?
- **Text rewriter family** (base vs formal vs casual) — does tone shift affect semantic similarity?

**To add a new prompt:** Create a folder in `backend/prompts/` (e.g. `my-prompt/`) with a `base.md` file and click "Reload from Disk" in the UI. To edit, change the file and reload.

**Prompt variants:** Variants are `.md` files in the same family folder as the parent. Create them via:

- **Manual**: Click `+ Variant` on a parent card, edit the system prompt
- **AI Generate**: Click `AI Gen`, configure count/instructions/model, generate in batch
- **Disk**: Add a `.md` file to the parent's folder (e.g. `backend/prompts/summarizer/concise.md`)

All methods immediately write a `.md` file into the family folder. IDs are auto-derived: folder name = parent ID, `{folder}-{filename}` = variant ID. Edit variants the same way as any prompt — change the file or use the UI. Delete by removing the file or using the UI delete button.

**Testing inline:** Each prompt has a "Test" button. Enter sample input, click play, see the output and latency.

### Step 5: Run an Experiment

Go to **Experiments** tab.

1. **Select a dataset** from the dropdown
2. **Select candidates** (optional — multi-select). If no candidates selected, graders evaluate `expectedOutput` directly
3. **Select graders** (multi-select)
4. **Click Run**

**What happens:**

1. For each test case in the dataset:
   - For each candidate: generate output (LLM call or HTTP request)
   - For each grader: evaluate the generated output
2. Results stream in real-time via SSE — you see pass/fail as each eval completes
3. Progress bar shows `current / total` evaluations

**Total evaluations** = `testCases × candidates × graders`. A dataset with 5 cases, 2 candidates, and 3 graders = 30 evaluations.

**Results table** shows a matrix:

- Rows: test cases
- Columns: one column per `candidate × grader` combination
- Cells: Pass/Fail badge. Hover to see score (0-1), reason, generated output, and latency (ms)

### Step 6: Compare Candidates

After running an experiment with multiple candidates, compare them:

**Via API:**

```bash
curl "http://localhost:3021/api/experiments/EXPERIMENT_ID/compare?baseline=CANDIDATE_A_ID&challenger=CANDIDATE_B_ID"
```

**Response:**

```json
{
  "summary": {
    "baselinePassRate": 0.8,
    "challengerPassRate": 0.9,
    "deltaPassRate": 0.1,
    "improved": 3,
    "regressed": 1,
    "same": 6,
    "total": 10
  },
  "comparisons": [
    {
      "testCaseId": "...",
      "graderId": "...",
      "baseline": { "pass": false, "score": 0.6 },
      "challenger": { "pass": true, "score": 0.85 },
      "delta": "improved"
    }
  ]
}
```

### Step 7: Export Results

```bash
# JSON export
curl http://localhost:3021/api/experiments/EXPERIMENT_ID/export/json -o results.json

# CSV export
curl http://localhost:3021/api/experiments/EXPERIMENT_ID/export/csv -o results.csv
```

---

## Presets System

Grader presets are defined in `backend/src/presets/presets.ts`. When loaded, they create grader YAML files in `backend/graders/` (or return the existing grader if it already exists).

Presets are just a small built-in template list (`GET /api/presets/graders`). Your installed graders are whatever YAML files exist on disk (`GET /api/graders`). These two lists may differ (by design).

### Loading Presets

**Seed all graders at once:**

```bash
POST /api/presets/seed
```

**Load individually:**

```bash
# List available grader presets
GET /api/presets/graders

# Load a specific grader
POST /api/presets/graders/faithfulness/load
```

### Available Presets

**Grader Presets**:

- `faithfulness` — promptfoo-backed context faithfulness (threshold adjustable)
- `llm-judge-helpful` — built-in rubric-based judge for helpfulness
- `semantic-similarity` — built-in embedding cosine similarity (threshold adjustable)
- `extraction-schema` — deterministic JSON schema validation for paper extraction
- `extraction-completeness` — LLM judge for extraction quality and grounding

**Dataset Files** (in `backend/datasets/`):
Loaded automatically on startup. Add more by placing CSV files in the directory.

**Grader Files** (in `backend/graders/`):
Loaded automatically on startup. All CRUD operations write back to YAML on disk. Each grader has a detail page (`/graders/:id`) with YAML editing, threshold controls, and research references.

| File                           | Type                | Description                                                                  | Threshold |
| ------------------------------ | ------------------- | ---------------------------------------------------------------------------- | --------- |
| `faithfulness.yaml`            | promptfoo           | RAGAS-style context faithfulness — verifies claims are grounded in context   | 0.8       |
| `llm-judge-helpful.yaml`       | llm-judge           | Built-in LLM evaluator — rubric-based pass/fail for helpfulness and accuracy | —         |
| `extraction-completeness.yaml` | llm-judge           | LLM evaluates extraction quality, completeness, and grounding                | —         |
| `extraction-schema.yaml`       | json-schema         | Validates JSON against a research paper schema (title, authors, keyFindings) | —         |
| `semantic-similarity.yaml`     | semantic-similarity | Cosine similarity on sentence embeddings (Sentence-BERT)                     | 0.8       |

**Promptfoo integration:** The `promptfoo` grader type delegates to promptfoo's MIT-licensed assertion engine. Beyond `context-faithfulness`, you can create additional promptfoo graders by setting `config.assertion` to values like `answer-relevance`, `context-relevance`, `context-recall`, `llm-rubric`, or `similar` (and more).

**Prompt Files** (in `backend/prompts/`, folder-per-family):
Loaded automatically on startup. Each family has its own folder with `base.md` (parent) and variant `.md` files. IDs are auto-derived from folder structure. See the Candidates tab or the files for details.

---

## API Reference

Base URL: `http://localhost:3021/api`

Interactive Swagger docs: `http://localhost:3021/api/docs`

### Datasets (file-based — loaded from CSV files, editable via `PUT /datasets/:id`)

| Method | Path                        | Description                                       |
| ------ | --------------------------- | ------------------------------------------------- |
| GET    | `/datasets`                 | List all datasets                                 |
| GET    | `/datasets/:id`             | Get dataset with test cases                       |
| PUT    | `/datasets/:id`             | Rewrite dataset rows/metadata to CSV on disk      |
| POST   | `/datasets/reload`          | Re-read all CSV files from disk                   |
| POST   | `/datasets/import`          | Upload CSV `{filename, csv, name?, description?}` |
| GET    | `/datasets/:id/export/json` | Export as JSON                                    |
| GET    | `/datasets/:id/export/csv`  | Export as CSV                                     |

### Graders (file-based — loaded from YAML files, editable via UI or API)

| Method | Path                | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/graders`          | List all graders                             |
| GET    | `/graders/:id`      | Get grader                                   |
| GET    | `/graders/:id/yaml` | Get raw YAML file content                    |
| POST   | `/graders`          | Create grader `{name, type, rubric, config}` |
| PUT    | `/graders/:id`      | Update grader (writes YAML to disk)          |
| DELETE | `/graders/:id`      | Delete grader (removes YAML file)            |
| POST   | `/graders/reload`   | Re-read all YAML files from disk             |

### Prompts (Candidates — file-based, editable)

| Method | Path                             | Description                                                                                       |
| ------ | -------------------------------- | ------------------------------------------------------------------------------------------------- |
| GET    | `/prompts`                       | List all loaded prompts                                                                           |
| GET    | `/prompts/:id`                   | Get prompt by filename ID                                                                         |
| PUT    | `/prompts/:id`                   | Update prompt frontmatter/body on disk                                                            |
| POST   | `/prompts/:id/test`              | Test with `{input, context?, metadata?}`                                                          |
| POST   | `/prompts/:id/variant`           | Create a prompt variant (writes a new `.md` file)                                                 |
| POST   | `/prompts/:id/variants/generate` | AI-generate variants `{count?, customInstructions?, provider?, model?, temperature?, maxTokens?}` |
| DELETE | `/prompts/:id`                   | Delete prompt file from disk                                                                      |
| POST   | `/prompts/reload`                | Re-read all .md files from disk                                                                   |

### Experiments

| Method | Path                                               | Description                                                |
| ------ | -------------------------------------------------- | ---------------------------------------------------------- |
| GET    | `/experiments`                                     | List all experiments                                       |
| GET    | `/experiments/:id`                                 | Get experiment with results                                |
| POST   | `/experiments`                                     | Create and run `{datasetId, graderIds[], candidateIds?[]}` |
| GET    | `/experiments/:id/stats`                           | Aggregate statistics                                       |
| GET    | `/experiments/:id/stream`                          | SSE progress stream                                        |
| GET    | `/experiments/:id/compare?baseline=X&challenger=Y` | A/B compare                                                |
| DELETE | `/experiments/:id`                                 | Delete experiment and results                              |
| DELETE | `/experiments/clear-all`                           | Delete all experiments and results                         |
| GET    | `/experiments/:id/export/json`                     | Export JSON                                                |
| GET    | `/experiments/:id/export/csv`                      | Export CSV                                                 |
| GET    | `/experiments/export/all-csv`                      | Export all experiments as a consolidated CSV               |

### Presets

| Method | Path                          | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/presets/graders`            | List grader presets          |
| POST   | `/presets/graders/:id/load`   | Create grader from preset    |
| POST   | `/presets/seed`               | Load all grader presets      |
| POST   | `/presets/synthetic/generate` | Generate test cases with LLM |
| POST   | `/presets/synthetic/dataset`  | Generate and save as CSV     |

### Settings

| Method | Path                 | Description                                        |
| ------ | -------------------- | -------------------------------------------------- |
| GET    | `/settings`          | List all settings                                  |
| GET    | `/settings/llm`      | Get LLM configuration                              |
| PUT    | `/settings/llm`      | Update LLM config `{provider, model, apiKey, ...}` |
| POST   | `/settings/llm/test` | Test LLM connection                                |
| POST   | `/settings/reset`    | Reset to defaults                                  |

---

## Example Workflows

### Workflow 1: Test Faithfulness with Provided Context

```bash
# 1. Datasets are loaded from CSV on startup — context-qa is included
# Load the faithfulness grader preset
curl -X POST localhost:3021/api/presets/graders/faithfulness/load

# 2. Use the analyst candidate (already loaded from disk)
# Or reload prompts: curl -X POST localhost:3021/api/prompts/reload

# 3. Run experiment (dataset ID = CSV filename without extension)
curl -X POST localhost:3021/api/experiments \
  -H "Content-Type: application/json" \
  -d '{"datasetId":"context-qa","candidateIds":["analyst"],"graderIds":["GRADER_ID"]}'
```

> **Note:** Context is pre-loaded in test cases. Dynamic retrieval (RAG) is planned but not yet implemented.

## Roadmap: First-Class RAG Retrieval

Today, the harness can **evaluate RAG-style behavior** if you include context directly in your dataset rows (the `context` column) and run RAGAS-style graders (e.g. `context-faithfulness`, `context-relevance`, `context-recall`) via the `promptfoo` grader type.

The next step is making **retrieval itself** part of the experiment run, using the existing UI/UX patterns:

1. **Datasets: add document sources + indexing**
   - Add a per-dataset "Sources" area (e.g. upload PDFs/markdown/text or point to a folder) and an "Index" action.
   - Indexing = chunking + embeddings + writing to a vector store (local or external).
   - Extend "Generate" to produce RAG datasets: a small synthetic corpus + questions + expected outputs + optional gold context/citations for recall-style grading.
2. **Candidates: add a `rag_prompt` runner**
   - A candidate would carry a retrieval config (method, `topK`, thresholds, chunking, vector store connection).
   - During an experiment: `retrieve(input) → inject {{context}} → generate output → grade`.
3. **Experiments: persist retrieval traces for auditability**
   - Store the retrieval query, latency, and the retrieved chunks (content + scores + source IDs) alongside results so comparisons are reproducible.
   - Show retrieved context in the existing result hover/details UI so failures are debuggable (bad retrieval vs bad generation vs bad grading).
4. **Systematic testing of variations**
   - Use variants to sweep retrieval parameters (`topK`, chunk size/overlap, reranking on/off) and prompt changes with the same dataset/graders.
   - The compare view (A/B deltas) becomes the main way to iterate on retrieval configuration.

Backend stubs already exist for this integration: `backend/src/retrieval/retrieval.interfaces.ts` and `backend/src/retrieval/retrieval.module.ts`.

### Workflow 2: Compare Two Prompt Variants

1. Create candidate A: "Answer concisely"
2. Create candidate B (variant of A): "Answer with step-by-step reasoning"
3. Run experiment with both candidates and multiple graders
4. Compare: `GET /experiments/:id/compare?baseline=A&challenger=B`

### Workflow 3: Test Your Own API

1. Create an HTTP endpoint candidate pointing to your API
2. Load a dataset (or create your own)
3. Load exact-match + semantic similarity graders
4. Run experiment — the harness will call your API for each test case

---

## Tech Stack

| Layer    | Tech                                               | Port          |
| -------- | -------------------------------------------------- | ------------- |
| Frontend | Next.js 15                                         | 3020          |
| Backend  | NestJS                                             | 3021          |
| Database | SQLite (via Drizzle ORM; Postgres adapter planned) | —             |
| LLM      | OpenAI, Anthropic, Ollama                          | —             |
| Docs     | Swagger/OpenAPI                                    | 3021/api/docs |

---

## Project Structure

```
├── frontend/                    # Next.js 15 app
│   └── src/
│       ├── app/
│       │   ├── datasets/        # CSV-backed dataset editor + export
│       │   ├── graders/         # Grader CRUD + presets
│       │   ├── candidates/      # Prompt editor + variant generation + test panel
│       │   ├── experiments/     # Run experiments + results + weighted scores
│       │   ├── settings/        # Runtime LLM config
│       │   └── about/           # Docs and references
│       ├── components/          # Navigation, ThemeProvider
│       └── lib/                 # API client, types
├── backend/
│   ├── datasets/                # CSV dataset files + optional .meta.json sidecars
│   ├── graders/                 # YAML grader files (editable, CRUD writes back to YAML)
│   ├── prompts/                 # Folder-per-family prompt files (base.md + variants per folder)
│   └── src/
│       ├── database/            # IDbAdapter interface + SQLite implementation
│       ├── datasets/            # DatasetLoaderService (reads CSV files from disk)
│       ├── candidates/          # PromptLoaderService + CandidateRunnerService
│       ├── experiments/         # Experiment orchestrator + SSE + weighted stats
│       ├── eval-engine/         # Grader implementations (7 types)
│       ├── graders/             # Grader CRUD
│       ├── llm/                 # Provider-agnostic LLM layer
│       ├── presets/             # Seed graders + synthetic generation
│       ├── settings/            # Runtime configuration
│       └── main.ts              # App bootstrap, CORS, Swagger
└── README.md                    # This file
```

---

## Testing

```bash
cd backend
npm test                                      # All tests
npm test -- --testPathPattern=candidates       # Prompt loader + template utils
```

Tests cover:

- **template-utils**: variable substitution, dot notation, edge cases
- **prompt-loader**: file loading, weight parsing, rationale parsing, findMany

---

## FAQ

**How do I add a dataset?**
Place a `.csv` file in `backend/datasets/` with columns: `input`, `expected_output`, `context`, `metadata`. Click "Reload from Disk" in the Datasets tab. Or use "Upload CSV" in the UI.

**How do I add a new prompt?**
Create a folder in `backend/prompts/` (e.g. `my-prompt/`) with a `base.md` file containing frontmatter (see format above), then click "Reload from Disk" in the Candidates tab.

**How do I change a prompt?**
Edit the `.md` file directly and click "Reload from Disk". No database migration needed.

**What are grader weights?**
Weights control how much each grader contributes to a candidate's weighted aggregate score. Format: `grader-id:0.4`. Higher weight = more influence. Default weight is `1.0` if not specified.

**How does the weighted score work?**
`weightedScore = sum(graderAvgScore * graderWeight) / sum(graderWeights)`. When all weights are equal, `weightedScore == avgScore`.

**Can I use Ollama / local models?**
Yes. Go to Settings, set provider to "ollama", set the base URL (default `http://localhost:11434`), and select your model.

**How do I run an A/B test?**
Create an experiment with 2+ candidates, same dataset and graders. After completion, use the compare endpoint: `GET /api/experiments/:id/compare?baseline=X&challenger=Y`

**What grader should I use?**
Each prompt file includes `recommended_graders` with weights and a `grader_rationale` explaining why. Start there.

**What's stored on disk vs SQLite?**
Disk: datasets (CSV), prompts (markdown), graders (YAML) — these are the source of truth for all definitions. SQLite: experiment runs, experiment results, and settings only. You can delete the SQLite database and start fresh without losing any prompts, graders, or datasets.

**Are AI-generated variants saved to disk?**
Yes. Every variant (manual or AI-generated) is immediately written as a `.md` file in the parent's family folder (e.g. `backend/prompts/summarizer/concise.md`). They're regular files you can edit, delete, or version-control like any other prompt.
