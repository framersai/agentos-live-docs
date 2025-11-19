import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Theming Guide – GitPayWidget',
  description: 'Customize GitPayWidget colors, labels, and styles to match your brand.',
};

export default function ThemingPage() {
  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <h1>Theming Guide</h1>
      <p className="lead">Customize GitPayWidget to match your brand.</p>

      <hr />

      <h2>Dashboard Theming (Recommended)</h2>
      <p>The easiest way to theme your widget is through the dashboard:</p>

      <ol>
        <li>
          Login to <a href="/dashboard">/dashboard</a>
        </li>
        <li>Select your project</li>
        <li>
          Scroll to <strong>"Widget Theme"</strong>
        </li>
        <li>
          Set:
          <ul>
            <li>
              <strong>Accent color</strong>: HEX code (e.g., <code>#8b5cf6</code>)
            </li>
            <li>
              <strong>CTA label</strong>: Button text (e.g., "Get started")
            </li>
            <li>
              <strong>Custom CSS</strong>: Advanced overrides
            </li>
          </ul>
        </li>
        <li>
          Click <strong>"Save theme"</strong>
        </li>
      </ol>

      <p>Then enable auto-theme in your widget code:</p>

      <pre>
        <code>{`renderGitPayWidget({
  project: 'myorg/site',
  plans: [...],
  autoTheme: true  // Fetches your dashboard theme
})`}</code>
      </pre>

      <hr />

      <h2>Inline Theming</h2>
      <p>Override theme directly in code:</p>

      <pre>
        <code>{`renderGitPayWidget({
  project: 'myorg/site',
  plans: [...],
  theme: {
    accentHex: '#ec4899',
    ctaLabel: 'Start free trial'
  }
})`}</code>
      </pre>

      <hr />

      <h2>Custom CSS</h2>
      <p>Target these classes for advanced styling:</p>

      <h3>Plan Cards</h3>
      <pre>
        <code>{`.gpw-plan-card {
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.12);
  transition: transform 0.2s ease;
}

.gpw-plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(139, 92, 246, 0.18);
}`}</code>
      </pre>

      <h3>Buttons</h3>
      <pre>
        <code>{`.gpw-plan-button {
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 9999px;
}

.gpw-plan-button:hover {
  opacity: 0.9;
}`}</code>
      </pre>

      <h3>Typography</h3>
      <pre>
        <code>{`.gpw-plan-card h3 {
  font-family: 'Caveat', cursive;
  font-size: 2rem;
  color: var(--accent-color);
}`}</code>
      </pre>

      <hr />

      <h2>Brand Colors</h2>
      <p>GitPayWidget's default palette:</p>

      <div className="grid grid-cols-2 gap-4 not-prose">
        <div className="rounded-xl border p-4">
          <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#8b5cf6' }} />
          <p className="text-sm font-mono">#8b5cf6</p>
          <p className="text-xs text-ink-500">Primary Purple</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#ec4899' }} />
          <p className="text-sm font-mono">#ec4899</p>
          <p className="text-xs text-ink-500">Secondary Pink</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#fbbf24' }} />
          <p className="text-sm font-mono">#fbbf24</p>
          <p className="text-xs text-ink-500">Accent Yellow</p>
        </div>
        <div className="rounded-xl border p-4">
          <div
            className="w-full h-16 rounded-lg mb-2"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          />
          <p className="text-sm">Gradient</p>
          <p className="text-xs text-ink-500">Purple → Pink</p>
        </div>
      </div>

      <hr />

      <h2>Typography</h2>
      <ul>
        <li>
          <strong>Display</strong>: Caveat (playful, hand-drawn feel)
        </li>
        <li>
          <strong>Body</strong>: Space Grotesk (modern, geometric)
        </li>
        <li>
          <strong>Code</strong>: JetBrains Mono (monospace)
        </li>
      </ul>

      <pre>
        <code>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Space+Grotesk:wght@400;500;600&display=swap');`}</code>
      </pre>

      <hr />

      <h2>Examples</h2>

      <h3>Minimal Dark Mode</h3>
      <pre>
        <code>{`.gpw-widget-root {
  background: #0a0a0a;
  color: #fff;
}

.gpw-plan-card {
  background: #1a1a1a;
  border: 1px solid #333;
}

.gpw-plan-button {
  background: white;
  color: black;
}`}</code>
      </pre>

      <h3>Glassmorphism</h3>
      <pre>
        <code>{`.gpw-plan-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`}</code>
      </pre>

      <hr />

      <h2>Need Help?</h2>
      <p>
        Contact <a href="mailto:team@manic.agency">team@manic.agency</a> for custom theming
        assistance.
      </p>
    </article>
  );
}
