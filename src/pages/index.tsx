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
  Multimodal: `import { generateText, streamText, generateImage, agent } from '@framers/agentos';

// Text — just set the provider, AgentOS picks the model
const { text } = await generateText({ provider: 'openai', prompt: 'Explain QUIC.' });

// Images — cloud or local (Ollama, SD WebUI)
const poster = await generateImage({
  provider: 'stability',
  model: 'stable-image-core',
  prompt: 'Art deco travel poster for a moon colony',
  providerOptions: { stability: { stylePreset: 'illustration' } },
});

// Streaming
for await (const delta of streamText({ provider: 'anthropic', prompt: 'Compare TCP vs UDP.' }).textStream) {
  process.stdout.write(delta);
}

// Stateful agent with sessions and personality
const tutor = agent({
  provider: 'openai',
  instructions: 'You are a networking tutor.',
  personality: { openness: 0.9, conscientiousness: 0.8 },  // HEXACO
});
const session = tutor.session('demo');
await session.send('What is QUIC?');
await session.send('How does it compare to HTTP/2?');`,

  'Deep Research': `import { mission, toolNode, humanNode } from '@framers/agentos/orchestration';
import { z } from 'zod';

// Goal-first orchestration — the planner decides the steps
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
  .anchor('human-review', humanNode({ prompt: 'Verify sources' }), { phase: 'validate' })
  .compile();

const plan = await researcher.explain({ topic: 'AI safety' });  // Preview the plan
const result = await researcher.invoke({ topic: 'AI safety' });  // Execute it`,

  'Voice IVR': `import { AgentOS } from '@framers/agentos';

const agent = new AgentOS();
await agent.initialize({
  provider: 'openai',
  voice: {
    stt: { provider: 'deepgram', model: 'nova-2' },
    tts: { provider: 'elevenlabs', model: 'eleven_turbo_v2', voice: 'Rachel' },
    vad: { provider: 'silero' },
    endpointDetection: 'acoustic',   // or 'heuristic' | 'semantic'
    bargeinStrategy: 'soft-fade',    // or 'hard-cut'
  },
  telephony: {
    provider: 'twilio',              // or 'telnyx' | 'plivo'
    webhookPath: '/voice/webhook',
  },
  guardrails: ['pii-redaction'],     // Redact PII from voice transcripts
});

// Handle inbound calls
agent.onCall(async (call) => {
  for await (const chunk of agent.processVoice(call)) {
    call.stream(chunk);              // Stream TTS audio back
  }
});`,

  'Emergent Tools': `import { AgentOS } from '@framers/agentos';

// Enable emergent capabilities — agents can forge new tools at runtime
const agent = new AgentOS();
await agent.initialize({
  provider: 'openai',
  emergent: true,
  emergentConfig: {
    maxSessionTools: 10,
    sandboxTimeoutMs: 5000,
    judgeModel: 'gpt-4o-mini',       // LLM-as-judge for safety review
  },
});

// The agent now has forge_tool. When it encounters a task with no matching
// tool, it creates one — compose mode (chain existing tools) or sandbox
// mode (isolated V8). Every tool is judge-reviewed before activation.

// Tools start at session tier, auto-promote to agent tier after 5+ uses
// with >0.8 confidence, then require human approval for shared tier.

// Export a forged tool as a portable YAML package:
// wunderland emergent export <id> --output ./my-tool.emergent-tool.yaml`,

  AgentGraph: `import { AgentGraph, toolNode, gmiNode, judgeNode, START, END } from '@framers/agentos/orchestration';
import { z } from 'zod';

const graph = new AgentGraph({
  input: z.object({ topic: z.string() }),
  scratch: z.object({ confidence: z.number().default(0) }),
  artifacts: z.object({ summary: z.string(), image: z.string().optional() }),
})
  .addNode('search', toolNode('web_search'))
  .addNode('evaluate', gmiNode({ instructions: 'Score source quality 0-1' }))
  .addNode('judge', judgeNode({
    rubric: 'Score accuracy (1-10) and credibility (1-10)',
    threshold: 7,
  }))
  .addNode('summarize', gmiNode({ instructions: 'Write a cited summary' }))
  .addNode('illustrate', toolNode('generate_image'))
  .addEdge(START, 'search')
  .addEdge('search', 'evaluate')
  .addConditionalEdge('evaluate', (s) => s.scratch.confidence > 0.8 ? 'judge' : 'search')
  .addEdge('judge', 'summarize')
  .addEdge('summarize', 'illustrate')
  .addEdge('illustrate', END)
  .compile({ checkpoint: 'every_node' });  // Enable time-travel

const result = await graph.invoke({ topic: 'quantum computing' });`,
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

const architectureMermaid = `flowchart TD
    API["<b>High-Level API</b><br/>generateText · streamText · generateImage · agent()"]
    API --> GMI["<b>Cognitive Substrate</b> — GMI<br/>Persona · HEXACO · Working Memory · ReAct Loop"]
    GMI --> MEM["<b>Memory</b><br/>Cognitive + GraphRAG + Ebbinghaus Decay"]
    GMI --> TOOLS["<b>Tools</b><br/>23+ Built-in · Semantic Discovery · Emergent Forge"]
    GMI --> GUARD["<b>Guardrails</b><br/>5-Tier Pipeline · PII · ML Classifiers · Grounding"]
    TOOLS --> GRAPH["<b>Graph Runtime</b><br/>AgentGraph · workflow() · mission() · Checkpoints"]
    GRAPH --> VOICE["<b>Voice Pipeline</b><br/>28 STT/TTS Providers · VAD · Barge-in"]
    GRAPH --> CHAN["<b>Channels</b><br/>37 Platform Adapters"]
    GRAPH --> LLM["<b>LLM Providers</b><br/>21 Providers · Auto-fallback · Local (Ollama)"]

    style API fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
    style GMI fill:#1e1b4b,stroke:#00f5ff,stroke-width:2px,color:#e0e7ff
    style MEM fill:#0f172a,stroke:#22c55e,color:#e0e7ff
    style TOOLS fill:#0f172a,stroke:#22c55e,color:#e0e7ff
    style GUARD fill:#0f172a,stroke:#ef4444,color:#e0e7ff
    style GRAPH fill:#1e1b4b,stroke:#f59e0b,stroke-width:2px,color:#e0e7ff
    style VOICE fill:#0f172a,stroke:#8b5cf6,color:#e0e7ff
    style CHAN fill:#0f172a,stroke:#8b5cf6,color:#e0e7ff
    style LLM fill:#0f172a,stroke:#8b5cf6,color:#e0e7ff`;

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
    title: 'Multimodal Provider API',
    description:
      'Text, images, embeddings, and speech from one API. 21 cloud providers (OpenAI, Anthropic, Gemini, Stability, Replicate) + local (Ollama, SD WebUI). Auto-fallback between providers.',
    link: '/getting-started/high-level-api',
  },
  {
    title: 'Deep Research Agents',
    description:
      'mission() API with goal-first planning, multi-source search, grounding verification, and human-in-the-loop review. Agents plan their own steps, discover tools, and self-evaluate.',
    link: '/features/deep-research',
  },
  {
    title: 'Emergent Capabilities',
    description:
      'Agents forge new tools at runtime — compose (chain existing tools) or sandbox (isolated V8 with allowlists). LLM-as-judge safety review, tiered promotion, portable YAML export.',
    link: '/features/emergent-capabilities',
  },
  {
    title: 'Voice & IVR Pipeline',
    description:
      'Full-duplex voice with 3 endpoint detection modes, barge-in handling, 28 STT/TTS providers, diarization. Twilio/Telnyx/Plivo telephony bridging for production IVR.',
    link: '/features/voice-pipeline',
  },
  {
    title: 'Graph Orchestration',
    description:
      'Three authoring APIs — AgentGraph, workflow() DSL, mission() — compile to one IR. judgeNode for evaluation, checkpointing for time-travel, streaming events.',
    link: '/features/unified-orchestration',
  },
  {
    title: 'Cognitive Memory',
    description:
      'Ebbinghaus decay, spreading activation, Baddeley working memory, personality-driven encoding (HEXACO). GraphRAG retrieval with episodic-to-semantic consolidation.',
    link: '/features/cognitive-memory',
  },
  {
    title: 'Streaming Guardrails',
    description:
      '5-tier pipeline: PII redaction (regex + NLP + NER + LLM), ML classifiers (ONNX BERT), topicality drift, code safety (OWASP), grounding guard (NLI). Sentence-boundary buffered.',
    link: '/features/guardrails',
  },
  {
    title: 'Evaluation Framework',
    description:
      'Dataset-driven evals with candidates, graders, and experiments. LLM prompt runner and HTTP endpoint runner. Compare baseline vs challenger. Drizzle ORM with SQLite/Postgres.',
    link: '/features/evaluation-framework',
  },
  {
    title: 'Capability Discovery',
    description:
      '3-tier semantic discovery: category summaries (150 tokens) → top-5 matches (200 tokens) → full schemas on demand. 89% token reduction. Agents self-discover tools mid-conversation.',
    link: '/features/capability-discovery',
  },
  {
    title: 'Provenance & Audit',
    description:
      'Signed event ledger (Ed25519 + SHA-256 hash chain), soft-delete tombstones, revision history, autonomy guard. Merkle anchoring for tamper-evident external verification.',
    link: '/features/provenance-immutability',
  },
  {
    title: '37 Channel Adapters',
    description:
      'Telegram, Discord, Slack, WhatsApp, Twitter/X, LinkedIn, email, SMS, and 29 more. Multi-channel routing, content adaptation engine, and custom adapter API.',
    link: '/extensions/overview',
  },
  {
    title: 'Immutable Agents',
    description:
      'Sealed storage policy, toolset pinning, secret rotation, soft-forget memory. Full provenance audit trail. Deploy agents that cannot be tampered with after initialization.',
    link: '/features/immutable-agents',
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
