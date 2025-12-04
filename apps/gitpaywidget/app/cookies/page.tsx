import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'GitPayWidget cookie policy. Learn about the cookies we use and how to manage your preferences.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/cookies' },
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        <article className="gpw-prose">
          <h1>Cookie Policy</h1>
          <p className="lead">Last updated: December 4, 2024</p>

          <p>
            This Cookie Policy explains how GitPayWidget ("we," "us," or "our") uses cookies 
            and similar technologies when you visit our website at gitpaywidget.com.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website. 
            They help the website remember your preferences and understand how you interact with 
            the site. Cookies can be "session" cookies (deleted when you close your browser) or 
            "persistent" cookies (remain until they expire or you delete them).
          </p>

          <h2>Types of Cookies We Use</h2>

          <h3>Essential Cookies (Always Active)</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core 
            functionality such as authentication, security, and session management.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>sb-*-auth-token</code></td>
                <td>Supabase</td>
                <td>Authentication session</td>
                <td>7 days</td>
              </tr>
              <tr>
                <td><code>gpw:*</code></td>
                <td>GitPayWidget</td>
                <td>User preferences (theme, onboarding)</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>Analytics Cookies (Optional)</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>_ga, _ga_*</code></td>
                <td>Google Analytics</td>
                <td>Distinguish users, track page views</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td><code>_gid</code></td>
                <td>Google Analytics</td>
                <td>Distinguish users</td>
                <td>24 hours</td>
              </tr>
            </tbody>
          </table>

          <h3>Marketing & Experience Cookies (Optional)</h3>
          <p>
            These cookies are used to improve your experience and help us understand user behavior 
            to enhance our product.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>_clck, _clsk</code></td>
                <td>Microsoft Clarity</td>
                <td>Session recording, heatmaps</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td><code>MUID</code></td>
                <td>Microsoft</td>
                <td>User identification</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h2>Managing Your Cookie Preferences</h2>
          <p>
            When you first visit our website, you'll see a cookie consent banner where you can:
          </p>
          <ul>
            <li><strong>Accept All:</strong> Enable all cookies including analytics and marketing</li>
            <li><strong>Decline:</strong> Only essential cookies will be used</li>
            <li><strong>Customize:</strong> Choose which categories of cookies to enable</li>
          </ul>
          <p>
            You can change your preferences at any time by clearing your browser's cookies and 
            localStorage, then revisiting our site. The consent banner will appear again.
          </p>

          <h2>Browser Settings</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>View what cookies are stored on your device</li>
            <li>Delete some or all cookies</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies (note: this may break some website functionality)</li>
          </ul>
          <p>
            For more information on managing cookies in your browser:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies on our site are set by third-party services. We do not control these 
            cookies and recommend reviewing the privacy policies of these providers:
          </p>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li><a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a></li>
            <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
          </ul>

          <h2>Embedded Widget Cookies</h2>
          <p>
            The GitPayWidget embedded on your users' sites does <strong>not</strong> set any 
            cookies on visitors' browsers. All payment processing is handled by your chosen 
            payment provider (Stripe, Lemon Squeezy) on their domains.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We will notify you of any 
            significant changes by updating the "Last updated" date at the top of this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{' '}
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

