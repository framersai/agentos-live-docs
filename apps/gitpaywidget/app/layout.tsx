import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a1d' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gitpaywidget.com'),
  title: {
    default: 'GitPayWidget – Payments for Static Sites & GitHub Pages',
    template: '%s | GitPayWidget',
  },
  description:
    'Accept Stripe, Lemon Squeezy, and crypto payments on any static site with a single script tag. Perfect for GitHub Pages, Docs, Jekyll blogs, and vibe coding projects.',
  keywords: [
    'GitHub Pages payments',
    'static site payments',
    'Stripe widget',
    'Lemon Squeezy checkout',
    'payment widget',
    'GitPayWidget',
    'vibe coding',
    'no-code payments',
    'Jekyll payments',
    'docs monetization',
    'open source payments',
    'developer tools',
    'SaaS billing',
    'subscription widget',
    'embed checkout',
  ],
  authors: [{ name: 'Manic Agency', url: 'https://manic.agency' }],
  creator: 'Manic Agency',
  publisher: 'Manic Agency LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gitpaywidget.com',
    siteName: 'GitPayWidget',
    title: 'GitPayWidget – Payments for Static Sites',
    description: 'Accept payments on GitHub Pages with a single script tag. Stripe, Lemon Squeezy, and crypto support.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitPayWidget - Simple payments for static sites',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gitpaywidget',
    creator: '@manicagency',
    title: 'GitPayWidget – Payments for Static Sites',
    description: 'Accept payments on GitHub Pages with a single script tag.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://gitpaywidget.com',
  },
  category: 'technology',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GitPayWidget',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  description: 'Plug-and-play payment widget for static sites. Accept Stripe, Lemon Squeezy, and crypto checkouts with a single script tag.',
  url: 'https://gitpaywidget.com',
  author: {
    '@type': 'Organization',
    name: 'Manic Agency',
    url: 'https://manic.agency',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free tier available',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Stripe Integration',
    'Lemon Squeezy Integration',
    'Crypto Payments',
    'GitHub Pages Support',
    'Static Site Compatible',
    'Single Script Tag',
    'Customizable Themes',
    'Real-time Analytics',
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gpw-bg-base text-gpw-text-primary antialiased">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
