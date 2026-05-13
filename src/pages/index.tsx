import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

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
          {/* Static badge with the star count baked in at build time —
              avoids shields.io's unauthenticated rate-limit fallback
              that intermittently rendered "invalid" on this badge.
              The count comes from a GH_PAT-authenticated API call in
              docusaurus.config.ts and refreshes every deploy. */}
          <img
            src={`https://img.shields.io/badge/stars-${(siteConfig.customFields?.githubStars as number | undefined) ?? 268}-6366f1?style=for-the-badge&logo=github&logoColor=white&labelColor=4f46e5`}
            alt={`GitHub stars: ${(siteConfig.customFields?.githubStars as number | undefined) ?? 268}`}
          />
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
/*  Discord CTA                                                        */
/* ------------------------------------------------------------------ */

/**
 * Two side-by-side CTA cards under the hero: Discord (real-time community)
 * and Contact (the agentos.sh contact page for written inquiries). Both
 * mirror the cards rendered on agentos.sh; kept inline here to avoid a
 * components/ tree just for static link cards.
 */
const ctaCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem 1.25rem',
  borderRadius: '12px',
  border: '1px solid var(--ifm-color-emphasis-300)',
  background: 'var(--ifm-background-surface-color)',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
  flex: '1 1 320px',
};

function liftCard(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
  e.currentTarget.style.transform = 'translateY(-1px)';
}

function dropCard(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
  e.currentTarget.style.transform = 'translateY(0)';
}

function ContactCTAs() {
  return (
    <section
      style={{
        padding: '1rem 2rem 0',
        maxWidth: '960px',
        margin: '0 auto',
      }}
      aria-label="Talk to the AgentOS team — Discord or contact form"
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <a
          href="https://wilds.ai/discord"
          target="_blank"
          rel="noopener noreferrer"
          style={ctaCardStyle}
          onMouseEnter={liftCard}
          onMouseLeave={dropCard}
        >
          <img
            src="/img/wilds-ai-icon.png"
            alt="Wilds AI"
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            style={{ borderRadius: '8px', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>
              Join the Wilds AI Discord
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                opacity: 0.75,
                marginTop: '0.15rem',
              }}
            >
              Real-time community for AgentOS and Paracosm support and developer onboarding.
            </div>
          </div>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              fontWeight: 600,
              color: 'var(--ifm-color-primary)',
              fontSize: '0.9rem',
            }}
          >
            Join &rarr;
          </span>
        </a>

        <a
          href="https://agentos.sh/en/contact"
          target="_blank"
          rel="noopener noreferrer"
          style={ctaCardStyle}
          onMouseEnter={liftCard}
          onMouseLeave={dropCard}
        >
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: 8,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff',
              fontSize: '1.5rem',
            }}
          >
            ✉
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>
              Contact the AgentOS team
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                opacity: 0.75,
                marginTop: '0.15rem',
              }}
            >
              Partnerships, investment, press, security, hiring — written inquiries to team@frame.dev.
            </div>
          </div>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              fontWeight: 600,
              color: 'var(--ifm-color-primary)',
              fontSize: '0.9rem',
            }}
          >
            Contact &rarr;
          </span>
        </a>
      </div>
    </section>
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
  'HEXACO Agent': `import { agent } from '@framers/agentos';

// Personality is six 0-1 trait values. The runtime appends a trait-derived
// directive to the system prompt and modulates three cognitive-memory
// mechanisms (involuntary recall, consolidation, schema encoding) based on
// honesty / emotionality / openness. Default is neutral (0.5) on every axis.
const tutor = agent({
  provider: 'openai',
  model: 'gpt-4o',
  instructions: 'You are a patient programming tutor.',
  personality: {
    honesty:           0.85,  // direct, transparent, no flattery
    emotionality:      0.65,  // tone-aware without being clinical
    extraversion:      0.50,
    agreeableness:     0.75,  // warm, encouraging
    conscientiousness: 0.90,  // structured, thorough, follow-through
    openness:          0.85,  // creative, exploratory framing
  },
  memory: {
    enabled:    true,         // session history persists automatically
    cognitive:  true,         // Ebbinghaus decay + reconsolidation + 6 more
  },
});

// Sessions scope conversation history by ID. Same agent, multiple users,
// no cross-talk — each session has its own memory bag.
const session = tutor.session('user-42');

// The agent remembers across turns. Context from the first message is
// recalled automatically in the second.
await session.send('My exam is on distributed systems next Thursday.');
await session.send('I struggle with consensus algorithms.');
const reply = await session.send('What should I focus on this week?');

console.log(reply.text);
// => "Given Thursday's exam and your block on consensus, lock in Paxos
//     and Raft this week. Start with the leader-election proof…"

// Inspect what the session actually carries — full message history +
// token usage. Useful for debugging memory recall or cost.
console.log(session.messages());
const usage = await session.usage();
console.log(\`Total tokens: \${usage.totalTokens}\`);`,

  'Streaming': `import { streamText, agent } from '@framers/agentos';

// streamText() — raw streaming completion. Yields token deltas as they arrive.
// Backpressure-safe; you can break out of the loop and the upstream HTTP
// request aborts cleanly.
const { textStream, text, usage } = streamText({
  provider: 'openai',
  model: 'gpt-4o',
  prompt: 'Explain how QUIC differs from TCP at the wire level.',
});
for await (const delta of textStream) {
  process.stdout.write(delta);
}
console.log(\`\\n\\nTotal tokens: \${(await usage).totalTokens}\`);

// Streaming on an agent session — same async-iterable shape, but reasoning,
// tool-call, and memory-update events ride alongside the text deltas so a UI
// can render each one as it happens.
const support = agent({
  provider: 'openai',
  instructions: 'You are a senior platform engineer.',
  memory: { enabled: true, cognitive: true },
});
const session = support.session('user-42');

for await (const chunk of session.stream('Why is gRPC slow over satellite?')) {
  switch (chunk.type) {
    case 'TEXT_DELTA':           process.stdout.write(chunk.delta);          break;
    case 'TOOL_CALL_REQUEST':    console.log('\\n[tool]', chunk.toolName);    break;
    case 'REASONING_STATE':      console.log('\\n[reasoning]', chunk.state);  break;
    case 'MEMORY_FORMED':        console.log('\\n[memory]', chunk.traceId);   break;
    case 'FINAL_RESPONSE_MARKER':                                            break;
  }
}`,

  'Multimodal RAG': `import { Memory } from '@framers/agentos';
import { MultimodalIndexer } from '@framers/agentos/cognition/rag';
import fs from 'fs';

// One brain backs everything — text, PDFs, images, audio.
const brain = await Memory.createSqlite({ path: './brain.sqlite' });

// Text + documents flow through the standard ingest path.
// Loaders auto-detect PDF / DOCX / MD / HTML / CSV / JSON / XML.
await brain.ingest('./reports/q4-earnings.pdf');
await brain.ingest('./notes/');                       // recurse a folder

// Images and audio go through MultimodalIndexer. It captions images
// via a vision provider, transcribes audio via STT, and indexes the
// derived text into the same vector store as everything else.
const indexer = new MultimodalIndexer({
  embeddingManager: brain.embeddingManager,
  vectorStore: brain.vectorStore,
  visionProvider: { provider: 'openai', model: 'gpt-4o-mini' },
  sttProvider:    { provider: 'openai', model: 'whisper-1' },
});

await indexer.indexImage({ image: fs.readFileSync('./figures/revenue-chart.png') });
await indexer.indexAudio({ audio: fs.readFileSync('./calls/sales-q4.wav'), language: 'en' });

// One text query, every modality searched. Hits arrive ranked with
// modality + derived text so you can cite the underlying asset.
const hits = await indexer.search('Q4 revenue growth drivers');
for (const hit of hits) {
  console.log(\`[\${hit.modality}] \${hit.text.slice(0, 80)}…  (\${hit.score.toFixed(2)})\`);
  // => [image]    "Bar chart showing 23% YoY growth in cloud…  (0.91)"
  // => [audio]    "…we hit $4.2B in cloud services…           (0.87)"
  // => [document] "Revenue grew 23% to $4.2B driven by…       (0.84)"
}`,

  'Media Generation': `import { generateText, streamText, generateImage, agent } from '@framers/agentos';

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
/*  Architecture Diagram (hand-crafted SVG)                            */
/* ------------------------------------------------------------------ */

function ArchitectureDiagram() {
  return (
    <section style={{ padding: '3rem 2rem 1rem', maxWidth: '1240px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>System Architecture</h2>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.65, marginBottom: '1.25rem' }}>
        Seven cooperating layers. API surface at the top, channels and providers at the floor, cognition and memory in the middle. Click to zoom.
      </p>
      <div style={{ overflow: 'auto' }}>
        <img
          src="/img/diagrams/system-architecture.svg"
          alt="AgentOS layered architecture: 7 cooperating layers from API surface (generateText, streamText, agent, agency, mission) through cognitive substrate (GMI coordinator, PersonaOverlayManager, SentimentTracker, MetapromptExecutor), memory and RAG pipeline (working / episodic / semantic / observational memory, 8 cognitive mechanisms, HyDE, GraphRAG, 7 vector backends), tools and capabilities (ToolOrchestrator, 100+ extension packs, 88 SKILL.md modules, CapabilityDiscovery, ForgeToolMetaTool), guardrails and HITL (GuardrailDispatcher, 4-tier PII redaction, ML classifiers, Grounding Guard, HumanInteract), orchestration (workflow, mission, AgentGraph, CompiledExecutionGraph, CheckpointStore), down to I/O and providers (voice pipeline, channels, media generation, 21 LLM providers, OpenRouter fanout)."
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
        />
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
      'Text, images, video, music, SFX, embeddings, and speech from one API. Cloud and local backends share the same surface, with fallback chains and provider preferences for load balancing.',
    link: '/features/multimodal-rag',
  },
  {
    title: 'Deep Research Agents',
    description:
      'mission() API with Tree of Thought planning, multi-source search, grounding verification, and human-in-the-loop review. 3 autonomy modes, 5 provider strategies, and dynamic graph expansion.',
    link: '/features/rag-memory#query-classification',
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
      'Full-duplex voice with endpoint detection modes, barge-in handling, diarization, and Twilio/Telnyx/Plivo telephony bridging for production IVR.',
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
      'Telegram, Discord, Slack, WhatsApp, Twitter/X, LinkedIn, Bluesky, Mastodon, and custom adapters. Multi-channel routing, social publishing, browser automation, and adapter APIs.',
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
    title: 'Curated Skills',
    description:
      'SKILL.md prompt modules for research, developer tools, communication, productivity, security, media, and creative workflows. Semantic discovery finds the right skill per turn.',
    link: '/skills',
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
      <ContactCTAs />
      <InstallTabs />
      <QuickStartTabs />
      <ArchitectureDiagram />
      <Features />
    </Layout>
  );
}
