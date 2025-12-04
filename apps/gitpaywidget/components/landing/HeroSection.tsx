'use client';

import { useState } from 'react';
import Link from 'next/link';

const codeSnippet = `<script src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="your-org/your-site"
  data-plan="pro">
</script>`;

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet.replace(/\n/g, ' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gpw-mesh opacity-60 dark:opacity-40" />
      <div className="absolute inset-0 gpw-grid-pattern" />
      
      {/* Floating orbs */}
      <div className="gpw-glow-orb w-96 h-96 bg-gpw-purple-500 -top-20 -left-20 animate-float" />
      <div className="gpw-glow-orb w-80 h-80 bg-gpw-pink-500 -bottom-20 -right-20 animate-float-delayed" />
      <div className="gpw-glow-orb w-64 h-64 bg-gpw-accent-yellow top-1/3 right-1/4 animate-float opacity-20" />

      <div className="gpw-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gpw-purple-500/10 border border-gpw-purple-500/20 mb-8 animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-gpw-accent-green animate-pulse" />
            <span className="text-sm font-medium text-gpw-purple-600 dark:text-gpw-purple-400">
              Now in public beta — free for early adopters
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            <span className="font-display text-gpw-purple-600 dark:text-gpw-purple-400">Payments</span>
            {' '}for{' '}
            <span className="gpw-text-gradient">Static Sites</span>
            <br />
            <span className="text-gpw-text-secondary dark:text-gpw-text-muted">
              in one line of code
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gpw-text-muted max-w-2xl mx-auto mb-10 animate-fade-in-up gpw-delay-100">
            Accept Stripe, Lemon Squeezy, and crypto payments on GitHub Pages, 
            Docs sites, or any static host. No server required. 
            <span className="text-gpw-pink-500 font-medium"> Perfect for vibe coding.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up gpw-delay-200">
            <Link href="/login" className="gpw-btn-primary text-lg px-8 py-4">
              <span>Start free</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/widget-demo" className="gpw-btn-secondary text-lg px-8 py-4">
              <span>See demo</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>

          {/* Code preview */}
          <div className="max-w-2xl mx-auto animate-fade-in-up gpw-delay-300">
            <div className="gpw-code-block group">
              <div className="gpw-code-header">
                <div className="gpw-code-dots">
                  <span className="gpw-code-dot bg-red-500" />
                  <span className="gpw-code-dot bg-yellow-500" />
                  <span className="gpw-code-dot bg-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">index.html</span>
                  <button
                    onClick={copyCode}
                    className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <pre className="gpw-code-content text-left">
                <code className="language-html">
                  <span className="text-pink-400">&lt;script</span>
                  {'\n  '}
                  <span className="text-purple-300">src</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-green-300">"https://cdn.gitpaywidget.com/v0/widget.js"</span>
                  {'\n  '}
                  <span className="text-purple-300">data-project</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-green-300">"your-org/your-site"</span>
                  {'\n  '}
                  <span className="text-purple-300">data-plan</span>
                  <span className="text-gray-400">=</span>
                  <span className="text-green-300">"pro"</span>
                  <span className="text-pink-400">&gt;&lt;/script&gt;</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gpw-text-muted animate-fade-in-up gpw-delay-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gpw-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>AES-256 encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gpw-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>&lt;5KB gzipped</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gpw-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-gpw-bg-subtle dark:fill-gpw-bg-muted"
          />
        </svg>
      </div>
    </section>
  );
}





