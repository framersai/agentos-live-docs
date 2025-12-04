import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'GitPayWidget terms of service. Read our terms and conditions for using the service.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        <article className="gpw-prose">
          <h1>Terms of Service</h1>
          <p className="lead">Last updated: December 1, 2024</p>

          <p>
            These Terms of Service ("Terms") govern your access to and use of GitPayWidget 
            ("Service"), operated by Manic Agency LLC ("we," "us," or "our"). By using 
            the Service, you agree to be bound by these Terms.
          </p>

          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old and have the legal capacity to enter into 
            a binding agreement to use GitPayWidget. If you're using the Service on behalf 
            of an organization, you represent that you have authority to bind that organization.
          </p>

          <h2>2. Account Registration</h2>
          <p>
            To use GitPayWidget, you must create an account using GitHub OAuth. You are 
            responsible for maintaining the security of your account credentials and for 
            all activities that occur under your account.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose</li>
            <li>Process payments for prohibited goods or services</li>
            <li>Attempt to circumvent security measures</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Resell access to the Service without authorization</li>
            <li>Collect personal data from widget end users beyond what's necessary</li>
          </ul>

          <h2>4. Payment Processing</h2>
          <p>
            GitPayWidget facilitates payment processing through third-party providers 
            (Stripe, Lemon Squeezy, etc.). You are responsible for complying with each 
            provider's terms of service and maintaining valid credentials.
          </p>
          <p>
            We do not take a percentage of your transactions. You pay only our subscription 
            fees (if applicable) plus your payment provider's standard fees.
          </p>

          <h2>5. Data and Security</h2>
          <p>
            Your payment provider API keys are encrypted at rest. You are responsible for 
            keeping your keys secure and rotating them if compromised. We are not liable 
            for unauthorized access resulting from your negligence.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            GitPayWidget and its original content, features, and functionality are owned 
            by Manic Agency LLC and are protected by intellectual property laws. The 
            widget code is licensed under the MIT License.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, GITPAYWIDGET SHALL NOT BE LIABLE FOR 
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY 
            LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
          </p>
          <p>
            Our total liability for any claims arising from your use of the Service shall 
            not exceed the amount you paid us in the twelve (12) months preceding the claim.
          </p>

          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
            OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, 
            OR ERROR-FREE.
          </p>

          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account at any time for violation of these 
            Terms. You may close your account at any time through the dashboard. Upon 
            termination, your right to use the Service will immediately cease.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice 
            of material changes via email or through the dashboard. Continued use of the 
            Service after changes constitutes acceptance of the new Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the State of Delaware, without 
            regard to its conflict of law provisions.
          </p>

          <h2>12. Dispute Resolution</h2>
          <p>
            Any disputes arising from these Terms or your use of the Service shall be 
            resolved through binding arbitration in accordance with the rules of the 
            American Arbitration Association.
          </p>

          <h2>13. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@gitpaywidget.com">legal@gitpaywidget.com</a>.
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





