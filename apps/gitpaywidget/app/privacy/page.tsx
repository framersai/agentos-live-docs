import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GitPayWidget privacy policy. Learn how we collect, use, and protect your data.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        <article className="gpw-prose">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: December 1, 2024</p>

          <p>
            GitPayWidget ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our service.
          </p>

          <h2>Information We Collect</h2>

          <h3>Account Information</h3>
          <p>
            When you create an account, we collect your email address and basic profile 
            information from your GitHub account (username, avatar). We use GitHub OAuth 
            for authentication and do not store your GitHub password.
          </p>

          <h3>Payment Provider Credentials</h3>
          <p>
            You may provide API keys for payment providers (Stripe, Lemon Squeezy). These 
            are encrypted using AES-256-GCM before storage and are only decrypted server-side 
            during checkout session creation. We never expose these keys to client-side code.
          </p>

          <h3>Usage Data</h3>
          <p>
            We collect analytics about how you use GitPayWidget, including:
          </p>
          <ul>
            <li>Checkout session counts</li>
            <li>Conversion rates</li>
            <li>Widget impressions</li>
            <li>Error logs (for debugging)</li>
          </ul>

          <h3>Widget End Users</h3>
          <p>
            When visitors interact with your embedded widget, we do not collect personal 
            information about them. Checkout sessions are created via your payment provider, 
            and all customer data is handled by Stripe, Lemon Squeezy, or your chosen provider.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain the GitPayWidget service</li>
            <li>To process checkout sessions on your behalf</li>
            <li>To send you service-related notifications</li>
            <li>To analyze usage and improve our product</li>
            <li>To respond to support requests</li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            We retain your account data as long as your account is active. Analytics data 
            is retained for 24 months. You can request deletion of your data at any time 
            by contacting us.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures including:
          </p>
          <ul>
            <li>AES-256-GCM encryption for sensitive credentials</li>
            <li>TLS/HTTPS for all data in transit</li>
            <li>Row-level security in our database</li>
            <li>Regular security audits</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Supabase:</strong> Database and authentication</li>
            <li><strong>Stripe/Lemon Squeezy:</strong> Payment processing (via your credentials)</li>
            <li><strong>Cloudflare:</strong> CDN and DDoS protection</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use essential cookies for authentication. The embedded widget does not 
            set cookies on your visitors' browsers.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of 
            any material changes by email or through the dashboard.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@gitpaywidget.com">privacy@gitpaywidget.com</a>.
          </p>

          <hr />

          <p className="text-sm text-gpw-text-muted">
            GitPayWidget is operated by Manic Agency LLC.
          </p>
        </article>
      </div>
    </div>
  );
}





