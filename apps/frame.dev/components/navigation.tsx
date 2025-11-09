'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-paper-50/80 dark:bg-ink-950/80 backdrop-blur-md border-b border-ink-200 dark:border-ink-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <FrameLogo />
            <span className="text-lg font-bold ink-text">Frame</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/team" className="nav-link">Team</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/jobs" className="nav-link">Jobs</Link>
            <a href="https://agentos.sh" className="nav-link">AgentOS</a>
            <a href="https://vca.chat" className="nav-link">Marketplace</a>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-4">
            <a href="https://github.com/framersai" className="nav-link">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://npmjs.com/org/framers" className="nav-link">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 0v24h24v-24h-24zm6.168 20.16v-3.84h6.144v-12.48h3.84v12.48h3.84v-12.48h3.84v16.32h-17.664z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function FrameLogo() {
  return (
    <div className="relative w-10 h-12">
      {/* Recreating the Frame window logo in pure CSS */}
      <div className="absolute inset-0 bg-frame-green rounded-sm shadow-md">
        {/* Left spine highlight */}
        <div className="absolute left-0 top-0 w-2 h-full bg-white opacity-20"></div>
        {/* Vertical dividers */}
        <div className="absolute left-1/3 top-0 w-0.5 h-full bg-white"></div>
        <div className="absolute left-2/3 top-0 w-0.5 h-full bg-white"></div>
        {/* Horizontal center line */}
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white -translate-y-1/2"></div>
      </div>
    </div>
  )
}
