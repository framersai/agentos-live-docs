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
      <div className="hero-agentos__logo">
        <img src="/img/logo.svg" alt="AgentOS" width={72} height={72} />
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

      <div className="hero-badges">
        <a href="https://github.com/framersai/agentos" className="hero-badge" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/github/stars/framersai/agentos?style=for-the-badge&logo=github&logoColor=white&label=stars&color=6366f1&labelColor=4f46e5" alt="GitHub stars" />
        </a>
        <a href="https://www.npmjs.com/package/@framers/agentos" className="hero-badge" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/npm/v/@framers/agentos?style=for-the-badge&logo=npm&logoColor=white&label=npm&color=6366f1&labelColor=4f46e5" alt="npm version" />
        </a>
        <span className="hero-badge">
          <img src="https://img.shields.io/badge/TypeScript-5.4+-6366f1?style=for-the-badge&logo=typescript&logoColor=white&labelColor=4f46e5" alt="TypeScript" />
        </span>
        <span className="hero-badge">
          <img src="https://img.shields.io/badge/license-Apache_2.0-6366f1?style=for-the-badge&labelColor=4f46e5" alt="License" />
        </span>
      </div>

      <div className="hero-buttons">
        <Link className="btn-primary" to="/getting-started">
          Get Started
        </Link>
        <Link className="btn-secondary" to="/getting-started/examples">
          Examples
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
              fontFamily: "'JetBrains Mono', monospace",
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

  'Video & Audio': `import { generateVideo, analyzeVideo, generateMusic, generateSFX } from '@framers/agentos';

// Text-to-video — provider auto-detected from env vars
const video = await generateVideo({
  prompt: 'A drone flying over a misty forest at sunrise',
  provider: 'runway',
  durationSec: 5,
  aspectRatio: '16:9',
});
console.log(video.videos[0].url);

// Video analysis with RAG indexing
const analysis = await analyzeVideo({
  videoUrl: 'https://example.com/demo.mp4',
  transcribeAudio: true,
  indexForRAG: true,      // Index scenes into the vector store
});
console.log(analysis.scenes);

// Music generation — 8 providers with auto-fallback
const music = await generateMusic({
  prompt: 'Upbeat lo-fi hip hop beat with vinyl crackle and mellow piano',
  durationSec: 60,
});

// Sound effects
const sfx = await generateSFX({
  prompt: 'Thunder crack followed by heavy rain on a tin roof',
  durationSec: 5,
});`,

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
              fontFamily: "'JetBrains Mono', monospace",
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
    subgraph API_LAYER["API Layer"]
        direction LR
        GT["generateText()"]
        ST["streamText()"]
        GO["generateObject()"]
        GI["generateImage()"]
        AG["agent()"]
        AGY["agency()"]
    end

    subgraph GMI_LAYER["Cognitive Substrate"]
        GMI["GMI Instance"]
        CONV["ConversationHistoryManager"]
        SENT["SentimentTracker"]
        META["MetapromptExecutor"]
        PERSONA["PersonaOverlayManager<br/>HEXACO 6-Factor Personality"]
    end

    subgraph MEMORY_LAYER["Memory System"]
        WM["Working Memory"]
        EPIS["Episodic Memory<br/>Ebbinghaus Decay"]
        SEM["Semantic Memory<br/>GraphRAG + Louvain"]
        OBS["Observational Memory<br/>3-10x LLM Compression"]
        MECH["8 Cognitive Mechanisms<br/>Reconsolidation \u00B7 RIF \u00B7 FOK \u00B7 Gist"]
    end

    subgraph RAG_LAYER["RAG Pipeline"]
        INGEST["10 Document Loaders"]
        CHUNK["4 Chunking Strategies"]
        EMBED["Embedding Providers"]
        VECTOR["7 Vector Backends<br/>SQLite \u00B7 HNSW \u00B7 Postgres \u00B7 Qdrant \u00B7 Pinecone \u00B7 Neo4j"]
        RETRIEVE["Retrieval: Semantic \u00B7 HyDE \u00B7 GraphRAG \u00B7 Hybrid"]
        RERANK["Cross-Encoder Reranking"]
    end

    subgraph SAFETY_LAYER["Safety & Guardrails"]
        TIERS["5 Security Tiers<br/>dangerous \u2192 paranoid"]
        PII["PII Redaction<br/>4-tier: Regex+NLP+NER+LLM"]
        ML["ML Classifiers<br/>ONNX BERT: Toxicity \u00B7 Injection"]
        GROUND["Grounding Guard<br/>NLI Hallucination Detection"]
        CODE["Code Safety<br/>OWASP Top 10"]
    end

    subgraph TOOLS_LAYER["Tools & Extensions"]
        ORCH["ToolOrchestrator"]
        EXT["107 Extensions"]
        SKILLS["72 Curated Skills"]
        DISC["Capability Discovery<br/>3-Tier Semantic Search"]
        FORGE["Emergent Tool Forge<br/>Runtime Tool Creation"]
    end

    subgraph EXEC_LAYER["Orchestration"]
        WF["workflow() DSL"]
        MISS["mission() Planner<br/>Tree of Thought"]
        AGRAPH["AgentGraph<br/>Programmatic DAGs"]
        HITL["Human-in-the-Loop<br/>CLI \u00B7 Webhook \u00B7 Slack"]
        CKPT["Checkpoint / Resume"]
    end

    subgraph IO_LAYER["I/O Layer"]
        VOICE["Voice Pipeline<br/>12 STT + 12 TTS Providers"]
        CHAN["37 Channel Adapters<br/>Discord \u00B7 Slack \u00B7 Telegram \u00B7 Twitter"]
        MEDIA["Media Generation<br/>Images \u00B7 Video \u00B7 Music \u00B7 SFX"]
        LLM["21 LLM Providers<br/>Auto-Fallback Chains"]
    end

    API_LAYER ==> GMI_LAYER
    GMI_LAYER ==> MEMORY_LAYER
    GMI_LAYER ==> SAFETY_LAYER
    GMI_LAYER ==> TOOLS_LAYER
    TOOLS_LAYER ==> EXEC_LAYER
    EXEC_LAYER ==> IO_LAYER
    MEMORY_LAYER -.-> RAG_LAYER

    INGEST --> CHUNK --> EMBED --> VECTOR --> RETRIEVE --> RERANK

    style API_LAYER fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#c7d2fe
    style GMI_LAYER fill:#1a1a2e,stroke:#06b6d4,stroke-width:2px,color:#cffafe
    style MEMORY_LAYER fill:#0f172a,stroke:#22c55e,stroke-width:2px,color:#dcfce7
    style RAG_LAYER fill:#0f172a,stroke:#14b8a6,stroke-width:2px,color:#ccfbf1
    style SAFETY_LAYER fill:#1a0a0a,stroke:#ef4444,stroke-width:2px,color:#fecaca
    style TOOLS_LAYER fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#fef3c7
    style EXEC_LAYER fill:#1e1b4b,stroke:#a78bfa,stroke-width:2px,color:#ede9fe
    style IO_LAYER fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#e9d5ff`;

function ArchitectureDiagram() {
  const [zoomed, setZoomed] = React.useState(false);
  const diagramContent = (
    <div style={{ overflow: 'auto', cursor: zoomed ? 'zoom-out' : 'zoom-in' }} onClick={() => setZoomed(!zoomed)}>
      <Mermaid value={architectureMermaid} />
    </div>
  );

  return (
    <>
      <section style={{ padding: '3rem 2rem 1rem', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>System Architecture</h2>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem' }}>Click diagram to expand. 8 subsystems, 21 providers, 107 extensions.</p>
        {!zoomed && diagramContent}
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/architecture/system-architecture" style={{ fontSize: '0.9rem' }}>
            Full architecture guide &rarr;
          </Link>
        </p>
      </section>

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', cursor: 'zoom-out',
          }}
        >
          <div style={{ maxWidth: '1400px', width: '100%', maxHeight: '90vh', overflow: 'auto', background: 'var(--ifm-background-color)', borderRadius: '12px', padding: '2rem' }}
               onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>System Architecture</h3>
              <button onClick={() => setZoomed(false)} style={{ background: 'none', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '0.25rem 0.75rem', cursor: 'pointer', color: 'var(--ifm-font-color-base)', fontSize: '0.85rem' }}>
                Close &times;
              </button>
            </div>
            <Mermaid value={architectureMermaid} />
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature Cards                                                      */
/* ------------------------------------------------------------------ */

const features = [
  {
    title: 'Multimodal Provider API',
    description:
      'Text, images, video, music, SFX, embeddings, and speech from one API. 21 cloud providers + local (Ollama, MusicGen, AudioGen). Auto-fallback chains with provider preferences for load balancing.',
    link: '/features/multimodal-rag',
  },
  {
    title: 'Deep Research Agents',
    description:
      'mission() API with Tree of Thought planning, multi-source search, grounding verification, and human-in-the-loop review. 3 autonomy modes, 5 provider strategies, and dynamic graph expansion.',
    link: '/features/deep-research',
  },
  {
    title: 'Emergent Capabilities',
    description:
      'Agents forge new tools at runtime \u2014 compose (chain existing tools) or sandbox (isolated V8 with allowlists). LLM-as-judge safety review, tiered promotion, portable YAML export.',
    link: '/features/emergent-capabilities',
  },
  {
    title: 'Voice & IVR Pipeline',
    description:
      'Full-duplex voice with 3 endpoint detection modes, barge-in handling, 27 STT/TTS providers, diarization. Twilio/Telnyx/Plivo telephony bridging for production IVR.',
    link: '/features/voice-pipeline',
  },
  {
    title: 'Graph Orchestration',
    description:
      'Three authoring APIs \u2014 AgentGraph, workflow() DSL, mission() \u2014 compile to one IR. judgeNode for evaluation, checkpointing for time-travel, streaming events.',
    link: '/features/unified-orchestration',
  },
  {
    title: 'Cognitive Memory',
    description:
      '8 neuroscience-grounded mechanisms with HEXACO personality modulation. Ebbinghaus decay, spreading activation, Baddeley working memory, GraphRAG retrieval with episodic-to-semantic consolidation.',
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
    link: '/features/evaluation-guide',
  },
  {
    title: 'Capability Discovery',
    description:
      '3-tier semantic discovery: category summaries (150 tokens) \u2192 top-5 matches (200 tokens) \u2192 full schemas on demand. 89% token reduction. Agents self-discover tools mid-conversation.',
    link: '/features/capability-discovery',
  },
  {
    title: 'Provenance & Audit',
    description:
      'Signed event ledger (Ed25519 + SHA-256 hash chain), soft-delete tombstones, revision history, autonomy guard. Merkle anchoring for tamper-evident external verification.',
    link: '/features/provenance-immutability',
  },
  {
    title: 'Channels & Social',
    description:
      'Telegram, Discord, Slack, WhatsApp, Twitter/X, LinkedIn, Bluesky, Mastodon, and 29 more. Multi-channel routing, social publishing, browser automation, and custom adapter APIs.',
    link: '/features/channels',
  },
  {
    title: 'Immutable Agents',
    description:
      'Sealed storage policy, toolset pinning, secret rotation, soft-forget memory. Full provenance audit trail. Deploy agents that cannot be tampered with after initialization.',
    link: '/features/immutable-agents',
  },
  {
    title: 'Video & Audio Generation',
    description:
      'generateVideo(), analyzeVideo(), detectScenes(), generateMusic(), generateSFX() APIs. 3 video providers (Runway, Replicate, Fal) + 8 audio providers. Fallback chains, scene detection, RAG indexing.',
    link: '/features/video-pipeline',
  },
  {
    title: '72 Curated Skills',
    description:
      'SKILL.md prompt modules across 8 categories: information, developer-tools, communication, productivity, devops, media, security, creative. Semantic discovery finds the right skill per turn.',
    link: '/skills/overview',
  },
  {
    title: 'Self-Improving Agents',
    description:
      'Bounded self-modification: adapt_personality (HEXACO mutation with per-session budgets), manage_skills, create_workflow, self_evaluate. Ebbinghaus decay ensures unreinforced changes fade.',
    link: '/features/self-improving-agents',
  },
];

function Features() {
  return (
    <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Core Features</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
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
    <Layout description="AgentOS \u2014 open-source TypeScript runtime for autonomous AI agents with unified graph orchestration, cognitive memory, streaming guardrails, and voice pipeline.">
      <Hero />
      <InstallTabs />
      <QuickStartTabs />
      <ArchitectureDiagram />
      <Features />
    </Layout>
  );
}
