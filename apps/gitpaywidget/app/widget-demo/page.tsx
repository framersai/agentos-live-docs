'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WidgetDemo() {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadWidget = async () => {
      try {
        const { renderGitPayWidget } = await import('@gitpaywidget/widget');
        const mount = document.getElementById('widget');
        
        if (!mount) return;

        await renderGitPayWidget({
          project: 'demo/project',
          plans: [
            {
              id: 'free',
              label: 'Free',
              price: '$0',
              description: 'Start accepting payments with 1% platform fee.',
              features: [
                'Unlimited projects',
                'Stripe & Lemon Squeezy',
                'Basic analytics',
                'Community support',
              ],
            },
            {
              id: 'pro',
              label: 'Pro',
              price: '$250',
              description: 'One-time lifetime license. Zero fees forever.',
              features: [
                '0% platform fee',
                'Full analytics dashboard',
                'Custom branding',
                'Priority support',
                'Crypto payments (soon)',
              ],
            },
          ],
          mount,
          autoTheme: true,
        });
        
        setWidgetLoaded(true);
      } catch (err: any) {
        console.error('Failed to load widget:', err);
        setError('Widget failed to load. This is a demo preview.');
      }
    };

    loadWidget();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="gpw-container">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="gpw-badge-primary mb-4">Live Demo</span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Widget <span className="gpw-text-gradient">Preview</span>
          </h1>
          <p className="text-lg text-gpw-text-muted max-w-2xl mx-auto">
            This is exactly how the widget will look on your site. 
            Click the buttons to see the checkout flow in action.
          </p>
        </div>

        {/* Code snippet */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="gpw-code-block">
            <div className="gpw-code-header">
              <div className="gpw-code-dots">
                <span className="gpw-code-dot bg-red-500" />
                <span className="gpw-code-dot bg-yellow-500" />
                <span className="gpw-code-dot bg-green-500" />
              </div>
              <span className="text-xs text-gray-400">index.html</span>
            </div>
            <pre className="gpw-code-content overflow-x-auto">
              <code className="text-sm">
                <span className="text-pink-400">&lt;script</span>
                {'\n  '}
                <span className="text-purple-300">src</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-300">"https://cdn.gitpaywidget.com/v0/widget.js"</span>
                {'\n  '}
                <span className="text-purple-300">data-project</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-300">"your-project-slug"</span>
                <span className="text-pink-400">&gt;&lt;/script&gt;</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Widget container */}
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="gpw-card p-8 text-center">
              <p className="text-gpw-text-muted mb-4">{error}</p>
              <p className="text-sm text-gpw-text-muted">
                The widget displays pricing cards that connect to your Stripe or Lemon Squeezy account.
              </p>
            </div>
          ) : !widgetLoaded ? (
            <div className="gpw-card p-8 text-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gpw-purple-500/20" />
                <p className="text-gpw-text-muted">Loading widget preview...</p>
              </div>
            </div>
          ) : null}
          
          <div id="widget" className={widgetLoaded ? '' : 'hidden'} />
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Widget Features
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="gpw-card p-6 text-center">
              <div className="gpw-feature-icon mx-auto mb-4">🎨</div>
              <h3 className="font-semibold mb-2">Auto Theme</h3>
              <p className="text-sm text-gpw-text-muted">
                Automatically matches your site's light/dark mode
              </p>
            </div>
            <div className="gpw-card p-6 text-center">
              <div className="gpw-feature-icon mx-auto mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Lightweight</h3>
              <p className="text-sm text-gpw-text-muted">
                Under 5KB gzipped, lazy-loads payment SDKs
              </p>
            </div>
            <div className="gpw-card p-6 text-center">
              <div className="gpw-feature-icon mx-auto mb-4">🔒</div>
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-gpw-text-muted">
                No card data touches your site or our servers
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to add payments?</h2>
          <p className="text-gpw-text-muted mb-6">
            Get started in under 5 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="gpw-btn-primary">
              Start Free
            </Link>
            <Link href="/docs/quickstart" className="gpw-btn-secondary">
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
