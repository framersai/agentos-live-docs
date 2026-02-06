'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  Database,
  Brain,
  TestTube,
  Server,
  Layout,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item">
      <button
        className="accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        data-state={isOpen ? 'open' : 'closed'}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
}

function TechCard({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  link?: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted">
          <Icon className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg uppercase tracking-wide">{title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1 mt-3 text-sm"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero */}
      <section>
        <h1 className="section-title text-4xl">Full-Stack Eval Harness</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          A lightweight evaluation harness for testing LLM prompts against datasets with
          configurable graders. Define prompts as markdown files, load datasets and graders, run
          experiments, and compare results side by side.
        </p>
      </section>

      <hr className="divider" />

      {/* How It Works */}
      <section>
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Four core concepts: <strong>Datasets</strong> provide test cases,{' '}
          <strong>Candidates</strong> (prompt files) generate outputs, <strong>Graders</strong>{' '}
          evaluate quality, <strong>Experiments</strong> orchestrate runs and show results.
        </p>

        <div className="mt-8 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">01</span>
              <h3 className="font-bold text-xl uppercase">Datasets</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              CSV files in <code>backend/datasets/</code>. Each row has <code>input</code>,
              <code>expected_output</code>, optional <code>context</code> (for faithfulness), and
              optional <code>metadata</code>. Upload new CSVs via the UI or drop files in the
              directory.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Included examples:</strong> context QA, paper extraction, summarization, and
              rewriting (see <code>backend/datasets/</code>).
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">02</span>
              <h3 className="font-bold text-xl uppercase">Candidates</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Markdown files organized in <strong>family folders</strong> under{' '}
              <code>backend/prompts/</code>. Each folder contains a <code>base.md</code> (parent)
              and variant files. IDs are auto-derived: folder name = parent ID,{' '}
              <code>{'{folder}-{filename}'}</code> = variant ID. Each file has YAML frontmatter
              (name, description, runner type, templates, recommended graders with weights,
              rationale) and a system prompt body.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Included examples:</strong> Q&amp;A assistant, structured analyst +
              citation-focused variant, strict/loose JSON extractors, summarizer variants (concise,
              bullets, verbose), and text rewriter variants (formal, casual). See{' '}
              <code>backend/prompts/</code>. Create variants from the UI or edit files directly.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">03</span>
              <h3 className="font-bold text-xl uppercase">Graders</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              YAML files in <code>backend/graders/</code>. Each grader scores output as pass/fail
              with a reason and a 0-1 score. Two categories:
            </p>
            <ul className="list-brutal mt-4 text-muted-foreground">
              <li>
                <strong>Built-in</strong> — LLM Judge, Semantic Similarity, JSON Schema, Contains,
                Regex, Exact Match
              </li>
              <li>
                <strong>Promptfoo-backed</strong> — RAGAS-style metrics (context-faithfulness,
                answer-relevance, context-relevance, context-recall), LLM rubric, and similarity via{' '}
                <a href="https://promptfoo.dev" className="underline">
                  promptfoo
                </a>
                &apos;s assertion types
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Grader files live on disk.</strong> Each prompt file declares which graders to
              use with weights and a rationale. Edit YAML files directly, use the grader detail
              page, or create custom ones via API.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              The Graders tab also has a <strong>Load Preset</strong> menu: presets are optional
              templates that create new grader YAML files on disk (or open an existing grader).
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-2 pr-3">Grader</th>
                    <th className="pb-2 pr-3">Type</th>
                    <th className="pb-2 pr-3">Engine</th>
                    <th className="pb-2">Threshold</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-1.5 pr-3 font-medium text-foreground">Faithfulness</td>
                    <td className="py-1.5 pr-3">context-faithfulness</td>
                    <td className="py-1.5 pr-3">promptfoo</td>
                    <td className="py-1.5">0.8</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-1.5 pr-3 font-medium text-foreground">Helpfulness Judge</td>
                    <td className="py-1.5 pr-3">llm-judge</td>
                    <td className="py-1.5 pr-3">built-in</td>
                    <td className="py-1.5">optional</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-1.5 pr-3 font-medium text-foreground">
                      Extraction Completeness
                    </td>
                    <td className="py-1.5 pr-3">llm-judge</td>
                    <td className="py-1.5 pr-3">built-in</td>
                    <td className="py-1.5">optional</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-1.5 pr-3 font-medium text-foreground">
                      Paper Extraction Schema
                    </td>
                    <td className="py-1.5 pr-3">json-schema</td>
                    <td className="py-1.5 pr-3">built-in</td>
                    <td className="py-1.5">&mdash;</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-3 font-medium text-foreground">Semantic Similarity</td>
                    <td className="py-1.5 pr-3">semantic-similarity</td>
                    <td className="py-1.5 pr-3">built-in</td>
                    <td className="py-1.5">0.8</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              The <strong>promptfoo</strong> grader type supports additional assertions
              (answer/context relevance, context recall, llm-rubric, similar, etc.) by changing{' '}
              <code>config.assertion</code> in a promptfoo grader YAML file.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">04</span>
              <h3 className="font-bold text-xl uppercase">Experiments</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Select a dataset, graders, and optionally candidates, then run. Results stream in
              real-time via SSE. Each candidate gets an average score and a weighted score (using
              the prompt&apos;s grader weight config). Compare candidates side-by-side.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Weighted Scoring */}
      <section>
        <h2 className="section-title">Weighted Grader Scoring</h2>
        <p className="section-subtitle">
          Each prompt file declares which graders matter most and why.
        </p>

        <div className="mt-8 card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="h-6 w-6" />
            <h3 className="font-bold text-lg uppercase">How It Works</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            In the prompt&apos;s frontmatter, <code>recommended_graders</code> assigns weights to
            each grader. The experiment stats compute both an equal-weight average and a weighted
            score per candidate.
          </p>
          <pre className="mt-4 text-xs bg-muted p-4 rounded overflow-x-auto">
            {`recommended_graders: faithfulness:0.4, semantic-similarity:0.3, llm-judge-helpful:0.3
grader_rationale: Faithfulness is highest — responses must stay grounded in context.`}
          </pre>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Faithfulness at 40%, semantic similarity at 30%, helpfulness at 30%. When weights
            differ, the weighted score diverges from the average — showing what actually matters for
            each prompt.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Roadmap */}
      <section>
        <h2 className="section-title">Roadmap: First-Class RAG Testing</h2>
        <p className="section-subtitle">
          Today you can evaluate RAG-style behavior by including <code>context</code> in dataset
          rows. Next is making retrieval itself part of candidate execution.
        </p>

        <div className="mt-8 space-y-4">
          <div className="card p-6 space-y-3 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">Planned UI/UX extensions:</p>
            <ul className="list-brutal">
              <li>
                <strong>Datasets:</strong> attach &ldquo;Sources&rdquo; (docs/URLs/files) and add an
                &ldquo;Index&rdquo; action (chunking + embeddings + vector store write).
              </li>
              <li>
                <strong>Generation:</strong> extend &ldquo;Generate&rdquo; to create RAG fixtures (a
                small corpus + questions + expected outputs + optional gold context/citations).
              </li>
              <li>
                <strong>Candidates:</strong> add a <code>rag_prompt</code> runner with retrieval
                config (method, <code>topK</code>, thresholds, chunking, reranking).
              </li>
              <li>
                <strong>Experiments:</strong> persist and display retrieval traces (query, latency,
                retrieved chunks + scores) so failures are debuggable and comparisons are
                reproducible.
              </li>
              <li>
                <strong>Variations:</strong> use variants to sweep retrieval parameters and prompt
                changes side-by-side with the same dataset/graders.
              </li>
            </ul>
            <p className="text-xs">
              Backend scaffolding already exists in <code>backend/src/retrieval/</code> (interfaces
              + module stub).
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Tech Stack */}
      <section>
        <h2 className="section-title">Tech Stack</h2>

        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <TechCard
            icon={Layout}
            title="Next.js 15"
            description="React with App Router and Tailwind CSS."
            link="https://nextjs.org"
          />
          <TechCard
            icon={Server}
            title="NestJS"
            description="Node.js framework with dependency injection. Swagger docs at /api/docs."
            link="https://nestjs.com"
          />
          <TechCard
            icon={Database}
            title="Drizzle ORM + SQLite"
            description="Type-safe ORM, zero runtime overhead. Swap to Postgres by changing the driver."
            link="https://orm.drizzle.team"
          />
          <TechCard
            icon={Brain}
            title="Multi-Provider LLM"
            description="OpenAI, Anthropic, and Ollama. Configure globally in Settings."
          />
          <TechCard
            icon={TestTube}
            title="Promptfoo"
            description="MIT-licensed assertion engine for RAGAS-style metrics, LLM-as-judge, and many evaluation types."
            link="https://promptfoo.dev"
          />
          <TechCard
            icon={Zap}
            title="SSE Streaming"
            description="Real-time experiment progress via Server-Sent Events."
          />
        </div>
      </section>

      <hr className="divider" />

      {/* FAQ */}
      <section>
        <h2 className="section-title">FAQ</h2>

        <div className="mt-8">
          <AccordionItem title="How do I add a dataset?" defaultOpen>
            <p className="text-muted-foreground leading-relaxed">
              Place a <code>.csv</code> file in <code>backend/datasets/</code> with columns:{' '}
              <code>input</code>, <code>expected_output</code>, <code>context</code>,{' '}
              <code>metadata</code>. Click &ldquo;Reload from Disk&rdquo; in the Datasets tab, or
              use &ldquo;Upload CSV&rdquo; to import directly. An optional <code>.meta.json</code>{' '}
              sidecar provides a display name and description.
            </p>
          </AccordionItem>

          <AccordionItem title="How do I add or edit a prompt?">
            <p className="text-muted-foreground leading-relaxed">
              Create a folder in <code>backend/prompts/</code> (e.g. <code>my-prompt/</code>) with a{' '}
              <code>base.md</code> file containing YAML frontmatter (name, description, runner,
              user_template, recommended_graders with weights, grader_rationale). The body is the
              system prompt. Click &ldquo;Reload from Disk&rdquo; in the Candidates tab, or edit
              directly in the UI detail page.
            </p>
          </AccordionItem>

          <AccordionItem title="What are prompt variants?">
            <p className="text-muted-foreground leading-relaxed">
              Variants are clones of a parent prompt with modified instructions. Use them to A/B
              test different approaches — for example, a &ldquo;formal&rdquo; vs
              &ldquo;casual&rdquo; rewriter, or a &ldquo;concise&rdquo; vs &ldquo;verbose&rdquo;
              summarizer.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Creating variants:</strong> Click the <code>+</code> button on any prompt in
              the Candidates tab. The variant modal pre-fills the parent&apos;s system prompt so you
              can edit it. A new <code>.md</code> file is saved into the parent&apos;s family
              folder. IDs are auto-derived from the folder structure.
            </p>
            <pre className="mt-3 text-xs bg-muted p-3 rounded overflow-x-auto">
              {`# Folder: backend/prompts/summarizer/
#   base.md       → ID: summarizer (parent)
#   concise.md    → ID: summarizer-concise (variant)

# File: backend/prompts/summarizer/concise.md
---
name: Concise Summarizer
runner: llm_prompt
---
Summarize in one sentence.`}
            </pre>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Comparing variants:</strong> Select multiple variants as candidates in an
              experiment. Results appear side-by-side with per-grader scores. The weighted score
              uses each prompt&apos;s own grader weight configuration.
            </p>
          </AccordionItem>

          <AccordionItem title="What are RAGAS-style metrics?">
            <p className="text-muted-foreground leading-relaxed">
              RAGAS-style metrics evaluate RAG (Retrieval-Augmented Generation) systems. We use{' '}
              <a href="https://promptfoo.dev" className="link">
                promptfoo
              </a>
              &apos;s implementation:
            </p>
            <ul className="list-brutal mt-3 text-muted-foreground">
              <li>
                <code>context-faithfulness</code> — hallucination detection (claims grounded in
                context)
              </li>
              <li>
                <code>answer-relevance</code> — query alignment
              </li>
              <li>
                <code>context-relevance</code> — retrieval quality
              </li>
              <li>
                <code>context-recall</code> — ground truth coverage
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              These work with your configured provider (OpenAI, Anthropic, or Ollama) via Settings.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <a
                href="https://arxiv.org/abs/2309.15217"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                RAGAS paper (Es et al., 2023) <ExternalLink className="inline h-3 w-3" />
              </a>
            </p>
          </AccordionItem>

          <AccordionItem title="How does semantic similarity work?">
            <p className="text-muted-foreground leading-relaxed">
              Both texts are converted to embedding vectors, then compared via cosine similarity. A
              threshold (85% or 70%) determines pass/fail. OpenAI uses{' '}
              <code>text-embedding-3-small</code>, Ollama uses native embeddings.
            </p>
          </AccordionItem>

          <AccordionItem title="How do I run an A/B test?">
            <p className="text-muted-foreground leading-relaxed">
              Select 2+ candidates in the experiment, same dataset and graders. Results appear
              side-by-side. Use{' '}
              <code>GET /api/experiments/:id/compare?baseline=X&challenger=Y</code> for structured
              deltas.
            </p>
          </AccordionItem>

          <AccordionItem title="Is this production-ready?">
            <p className="text-muted-foreground leading-relaxed">
              It&apos;s a functional prototype for local development, prompt iteration, and
              demonstrating evaluation workflows. For production scale, see Braintrust, Langsmith,
              or Promptfoo.
            </p>
          </AccordionItem>
        </div>
      </section>

      <hr className="divider" />

      {/* References */}
      <section>
        <h2 className="section-title">References &amp; Why We Chose Them</h2>

        <div className="mt-8 space-y-4">
          <div className="card p-5">
            <h3 className="font-bold uppercase">Promptfoo</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Our assertion engine.</strong> We use promptfoo for RAGAS-style metrics, and
              it can also power LLM-as-judge and similarity assertions via the{' '}
              <code className="text-xs">promptfoo</code> grader type. Why? MIT licensed, saves us
              from reimplementing complex claim extraction + NLI verification.
            </p>
            <a
              href="https://promptfoo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm mt-2 inline-flex items-center gap-1"
            >
              promptfoo.dev <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="card p-5">
            <h3 className="font-bold uppercase">RAGAS</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Research foundation.</strong> Es et al. 2023 introduced faithfulness, answer
              relevancy, and context relevancy metrics for RAG evaluation. We use promptfoo&apos;s
              production-ready implementation of these metrics.
            </p>
            <a
              href="https://arxiv.org/abs/2309.15217"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm mt-2 inline-flex items-center gap-1"
            >
              arxiv.org/abs/2309.15217 <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="card p-5">
            <h3 className="font-bold uppercase">LLM-as-Judge</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Zheng et al. 2023 demonstrated using LLMs for evaluation with rubrics. Our
              <code className="text-xs">llm-judge</code> grader implements this pattern for
              open-ended quality assessment. You can also use promptfoo&apos;s{' '}
              <code className="text-xs">llm-rubric</code> assertion via a{' '}
              <code className="text-xs">promptfoo</code> grader.
            </p>
            <a
              href="https://arxiv.org/abs/2306.05685"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm mt-2 inline-flex items-center gap-1"
            >
              arxiv.org/abs/2306.05685 <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="card p-5">
            <h3 className="font-bold uppercase">Sentence-BERT</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Reimers &amp; Gurevych 2019. Our semantic similarity graders use embedding cosine
              distance to compare meaning beyond surface-level string matching.
            </p>
            <a
              href="https://arxiv.org/abs/1908.10084"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm mt-2 inline-flex items-center gap-1"
            >
              arxiv.org/abs/1908.10084 <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      <hr className="divider-dashed" />

      <section className="text-center py-8">
        <p className="text-muted-foreground mb-6">Ready to evaluate your prompts?</p>
        <Link href="/datasets" className="btn-primary">
          Get Started
        </Link>
      </section>
    </div>
  );
}
