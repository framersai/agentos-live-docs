import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Start – GitPayWidget',
  description: 'Get GitPayWidget running on your static site in 5 minutes.',
};

export default function QuickStartPage() {
  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <h1>Quick Start Guide</h1>
      <p className="lead">Get GitPayWidget running on your static site in under 5 minutes.</p>

      <hr />

      <h2>1. Sign Up</h2>
      <ol>
        <li>
          Visit <a href="https://gitpaywidget.com">gitpaywidget.com</a>
        </li>
        <li>
          Click <strong>"Continue with GitHub"</strong>
        </li>
        <li>Authorize the app</li>
      </ol>

      <h2>2. Create Project</h2>
      <ol>
        <li>
          Go to <a href="/projects">/projects</a>
        </li>
        <li>
          Click <strong>"Create new project"</strong>
        </li>
        <li>
          Enter name: <code>My Site</code>
        </li>
        <li>
          Enter slug: <code>myorg/site</code>
        </li>
        <li>Save</li>
      </ol>

      <h2>3. Add Payment Keys</h2>
      <ol>
        <li>
          Go to <a href="/dashboard">/dashboard</a>
        </li>
        <li>Select your project</li>
        <li>
          Choose provider: <strong>Stripe</strong> or <strong>Lemon Squeezy</strong>
        </li>
        <li>Paste API keys as JSON (see examples below)</li>
        <li>
          Click <strong>"Save secret"</strong>
        </li>
      </ol>

      <h3>Stripe Keys Example</h3>
      <pre>
        <code>{`{
  "secretKey": "sk_test_...",
  "webhookSecret": "whsec_...",
  "priceId": "price_..."
}`}</code>
      </pre>

      <h3>Lemon Squeezy Keys Example</h3>
      <pre>
        <code>{`{
  "apiKey": "...",
  "storeId": "12345",
  "variantId": "67890"
}`}</code>
      </pre>

      <h2>4. Embed Widget</h2>
      <p>Add this to your HTML:</p>

      <pre>
        <code>{`<div id="pricing"></div>

<script type="module">
  import { renderGitPayWidget } from 'https://cdn.gitpaywidget.com/v0/widget.js'

  renderGitPayWidget({
    project: 'myorg/site',
    plans: [
      {
        id: 'free',
        label: 'Free',
        price: '$0',
        description: 'For individuals',
        features: ['Basic features', 'Community support']
      },
      {
        id: 'pro',
        label: 'Pro',
        price: '$9.99/mo',
        description: 'For teams',
        features: ['Advanced features', 'Priority support', 'API access']
      }
    ],
    autoTheme: true,
    mount: document.getElementById('pricing')
  })
</script>`}</code>
      </pre>

      <h2>5. Configure Webhooks</h2>
      <p>In your Stripe or Lemon Squeezy dashboard:</p>
      <ul>
        <li>
          <strong>Webhook URL:</strong> <code>https://gitpaywidget.com/api/webhook</code>
        </li>
        <li>
          <strong>Events:</strong> subscription created/updated/deleted
        </li>
        <li>Copy webhook secret → paste into GitPayWidget dashboard</li>
      </ul>

      <h2>6. Test</h2>
      <ol>
        <li>Visit your site</li>
        <li>Click a plan button</li>
        <li>
          Complete checkout (use test card: <code>4242 4242 4242 4242</code>)
        </li>
        <li>Check analytics in dashboard</li>
      </ol>

      <hr />

      <h2>Next Steps</h2>
      <ul>
        <li>
          <a href="/docs/integration">Full Integration Guide</a> – detailed walkthrough
        </li>
        <li>
          <a href="/docs/api">API Reference</a> – all endpoints documented
        </li>
        <li>
          <a href="/docs/theming">Theming Guide</a> – customize colors & CSS
        </li>
      </ul>

      <div className="rounded-2xl border border-gpw-primary/30 bg-gpw-primary/5 p-6 not-prose">
        <p className="text-sm">
          <strong>Questions?</strong> Contact{' '}
          <a href="mailto:team@manic.agency" className="text-gpw-primary hover:underline">
            team@manic.agency
          </a>
        </p>
      </div>
    </article>
  );
}
