'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuickActionsProps {
  projectSlug: string | null;
}

export function QuickActions({ projectSlug }: QuickActionsProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="${projectSlug ?? 'your-project'}"
  data-plan="pro">
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    {
      label: 'Copy Embed Code',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      onClick: copyCode,
      highlight: true,
    },
    {
      label: 'View Live Demo',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      href: '/widget-demo',
    },
    {
      label: 'Read Docs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/docs/integration',
    },
    {
      label: 'Test Webhook',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: '/docs/api#webhooks',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => {
        const content = (
          <>
            <span className={action.highlight && copied ? 'text-emerald-500' : ''}>
              {action.highlight && copied ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                action.icon
              )}
            </span>
            <span className="text-sm font-medium">
              {action.highlight && copied ? 'Copied!' : action.label}
            </span>
          </>
        );

        if (action.onClick) {
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`
                gpw-card p-4 flex flex-col items-center gap-2 text-center
                transition-all hover:shadow-gpw-md hover:-translate-y-0.5
                ${action.highlight
                  ? 'bg-gradient-to-br from-gpw-purple-500/10 to-gpw-pink-500/10 border-gpw-purple-500/20'
                  : ''
                }
              `}
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={action.label}
            href={action.href!}
            className="gpw-card p-4 flex flex-col items-center gap-2 text-center transition-all hover:shadow-gpw-md hover:-translate-y-0.5"
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}





