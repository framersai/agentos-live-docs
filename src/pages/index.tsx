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
        <Link className="btn-primary" to="/docs/">
          Get Started
        </Link>
        <Link className="btn-secondary" to="/docs/api/">
          API Reference
        </Link>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Cognitive Memory',
    description:
      'Observational memory with Ebbinghaus decay, Baddeley working memory, HyDE retrieval, and personality-driven encoding.',
    link: '/docs/features/cognitive-memory',
  },
  {
    title: 'Deep Research',
    description:
      'LLM-as-judge query classification, 3-phase research pipeline, real-time progress streaming via SSE.',
    link: '/docs/features/rag-memory',
  },
  {
    title: 'Safety & Guardrails',
    description:
      '5-tier security pipeline — pre-LLM classification, dual-LLM audit, signed outputs, step-up authorization.',
    link: '/docs/features/guardrails',
  },
  {
    title: 'RAG & Vector Search',
    description:
      'HNSW vector store, graph-augmented re-ranking, hybrid retrieval, adaptive HyDE thresholding.',
    link: '/docs/features/rag-memory',
  },
  {
    title: 'Capability Discovery',
    description:
      'Semantic tiered discovery — 89% token reduction, graph re-ranking, agents self-discover tools mid-conversation.',
    link: '/docs/features/capability-discovery',
  },
  {
    title: 'Extensions & Skills',
    description:
      '37 channel adapters, 23+ tools, 40 curated skills, multi-provider TTS/STT, image generation.',
    link: '/docs/extensions/overview',
  },
  {
    title: 'Planning & Orchestration',
    description:
      'Multi-step planning engine, human-in-the-loop approvals, adaptive execution runtime.',
    link: '/docs/features/planning-engine',
  },
  {
    title: 'API Reference',
    description:
      'Auto-generated TypeDoc reference — every class, interface, type, and function documented.',
    link: '/docs/api/',
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
      <Features />
    </Layout>
  );
}
