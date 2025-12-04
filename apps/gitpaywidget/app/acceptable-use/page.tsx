import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description: 'GitPayWidget acceptable use policy. Guidelines for using our payment widget service.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/acceptable-use' },
};

export default function AcceptableUsePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        <article className="gpw-prose">
          <h1>Acceptable Use Policy</h1>
          <p className="lead">Last updated: December 4, 2024</p>

          <p>
            This Acceptable Use Policy ("AUP") outlines the rules and guidelines for using 
            GitPayWidget. By using our service, you agree to comply with this policy.
          </p>

          <h2>Permitted Uses</h2>
          <p>GitPayWidget is designed for legitimate payment processing including:</p>
          <ul>
            <li>Software licenses and SaaS subscriptions</li>
            <li>Digital products (ebooks, courses, templates)</li>
            <li>Open source project donations and sponsorships</li>
            <li>Documentation and content site memberships</li>
            <li>API access and developer tools</li>
            <li>Professional services and consulting</li>
            <li>Physical goods (with proper fulfillment)</li>
          </ul>

          <h2>Prohibited Activities</h2>
          <p>
            You may <strong>not</strong> use GitPayWidget to process payments for:
          </p>

          <h3>Illegal Goods & Services</h3>
          <ul>
            <li>Illegal drugs, controlled substances, or drug paraphernalia</li>
            <li>Weapons, ammunition, or explosives</li>
            <li>Counterfeit or stolen goods</li>
            <li>Items that infringe intellectual property rights</li>
            <li>Services that violate any applicable law</li>
          </ul>

          <h3>High-Risk & Regulated Industries</h3>
          <ul>
            <li>Gambling, lotteries, or games of chance</li>
            <li>Adult content, pornography, or escort services</li>
            <li>Cryptocurrency trading, ICOs, or NFT minting</li>
            <li>Multi-level marketing (MLM) or pyramid schemes</li>
            <li>Debt collection or credit repair services</li>
            <li>Bail bonds or legal defense funds</li>
          </ul>

          <h3>Fraudulent Activities</h3>
          <ul>
            <li>Phishing, scams, or deceptive practices</li>
            <li>Money laundering or terrorist financing</li>
            <li>Identity theft or impersonation</li>
            <li>Fake charities or fraudulent fundraising</li>
            <li>Get-rich-quick schemes</li>
          </ul>

          <h3>Harmful Content</h3>
          <ul>
            <li>Content promoting violence, hatred, or discrimination</li>
            <li>Child exploitation material (CSAM)</li>
            <li>Non-consensual intimate imagery</li>
            <li>Malware, spyware, or hacking tools</li>
          </ul>

          <h2>Payment Provider Compliance</h2>
          <p>
            In addition to this AUP, you must comply with the acceptable use policies of your 
            chosen payment providers:
          </p>
          <ul>
            <li><a href="https://stripe.com/legal/restricted-businesses" target="_blank" rel="noopener noreferrer">Stripe Restricted Businesses</a></li>
            <li><a href="https://www.lemonsqueezy.com/terms" target="_blank" rel="noopener noreferrer">Lemon Squeezy Terms</a></li>
          </ul>

          <h2>Technical Restrictions</h2>
          <p>You may not:</p>
          <ul>
            <li>Attempt to bypass rate limits or abuse our API</li>
            <li>Reverse engineer or decompile our software</li>
            <li>Use automated systems to scrape or harvest data</li>
            <li>Interfere with the security or integrity of our service</li>
            <li>Resell or redistribute access without authorization</li>
            <li>Share API keys or credentials with unauthorized parties</li>
          </ul>

          <h2>Reporting Violations</h2>
          <p>
            If you become aware of any violation of this AUP, please report it to{' '}
            <a href="mailto:abuse@gitpaywidget.com">abuse@gitpaywidget.com</a>. We investigate 
            all reports and take appropriate action.
          </p>

          <h2>Enforcement</h2>
          <p>
            Violations of this AUP may result in:
          </p>
          <ul>
            <li>Warning and request to cease the activity</li>
            <li>Temporary suspension of your account</li>
            <li>Permanent termination without refund</li>
            <li>Reporting to law enforcement if required</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this AUP at any time. Continued use of the service after changes 
            constitutes acceptance of the updated policy.
          </p>

          <h2>Questions</h2>
          <p>
            If you're unsure whether your use case is permitted, please contact us at{' '}
            <a href="mailto:team@manic.agency">team@manic.agency</a> before signing up.
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

