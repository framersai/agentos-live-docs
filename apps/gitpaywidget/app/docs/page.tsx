import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Documentation – GitPayWidget',
  description:
    'Complete API reference for GitPayWidget REST endpoints, SDK, and widget integration.',
};

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="font-display text-6xl text-transparent bg-clip-text bg-gpw-gradient">
          Documentation
        </h1>
        <p className="text-xl text-ink-600 dark:text-ink-300">
          Everything you need to integrate GitPayWidget into your static site.
        </p>
      </header>

      <nav className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DocCard
          title="🚀 Quick Start"
          description="Get up and running in 5 minutes"
          href="/docs/quickstart"
        />
        <DocCard
          title="📖 Integration Guide"
          description="Step-by-step integration walkthrough"
          href="/docs/integration"
        />
        <DocCard
          title="🔌 API Reference"
          description="Complete REST API documentation"
          href="/docs/api"
        />
        <DocCard
          title="🎨 Widget Theming"
          description="Customize colors, labels, and CSS"
          href="/docs/theming"
        />
        <DocCard
          title="🌐 DNS & Deployment"
          description="Porkbun, Cloudflare, Linode setup"
          href="/docs/dns"
        />
        <DocCard
          title="🔐 Security Best Practices"
          description="Key management, webhooks, HTTPS"
          href="/docs/security"
        />
        <DocCard
          title="📦 Widget Reference"
          description="Embeddable widget configuration"
          href="/docs/widget"
        />
        <DocCard
          title="⚙️ SDK Reference"
          description="TypeScript SDK for checkout integration"
          href="/docs/sdk"
        />
      </nav>

      <section className="rounded-3xl border border-gpw-border p-8 space-y-6">
        <h2 className="text-3xl font-bold">SDK Packages</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <PackageCard
            name="@gitpaywidget/sdk"
            description="TypeScript SDK for checkout integration"
            npmLink="https://www.npmjs.com/package/@gitpaywidget/sdk"
            docsLink="/docs/sdk"
          />
          <PackageCard
            name="@gitpaywidget/widget"
            description="Embeddable pricing widget (< 5 KB)"
            npmLink="https://www.npmjs.com/package/@gitpaywidget/widget"
            docsLink="/docs/widget"
          />
        </div>
      </section>

      <section className="rounded-3xl bg-gpw-gradient p-1">
        <div className="rounded-[22px] bg-white dark:bg-ink-900 p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Need Help?</h2>
          <p className="text-ink-600 dark:text-ink-300">
            Can't find what you're looking for? Contact our team.
          </p>
          <Link
            href="mailto:team@manic.agency"
            className="inline-block rounded-full bg-gpw-primary px-6 py-3 font-semibold text-white hover:bg-gpw-tertiary"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}

function DocCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-ink-200/60 p-6 transition hover:border-gpw-primary hover:shadow-gpw-card"
    >
      <h3 className="text-xl font-semibold mb-2 group-hover:text-gpw-primary transition">
        {title}
      </h3>
      <p className="text-sm text-ink-600 dark:text-ink-300">{description}</p>
    </Link>
  );
}

function PackageCard({
  name,
  description,
  npmLink,
  docsLink,
}: {
  name: string;
  description: string;
  npmLink: string;
  docsLink: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-200/60 p-6 space-y-4">
      <div>
        <code className="text-sm font-mono text-gpw-primary">{name}</code>
        <p className="mt-2 text-sm text-ink-600">{description}</p>
      </div>
      <div className="flex gap-3">
        <a href={npmLink} className="text-sm text-gpw-primary hover:underline">
          npm →
        </a>
        <Link href={docsLink} className="text-sm text-gpw-primary hover:underline">
          docs →
        </Link>
      </div>
    </div>
  );
}
