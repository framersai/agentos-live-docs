import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'GitPayWidget refund policy. Learn about our 30-day money-back guarantee for Pro licenses.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/refund' },
};

export default function RefundPolicyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        <article className="gpw-prose">
          <h1>Refund Policy</h1>
          <p className="lead">Last updated: December 4, 2024</p>

          <p>
            We want you to be completely satisfied with GitPayWidget. This policy outlines 
            our refund terms for different plan types.
          </p>

          <h2>Free Plan</h2>
          <p>
            The Free plan has no upfront cost. The 1% platform fee is collected at the time 
            of each transaction and is <strong>non-refundable</strong> as it covers the cost 
            of processing the payment.
          </p>

          <h2>Pro Lifetime License</h2>
          <p>
            We offer a <strong>30-day money-back guarantee</strong> on all Pro license purchases. 
            If you're not satisfied for any reason within 30 days of purchase, we'll refund 
            your full $250 license fee—no questions asked.
          </p>

          <h3>How to Request a Refund</h3>
          <ol>
            <li>Email <a href="mailto:team@manic.agency">team@manic.agency</a> within 30 days of purchase</li>
            <li>Include your account email and reason (optional but helpful)</li>
            <li>We'll process your refund within 5-7 business days</li>
            <li>Refunds are issued to the original payment method</li>
          </ol>

          <h3>After 30 Days</h3>
          <p>
            Refunds are generally not available after the 30-day period. However, we may make 
            exceptions in cases of:
          </p>
          <ul>
            <li>Technical issues that prevent you from using the service</li>
            <li>Billing errors or duplicate charges</li>
            <li>Other extenuating circumstances</li>
          </ul>
          <p>
            Contact us at <a href="mailto:team@manic.agency">team@manic.agency</a> to discuss 
            your situation.
          </p>

          <h2>What Happens After a Refund</h2>
          <p>Once your refund is processed:</p>
          <ul>
            <li>Your account will be downgraded to the Free plan</li>
            <li>Pro features will be disabled immediately</li>
            <li>Your projects and data will remain intact</li>
            <li>The 1% platform fee will apply to future transactions</li>
          </ul>

          <h2>Chargebacks</h2>
          <p>
            If you dispute a charge with your bank or credit card company without contacting 
            us first, we may suspend your account pending resolution. Please reach out to us 
            first—we're happy to resolve any issues directly.
          </p>

          <h2>Transaction Fees from Your Customers</h2>
          <p>
            GitPayWidget facilitates payments between you and your customers. Refunds to your 
            customers are handled through your payment provider (Stripe, Lemon Squeezy):
          </p>
          <ul>
            <li>You are responsible for your own refund policy to customers</li>
            <li>Refunds are processed through your provider's dashboard</li>
            <li>Provider fees may or may not be refundable (check your provider's policy)</li>
            <li>GitPayWidget's 1% fee (Free plan) is non-refundable on customer transactions</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            Questions about refunds? We're here to help:
          </p>
          <ul>
            <li>Email: <a href="mailto:team@manic.agency">team@manic.agency</a></li>
            <li>Response time: Within 24 hours on business days</li>
          </ul>

          <hr />

          <div className="not-prose gpw-card p-6 text-center">
            <p className="text-lg font-semibold mb-2">Ready to try GitPayWidget?</p>
            <p className="text-gpw-text-muted mb-4">
              Start free with our risk-free 30-day guarantee on Pro.
            </p>
            <Link href="/pricing" className="gpw-btn-primary">
              View Pricing
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

