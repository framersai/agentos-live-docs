import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "AgentOS - Orchestrate adaptive AI systems",
  description:
    "AgentOS is the orchestration substrate powering Frame.dev. Build, debug, and deploy adaptive AI agents with a runtime designed for audio, tools, and realtime feedback loops.",
  metadataBase: new URL("https://agentos.sh"),
  openGraph: {
    title: "AgentOS by Frame",
    description:
      "Adaptive agent runtime with battle-tested streaming, tooling, and observability. Built by Frame.dev.",
    url: "https://agentos.sh",
    siteName: "AgentOS",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    creator: "@frame_dev",
    site: "@frame_dev"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable}`}>
      <body className="grainy min-h-screen antialiased">
        <ThemeProvider>
          <header className="relative z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30">
                  <span className="text-lg font-bold">A.</span>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Frame.dev presents
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">AgentOS</p>
                </div>
              </div>
              <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
                <a className="hover:text-slate-900 dark:hover:text-white" href="#stack">
                  Stack
                </a>
                <a className="hover:text-slate-900 dark:hover:text-white" href="#telemetry">
                  Observability
                </a>
                <a className="hover:text-slate-900 dark:hover:text-white" href="#docs">
                  Docs
                </a>
                <a className="hover:text-slate-900 dark:hover:text-white" href="#cta">
                  Get AgentOS
                </a>
              </nav>
              <div className="flex items-center gap-6">
                <ThemeToggle />
                <a
                  href="https://frame.dev"
                  className="hidden rounded-full border border-slate-200/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-100 dark:hover:border-brand dark:hover:text-brand md:inline-flex"
                >
                  Frame.dev
                </a>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-slate-200/60 bg-white/80 py-10 text-sm text-slate-500 dark:border-slate-900 dark:bg-slate-950/70 dark:text-slate-400">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
              <p>&copy; {new Date().getFullYear()} Frame.dev / wearetheframers. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="https://github.com/wearetheframers" className="hover:text-brand">
                  GitHub
                </a>
                <a href="mailto:founders@frame.dev" className="hover:text-brand">
                  Contact
                </a>
                <a href="https://frame.dev/legal/privacy" className="hover:text-brand">
                  Privacy
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
