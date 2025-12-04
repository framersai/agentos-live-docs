import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security Best Practices – GitPayWidget Docs',
  description: 'Learn how to securely manage API keys, handle webhooks, and protect your payment integration.',
  alternates: { canonical: '/docs/security' },
};

export default function SecurityDocsPage() {
  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <h1>Security Best Practices</h1>
      <p className="lead">
        Protect your integration and your customers with these security guidelines.
      </p>

      <hr />

      <h2>API Key Management</h2>

      <h3>Key Types</h3>
      <ul>
        <li><strong>Test keys</strong> (e.g., <code>sk_test_...</code>) — Use for development</li>
        <li><strong>Live keys</strong> (e.g., <code>sk_live_...</code>) — Use for production only</li>
      </ul>

      <h3>Storage Rules</h3>
      <ol>
        <li><strong>Never commit keys to git</strong> — Add <code>.env</code> to <code>.gitignore</code></li>
        <li><strong>Use environment variables</strong> — Not hardcoded strings</li>
        <li><strong>Rotate keys periodically</strong> — At least every 90 days</li>
        <li><strong>Revoke compromised keys immediately</strong> — In your provider dashboard</li>
      </ol>

      <h3>GitPayWidget Encryption</h3>
      <p>When you save keys in our dashboard:</p>
      <ul>
        <li>Keys are encrypted with <strong>AES-256-GCM</strong> before storage</li>
        <li>Encryption key is unique per environment</li>
        <li>Keys are only decrypted server-side during checkout</li>
        <li>Client-side code <strong>never</strong> sees your keys</li>
      </ul>

      <pre><code>{`// Your keys flow:
Dashboard → Encrypted → Database → Decrypted → Checkout API → Stripe/Lemon

// Client never sees:
❌ Your Stripe secret key
❌ Your webhook secrets
❌ Decrypted credentials`}</code></pre>

      <h2>Webhook Security</h2>

      <h3>Signature Verification</h3>
      <p>
        All webhook events from Stripe and Lemon Squeezy include a signature header. 
        GitPayWidget automatically verifies these signatures before processing.
      </p>

      <pre><code>{`// Stripe signature header
stripe-signature: t=1234567890,v1=abc123...

// Lemon Squeezy signature header  
X-Signature: sha256=abc123...`}</code></pre>

      <h3>Webhook Best Practices</h3>
      <ol>
        <li><strong>Use HTTPS only</strong> — Never expose webhook endpoints on HTTP</li>
        <li><strong>Keep secrets secret</strong> — Webhook signing secrets should be in env vars</li>
        <li><strong>Idempotency</strong> — Handle duplicate webhook deliveries gracefully</li>
        <li><strong>Return 200 quickly</strong> — Process async to avoid timeouts</li>
      </ol>

      <h2>Widget Security</h2>

      <h3>Content Security Policy</h3>
      <p>If you use CSP headers, add these domains:</p>
      <pre><code>{`Content-Security-Policy: 
  script-src 'self' https://cdn.gitpaywidget.com;
  connect-src 'self' https://api.gitpaywidget.com https://api.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;`}</code></pre>

      <h3>Subresource Integrity</h3>
      <p>For extra security, use SRI with the widget script:</p>
      <pre><code>{`<script 
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>`}</code></pre>

      <h2>PCI Compliance</h2>

      <h3>Zero PCI Scope</h3>
      <p>
        GitPayWidget is designed so neither you nor we handle card data:
      </p>
      <ul>
        <li>Card numbers are entered directly on Stripe/Lemon Squeezy</li>
        <li>Your site receives only session IDs and metadata</li>
        <li>No sensitive payment data touches your servers</li>
      </ul>

      <h3>SAQ A Eligibility</h3>
      <p>
        Using GitPayWidget keeps you eligible for the simplest PCI compliance level (SAQ A), 
        which requires only a brief annual questionnaire.
      </p>

      <h2>Test Mode</h2>

      <h3>Always Use Test Mode in Development</h3>
      <pre><code>{`// Dashboard → Select project → Toggle "Test Mode"

// Test card numbers:
4242 4242 4242 4242  // Visa (success)
4000 0000 0000 9995  // Visa (declined)
4000 0000 0000 3220  // 3D Secure required`}</code></pre>

      <h3>Separate Keys Per Environment</h3>
      <pre><code>{`# .env.development
STRIPE_SECRET_KEY=sk_test_...

# .env.production  
STRIPE_SECRET_KEY=sk_live_...`}</code></pre>

      <h2>Incident Response</h2>

      <h3>If You Suspect a Breach</h3>
      <ol>
        <li><strong>Revoke keys immediately</strong> — In Stripe/Lemon Squeezy dashboard</li>
        <li><strong>Update keys in GitPayWidget</strong> — Dashboard → Provider Keys</li>
        <li><strong>Review recent transactions</strong> — Check for unauthorized activity</li>
        <li><strong>Contact us</strong> — <a href="mailto:security@gitpaywidget.com">security@gitpaywidget.com</a></li>
      </ol>

      <hr />

      <h2>Security Checklist</h2>
      <ul>
        <li>☐ API keys stored in environment variables</li>
        <li>☐ Test mode enabled during development</li>
        <li>☐ Webhook secrets configured</li>
        <li>☐ HTTPS on all production endpoints</li>
        <li>☐ CSP headers include required domains</li>
        <li>☐ Keys rotated within last 90 days</li>
      </ul>

      <div className="not-prose gpw-card p-6 mt-8">
        <p className="text-sm">
          <strong>Questions about security?</strong>{' '}
          <Link href="/security" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
            Read our Security page
          </Link>{' '}
          or email{' '}
          <a href="mailto:security@gitpaywidget.com" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
            security@gitpaywidget.com
          </a>
        </p>
      </div>
    </article>
  );
}

