import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Frame',
  description: 'Learn about Frame and our mission to denoise the web',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen paper-bg">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <nav className="mb-8">
          <Link href="/" className="text-sm text-ink-600 dark:text-paper-400 hover:text-frame-green transition-colors">
            ← Back to Frame
          </Link>
        </nav>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl md:text-5xl font-serif font-bold ink-text mb-8">
            About Frame
          </h1>
          
          <div className="text-lg leading-relaxed space-y-6 ink-text">
            <p className="text-xl font-light">
              Frame is a window dedicated to denoising the web—a lens through which the chaos of digital life becomes organized, purposeful, and beautiful.
            </p>

            <h2 className="text-2xl font-serif font-bold mt-12 mb-4">The OS for Your Life</h2>
            <p>
              We're building more than software; we're creating a new paradigm for how humans interact with digital systems. Frame represents a suite of operating systems, each designed for a specific aspect of modern life, all working in harmony to create a cohesive digital experience.
            </p>

            <h2 className="text-2xl font-serif font-bold mt-12 mb-4">Our Ecosystem</h2>
            <div className="space-y-4">
              <div className="pl-4 border-l-4 border-frame-green">
                <h3 className="font-bold">AgentOS</h3>
                <p className="text-base">The adaptive agent platform—our first and original OS, powered by Frame. Live and evolving.</p>
              </div>
              <div className="pl-4 border-l-4 border-ink-300 dark:border-ink-700">
                <h3 className="font-bold">WebOS</h3>
                <p className="text-base">The universal framework for interacting with web, Web3, and metaverses concurrently.</p>
              </div>
              <div className="pl-4 border-l-4 border-ink-300 dark:border-ink-700">
                <h3 className="font-bold">HomeOS</h3>
                <p className="text-base">The intelligent platform for smart home management and automation.</p>
              </div>
              <div className="pl-4 border-l-4 border-ink-300 dark:border-ink-700">
                <h3 className="font-bold">SafeOS</h3>
                <p className="text-base">Your digital vault for storage, backup, firewall protection, and identity monitoring.</p>
              </div>
              <div className="pl-4 border-l-4 border-ink-300 dark:border-ink-700">
                <h3 className="font-bold">WorkOS</h3>
                <p className="text-base">The comprehensive platform for work management, projects, and CRM.</p>
              </div>
              <div className="pl-4 border-l-4 border-ink-300 dark:border-ink-700">
                <h3 className="font-bold">MyOS</h3>
                <p className="text-base">The dashboard that manages all OSes—your personal command center.</p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold mt-12 mb-4">Built on OpenStrand</h2>
            <p>
              At the foundation of our ecosystem lies OpenStrand—the backbone technology that powers all our OS sites. It represents our commitment to open infrastructure, allowing anyone to build upon and extend our work.
            </p>

            <h2 className="text-2xl font-serif font-bold mt-12 mb-4">Our Philosophy</h2>
            <p>
              We believe in minimalism without sacrifice, elegance without pretense, and functionality without complexity. Every line of code, every design decision, every interaction is crafted with intention—to create systems that feel as natural as paper and ink, yet as powerful as the future demands.
            </p>

            <p>
              Frame isn't just infrastructure for agentic AI—it's infrastructure for human flourishing in an AI-augmented world.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
