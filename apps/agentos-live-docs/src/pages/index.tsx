import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function AnimatedLogo() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginBottom: '1.5rem' }}
    >
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Connection lines — staggered pulse */}
      {[
        { x2: 25, y2: 25, delay: '0s' },
        { x2: 75, y2: 25, delay: '0.5s' },
        { x2: 80, y2: 55, delay: '1s' },
        { x2: 50, y2: 80, delay: '1.5s' },
        { x2: 20, y2: 55, delay: '2s' },
      ].map(({ x2, y2, delay }, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={x2}
          y2={y2}
          stroke="url(#heroGrad)"
          strokeWidth="1.5"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur="3s"
            begin={delay}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {/* Outer rings — breathing */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="url(#heroGrad)"
        strokeWidth="0.5"
        opacity="0.2"
      >
        <animate attributeName="r" values="28;32;28" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="url(#heroGrad)"
        strokeWidth="0.3"
        opacity="0.1"
      >
        <animate attributeName="r" values="40;44;40" dur="5s" repeatCount="indefinite" />
      </circle>
      {/* Satellite nodes — breathing */}
      {[
        { cx: 25, cy: 25, fill: '#6366F1', delay: '0s' },
        { cx: 75, cy: 25, fill: '#8B5CF6', delay: '0.4s' },
        { cx: 80, cy: 55, fill: '#EC4899', delay: '0.8s' },
        { cx: 50, cy: 80, fill: '#06B6D4', delay: '1.2s' },
        { cx: 20, cy: 55, fill: '#6366F1', delay: '1.6s' },
      ].map(({ cx, cy, fill, delay }, i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill={fill} opacity="0.85">
          <animate
            attributeName="r"
            values="4.5;5.5;4.5"
            dur="2.5s"
            begin={delay}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {/* Center node */}
      <circle cx="50" cy="50" r="9" fill="url(#heroGrad)">
        <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero-agentos">
      <AnimatedLogo />
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

const quickStartTracks = [
  {
    title: 'High-Level API',
    description:
      'Use `generateText()`, `streamText()`, `generateImage()`, and `agent()` when you want the fastest path from prompt to working code.',
    link: '/getting-started/high-level-api',
  },
  {
    title: 'Full Runtime',
    description:
      'Drop to `new AgentOS()` when you need extensions, personas, workflows, HITL, or runtime lifecycle control.',
    link: '/api/',
  },
  {
    title: 'Extensions & Skills',
    description:
      'Wire curated extensions, SKILL.md registries, and provider-agnostic image generation into the runtime you choose.',
    link: '/extensions/overview',
  },
];

function QuickStartTracks() {
  return (
    <section style={{ padding: '2rem 2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {quickStartTracks.map(({ title, description, link }) => (
          <Link
            key={title}
            to={link}
            className="feature-card"
            style={{ padding: '1.25rem', minHeight: '160px' }}
          >
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{title}</h3>
            <p style={{ opacity: 0.75, margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    title: 'High-Level API',
    description:
      'Streamlined root exports for text generation, streaming, provider-agnostic image generation, and lightweight stateful sessions.',
    link: '/getting-started/high-level-api',
  },
  {
    title: 'Cognitive Memory',
    description:
      'Observational memory with Ebbinghaus decay, Baddeley working memory, HyDE retrieval, and personality-driven encoding.',
    link: '/features/cognitive-memory',
  },
  {
    title: 'Deep Research',
    description:
      'LLM-as-judge query classification, 3-phase research pipeline, real-time progress streaming via SSE.',
    link: '/features/deep-research',
  },
  {
    title: 'Safety & Guardrails',
    description:
      '5-tier security pipeline — pre-LLM classification, dual-LLM audit, signed outputs, step-up authorization.',
    link: '/features/guardrails',
  },
  {
    title: 'RAG & Vector Search',
    description:
      'HNSW vector store, graph-augmented re-ranking, hybrid retrieval, adaptive HyDE thresholding.',
    link: '/features/rag-memory',
  },
  {
    title: 'Capability Discovery',
    description:
      'Semantic tiered discovery — 89% token reduction, graph re-ranking, agents self-discover tools mid-conversation.',
    link: '/features/capability-discovery',
  },
  {
    title: 'Extensions & Skills',
    description:
      '37 channel adapters, 23+ tools, 40 curated skills, multi-provider TTS/STT, image generation.',
    link: '/extensions/overview',
  },
  {
    title: 'Planning & Orchestration',
    description:
      'Multi-step planning engine, human-in-the-loop approvals, adaptive execution runtime.',
    link: '/features/planning-engine',
  },
  {
    title: 'API Reference',
    description:
      'Auto-generated TypeDoc reference — every class, interface, type, and function documented.',
    link: '/api/',
  },
];

function Features() {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {features.map(({ title, description, link }) => (
          <Link key={title} to={link} className="feature-card">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
            <p style={{ opacity: 0.7, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout description="AgentOS documentation — cognitive memory, graph-based RAG, HEXACO personalities, and autonomous agent orchestration.">
      <Hero />
      <QuickStartTracks />
      <Features />
    </Layout>
  );
}
