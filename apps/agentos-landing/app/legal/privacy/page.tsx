"use client";

import Link from "next/link";

const lastUpdated = "November 6, 2025";

export const metadata = {
  title: "Privacy Policy · AgentOS",
  description:
    "How AgentOS, the Voice Chat Assistant, and the marketplace handle personal data, launch telemetry, and partner submissions."
};

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "What we collect",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          <strong>Account identifiers.</strong> Email address, organisation membership, and plan metadata
          (plan id, seat assignments).
        </li>
        <li>
          <strong>Operational telemetry.</strong> Agent launches (workflow definition id, agency id, seat
          count, timestamps) stored in <code>agency_usage_log</code> for quota enforcement and billing
          reconciliation.
        </li>
        <li>
          <strong>Marketplace submissions.</strong> Persona bundles, prompts, and listing metadata saved in{" "}
          <code>agentos_persona_submissions</code> until they are approved or rejected.
        </li>
        <li>
          <strong>Optional media.</strong> Voice recordings or files that you explicitly upload for model
          processing. We do not retain audio after the task completes unless you opt into storage.
        </li>
      </ul>
    )
  },
  {
    title: "How we use your data",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>Delivering AgentOS functionality, including streaming responses and tool execution.</li>
        <li>
          Enforcing quota and billing decisions (e.g., weekly agency launch allowances, marketplace payout
          calculations).
        </li>
        <li>Reviewing persona bundles for security, IP compliance, and safe marketplace distribution.</li>
        <li>
          Communicating with you about service updates, incident notices, and product improvements. You may
          opt out of non-essential communication.
        </li>
      </ul>
    )
  },
  {
    title: "Retention & deletion",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          <strong>Agency usage.</strong> Launch entries are pruned after ~18 months, the minimum period needed
          to resolve billing disputes and quota audits.
        </li>
        <li>
          <strong>Persona submissions.</strong> Pending and rejected bundles remain in{" "}
          <code>agentos_persona_submissions</code> as an audit trail. Approved bundles copy the prompt to{" "}
          <code>prompts/_dynamic</code> and retain reviewer metadata for compliance.
        </li>
        <li>
          <strong>Marketplace listings.</strong> Visibility (`public`, `unlisted`, `org`, `invite`) and status
          (`draft`, `pending`, `published`, `retired`) determine who can access a listing. Owners or
          organisation managers may archive or delete entries at any time.
        </li>
        <li>
          <strong>Audio & attachments.</strong> Transient media is discarded once transcription or tool
          processing finishes unless you explicitly store it in your own knowledge base.
        </li>
      </ul>
    )
  },
  {
    title: "Sharing & third parties",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          AgentOS runs on infrastructure managed by Frame.dev contractors and sub-processors (hosting,
          observability, payment providers). We only share the minimum metadata required for those vendors to
          perform their function.
        </li>
        <li>No marketplace bundle is published without human review and explicit approval.</li>
        <li>
          We do not sell or rent personal data. Aggregated analytics may be used to improve quotas, guardrails,
          and runtime performance.
        </li>
      </ul>
    )
  },
  {
    title: "Your choices",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>Download or delete your agents via the Voice Chat Assistant dashboard.</li>
        <li>Export marketplace bundles for self-hosting or archival.</li>
        <li>Open a ticket at <a href="mailto:privacy@frame.dev">privacy@frame.dev</a> to request data access or deletion.</li>
        <li>Revoke access tokens and organisation seats at any time through the Team settings UI.</li>
      </ul>
    )
  },
  {
    title: "Contact",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        Questions about privacy, retention, or compliance? Email{" "}
        <a href="mailto:privacy@frame.dev" className="font-semibold text-brand hover:underline">
          privacy@frame.dev
        </a>{" "}
        or reach the founders directly at{" "}
        <a href="mailto:founders@frame.dev" className="font-semibold text-brand hover:underline">
          founders@frame.dev
        </a>
        .
      </p>
    )
  }
];

export default function PrivacyPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          We built AgentOS and the Voice Chat Assistant with data minimisation in mind. This policy explains
          what we collect, how long we keep it, and the controls you have over marketplace submissions,
          agency launches, and bundled personas.
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
          Need contractual terms instead? Read our{" "}
          <Link href="/legal/terms" className="font-semibold text-brand hover:underline">
            Terms of Service
          </Link>
          . Compliance reports and regional addenda are available on request.
        </p>
      </footer>
    </article>
  );
}

