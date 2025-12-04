import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Complete API documentation for GitPayWidget. Learn how to integrate payments into your static site.',
  alternates: { canonical: '/docs/api' },
};

const endpoints = [
  {
    method: 'POST',
    path: '/api/checkout',
    description: 'Create a hosted checkout session',
    auth: false,
    rateLimit: '10 req/min',
  },
  {
    method: 'GET',
    path: '/api/projects',
    description: 'List all projects for authenticated user',
    auth: true,
    rateLimit: '120 req/min',
  },
  {
    method: 'POST',
    path: '/api/projects',
    description: 'Create a new project',
    auth: true,
    rateLimit: '120 req/min',
  },
  {
    method: 'GET',
    path: '/api/projects/:slug/analytics',
    description: 'Get project analytics and revenue data',
    auth: true,
    rateLimit: '120 req/min',
  },
  {
    method: 'GET',
    path: '/api/projects/:slug/settings',
    description: 'Get widget theme settings',
    auth: true,
    rateLimit: '120 req/min',
  },
  {
    method: 'POST',
    path: '/api/projects/:slug/settings',
    description: 'Update widget theme settings',
    auth: true,
    rateLimit: '30 req/min',
  },
  {
    method: 'POST',
    path: '/api/projects/:slug/keys',
    description: 'Store encrypted provider credentials',
    auth: true,
    rateLimit: '30 req/min',
  },
  {
    method: 'POST',
    path: '/api/webhook',
    description: 'Receive provider webhook events',
    auth: false,
    rateLimit: 'Unlimited',
  },
  {
    method: 'POST',
    path: '/api/portal',
    description: 'Create Stripe Customer Portal session',
    auth: true,
    rateLimit: '120 req/min',
  },
  {
    method: 'GET',
    path: '/api/public/projects/:slug/settings',
    description: 'Public endpoint for widget auto-theming',
    auth: false,
    rateLimit: '60 req/min',
  },
];

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gpw-bg-base pt-20">
      <div className="gpw-container py-12">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gpw-text-muted mb-4">
            <Link href="/docs" className="hover:text-gpw-purple-600">Docs</Link>
            <span>/</span>
            <span className="text-gpw-text-primary">API Reference</span>
          </nav>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="gpw-text-gradient">API Reference</span>
          </h1>
          <p className="text-lg text-gpw-text-muted max-w-2xl">
            Complete REST API documentation for GitPayWidget. 
            All endpoints return JSON and use standard HTTP status codes.
          </p>
        </div>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Base URL</h2>
          <div className="gpw-code-block">
            <div className="gpw-code-content">
              <code className="text-emerald-400">https://gitpaywidget.com/api</code>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="text-gpw-text-muted mb-4">
            Most endpoints require Supabase session authentication via cookies.
            Sign in with GitHub OAuth to get a session token automatically.
          </p>
          <div className="gpw-card p-4">
            <p className="text-sm">
              <strong>Public endpoints</strong> (no auth required): 
              <code className="ml-2 px-2 py-0.5 rounded bg-gpw-purple-500/10 text-gpw-purple-600">/api/checkout</code>,
              <code className="ml-1 px-2 py-0.5 rounded bg-gpw-purple-500/10 text-gpw-purple-600">/api/webhook</code>,
              <code className="ml-1 px-2 py-0.5 rounded bg-gpw-purple-500/10 text-gpw-purple-600">/api/public/*</code>
            </p>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="gpw-card p-4">
              <p className="text-sm text-gpw-text-muted">Public</p>
              <p className="text-2xl font-bold text-gpw-purple-600">60 req/min</p>
            </div>
            <div className="gpw-card p-4">
              <p className="text-sm text-gpw-text-muted">Authenticated</p>
              <p className="text-2xl font-bold text-gpw-purple-600">120 req/min</p>
            </div>
            <div className="gpw-card p-4">
              <p className="text-sm text-gpw-text-muted">Checkout</p>
              <p className="text-2xl font-bold text-gpw-purple-600">10 req/min</p>
            </div>
            <div className="gpw-card p-4">
              <p className="text-sm text-gpw-text-muted">Webhooks</p>
              <p className="text-2xl font-bold text-emerald-600">Unlimited</p>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <div key={endpoint.path} className="gpw-card p-5">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <span className={`
                    px-2 py-1 rounded font-mono text-xs font-bold
                    ${endpoint.method === 'GET' 
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'}
                  `}>
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-sm text-gpw-text-primary">
                    {endpoint.path}
                  </code>
                  {endpoint.auth && (
                    <span className="gpw-badge-warning text-2xs">Auth Required</span>
                  )}
                </div>
                <p className="text-gpw-text-muted text-sm mb-2">{endpoint.description}</p>
                <p className="text-xs text-gpw-text-muted">
                  Rate limit: <span className="font-mono">{endpoint.rateLimit}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Checkout Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Example: Create Checkout</h2>
          <div className="gpw-code-block">
            <div className="gpw-code-header">
              <div className="gpw-code-dots">
                <span className="gpw-code-dot bg-red-500" />
                <span className="gpw-code-dot bg-yellow-500" />
                <span className="gpw-code-dot bg-green-500" />
              </div>
              <span className="text-xs text-gray-400">Request</span>
            </div>
            <pre className="gpw-code-content text-sm">
              <code>{`curl -X POST https://gitpaywidget.com/api/checkout \\
  -H "Content-Type: application/json" \\
  -d '{
    "project": "your-org/your-site",
    "plan": "pro",
    "metadata": {
      "userId": "12345"
    }
  }'`}</code>
            </pre>
          </div>
          
          <div className="gpw-code-block mt-4">
            <div className="gpw-code-header">
              <div className="gpw-code-dots">
                <span className="gpw-code-dot bg-red-500" />
                <span className="gpw-code-dot bg-yellow-500" />
                <span className="gpw-code-dot bg-green-500" />
              </div>
              <span className="text-xs text-gray-400">Response</span>
            </div>
            <pre className="gpw-code-content text-sm">
              <code className="text-emerald-400">{`{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_...",
  "sessionId": "cs_test_...",
  "provider": "stripe"
}`}</code>
            </pre>
          </div>
        </section>

        {/* OpenAPI Link */}
        <section className="mb-12">
          <div className="gpw-card p-6 bg-gradient-to-r from-gpw-purple-500/10 to-gpw-pink-500/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gpw-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-gpw-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">OpenAPI Specification</h3>
                <p className="text-sm text-gpw-text-muted">
                  Download the full OpenAPI 3.1 spec for import into Postman, Insomnia, or your favorite API client.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a 
                href="/openapi.yaml" 
                download
                className="gpw-btn-primary text-sm"
              >
                Download OpenAPI YAML
              </a>
              <Link href="/docs/api/generated" className="gpw-btn-secondary text-sm">
                View Generated Docs
              </Link>
            </div>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Error Codes</h2>
          <div className="gpw-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gpw-purple-500/10">
                <tr>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gpw-border">
                <tr>
                  <td className="p-4 font-mono text-red-500">400</td>
                  <td className="p-4 text-gpw-text-muted">Bad request (invalid params)</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-red-500">401</td>
                  <td className="p-4 text-gpw-text-muted">Unauthenticated</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-red-500">403</td>
                  <td className="p-4 text-gpw-text-muted">Forbidden (not the owner)</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-red-500">404</td>
                  <td className="p-4 text-gpw-text-muted">Resource not found</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-amber-500">429</td>
                  <td className="p-4 text-gpw-text-muted">Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-red-500">500</td>
                  <td className="p-4 text-gpw-text-muted">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Support */}
        <section>
          <div className="gpw-card p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
            <p className="text-gpw-text-muted mb-4">
              Questions about the API? We're here to help.
            </p>
            <a 
              href="mailto:team@manic.agency" 
              className="gpw-btn-secondary text-sm"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
