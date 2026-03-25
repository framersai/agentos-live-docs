import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Mermaid from '@theme/Mermaid';

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero-agentos">
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <a href="https://www.npmjs.com/package/@framers/agentos">
          <img
            src="https://img.shields.io/npm/v/@framers/agentos?style=flat-square&logo=npm&color=cb3837"
            alt="npm"
          />
        </a>
        <a href="https://github.com/framersai/agentos/actions">
          <img
            src="https://img.shields.io/github/actions/workflow/status/framersai/agentos/ci.yml?style=flat-square&logo=github&label=CI"
            alt="CI"
          />
        </a>
        <a href="https://github.com/framersai/agentos">
          <img
            src="https://img.shields.io/github/stars/framersai/agentos?style=flat-square&logo=github"
            alt="Stars"
          />
        </a>
        <a href="https://github.com/framersai/agentos/network/members">
          <img
            src="https://img.shields.io/github/forks/framersai/agentos?style=flat-square&logo=github"
            alt="Forks"
          />
        </a>
        <img
          src="https://img.shields.io/badge/TypeScript-5.4+-3178c6?style=flat-square&logo=typescript&logoColor=white"
          alt="TypeScript"
        />
        <img
          src="https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square"
          alt="License"
        />
      </div>

      <h1 className="hero-agentos__title">
        Agent
        <span
          style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          OS
        </span>
      </h1>

      <p className="hero-agentos__subtitle">{siteConfig.tagline}</p>

      <div className="hero-buttons">
        <Link className="btn-primary" to="/getting-started/documentation-index">
          Get Started
        </Link>
        <Link className="btn-secondary" to="/getting-started/high-level-api">
          High-Level API
        </Link>
        <Link className="btn-secondary" to="/api/">
          API Reference
        </Link>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Install Tabs                                                       */
/* ------------------------------------------------------------------ */

const installCommands = {
  npm: 'npm install @framers/agentos',
  pnpm: 'pnpm add @framers/agentos',
  yarn: 'yarn add @framers/agentos',
  bun: 'bun add @framers/agentos',
};

function InstallTabs() {
  const [pm, setPm] = useState<keyof typeof installCommands>('npm');
  return (
    <section style={{ padding: '2rem 2rem 0', maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
        {(Object.keys(installCommands) as Array<keyof typeof installCommands>).map((key) => (
          <button
            key={key}
            onClick={() => setPm(key)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.8rem',
              fontWeight: pm === key ? 700 : 400,
              background: pm === key ? 'var(--ifm-color-primary)' : 'transparent',
              color: pm === key ? '#fff' : 'var(--ifm-font-color-base)',
              opacity: pm === key ? 1 : 0.6,
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <CodeBlock language="bash">{installCommands[pm]}</CodeBlock>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Start Code Tabs                                              */
/* ------------------------------------------------------------------ */

const quickStartCode = {
  'Provider-First': `import { generateText, streamText, generateImage, agent } from '@framers/agentos';

// Just specify the provider — smart defaults pick the right model
const result = await generateText({
  provider: 'openai',
  prompt: 'Explain TCP handshakes in 3 bullets.',
});
console.log(result.text);

// Stream responses
for await (const delta of streamText({ provider: 'anthropic', prompt: 'Explain UDP.' }).textStream) {
  process.stdout.write(delta);
}

// Generate images
const image = await generateImage({ provider: 'openai', prompt: 'Neon city at night.' });

// Stateful agent with sessions
const assistant = agent({ provider: 'openai', instructions: 'You are a networking tutor.' });
const reply = await assistant.session('demo').send('Compare TCP and UDP.');`,

  'Workflows (YAML)': `# research-pipeline.workflow.yaml
name: research-pipeline
input:
  topic: { type: string, required: true }
returns:
  summary: { type: string }
steps:
  - id: search
    tool: web_search
  - id: evaluate
    gmi:
      instructions: "Evaluate source quality, assign confidence 0-1"
  - id: judge
    judge:
      rubric: "Score accuracy (1-10) and credibility (1-10)"
      threshold: 7
  - id: summarize
    gmi:
      instructions: "Write a cited summary"
    guardrails:
      output: [grounding-guard]`,

  AgentGraph: `import { AgentGraph, toolNode, gmiNode, START, END } from '@framers/agentos/orchestration';
import { z } from 'zod';

const graph = new AgentGraph({
  input: z.object({ topic: z.string() }),
  scratch: z.object({ confidence: z.number().default(0) }),
  artifacts: z.object({ summary: z.string() }),
})
  .addNode('search', toolNode('web_search'))
  .addNode('evaluate', gmiNode({ instructions: 'Score quality', executionMode: 'single_turn' }))
  .addNode('summarize', gmiNode({ instructions: 'Write summary', executionMode: 'single_turn' }))
  .addEdge(START, 'search')
  .addEdge('search', 'evaluate')
  .addConditionalEdge('evaluate', (s) => s.scratch.confidence > 0.8 ? 'summarize' : 'search')
  .addEdge('summarize', END)
  .compile();

const result = await graph.invoke({ topic: 'quantum computing' });`,

  Mission: `import { mission, toolNode, humanNode } from '@framers/agentos/orchestration';
import { z } from 'zod';

const researcher = mission('deep-research')
  .input(z.object({ topic: z.string() }))
  .goal('Research {topic} thoroughly and produce a cited summary')
  .returns(z.object({ summary: z.string(), confidence: z.number() }))
  .planner({ strategy: 'plan_and_execute', maxSteps: 8 })
  .policy({
    memory: { read: { types: ['semantic', 'episodic'] }, write: 'auto' },
    discovery: { kind: 'tool', fallback: 'all' },
    guardrails: ['grounding-guard', 'pii-redaction'],
  })
  .anchor('fact-check', toolNode('grounding_verifier'), { phase: 'validate', required: true })
  .anchor('human-review', humanNode({ prompt: 'Verify sources' }), { phase: 'validate', after: 'fact-check' })
  .compile();

const plan = await researcher.explain({ topic: 'AI safety' });
const result = await researcher.invoke({ topic: 'AI safety' });`,
};

function QuickStartTabs() {
  const tabs = Object.keys(quickStartCode) as Array<keyof typeof quickStartCode>;
  const [active, setActive] = useState(tabs[0]);
  return (
    <section style={{ padding: '2rem 2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Quick Start</h2>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.8rem',
              fontWeight: active === tab ? 700 : 400,
              background: active === tab ? 'var(--ifm-color-primary)' : 'transparent',
              color: active === tab ? '#fff' : 'var(--ifm-font-color-base)',
              opacity: active === tab ? 1 : 0.6,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <CodeBlock language={active.includes('YAML') ? 'yaml' : 'typescript'}>
        {quickStartCode[active]}
      </CodeBlock>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Architecture Diagram (Mermaid)                                     */
/* ------------------------------------------------------------------ */

const architectureMermaid = `graph TB
    subgraph Runtime["AgentOS Runtime"]
        API["<b>High-Level API</b><br/>generateText · streamText · generateImage<br/>agent() · mission() · workflow() · AgentGraph"]

        subgraph GMI["Cognitive Substrate — GMI"]
            WM["Working<br/>Memory"] ~~~ CM["Context<br/>Manager"] ~~~ PO["Persona<br/>Overlay"] ~~~ LM["Learning<br/>Module"]
        end

        API --> GMI

        subgraph Core["Core Services"]
            MEM["Memory<br/><i>Cognitive + GraphRAG</i>"]
            TOOLS["Tools<br/><i>23+ & Discovery</i>"]
            GUARD["Guardrails<br/><i>5-Tier Pipeline</i>"]
        end

        GMI --> MEM
        GMI --> TOOLS
        GMI --> GUARD

        subgraph GraphRT["Graph Runtime"]
            EXEC["CompiledExecutionGraph"] ~~~ SCHED["NodeScheduler"]
            LOOP["LoopController"] ~~~ CKPT["Checkpoints"]
        end

        TOOLS --> GraphRT

        subgraph Infra["Infrastructure"]
            VOICE["Voice Pipeline<br/><i>STT / TTS</i>"]
            CHAN["Channels<br/><i>37 Adapters</i>"]
            LLM["LLM Providers<br/><i>21 Providers</i>"]
        end

        GraphRT --> VOICE
        GraphRT --> CHAN
        GraphRT --> LLM
    end

    style Runtime fill:#0e0e18,stroke:#c9a227,stroke-width:2px,color:#f2f2fa
    style GMI fill:#151520,stroke:#00f5ff,stroke-width:1px,color:#f2f2fa
    style Core fill:#151520,stroke:#22c55e,stroke-width:1px,color:#f2f2fa
    style GraphRT fill:#151520,stroke:#f59e0b,stroke-width:1px,color:#f2f2fa
    style Infra fill:#151520,stroke:#8b5cf6,stroke-width:1px,color:#f2f2fa`;

function ArchitectureDiagram() {
  return (
    <section style={{ padding: '3rem 2rem 1rem', maxWidth: '960px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>System Architecture</h2>
      <div style={{ overflow: 'auto' }}>
        <Mermaid value={architectureMermaid} />
      </div>
      <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        <Link to="/architecture/system-architecture" style={{ fontSize: '0.9rem' }}>
          Full architecture guide &rarr;
        </Link>
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature Cards                                                      */
/* ------------------------------------------------------------------ */

const features = [
  {
    title: 'Unified Orchestration',
    description:
      'Three authoring APIs (AgentGraph, workflow, mission) compile to one IR. Visual builder, YAML authoring, checkpointing, time-travel.',
    link: '/features/unified-orchestration',
  },
  {
    title: 'Provider-First API',
    description:
      'Just specify provider: "openai" — smart defaults pick the right model for text, images, embeddings, and speech.',
    link: '/getting-started/high-level-api',
  },
  {
    title: 'Cognitive Memory',
    description:
      'Ebbinghaus decay, spreading activation, Baddeley working memory, personality-driven encoding with GraphRAG retrieval.',
    link: '/features/cognitive-memory',
  },
  {
    title: 'Streaming Guardrails',
    description:
      '5-tier security: PII redaction, ML classifiers, topicality, code safety, grounding guard. Sentence-boundary buffering for streaming.',
    link: '/features/guardrails',
  },
  {
    title: 'Voice Pipeline',
    description:
      'Full-duplex voice with endpoint detection, barge-in handling, 21 STT/TTS providers, telephony bridging.',
    link: '/features/voice-pipeline',
  },
  {
    title: 'Capability Discovery',
    description:
      '3-tier semantic discovery — 89% token reduction. Agents self-discover tools mid-conversation via embedding search + graph re-ranking.',
    link: '/features/capability-discovery',
  },
  {
    title: '37 Channel Adapters',
    description:
      'Telegram, Discord, Slack, WhatsApp, Twitter/X, LinkedIn, email, SMS, and 29 more. Full Postiz parity.',
    link: '/extensions/overview',
  },
  {
    title: 'LLM-as-Judge',
    description:
      'judgeNode with structured rubric scoring, multi-judge evaluation pipelines, and threshold-based routing.',
    link: '/features/unified-orchestration',
  },
  {
    title: '21 LLM Providers',
    description:
      'OpenAI, Anthropic, Gemini, Ollama, OpenRouter, Cohere, Replicate, and 14 more. Auto-fallback and cost optimization.',
    link: '/architecture/system-architecture',
  },
];

function Features() {
  return (
    <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Core Features</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {features.map(({ title, description, link }) => (
          <Link key={title} to={link} className="feature-card">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{title}</h3>
            <p style={{ opacity: 0.7, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home(): React.JSX.Element {
  return (
    <Layout description="AgentOS — open-source TypeScript runtime for autonomous AI agents with unified graph orchestration, cognitive memory, streaming guardrails, and voice pipeline.">
      <Hero />
      <InstallTabs />
      <QuickStartTabs />
      <ArchitectureDiagram />
      <Features />
    </Layout>
  );
}
