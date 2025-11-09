'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import WindowFrame from '@/components/window-frame'
import Navigation from '@/components/navigation'
import ThemeToggle from '@/components/theme-toggle'

export default function HomePage() {
  const [hoveredPane, setHoveredPane] = useState<string | null>(null)

  return (
    <div className="min-h-screen paper-bg relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold ink-text mb-4">
            Denoising the web
          </h1>
          <p className="text-xl md:text-2xl text-ink-600 dark:text-paper-300 font-light">
            The OS for your life
          </p>
        </motion.div>

        {/* Interactive Window Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <WindowFrame 
            hoveredPane={hoveredPane}
            setHoveredPane={setHoveredPane}
          />
        </motion.div>

        {/* Footer Links */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="https://agentos.sh" className="nav-link">AgentOS</a>
            <a href="https://vca.chat" className="nav-link">VCA Marketplace</a>
            <a href="https://github.com/framersai" className="nav-link">GitHub</a>
            <a href="https://npmjs.com/org/framers" className="nav-link">NPM</a>
            <a href="mailto:team@frame.dev" className="nav-link">Contact</a>
          </div>
          <div className="mt-8 text-xs text-ink-500 dark:text-paper-400">
            © 2025 Framers. Infrastructure for agentic AI.
          </div>
        </motion.footer>
      </main>

      {/* Theme Toggle */}
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
