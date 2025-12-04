import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDK Reference – GitPayWidget Docs',
  description: 'TypeScript SDK for programmatic checkout integration. Create checkout sessions, manage subscriptions, and handle webhooks.',
  alternates: { canonical: '/docs/sdk' },
};

export default function SDKDocsPage() {
  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <h1>@gitpaywidget/sdk</h1>
      <p className="lead">
        TypeScript SDK for programmatic checkout integration and subscription management.
      </p>

      <hr />

      <h2>Installation</h2>
      <pre><code>{`npm install @gitpaywidget/sdk
# or
pnpm add @gitpaywidget/sdk
# or
yarn add @gitpaywidget/sdk`}</code></pre>

      <h2>Quick Start</h2>
      <pre><code>{`import { GitPayClient } from '@gitpaywidget/sdk';

const client = new GitPayClient({
  projectSlug: 'your-org/your-site',
  apiEndpoint: 'https://gitpaywidget.com/api', // optional, defaults to this
});

// Create a checkout session
const { checkoutUrl, sessionId } = await client.createCheckout({
  plan: 'pro',
  metadata: {
    userId: 'user_123',
  },
});

// Redirect to checkout
window.location.href = checkoutUrl;`}</code></pre>

      <h2>API Reference</h2>

      <h3>GitPayClient</h3>
      <p>Main client class for interacting with the GitPayWidget API.</p>

      <h4>Constructor Options</h4>
      <pre><code>{`interface GitPayClientOptions {
  /** Your project slug (e.g., "acme/landing") */
  projectSlug: string;
  
  /** API endpoint (default: "https://gitpaywidget.com/api") */
  apiEndpoint?: string;
  
  /** Request timeout in ms (default: 30000) */
  timeout?: number;
}`}</code></pre>

      <h3>createCheckout()</h3>
      <p>Create a hosted checkout session.</p>

      <pre><code>{`interface CheckoutRequest {
  /** Plan ID to purchase */
  plan: string;
  
  /** Optional metadata (passed to payment provider) */
  metadata?: Record<string, string>;
  
  /** Success redirect URL (optional) */
  successUrl?: string;
  
  /** Cancel redirect URL (optional) */
  cancelUrl?: string;
}

interface CheckoutResponse {
  /** URL to redirect customer to */
  checkoutUrl: string;
  
  /** Checkout session ID */
  sessionId: string;
  
  /** Provider used (stripe or lemonsqueezy) */
  provider: 'stripe' | 'lemonsqueezy';
}

// Usage
const checkout = await client.createCheckout({
  plan: 'pro',
  metadata: { userId: 'user_123' },
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/pricing',
});`}</code></pre>

      <h3>createPortalSession()</h3>
      <p>Create a Stripe Customer Portal session for subscription management.</p>

      <pre><code>{`interface PortalRequest {
  /** Stripe customer ID */
  customerId: string;
  
  /** Return URL after portal session */
  returnUrl?: string;
}

// Usage
const { url } = await client.createPortalSession({
  customerId: 'cus_...',
  returnUrl: 'https://yoursite.com/account',
});

window.location.href = url;`}</code></pre>

      <h3>getProjectSettings()</h3>
      <p>Fetch public widget settings for a project.</p>

      <pre><code>{`interface ProjectSettings {
  accentHex?: string;
  ctaLabel?: string;
  customCss?: string;
}

// Usage (no auth required)
const settings = await client.getProjectSettings();
console.log(settings.accentHex); // "#8b5cf6"`}</code></pre>

      <h2>Error Handling</h2>
      <pre><code>{`import { GitPayClient, GitPayError } from '@gitpaywidget/sdk';

try {
  const checkout = await client.createCheckout({ plan: 'pro' });
} catch (error) {
  if (error instanceof GitPayError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    
    if (error.status === 429) {
      console.log('Rate limited, retry after:', error.retryAfter);
    }
  }
}`}</code></pre>

      <h2>TypeScript Support</h2>
      <p>
        The SDK is written in TypeScript and includes full type definitions.
        All request and response types are exported:
      </p>

      <pre><code>{`import type {
  CheckoutRequest,
  CheckoutResponse,
  PortalRequest,
  PortalResponse,
  ProjectSettings,
  GitPayClientOptions,
} from '@gitpaywidget/sdk';`}</code></pre>

      <h2>Server-Side Usage</h2>
      <p>The SDK works in Node.js environments for server-side checkout creation:</p>

      <pre><code>{`// Next.js API route
import { GitPayClient } from '@gitpaywidget/sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, plan } = await req.json();
  
  const client = new GitPayClient({
    projectSlug: process.env.GPW_PROJECT_SLUG!,
  });
  
  const checkout = await client.createCheckout({
    plan,
    metadata: { userId },
    successUrl: \`\${process.env.SITE_URL}/success\`,
  });
  
  return NextResponse.json(checkout);
}`}</code></pre>

      <h2>Bundle Size</h2>
      <p>
        The SDK is designed to be lightweight:
      </p>
      <ul>
        <li><strong>Full bundle:</strong> ~3KB gzipped</li>
        <li><strong>Tree-shakeable:</strong> Import only what you need</li>
        <li><strong>No dependencies:</strong> Uses native fetch</li>
      </ul>

      <hr />

      <h2>Related</h2>
      <ul>
        <li><a href="/docs/widget">Widget Documentation</a></li>
        <li><a href="/docs/api">REST API Reference</a></li>
        <li><a href="/docs/quickstart">Quick Start Guide</a></li>
      </ul>
    </article>
  );
}

