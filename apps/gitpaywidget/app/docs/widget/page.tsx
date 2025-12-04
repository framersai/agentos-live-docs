import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Widget Documentation – GitPayWidget Docs',
  description: 'Embed the GitPayWidget pricing widget on any static site. Customize themes, plans, and checkout behavior.',
  alternates: { canonical: '/docs/widget' },
};

export default function WidgetDocsPage() {
  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <h1>@gitpaywidget/widget</h1>
      <p className="lead">
        Embeddable pricing widget for any static site. Under 5KB gzipped.
      </p>

      <hr />

      <h2>Quick Start</h2>
      <p>Add the widget to any HTML page with a single script tag:</p>

      <pre><code>{`<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="your-org/your-site"
></script>`}</code></pre>

      <p>Or for more control, use the JavaScript API:</p>

      <pre><code>{`<div id="pricing"></div>

<script type="module">
  import { renderGitPayWidget } from 'https://cdn.gitpaywidget.com/v0/widget.js';
  
  renderGitPayWidget({
    project: 'your-org/your-site',
    mount: document.getElementById('pricing'),
    plans: [
      {
        id: 'free',
        label: 'Free',
        price: '$0',
        description: 'For personal projects',
        features: ['1 project', 'Basic support'],
      },
      {
        id: 'pro',
        label: 'Pro',
        price: '$250',
        description: 'Lifetime license',
        features: ['Unlimited projects', 'Priority support', '0% fees'],
      },
    ],
  });
</script>`}</code></pre>

      <h2>Configuration Options</h2>

      <h3>renderGitPayWidget(options)</h3>

      <pre><code>{`interface WidgetOptions {
  /** Project slug from your dashboard */
  project: string;
  
  /** DOM element to mount the widget */
  mount?: HTMLElement;
  
  /** Plan definitions */
  plans: Plan[];
  
  /** Auto-detect light/dark mode (default: true) */
  autoTheme?: boolean;
  
  /** Force light or dark theme */
  theme?: 'light' | 'dark';
  
  /** Custom accent color (hex) */
  accentColor?: string;
  
  /** Fetch theme from API endpoint */
  themeEndpoint?: string;
  
  /** Callback when checkout is initiated */
  onCheckout?: (plan: Plan) => void;
  
  /** Callback on successful checkout */
  onSuccess?: (sessionId: string) => void;
  
  /** Callback on error */
  onError?: (error: Error) => void;
}`}</code></pre>

      <h3>Plan Definition</h3>

      <pre><code>{`interface Plan {
  /** Unique plan identifier */
  id: string;
  
  /** Display name */
  label: string;
  
  /** Price string (e.g., "$9.99/mo", "$250", "Free") */
  price: string;
  
  /** Short description */
  description?: string;
  
  /** List of features */
  features?: string[];
  
  /** Highlight this plan (default: false) */
  featured?: boolean;
  
  /** CTA button text (default: "Get Started") */
  ctaText?: string;
  
  /** Disable checkout (for "Coming Soon" plans) */
  disabled?: boolean;
}`}</code></pre>

      <h2>Data Attributes</h2>
      <p>When using the simple script tag, configure via data attributes:</p>

      <pre><code>{`<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="your-org/your-site"
  data-theme="dark"
  data-accent="#ec4899"
  data-mount="#pricing-widget"
></script>`}</code></pre>

      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>data-project</code></td>
            <td>Your project slug (required)</td>
          </tr>
          <tr>
            <td><code>data-theme</code></td>
            <td>Force theme: "light" or "dark"</td>
          </tr>
          <tr>
            <td><code>data-accent</code></td>
            <td>Custom accent color (hex)</td>
          </tr>
          <tr>
            <td><code>data-mount</code></td>
            <td>CSS selector for mount element</td>
          </tr>
          <tr>
            <td><code>data-plan</code></td>
            <td>Pre-select a plan by ID</td>
          </tr>
        </tbody>
      </table>

      <h2>Theming</h2>

      <h3>Auto Theme Detection</h3>
      <p>
        By default, the widget detects your site's color scheme using 
        <code>prefers-color-scheme</code> and watches for changes:
      </p>

      <pre><code>{`renderGitPayWidget({
  project: 'my/site',
  autoTheme: true, // default
  plans: [...],
});`}</code></pre>

      <h3>Custom CSS</h3>
      <p>Override widget styles with CSS custom properties:</p>

      <pre><code>{`:root {
  --gpw-accent: #8b5cf6;
  --gpw-accent-hover: #7c3aed;
  --gpw-card-bg: #ffffff;
  --gpw-card-border: rgba(0, 0, 0, 0.1);
  --gpw-text-primary: #1a1a1a;
  --gpw-text-secondary: #6b7280;
  --gpw-button-radius: 9999px;
}`}</code></pre>

      <p>Or inject custom CSS directly:</p>

      <pre><code>{`renderGitPayWidget({
  project: 'my/site',
  plans: [...],
  customCss: \`
    .gpw-plan-card { border-radius: 16px; }
    .gpw-plan-button { font-weight: 700; }
  \`,
});`}</code></pre>

      <h2>Events</h2>

      <pre><code>{`renderGitPayWidget({
  project: 'my/site',
  plans: [...],
  
  onCheckout: (plan) => {
    console.log('Checkout started for:', plan.id);
    // Track analytics
    gtag('event', 'begin_checkout', { plan: plan.id });
  },
  
  onSuccess: (sessionId) => {
    console.log('Checkout complete:', sessionId);
    // Redirect or show success message
  },
  
  onError: (error) => {
    console.error('Checkout error:', error);
    // Show error message
  },
});`}</code></pre>

      <h2>React Integration</h2>

      <pre><code>{`import { useEffect, useRef } from 'react';
import { renderGitPayWidget } from '@gitpaywidget/widget';

function PricingWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    renderGitPayWidget({
      project: 'my/site',
      mount: containerRef.current,
      plans: [
        { id: 'free', label: 'Free', price: '$0', features: ['...'] },
        { id: 'pro', label: 'Pro', price: '$250', features: ['...'] },
      ],
    });
  }, []);
  
  return <div ref={containerRef} />;
}`}</code></pre>

      <h2>Vue Integration</h2>

      <pre><code>{`<template>
  <div ref="widgetContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { renderGitPayWidget } from '@gitpaywidget/widget';

const widgetContainer = ref(null);

onMounted(() => {
  renderGitPayWidget({
    project: 'my/site',
    mount: widgetContainer.value,
    plans: [...],
  });
});
</script>`}</code></pre>

      <h2>Performance</h2>
      <ul>
        <li><strong>Bundle size:</strong> ~4.5KB gzipped</li>
        <li><strong>Lazy loading:</strong> Payment SDKs load only on checkout click</li>
        <li><strong>No dependencies:</strong> Vanilla JS, no React/Vue required</li>
        <li><strong>Tree-shakeable:</strong> Import only what you need</li>
      </ul>

      <h2>Browser Support</h2>
      <ul>
        <li>Chrome 80+</li>
        <li>Firefox 75+</li>
        <li>Safari 13+</li>
        <li>Edge 80+</li>
      </ul>

      <hr />

      <h2>Related</h2>
      <ul>
        <li><Link href="/docs/theming">Advanced Theming Guide</Link></li>
        <li><Link href="/docs/sdk">SDK Documentation</Link></li>
        <li><Link href="/widget-demo">Live Demo</Link></li>
      </ul>
    </article>
  );
}

