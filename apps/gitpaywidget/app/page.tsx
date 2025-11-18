import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple payments for GitHub Pages',
  description:
    'GitPayWidget lets any static site accept Stripe and Lemon Squeezy checkouts with a single script tag.',
  openGraph: {
    title: 'GitPayWidget – Accept Stripe + Lemon Squeezy on GitHub Pages',
    description: 'Showcase your pricing, embed the widget, and go live in minutes.',
    url: '/',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-20 text-center">
      <Image src="/logo.svg" alt="GitPayWidget" width={160} height={160} />

      <h1 className="font-display text-6xl text-gpw-primary">GitPayWidget</h1>
      <p className="max-w-xl text-lg text-ink-600 dark:text-ink-300">
        Accept payments on any GitHub-hosted page with a single&nbsp;snippet.
      </p>

      <pre className="rounded-xl bg-ink-900/90 p-4 text-left text-sm text-white shadow-lg">
        {`<script src="https://cdn.gitpaywidget.com/v0/widget.js"
        data-project="my-org/my-project"
        data-plan="pro"></script>`}
      </pre>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="#pricing"
          className="rounded-full bg-gpw-primary px-6 py-3 font-semibold text-white shadow-frame-glow hover:bg-gpw-purple-tertiary"
        >
          See pricing
        </Link>
        <Link
          href="mailto:team@manic.agency"
          className="rounded-full border border-gpw-primary px-6 py-3 font-semibold text-gpw-primary hover:bg-gpw-primary/10"
        >
          Contact us
        </Link>
      </div>
    </main>
  );
}
