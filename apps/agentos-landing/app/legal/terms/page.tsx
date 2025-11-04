"use client";

import Link from "next/link";

const lastUpdated = "November 6, 2025";

export const metadata = {
  title: "Terms of Service · AgentOS",
  description:
    "Terms governing the use of AgentOS, the Voice Chat Assistant, Agency launches, and the AgentOS marketplace."
};

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "1. Acceptance of terms",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        By accessing AgentOS, the Voice Chat Assistant, or the AgentOS marketplace you agree to be bound by
        these Terms of Service and the companion <Link href="/legal/privacy" className="font-semibold text-brand hover:underline">Privacy Policy</Link>. If you are using the services on behalf of an
        organisation, you confirm that you have authority to bind that organisation to these terms.
      </p>
    )
  },
  {
    title: "2. Accounts & plans",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          You must provide accurate registration information. Accounts may be suspended if we detect abuse,
          fraud, or sustained policy violations.
        </li>
        <li>
          Plan entitlements (custom agents, knowledge docs, agency seats, and weekly agency launches) are
          defined in <Link href="/docs/PLANS_AND_BILLING" className="font-semibold text-brand hover:underline">docs/PLANS_AND_BILLING.md</Link>. Weekly launch quotas are enforced by{" "}
          <code>agency_usage_log</code>.
        </li>
        <li>
          Bring-your-own keys are optional on Creator and Organisation plans. You are responsible for the
          usage and security of any API keys that you attach.
        </li>
      </ul>
    )
  },
  {
    title: "3. Marketplace & bundles",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          Marketplace listings carry a visibility flag (`public`, `unlisted`, `org`, `invite`). You must not
          attempt to bypass visibility, invite, or organisation restrictions.
        </li>
        <li>
          Persona bundles imported via <code>/api/agents/bundles/import</code> are reviewed before publication.
          Submissions must not contain malicious prompts, unlicensed IP, or personal data you do not have
          rights to share.
        </li>
        <li>
          Revenue shares and payout schedules are handled outside these self-service terms. Contact{" "}
          <a href="mailto:founders@frame.dev" className="font-semibold text-brand hover:underline">
            founders@frame.dev
          </a>{" "}
          for partner agreements.
        </li>
      </ul>
    )
  },
  {
    title: "4. Acceptable use",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>No unlawful, infringing, or harmful content.</li>
        <li>No attempts to reverse engineer or interfere with platform security.</li>
        <li>No automated scraping of private or invite-only listings.</li>
        <li>
          Respect per-plan rate limits and ensure human review for sensitive AI output before acting on it.
        </li>
      </ul>
    )
  },
  {
    title: "5. Data handling & retention",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>Usage logs (including agency launches) are retained for ~18 months.</li>
        <li>Approved persona prompts are stored under <code>prompts/_dynamic</code> for runtime access.</li>
        <li>
          You are responsible for any personal data contained in custom prompts, knowledge documents, or
          bundles that you upload.
        </li>
      </ul>
    )
  },
  {
    title: "6. Termination",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        You may terminate at any time by deleting your account or cancelling your plan. We may suspend or
        terminate access if you materially breach these terms, refuse to pay applicable fees, or engage in
        abusive behaviour. Upon termination we will delete or anonymise retained data in accordance with the{" "}
        <Link href="/legal/privacy" className="font-semibold text-brand hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    )
  },
  {
    title: "7. Limitation of liability",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        AgentOS is provided “as is”. To the fullest extent permitted by law, Frame.dev disclaims all implied
        warranties and will not be liable for indirect, incidental, or consequential damages. Total liability
        is limited to fees paid in the 12 months preceding the claim.
      </p>
    )
  },
  {
    title: "8. Governing law & contact",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        These terms are governed by the laws of the Province of Ontario, Canada. Questions or notices can be
        sent to{" "}
        <a href="mailto:legal@frame.dev" className="font-semibold text-brand hover:underline">
          legal@frame.dev
        </a>
        .
      </p>
    )
  }
];

export default function TermsPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          These terms govern your use of AgentOS, the Voice Chat Assistant, and the AgentOS marketplace. They
          apply to individual builders, organisations, and marketplace partners alike.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="glass-panel space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
          {section.body}
        </section>
      ))}

      <footer className="space-y-4 text-sm text-slate-500 dark:text-slate-300">
        <p>
          We may update these terms from time to time. Material changes will be announced in the product
          changelog or via email. Continued use of the services after changes take effect constitutes
          acceptance of the revised terms.
        </p>
      </footer>
    </article>
  );
}

