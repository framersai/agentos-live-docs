'use client';

import { useEffect } from 'react';
import { renderGitPayWidget } from '@gitpaywidget/widget';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widget demo',
  description:
    'Preview the GitPayWidget embed with live pricing cards and hosted checkout buttons.',
  alternates: { canonical: '/widget-demo' },
};

export default function WidgetDemo() {
  useEffect(() => {
    const mount = document.getElementById('widget') ?? undefined;
    (async () => {
      await renderGitPayWidget({
        project: 'demo/project',
        plans: [
          {
            id: 'free',
            label: 'Starter',
            price: '$0 / mo',
            description: 'Perfect for evaluation.',
            features: ['Doc-level summaries', '500MB storage'],
          },
          {
            id: 'pro',
            label: 'Pro',
            price: '$9.99 / mo',
            description: 'Block insights & hosted generations.',
            features: ['Block summaries', 'Premium podcast/image generation'],
          },
        ],
        mount,
        autoTheme: true,
        themeEndpoint: '/api/public/projects',
      });
    })();
  }, []);

  return (
    <main className="min-h-screen bg-paper-50 px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <h1 className="font-display text-5xl text-gpw-primary">Widget Preview</h1>
        <p className="text-ink-600">
          Drop <code>&lt;script src=&quot;https://cdn.gitpaywidget.com/widget.js&quot;&gt;</code> on
          any static page and call <code>GitPayWidget(...)</code>.
        </p>
      </div>
      <div id="widget" className="mx-auto mt-10 max-w-4xl" />
    </main>
  );
}
