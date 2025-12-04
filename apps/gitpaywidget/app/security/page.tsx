import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security',
  description: 'GitPayWidget security practices. Learn how we protect your data and payment credentials.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/security' },
};

export default function SecurityPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        <article className="gpw-prose">
          <h1>Security at GitPayWidget</h1>
          <p className="lead">
            Security is foundational to everything we build. Your payment credentials and 
            customer data deserve the highest level of protection.
          </p>

          <h2>Data Encryption</h2>

          <h3>At Rest</h3>
          <p>
            All sensitive data is encrypted before storage using industry-standard algorithms:
          </p>
          <ul>
            <li><strong>Payment credentials:</strong> AES-256-GCM encryption with unique keys</li>
            <li><strong>Database:</strong> Encrypted at rest via Supabase (backed by AWS)</li>
            <li><strong>Backups:</strong> Encrypted and stored in geographically distributed locations</li>
          </ul>

          <h3>In Transit</h3>
          <ul>
            <li>All connections use TLS 1.3 encryption</li>
            <li>HTTPS enforced on all endpoints</li>
            <li>HSTS headers prevent downgrade attacks</li>
            <li>Certificate pinning on critical API calls</li>
          </ul>

          <h2>Zero PCI Scope</h2>
          <p>
            GitPayWidget is designed so that you never have to handle sensitive payment data:
          </p>
          <ul>
            <li>Card numbers never touch your servers or ours</li>
            <li>Customers enter payment details directly on Stripe/Lemon Squeezy</li>
            <li>We only receive session IDs and metadata via webhooks</li>
            <li>Your API keys are used server-side only, never exposed to browsers</li>
          </ul>

          <h2>Access Control</h2>

          <h3>Authentication</h3>
          <ul>
            <li>GitHub OAuth for secure sign-in (no passwords stored)</li>
            <li>Secure session tokens with automatic expiration</li>
            <li>CSRF protection on all state-changing operations</li>
          </ul>

          <h3>Authorization</h3>
          <ul>
            <li>Row-Level Security (RLS) in database</li>
            <li>Users can only access their own projects</li>
            <li>API keys are scoped to individual projects</li>
            <li>Audit logging for sensitive operations</li>
          </ul>

          <h2>Infrastructure Security</h2>
          <ul>
            <li><strong>Hosting:</strong> Deployed on secure cloud infrastructure</li>
            <li><strong>DDoS Protection:</strong> Cloudflare protection on all endpoints</li>
            <li><strong>Rate Limiting:</strong> API endpoints protected against abuse</li>
            <li><strong>WAF:</strong> Web Application Firewall rules block common attacks</li>
          </ul>

          <h2>Secure Development</h2>
          <ul>
            <li>Dependencies regularly audited for vulnerabilities</li>
            <li>Automated security scanning in CI/CD pipeline</li>
            <li>Code review required for all changes</li>
            <li>Regular penetration testing</li>
          </ul>

          <h2>Incident Response</h2>
          <p>
            In the unlikely event of a security incident:
          </p>
          <ol>
            <li>We immediately investigate and contain the threat</li>
            <li>Affected users are notified within 72 hours</li>
            <li>Root cause analysis is conducted</li>
            <li>Preventive measures are implemented</li>
          </ol>

          <h2>Responsible Disclosure</h2>
          <p>
            We appreciate security researchers who help us keep GitPayWidget secure. 
            If you discover a vulnerability:
          </p>
          <ol>
            <li>Email <a href="mailto:security@gitpaywidget.com">security@gitpaywidget.com</a></li>
            <li>Provide detailed information about the vulnerability</li>
            <li>Allow reasonable time for us to address the issue</li>
            <li>Do not publicly disclose until we've issued a fix</li>
          </ol>
          <p>
            We do not currently offer a bug bounty program, but we acknowledge researchers 
            who responsibly disclose valid vulnerabilities.
          </p>

          <h2>Compliance</h2>
          <ul>
            <li><strong>GDPR:</strong> Full compliance with EU data protection regulations</li>
            <li><strong>CCPA:</strong> California Consumer Privacy Act compliant</li>
            <li><strong>SOC 2:</strong> Infrastructure providers are SOC 2 certified</li>
          </ul>

          <h2>Best Practices for Users</h2>
          <p>Help us keep your account secure:</p>
          <ul>
            <li>Keep your GitHub account secure with 2FA</li>
            <li>Rotate payment provider API keys periodically</li>
            <li>Use test mode keys during development</li>
            <li>Monitor your dashboard for unexpected activity</li>
            <li>Report suspicious activity immediately</li>
          </ul>

          <h2>Questions?</h2>
          <p>
            For security-related questions or concerns, contact us at{' '}
            <a href="mailto:security@gitpaywidget.com">security@gitpaywidget.com</a>.
          </p>

          <hr />

          <div className="not-prose grid sm:grid-cols-2 gap-4">
            <div className="gpw-card p-6">
              <div className="gpw-feature-icon mb-4">🔐</div>
              <h3 className="font-semibold mb-2">AES-256 Encryption</h3>
              <p className="text-sm text-gpw-text-muted">
                Your API keys are encrypted with military-grade encryption before storage.
              </p>
            </div>
            <div className="gpw-card p-6">
              <div className="gpw-feature-icon mb-4">🛡️</div>
              <h3 className="font-semibold mb-2">Zero PCI Scope</h3>
              <p className="text-sm text-gpw-text-muted">
                Card data never touches our servers. Payments handled by Stripe/Lemon Squeezy.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

