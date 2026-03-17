import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function AnimatedLogo() {
  return (
    <svg
      width="120"
      height="120"
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
      {/* Connection lines with pulse animation */}
      <line x1="50" y1="50" x2="25" y2="25" stroke="url(#heroGrad)" strokeWidth="1.5" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="50" y1="50" x2="75" y2="25" stroke="url(#heroGrad)" strokeWidth="1.5" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.3;0.7;0.3"
          dur="3s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </line>
      <line x1="50" y1="50" x2="80" y2="55" stroke="url(#heroGrad)" strokeWidth="1.5" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.3;0.7;0.3"
          dur="3s"
          begin="1s"
          repeatCount="indefinite"
        />
      </line>
      <line x1="50" y1="50" x2="50" y2="80" stroke="url(#heroGrad)" strokeWidth="1.5" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.3;0.7;0.3"
          dur="3s"
          begin="1.5s"
          repeatCount="indefinite"
        />
      </line>
      <line x1="50" y1="50" x2="20" y2="55" stroke="url(#heroGrad)" strokeWidth="1.5" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.3;0.7;0.3"
          dur="3s"
          begin="2s"
          repeatCount="indefinite"
        />
      </line>
      {/* Outer ring pulse */}
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
      {/* Satellite nodes */}
      <circle cx="25" cy="25" r="5" fill="#6366F1" opacity="0.85">
        <animate attributeName="r" values="4.5;5.5;4.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="25" r="5" fill="#8B5CF6" opacity="0.85">
        <animate
          attributeName="r"
          values="4.5;5.5;4.5"
          dur="2.5s"
          begin="0.4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="80" cy="55" r="5" fill="#EC4899" opacity="0.85">
        <animate
          attributeName="r"
          values="4.5;5.5;4.5"
          dur="2.5s"
          begin="0.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="80" r="5" fill="#06B6D4" opacity="0.85">
        <animate
          attributeName="r"
          values="4.5;5.5;4.5"
          dur="2.5s"
          begin="1.2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="20" cy="55" r="5" fill="#6366F1" opacity="0.85">
        <animate
          attributeName="r"
          values="4.5;5.5;4.5"
          dur="2.5s"
          begin="1.6s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Center node — larger, brighter */}
      <circle cx="50" cy="50" r="9" fill="url(#heroGrad)">
        <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      style={{
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        background:
          'linear-gradient(180deg, var(--ifm-background-color) 0%, var(--ifm-background-surface-color) 100%)',
      }}
    >
      <AnimatedLogo />
      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          marginBottom: '0.75rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
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
      <p
        style={{
          fontSize: '1.2rem',
          maxWidth: '640px',
          margin: '0 auto 2rem',
          opacity: 0.75,
          lineHeight: 1.6,
        }}
      >
        {siteConfig.tagline}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link className="button button--primary button--lg" to="/docs/">
          Get Started
        </Link>
        <Link className="button button--secondary button--lg" to="/docs/api/">
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
    link: '/docs/features/deep-research',
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
          <Link
            key={title}
            to={link}
            style={{
              display: 'block',
              padding: '1.75rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--ifm-toc-border-color)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
            }}
          >
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

export default function Home(): JSX.Element {
  return (
    <Layout description="AgentOS documentation — cognitive memory, graph-based RAG, HEXACO personalities, and autonomous agent orchestration.">
      <Hero />
      <Features />
    </Layout>
  );
}
