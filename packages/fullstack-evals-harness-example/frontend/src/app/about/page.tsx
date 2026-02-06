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
          <strong>Candidates are the hub.</strong> Each prompt file declares which datasets and
          graders to use in its YAML frontmatter. Datasets and graders are standalone resources
          &mdash; candidates link them together. Experiments run the matrix and stream scored
          results.
        </p>

        <div className="mt-8 space-y-6">
          <div className="card p-6 border-l-4 border-l-foreground">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">01</span>
              <h3 className="font-bold text-xl uppercase">Candidates (The Hub)</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Markdown files organized in <strong>family folders</strong> under{' '}
              <code>backend/prompts/</code>. Each folder contains a <code>base.md</code> (parent)
              and variant files. IDs are auto-derived: folder name = parent ID,{' '}
              <code>{'{folder}-{filename}'}</code> = variant ID.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Frontmatter links everything:</strong> Each candidate&apos;s YAML frontmatter
              declares <code>recommended_graders</code> (with weights) and{' '}
              <code>recommended_datasets</code>. When you select a dataset in the Experiments tab,
              matching candidates auto-select, and their recommended graders auto-select too.
            </p>
            <pre className="mt-3 text-xs bg-muted p-3 rounded overflow-x-auto">
              {`---
name: Full Structured Analyst
runner: llm_prompt
recommended_graders: faithfulness:0.6, llm-judge-helpful:0.4
recommended_datasets: context-qa
grader_rationale: Faithfulness is highest — must stay grounded in context.
---
You are a technical analyst...`}
            </pre>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Included:</strong> Q&amp;A assistant, structured analyst + citation variant,
              strict/loose JSON extractors, summarizer variants (concise, bullets, verbose,
              bad-example), and text rewriter variants (formal, casual). The{' '}
              <strong>bad-example</strong> variant is an intentionally adversarial prompt with
              injection attacks and contradictory instructions — a negative control that should fail
              all graders. Create variants from the UI or edit files directly.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">02</span>
              <h3 className="font-bold text-xl uppercase">Datasets</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Organized in subfolders under <code>backend/datasets/</code>. Each subfolder contains
              a <code>data.csv</code> and optional <code>meta.yaml</code> (name, description). CSV
              rows have <code>input</code>, <code>expected_output</code>, optional{' '}
              <code>context</code> (for faithfulness), and optional <code>metadata</code>. Upload
              new CSVs via the UI or create a subfolder on disk. Candidates reference datasets by ID
              in their <code>recommended_datasets</code> frontmatter field.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Included:</strong> context QA, paper extraction, summarization, and rewriting.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-foreground text-background px-3 py-1 text-sm font-bold">03</span>
              <h3 className="font-bold text-xl uppercase">Graders</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              YAML files in <code>backend/graders/</code>. Each grader scores output as pass/fail
              with a reason and a 0-1 score. Candidates reference graders by ID in their{' '}
              <code>recommended_graders</code> frontmatter field (with weights). Two categories:
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

      {/* Included Datasets */}
      <section>
        <h2 className="section-title">Included Datasets</h2>
        <p className="section-subtitle">
          5 CSV datasets ship with the harness, each targeting a different evaluation scenario. Each
          lives in its own subfolder under <code>backend/datasets/</code> with a{' '}
          <code>data.csv</code> and optional <code>meta.yaml</code> for names and descriptions.
        </p>

        <div className="mt-8 space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                DS-1
              </span>
              <h3 className="font-bold text-lg">Q&amp;A with Context</h3>
              <code className="text-xs text-muted-foreground">context-qa/data.csv</code>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Questions paired with source context for <strong>faithfulness testing</strong>. Tests
              whether models answer accurately based on provided material without hallucinating.
              Each row has an <code>input</code> (question), <code>expected_output</code> (gold
              answer), and <code>context</code> (source paragraph). Designed for the analyst and
              Q&amp;A assistant prompt families.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Example:</strong> &quot;When was the company founded?&quot; with context about
              Acme Corp and expected answer &quot;The company was founded in 2015.&quot;
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                DS-2
              </span>
              <h3 className="font-bold text-lg">Research Paper Extraction</h3>
              <code className="text-xs text-muted-foreground">
                research-paper-extraction/data.csv
              </code>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              5 real AI paper abstracts for <strong>structured JSON extraction</strong>. Each row
              includes an arXiv source URL in metadata. Tests whether extractors can pull structured
              fields (title, authors, key findings, methodology) from unstructured academic text.
              Designed for the JSON extractor prompt family.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Papers include:</strong> Attention Is All You Need, GPT-2, BERT, ResNet, and
              others. Expected output is a JSON object matching a defined schema.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                DS-3
              </span>
              <h3 className="font-bold text-lg">Summarization</h3>
              <code className="text-xs text-muted-foreground">summarization/data.csv</code>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              News-style and research-style passages for <strong>summarization evaluation</strong>.
              Tests whether models produce accurate, concise, and faithful summaries. Topics include
              ML in medical diagnostics, quarterly revenue reports, EU AI regulation, and battery
              technology. Designed for the summarizer prompt family.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                DS-4
              </span>
              <h3 className="font-bold text-lg">Text Rewriting</h3>
              <code className="text-xs text-muted-foreground">text-rewriting/data.csv</code>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Mixed passages for <strong>rewriting evaluation</strong>: synthetic content plus
              sourced excerpts from arXiv papers and public-domain literature. Tests whether models
              preserve meaning while improving clarity and readability. The <code>context</code>{' '}
              column contains the original text so faithfulness graders can catch meaning drift.
              Designed for the text rewriter prompt family.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                DS-5
              </span>
              <h3 className="font-bold text-lg">Text Rewriting (Research)</h3>
              <code className="text-xs text-muted-foreground">
                text-rewriting-research/data.csv
              </code>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Short excerpts from <strong>real ML paper abstracts</strong> for rewriting evaluation.
              Each row includes an arXiv source URL in metadata. A focused variant of the general
              rewriting dataset &mdash; useful for testing how rewriters handle dense academic
              language specifically.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Included Prompts (Candidates) */}
      <section>
        <h2 className="section-title">Included Prompts (Candidates)</h2>
        <p className="section-subtitle">
          12 prompt variants across 5 families, each a markdown file in{' '}
          <code>backend/prompts/</code>. Every prompt declares its recommended datasets and graders
          with weights in YAML frontmatter.
        </p>

        <div className="mt-8 space-y-6">
          {/* Analyst family */}
          <div className="card p-6 border-l-4 border-l-foreground/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                FAMILY
              </span>
              <h3 className="font-bold text-lg">Analyst</h3>
              <span className="text-xs text-muted-foreground">2 variants</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Structured analysis prompts for context-based Q&amp;A. Both target the{' '}
              <strong>context-qa</strong> dataset with faithfulness as the dominant grader.
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold bg-foreground/10 px-1.5 py-0.5 rounded">
                    BASE
                  </span>
                  <strong className="text-sm">Full Structured Analyst</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Comprehensive analysis with multi-lens evaluation (Technical Merit, Practical
                  Impact, Novelty, Limitations). Requires all claims to reference source material.
                  Outputs TL;DR, Key Facts, Analysis, Recommendation, Action Plan, Risks, and a
                  Grounding Report separating facts from inferences.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> faithfulness:0.6, llm-judge-helpful:0.4
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:citations</span>
                  <strong className="text-sm">Citation-Focused Analyst</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Emphasizes grounding &mdash; every factual claim must include a direct quote or
                  specific reference in brackets. Distinguishes STATED, DERIVED, and UNSUPPORTED
                  claims. Faithfulness weight bumped to 0.7 (from 0.6).
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> faithfulness:0.7, llm-judge-helpful:0.3
                </p>
              </div>
            </div>
          </div>

          {/* JSON Extractor family */}
          <div className="card p-6 border-l-4 border-l-foreground/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                FAMILY
              </span>
              <h3 className="font-bold text-lg">JSON Extractor</h3>
              <span className="text-xs text-muted-foreground">2 variants</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Structured data extraction from unstructured text. Both target{' '}
              <strong>research-paper-extraction</strong> with schema validation and extraction
              completeness as primary graders. Compare strict (nulls for unknowns) vs loose (infers
              missing data).
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold bg-foreground/10 px-1.5 py-0.5 rounded">
                    BASE
                  </span>
                  <strong className="text-sm">Strict JSON Extractor</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Extracts ONLY explicitly stated facts. Uses <code>null</code> for any field not
                  found in the source text. Temperature set to 0 for deterministic output. Outputs a
                  JSON object with title, authors, publicationDate, abstract, keyFindings,
                  methodology, keywords, limitations, and citations.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> extraction-schema:0.4, extraction-completeness:0.4,
                  faithfulness:0.2
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:loose</span>
                  <strong className="text-sm">Loose JSON Extractor (Inferential)</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Makes reasonable inferences from context when information isn&apos;t explicitly
                  stated. Fills likely values instead of leaving nulls. Temperature 0.3. Expected to
                  score higher on completeness but lower on faithfulness vs strict mode.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> extraction-schema:0.4, extraction-completeness:0.4,
                  faithfulness:0.2
                </p>
              </div>
            </div>
          </div>

          {/* Q&A Assistant */}
          <div className="card p-6 border-l-4 border-l-foreground/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                FAMILY
              </span>
              <h3 className="font-bold text-lg">Q&amp;A Assistant</h3>
              <span className="text-xs text-muted-foreground">1 variant</span>
            </div>

            <div className="bg-muted/30 rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold bg-foreground/10 px-1.5 py-0.5 rounded">
                  BASE
                </span>
                <strong className="text-sm">Q&amp;A Assistant</strong>
              </div>
              <p className="text-xs text-muted-foreground">
                General-purpose question answering. Answers directly and concisely, uses provided
                context when available, explicitly states when context is insufficient, and avoids
                fabricating information. A good baseline for the context-qa dataset &mdash; compare
                against the analyst variants to see how prompt complexity affects scores.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Graders:</strong> faithfulness:0.4, semantic-similarity:0.3,
                llm-judge-helpful:0.3
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Datasets:</strong> context-qa
              </p>
            </div>
          </div>

          {/* Summarizer family */}
          <div className="card p-6 border-l-4 border-l-foreground/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                FAMILY
              </span>
              <h3 className="font-bold text-lg">Summarizer</h3>
              <span className="text-xs text-muted-foreground">4 variants</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All target the <strong>summarization</strong> dataset. Compare how output length and
              format affect faithfulness, semantic similarity, and helpfulness scores.
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold bg-foreground/10 px-1.5 py-0.5 rounded">
                    BASE
                  </span>
                  <strong className="text-sm">Text Summarizer</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  1&ndash;3 sentence summaries with factual content and key points. Balanced grader
                  weights across helpfulness, similarity, and faithfulness.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> llm-judge-helpful:0.4, semantic-similarity:0.3,
                  faithfulness:0.3
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:concise</span>
                  <strong className="text-sm">Concise Summarizer</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Exactly ONE sentence capturing the most important point. No filler words or
                  hedging. Semantic similarity weight bumped to 0.5 &mdash; a one-sentence summary
                  must capture core meaning.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> semantic-similarity:0.5, faithfulness:0.3,
                  llm-judge-helpful:0.2
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:bullets</span>
                  <strong className="text-sm">Bullet-Point Summarizer</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  3&ndash;7 scannable bullet points, most important first. No headers or
                  introductory text. Semantic similarity and faithfulness equally weighted at 0.4
                  each.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> semantic-similarity:0.4, faithfulness:0.4,
                  llm-judge-helpful:0.2
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:verbose</span>
                  <strong className="text-sm">Detailed Summarizer</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  2&ndash;4 paragraph structured summaries with topic sentences. Faithfulness bumped
                  to 0.5 &mdash; longer summaries have more room for hallucination.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> faithfulness:0.5, semantic-similarity:0.3,
                  llm-judge-helpful:0.2
                </p>
              </div>
            </div>
          </div>

          {/* Text Rewriter family */}
          <div className="card p-6 border-l-4 border-l-foreground/40">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-foreground text-background px-2.5 py-0.5 text-xs font-bold">
                FAMILY
              </span>
              <h3 className="font-bold text-lg">Text Rewriter</h3>
              <span className="text-xs text-muted-foreground">3 variants</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All target <strong>text-rewriting</strong> and{' '}
              <strong>text-rewriting-research</strong> datasets. Each row&apos;s{' '}
              <code>context</code> column contains the original text so faithfulness graders can
              catch meaning drift. Compare how tone (neutral / casual / formal) affects scores.
            </p>

            <div className="space-y-3">
              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold bg-foreground/10 px-1.5 py-0.5 rounded">
                    BASE
                  </span>
                  <strong className="text-sm">Text Rewriter</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Improves clarity, flow, and readability while preserving meaning. Uses different
                  phrasing and sentence structure. Maintains original tone unless clarity requires
                  change.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> faithfulness:0.6, semantic-similarity:0.4
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:casual</span>
                  <strong className="text-sm">Casual Text Rewriter</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Friendly conversational tone with short sentences, active voice, contractions, and
                  everyday vocabulary. Technical terms briefly explained.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> faithfulness:0.6, semantic-similarity:0.4
                </p>
              </div>

              <div className="bg-muted/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] opacity-60 px-1.5 py-0.5">v:formal</span>
                  <strong className="text-sm">Formal Text Rewriter</strong>
                </div>
                <p className="text-xs text-muted-foreground">
                  Professional academic/business register. Uses formal vocabulary, passive voice,
                  precise terminology, and longer sentence structures. Eliminates colloquialisms.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Graders:</strong> faithfulness:0.6, semantic-similarity:0.4
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested experiments */}
        <div className="mt-8 card p-6 bg-muted/20">
          <h3 className="font-bold text-lg uppercase tracking-wide mb-3">
            Suggested Experiment Combos
          </h3>
          <ul className="list-brutal text-sm text-muted-foreground space-y-2">
            <li>
              <strong className="text-foreground">Grounding check:</strong> context-qa + Full
              Analyst + Citation Analyst + Q&amp;A Assistant + Faithfulness grader. Which analysis
              style scores highest on grounding?
            </li>
            <li>
              <strong className="text-foreground">Extraction quality:</strong>{' '}
              research-paper-extraction + Strict Extractor + Loose Extractor + Schema + Completeness
              + Faithfulness graders. Does inference help or hurt accuracy?
            </li>
            <li>
              <strong className="text-foreground">Summarization trade-offs:</strong> summarization +
              all 5 summarizer variants (including bad-example) + Faithfulness + Semantic
              Similarity. Does brevity hurt faithfulness? How badly does the adversarial prompt
              score?
            </li>
            <li>
              <strong className="text-foreground">Tone comparison:</strong> text-rewriting + Base +
              Casual + Formal rewriters + Faithfulness + Semantic Similarity. Does tone shift
              introduce meaning drift?
            </li>
          </ul>
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

      {/* Datasets: Human vs Synthetic */}
      <section>
        <h2 className="section-title">Datasets: Human-Curated vs AI-Generated</h2>
        <p className="section-subtitle">
          This demo ships with <strong>AI-generated synthetic datasets</strong> &mdash; useful for
          bootstrapping and testing the harness itself. Here&apos;s when each approach makes sense.
        </p>

        <div className="mt-8 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
              Why This Demo Uses Synthetic Data
            </h3>
            <ul className="list-brutal text-muted-foreground">
              <li>
                <strong>Fast to create.</strong> An LLM can generate dozens of input/output pairs in
                seconds, covering diverse scenarios without manual effort.
              </li>
              <li>
                <strong>Good for testing infrastructure.</strong> When the goal is to validate the
                eval pipeline itself (grading logic, scoring, UI), the dataset content matters less
                than having realistic structure.
              </li>
              <li>
                <strong>Covers the shape of real data.</strong> Synthetic data can simulate
                different difficulty levels, edge cases, and output formats to exercise all grader
                types.
              </li>
              <li>
                <strong>Reproducible and shareable.</strong> No PII, no proprietary content, no
                licensing concerns. Anyone can clone the repo and run experiments immediately.
              </li>
            </ul>
          </div>

          <div className="card p-6 border-l-4 border-l-foreground">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
              When Human-Curated Datasets Are Better
            </h3>
            <ul className="list-brutal text-muted-foreground">
              <li>
                <strong>Domain expertise matters.</strong> Legal, medical, and financial evaluations
                need test cases written by people who know what a correct answer actually looks
                like. An LLM generating &ldquo;expected outputs&rdquo; for medical questions may
                produce confident but wrong ground truth.
              </li>
              <li>
                <strong>Real user patterns.</strong> Production queries have distributions,
                phrasings, and failure modes that synthetic data doesn&apos;t capture. Sampling
                actual user inputs (anonymized) creates evaluations that reflect real-world
                performance.
              </li>
              <li>
                <strong>Adversarial and edge cases.</strong> Humans are better at crafting tricky
                inputs &mdash; ambiguous questions, contradictory context, prompt injection
                attempts, multi-language mixing &mdash; that LLMs tend to avoid when generating
                data.
              </li>
              <li>
                <strong>Ground truth accuracy.</strong> The biggest risk of synthetic data: the AI
                that generates &ldquo;expected outputs&rdquo; can make the same mistakes as the AI
                being evaluated. Human-verified ground truth catches errors that model-generated
                answers won&apos;t.
              </li>
              <li>
                <strong>Cultural and linguistic nuance.</strong> Tone, formality, idioms, and
                cultural context are hard for models to generate authentically across languages and
                demographics.
              </li>
              <li>
                <strong>Compliance and regulation.</strong> Some industries require human-reviewed
                evaluation data for audit trails &mdash; synthetic data may not satisfy regulatory
                requirements.
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
              The Practical Approach: Both
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Start with synthetic data to build and test your eval pipeline quickly. Then layer in
              human-curated test cases for the scenarios that matter most. Use synthetic data as a
              baseline &mdash; if your prompt can&apos;t pass AI-generated cases, it won&apos;t pass
              real ones. Use human data as the bar &mdash; real-world correctness is what you ship
              against.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              This harness supports both: create a subfolder in <code>backend/datasets/</code> with
              a <code>data.csv</code>, or use the <strong>Generate</strong> feature to create
              synthetic datasets on demand.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Grader Deep Dive */}
      <section>
        <h2 className="section-title">Grader Deep Dive</h2>
        <p className="section-subtitle">
          How each evaluation technique works, where it comes from, and when to use it.
        </p>

        <div className="mt-8 space-y-6">
          {/* Faithfulness */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-foreground text-background px-2 py-0.5 text-xs font-bold">
                PROMPTFOO
              </span>
              <h3 className="font-bold text-lg uppercase tracking-wide">Faithfulness</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Type: <code>context-faithfulness</code> &middot; Default threshold: 0.8
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>What it measures:</strong> Whether every claim in the output is supported by
              the provided context. This is the core hallucination detection metric.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>How it works:</strong> The RAGAS framework (Es et al., 2023) breaks the output
              into atomic claims, then uses an NLI (Natural Language Inference) model to check
              whether each claim is entailed by the context. The score is the fraction of claims
              that are supported. A score of 0.8 means 80% of claims are grounded.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>When to use:</strong> Any task where the output should be grounded in source
              material &mdash; Q&amp;A over documents, summarization, RAG pipelines. Essential when
              factual accuracy matters more than creativity.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Origin:{' '}
              <a
                href="https://arxiv.org/abs/2309.15217"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                RAGAS (Es et al., 2023)
              </a>{' '}
              &middot; Implementation: promptfoo assertion engine
            </p>
          </div>

          {/* Semantic Similarity */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-foreground text-background px-2 py-0.5 text-xs font-bold">
                BUILT-IN
              </span>
              <h3 className="font-bold text-lg uppercase tracking-wide">Semantic Similarity</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Type: <code>semantic-similarity</code> &middot; Default threshold: 0.8
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>What it measures:</strong> Whether the output means the same thing as the
              expected answer, even if worded differently.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>How it works:</strong> Both texts are converted into high-dimensional
              embedding vectors using a model like <code>text-embedding-3-small</code> (OpenAI) or a
              local Ollama model. The cosine similarity between the two vectors gives a 0-1 score.
              Unlike string matching, this captures paraphrases, synonyms, and structural
              rearrangements.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>When to use:</strong> Tasks with a known &ldquo;right answer&rdquo; where
              exact wording doesn&apos;t matter &mdash; factual Q&amp;A, translation equivalence, or
              checking that a rewrite preserves meaning. Not ideal for creative tasks where many
              valid answers exist.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Origin:{' '}
              <a
                href="https://arxiv.org/abs/1908.10084"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Sentence-BERT (Reimers &amp; Gurevych, 2019)
              </a>
            </p>
          </div>

          {/* LLM-as-Judge */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-foreground text-background px-2 py-0.5 text-xs font-bold">
                BUILT-IN
              </span>
              <h3 className="font-bold text-lg uppercase tracking-wide">LLM-as-Judge</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Type: <code>llm-judge</code> &middot; Used by: Helpfulness Judge, Extraction
              Completeness
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>What it measures:</strong> Open-ended quality assessment against a
              human-written rubric. Each grader defines its own criteria &mdash; the Helpfulness
              Judge checks clarity, accuracy, and relevance; the Extraction Completeness Judge
              checks completeness, accuracy, grounding, and schema compliance.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>How it works:</strong> A capable LLM (your configured provider) receives the
              input, output, expected output, context, and a rubric. It evaluates the output against
              the rubric and returns a pass/fail decision with a reason. This is the most flexible
              grader &mdash; you can evaluate anything you can describe in natural language.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Trade-offs:</strong> Powerful but non-deterministic. Different models or
              temperatures may give different scores for the same output. Costs an LLM call per
              evaluation. Best used alongside deterministic graders (similarity, schema) so you have
              a reliable baseline plus nuanced assessment.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>When to use:</strong> When you need to evaluate subjective qualities
              (helpfulness, tone, completeness) or complex criteria that can&apos;t be captured by
              pattern matching or embeddings.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Origin:{' '}
              <a
                href="https://arxiv.org/abs/2306.05685"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                LLM-as-Judge (Zheng et al., 2023)
              </a>
            </p>
          </div>

          {/* JSON Schema */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-foreground text-background px-2 py-0.5 text-xs font-bold">
                BUILT-IN
              </span>
              <h3 className="font-bold text-lg uppercase tracking-wide">JSON Schema Validation</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Type: <code>json-schema</code> &middot; Binary pass/fail
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>What it measures:</strong> Whether the output is valid JSON that conforms to a
              defined schema &mdash; required fields present, correct types, valid structure.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>How it works:</strong> Parses the output as JSON (extracting from markdown
              code fences if needed), then validates against a JSON Schema definition. Completely
              deterministic &mdash; no LLM calls, no embeddings. Instant, free, and perfectly
              reproducible.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>When to use:</strong> Any structured extraction task &mdash; pulling data from
              documents, function calling outputs, API response generation. Pairs well with an
              LLM-as-Judge grader: schema validates structure, judge validates content quality.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Origin: JSON Schema specification &middot; Common in function-calling and structured
              output benchmarks
            </p>
          </div>

          {/* Deterministic graders */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-foreground text-background px-2 py-0.5 text-xs font-bold">
                BUILT-IN
              </span>
              <h3 className="font-bold text-lg uppercase tracking-wide">Deterministic Graders</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Types: <code>exact-match</code>, <code>contains</code>, <code>regex</code>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Simple pattern matching &mdash; no LLM calls, no embeddings. Zero cost, instant,
              perfectly reproducible.
            </p>
            <ul className="list-brutal mt-4 text-muted-foreground">
              <li>
                <strong>Exact Match</strong> &mdash; Binary string equality between output and
                expected. From the SQuAD benchmark (Rajpurkar et al., 2016) where it&apos;s paired
                with F1 score. Good for classification, short-answer, or any task with a single
                correct answer.
              </li>
              <li>
                <strong>Contains</strong> &mdash; Checks whether required substrings appear in the
                output. Inspired by HELM (Liang et al., 2022). Good for verifying that specific
                facts, keywords, or phrases are present without constraining the full output.
              </li>
              <li>
                <strong>Regex</strong> &mdash; Pattern matching with regular expressions. Good for
                format validation (dates, IDs, structured patterns) or extracting specific fields
                from free-text output.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>When to use:</strong> As sanity checks alongside LLM-powered graders.
              Deterministic graders catch obvious failures instantly. If the output doesn&apos;t
              contain a required keyword, there&apos;s no need to run an expensive LLM judge on it.
            </p>
          </div>

          {/* Choosing graders */}
          <div className="card p-6 border-l-4 border-l-foreground">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
              Choosing the Right Graders
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Layer graders from cheap/fast to expensive/nuanced:
            </p>
            <ol className="mt-4 space-y-2 text-muted-foreground text-sm">
              <li>
                <strong>1. Deterministic first.</strong> Exact match, contains, regex, JSON schema.
                Free, instant, catches structural failures.
              </li>
              <li>
                <strong>2. Embeddings next.</strong> Semantic similarity gives a meaning-aware score
                without the variability of an LLM judge.
              </li>
              <li>
                <strong>3. LLM-powered last.</strong> Faithfulness and LLM-as-Judge for nuanced
                quality assessment. Most powerful but costs an LLM call per evaluation.
              </li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Each prompt in this harness declares its own grader weights via{' '}
              <code>recommended_graders</code>, so different candidates can prioritize different
              metrics. A Q&amp;A prompt might weight faithfulness at 60%; a creative writing prompt
              might weight helpfulness at 80%.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Database Architecture */}
      <section>
        <h2 className="section-title">Database Architecture: Adapter Pattern</h2>
        <p className="section-subtitle">
          The harness uses a <strong>database-agnostic adapter pattern</strong> that decouples
          business logic from any specific database engine. Today it ships with SQLite; adding
          Postgres or MySQL requires only a new adapter file.
        </p>

        <div className="mt-8 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6" />
              <h3 className="font-bold text-lg uppercase tracking-wide">How It Works</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All database access flows through a single <code>IDbAdapter</code> TypeScript
              interface defined in{' '}
              <code>backend/src/database/interfaces/db-adapter.interface.ts</code>. This interface
              declares every operation the application needs &mdash; CRUD for datasets, test cases,
              graders, candidates, experiments, results, and settings &mdash; plus aggregate queries
              for experiment statistics and optional transaction support.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              NestJS&apos;s dependency injection system provides the adapter via a{' '}
              <code>DB_ADAPTER</code> symbol token. Services inject this token and receive whichever
              concrete adapter is registered, without knowing or caring whether the underlying
              database is SQLite, Postgres, or MySQL.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
              Libraries &amp; Layers
            </h3>
            <ul className="list-brutal text-muted-foreground space-y-3">
              <li>
                <strong className="text-foreground">Drizzle ORM</strong> &mdash; Lightweight,
                type-safe query builder. The Drizzle schema (
                <code>backend/src/database/schema.ts</code>) defines tables with full TypeScript
                inference. Drizzle generates insert/select types automatically, so the schema is the
                single source of truth for column names, types, and constraints.
              </li>
              <li>
                <strong className="text-foreground">better-sqlite3</strong> &mdash; The SQLite
                driver underneath Drizzle. Fast, synchronous, zero-config, stores everything in a
                single <code>data/eval-harness.db</code> file. Perfect for local development and
                demos.
              </li>
              <li>
                <strong className="text-foreground">IDbAdapter interface</strong> &mdash; The
                abstraction layer between Drizzle and the rest of the app. Every service (datasets,
                experiments, graders, settings) calls adapter methods like{' '}
                <code>findAllDatasets()</code>, <code>insertResult()</code>, or{' '}
                <code>getExperimentStats()</code> instead of writing raw SQL or direct ORM calls.
              </li>
              <li>
                <strong className="text-foreground">SQLiteAdapter</strong> (
                <code>backend/src/database/adapters/sqlite.adapter.ts</code>) &mdash; The concrete
                implementation. Handles connection setup, auto-migration (adds new columns
                gracefully), and translates every <code>IDbAdapter</code> method into Drizzle
                queries.
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">Why This Pattern?</h3>
            <ul className="list-brutal text-muted-foreground space-y-3">
              <li>
                <strong className="text-foreground">Testability</strong> &mdash; Unit tests can mock
                the adapter interface without touching a real database. Integration tests can swap
                in an in-memory SQLite instance.
              </li>
              <li>
                <strong className="text-foreground">Portability</strong> &mdash; Adding Postgres
                support means writing one new file that implements <code>IDbAdapter</code>. Change a
                config flag, and the whole app runs on a production-grade database with zero changes
                to business logic.
              </li>
              <li>
                <strong className="text-foreground">Auto-migration</strong> &mdash; The SQLite
                adapter checks for missing columns on startup and runs{' '}
                <code>ALTER TABLE ADD COLUMN</code> as needed. No migration scripts or CLI tools
                required &mdash; the app self-heals when the schema evolves.
              </li>
              <li>
                <strong className="text-foreground">Separation of concerns</strong> &mdash; Services
                think in domain terms (experiments, results, candidates). The adapter translates
                those into SQL. Adding a cache layer, read replicas, or audit logging happens in one
                place.
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-4">
              Hybrid Storage: Files + Database
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              The harness uses a <strong>dual storage model</strong>. Definitions live on disk:
              prompt markdown files (<code>backend/prompts/</code>), dataset CSVs (
              <code>backend/datasets/</code>), and grader YAMLs (<code>backend/graders/</code>).
              These are version-controllable, human-readable, and editable with any text editor.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Runtime data lives in SQLite: experiment runs, scored results, settings, and resolved
              snapshots of datasets/graders at experiment time. This means you can delete the
              database file and start fresh &mdash; all definitions reload from disk automatically.
              The database is disposable; your prompt engineering work is not.
            </p>
          </div>
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
              Create a subfolder in <code>backend/datasets/</code> (e.g. <code>my-dataset/</code>)
              and place a <code>data.csv</code> inside with columns: <code>input</code>,{' '}
              <code>expected_output</code>, <code>context</code>, <code>metadata</code>. Add an
              optional <code>meta.yaml</code> for a display name and description. Click
              &ldquo;Reload from Disk&rdquo; in the Datasets tab, or use &ldquo;Upload CSV&rdquo; to
              import directly.
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
