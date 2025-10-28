import { ArrowRight, Cpu, Equalizer, Radio, ShieldCheck, Sparkle, Waves } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const featureCards = [
  {
    icon: Radio,
    title: "Realtime orchestration",
    body: "Async generators power streaming responses across text, audio, and tool call lifecycles. The same primitives back the Frame voice assistant.",
    pill: "Stream native"
  },
  {
    icon: Cpu,
    title: "Tool-native runtime",
    body: "Declarative tool contracts with permissioning, rate budgets, and automatic retries. Swap between FastAPI, Vercel, or native Node targets.",
    pill: "Toolchain orchestration"
  },
  {
    icon: ShieldCheck,
    title: "Safety by design",
    body: "Constitutional guardrails, subscription-aware limits, and persona policies enforce compliance without you writing glue code.",
    pill: "Governance"
  },
  {
    icon: Equalizer,
    title: "End-to-end observability",
    body: "Structured telemetry, streaming cost snapshots, and persona lineage let you debug complex multi-agent sessions like a pro.",
    pill: "Observability"
  }
];

const timeline = [
  {
    title: "SDK & CLI",
    description:
      "Generate scaffolds, sync personas, and introspect the runtime from your terminal. Ship reproducible agents with a single pnpm publish.",
    status: "Available today"
  },
  {
    title: "Agent Workbench",
    description:
      "Visualise tool traffic, step through conversations, and test persona tweaks in a zero-config web app powered by the AgentOS client.",
    status: "Developer preview"
  },
  {
    title: "Hosted control plane",
    description:
      "Managed streaming, observability, and billing integrations for production teams that want Frame's infrastructure without the ops burden.",
    status: "Roadmap"
  }
];

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24 pt-20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="z-10 max-w-xl space-y-8"
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-brand/20 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-foreground">
              <Sparkle className="h-3.5 w-3.5" />
              The orchestration substrate behind Frame.dev
            </span>
            <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl sm:leading-tight dark:text-white">
              Build adaptive, voice-native agents with production tooling baked in.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              AgentOS is the runtime we rely on to ship realtime assistants, audio copilots, and tool-driven agents. Now it's available as a standalone package, a sleek marketing surface, and a developer cockpit.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="#cta"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand/40"
              >
                Explore the stack
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/wearetheframers"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-100 dark:hover:border-brand"
              >
                Follow along on GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-brand" />
                Audio-native streaming
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Auth & billing aware
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-brand" />
                Persona memory + RAG
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-2xl"
          >
            <div className="glass-panel relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/30 blur-3xl dark:bg-brand/20" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-slate-300/40 blur-3xl dark:bg-slate-800/40" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Realtime session
                  </p>
                  <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300">
                    Live
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-4 dark:border-white/5 dark:bg-slate-950/60">
                  <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Persona</p>
                  <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">Atlas, Systems Architect</h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    "I spotted a tool loop. Escalating to code interpreter with a capped energy budget and memoising your last three diagrams."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-slate-200/40 bg-white/70 p-4 dark:border-white/5 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-widest text-brand">Streaming cost</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">$0.021</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Session budget 8%</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/40 bg-white/70 p-4 dark:border-white/5 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-widest text-brand">Toolchain</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">3 calls</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Planner + Designer + Search</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="stack" className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-2">
          {featureCards.map((card) => (
            <article key={card.title} className="glass-panel h-full">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                <card.icon className="h-4 w-4" />
                {card.pill}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="telemetry" className="bg-slate-50 py-24 dark:bg-slate-900/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:flex-row">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 shadow dark:bg-slate-950/60 dark:text-slate-300">
              Built for teams who ship agents to production
            </span>
            <h2 className="text-3xl font-semibold leading-snug text-slate-900 dark:text-white">
              One runtime, three experiences. Pick the surface that meets you where you build.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              We split AgentOS into a publishable core, a marketing front-door, and an instrumented developer client. Everything lives inside the Frame.dev workspace so your docs and code stay versioned together.
            </p>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <Sparkle className="mt-0.5 h-4 w-4 text-brand" />
                <span>
                  <strong>@agentos/core</strong> &mdash; TypeScript package with streaming orchestrator, tool router, and telemetry surfaces.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkle className="mt-0.5 h-4 w-4 text-brand" />
                <span>
                  <strong>agentos.sh</strong> &mdash; Next.js marketing site with dark mode, launch timeline, and deep docs links.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkle className="mt-0.5 h-4 w-4 text-brand" />
                <span>
                  <strong>AgentOS client</strong> &mdash; React workbench for testing personas, debugging tool loops, and inspecting streaming payloads.
                </span>
              </li>
            </ul>
          </div>
          <div className="glass-panel relative flex-1 space-y-6">
            {timeline.map((item) => (
              <div key={item.title} className="relative pl-8">
                <div className="absolute left-0 top-2 h-10 w-px bg-gradient-to-b from-brand/80 to-transparent" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {item.status}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="docs" className="bg-white py-24 dark:bg-slate-950">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div className="glass-panel space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand dark:bg-brand/20 dark:text-brand-foreground">
              Library quick start
            </span>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Drop-in orchestration</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Install the package, initialise the orchestrator, and stream structured responses in just a few lines of code. The same entrypoint powers the Frame.dev backend.
            </p>
            <pre className="overflow-x-auto rounded-2xl border border-slate-200/30 bg-slate-900/90 p-4 text-xs text-slate-100 shadow-lg shadow-slate-900/40 dark:border-slate-700/60">
              <code>{`pnpm add @wearetheframers/agentos

import { AgentOS } from "@wearetheframers/agentos";

const agentos = new AgentOS();
await agentos.initialize(config);

for await (const chunk of agentos.processRequest(request)) {
  // handle AgentOSResponseChunkType.* events
}`}</code>
            </pre>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">ESM only</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Typed from core</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">Async streaming</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-panel space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Documentation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Full API reference ships with the repo. Run
                <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  pnpm --filter @agentos/core run docs
                </code>
                to regenerate TypeDoc output locally, or browse the public mirrors when they publish.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                  href="https://github.com/wearetheframers/agentos"
                >
                  View repository
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand"
                  href="#cta"
                >
                  Early access
                </a>
              </div>
            </div>
            <div className="glass-panel space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bring your agents</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Personas, memory policies, and tool registries live in configuration. Translate your existing orchestrations into typed modules and ship them with CI-friendly tooling.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>SQLite-first persistence with optional adapters</li>
                <li>Persona overrides per deployment or tenant</li>
                <li>Tool permission manager with subscription gating</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black py-24 text-slate-100"
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/50 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-3xl font-semibold">Ready to make AgentOS your runtime?</h2>
          <p className="max-w-2xl text-sm text-slate-300">
            AgentOS is private while we finish hardening the core for general availability. Join the early access list to collaborate with the Frame team, migrate your existing assistant, and shape the roadmap.
          </p>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@team.dev"
              className="flex-1 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/40 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/50">
              Request access
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            By subscribing you agree to receive product updates from Frame.dev. No spam, pinky promise.
          </p>
        </div>
      </section>
    </>
  );
}
