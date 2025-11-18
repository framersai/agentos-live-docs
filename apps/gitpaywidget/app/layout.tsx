import '../globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://gitpaywidget.com'),
  title: {
    default: 'GitPayWidget – Simple payments for GitHub Pages',
    template: '%s · GitPayWidget',
  },
  description:
    'Plug-and-play widget to accept Stripe, Lemon Squeezy and crypto checkouts on any static site.',
  openGraph: {
    title: 'GitPayWidget',
    description: 'Accept payments on GitHub Pages with a single <script> tag.',
    images: ['/og-image.png'],
    type: 'website',
    url: '/',
    siteName: 'GitPayWidget',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gitpaywidget',
    creator: '@gitpaywidget',
  },
  alternates: {
    canonical: '/',
  },
  keywords: [
    'GitHub Pages payments',
    'Stripe widget',
    'Lemon Squeezy checkout',
    'GitPayWidget',
    'Manic Agency',
  ],
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-gpw-ink-50">
      <body>{children}</body>
    </html>
  );
}
