# Fullstack Evals Harness

A lightweight evaluation harness for running AI graders against test cases. Built with Next.js and NestJS.


---

## What It Does

Create datasets of test cases, define graders (evaluation criteria), build candidates (prompt templates or API endpoints), and run experiments to see how your AI outputs hold up.

- **Datasets**: Tables of test cases with input/expected output/context/metadata
- **Graders**: Evaluation criteria (exact match, LLM judge, semantic similarity, faithfulness)
- **Candidates**: How to produce output — LLM prompt templates with `{{variable}}` substitution, or HTTP endpoints
- **Experiments**: Run `dataset × candidates × graders`, see results stream in real-time
- **Comparison**: A/B compare candidates — pass rate deltas, improved/regressed case counts

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- (Optional) Ollama for local LLM testing

### Setup

```bash
# Clone and install
cd packages/fullstack-evals-harness-example
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
```

### Environment Variables

```bash
# LLM Provider: openai | anthropic | ollama
LLM_PROVIDER=ollama

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=dolphin-llama3:8b
```

### Run

```bash
# Start backend (port 3001)
pnpm run backend:dev

# Start frontend (port 3000)
pnpm run frontend:dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

### 1. Create a Dataset

Navigate to the **Datasets** tab. Create a new dataset and add test cases:

| Input | Expected Output |
|-------|-----------------|
| What is 2+2? | 4 |
| Capital of France? | Paris |

### 2. Define Graders

Switch to the **Graders** tab. Create evaluation criteria:

- **Exact Match**: Output must match expected exactly
- **LLM Judge**: Uses an LLM with your rubric to judge pass/fail
- **Semantic Similarity**: Embedding-based similarity threshold
- **Faithfulness**: Checks if output is faithful to provided context (RAGAS-inspired)

### 3. Create Candidates

Go to the **Candidates** tab. A candidate defines how to produce output for each test case:

- **LLM Prompt**: System prompt + user prompt template with `{{input}}`, `{{context}}`, `{{metadata.field}}` substitution
- **HTTP Endpoint**: Call an external API and extract the response

Load from presets (qa-basic, qa-rag, json-extractor, classifier, summarizer, http-api) or create your own. Use the inline test panel to verify output before running experiments.

Candidates support variant lineage — create variations of existing candidates to track prompt iteration history.

### 4. Run an Experiment

Go to the **Experiments** tab:

1. Select a dataset
2. Select one or more candidates (optional — without candidates, graders evaluate expectedOutput directly)
3. Select one or more graders
4. Click **Run**
5. Watch results stream in real-time

Results show a matrix of candidates × graders per test case. Hover for score, reason, generated output, and latency.

### 5. Compare Candidates

After running an experiment with multiple candidates, use the comparison endpoint to see:

- Pass rate delta between baseline and challenger
- Count of improved, regressed, and unchanged cases
- Per-test-case side-by-side results

---

## Project Structure

```
├── frontend/                    # Next.js 15 app
│   └── src/app/
│       ├── datasets/            # Dataset + test case CRUD
│       ├── graders/             # Grader CRUD + presets
│       ├── candidates/          # Candidate CRUD + test panel
│       ├── experiments/         # Run experiments + results
│       ├── stats/               # Aggregate metrics
│       ├── settings/            # Runtime LLM config
│       └── about/               # Docs and references
├── backend/                     # NestJS API
│   └── src/
│       ├── database/            # IDbAdapter + SQLite implementation
│       ├── candidates/          # CRUD + runner service
│       ├── experiments/         # Run loop + SSE streaming
│       ├── graders/             # Grader evaluation logic
│       ├── llm/                 # Provider-agnostic LLM layer
│       ├── presets/             # Seed data + synthetic generation
│       └── settings/            # Runtime configuration
├── ARCHITECTURE.md              # Design decisions and references
└── README.md                    # You are here
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, Tailwind |
| Backend | NestJS |
| Database | SQLite (adapter pattern for Postgres) |
| LLM | OpenAI, Anthropic, Ollama |
| Docs | Swagger/OpenAPI at `/api/docs` |

---

## Development

```bash
# Run tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint
```

---

## Grader Types

### Exact Match
Simple string comparison. Pass if output === expected.

### LLM Judge
Provide a rubric, and an LLM evaluates whether the output meets the criteria.

### Semantic Similarity
Compares embeddings of output and expected. Pass if cosine similarity exceeds threshold.

### Faithfulness
RAGAS-inspired. Extracts claims from the output and verifies each against the provided context.
