'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Pane {
  id: string
  title: string
  subtitle: string
  color: string
  url?: string
  active: boolean
}

const panes: Pane[] = [
  {
    id: 'webos',
    title: 'WebOS',
    subtitle: 'Universal web framework',
    color: 'from-blue-400 to-blue-600',
    active: false
  },
  {
    id: 'homeos',
    title: 'HomeOS',
    subtitle: 'Smart home platform',
    color: 'from-amber-400 to-orange-600',
    active: false
  },
  {
    id: 'agentos',
    title: 'AgentOS',
    subtitle: 'Adaptive agent platform',
    color: 'from-green-400 to-emerald-600',
    url: 'https://agentos.sh',
    active: true
  },
  {
    id: 'safeos',
    title: 'SafeOS',
    subtitle: 'Digital vault & identity',
    color: 'from-purple-400 to-indigo-600',
    active: false
  },
  {
    id: 'workos',
    title: 'WorkOS',
    subtitle: 'Project & CRM platform',
    color: 'from-pink-400 to-rose-600',
    active: false
  },
  {
    id: 'myos',
    title: 'MyOS',
    subtitle: 'Universal dashboard',
    color: 'from-gray-400 to-gray-600',
    active: false
  }
]

interface WindowFrameProps {
  hoveredPane: string | null
  setHoveredPane: (pane: string | null) => void
}

export default function WindowFrame({ hoveredPane, setHoveredPane }: WindowFrameProps) {
  const [inkEffects, setInkEffects] = useState<{ [key: string]: boolean }>({})

  const handlePaneClick = (pane: Pane) => {
    if (pane.url) {
      window.open(pane.url, '_blank')
    } else {
      // Trigger ink spread effect for inactive panes
      setInkEffects(prev => ({ ...prev, [pane.id]: true }))
      setTimeout(() => {
        setInkEffects(prev => ({ ...prev, [pane.id]: false }))
      }, 1500)
    }
  }

  return (
    <div className="relative w-full aspect-[16/10] max-h-[70vh] animate-frame-appear">
      {/* Window Frame Container */}
      <div className="frame-window w-full h-full p-1 relative">
        {/* Window Title Bar */}
        <div className="h-8 bg-gradient-to-r from-paper-200 to-paper-100 dark:from-ink-800 dark:to-ink-900 rounded-t-lg flex items-center px-3 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="ml-3 text-xs font-mono text-ink-600 dark:text-paper-400">frame.dev</span>
        </div>

        {/* Window Panes Grid */}
        <div className="h-[calc(100%-2rem)] grid grid-cols-3 grid-rows-2 gap-[2px] bg-ink-300 dark:bg-ink-700 p-[2px]">
          {panes.map((pane, index) => (
            <motion.div
              key={pane.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`frame-pane relative group ${pane.active ? 'active' : ''} ${inkEffects[pane.id] ? 'ink-spread' : ''}`}
              onMouseEnter={() => setHoveredPane(pane.id)}
              onMouseLeave={() => setHoveredPane(null)}
              onClick={() => handlePaneClick(pane)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pane.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-4 text-center">
                <h3 className="text-lg md:text-xl font-bold ink-text mb-1">
                  {pane.title}
                </h3>
                <p className="text-xs md:text-sm text-ink-600 dark:text-paper-300">
                  {pane.subtitle}
                </p>
                
                {/* Status Indicator */}
                {pane.active ? (
                  <span className="mt-3 px-2 py-1 text-xs bg-frame-green text-white rounded-full">
                    Live
                  </span>
                ) : (
                  <span className="mt-3 px-2 py-1 text-xs bg-paper-200 dark:bg-ink-800 text-ink-600 dark:text-paper-400 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Hover Effect */}
              {hoveredPane === pane.id && !pane.active && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-ink-spread">
                  <span className="text-white text-sm font-medium">Coming Soon</span>
                </div>
              )}

              {/* Pane Glow for Active */}
              {pane.active && (
                <div className="absolute inset-0 animate-pane-glow pointer-events-none"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Window Frame Border (recreating the SVG design) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: 'multiply' }}>
          {/* Vertical dividers */}
          <line x1="33.33%" y1="8%" x2="33.33%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-ink-300 dark:text-ink-700" />
          <line x1="66.66%" y1="8%" x2="66.66%" y2="100%" stroke="currentColor" strokeWidth="2" className="text-ink-300 dark:text-ink-700" />
          {/* Horizontal divider */}
          <line x1="0" y1="54%" x2="100%" y2="54%" stroke="currentColor" strokeWidth="2" className="text-ink-300 dark:text-ink-700" />
        </svg>
      </div>
    </div>
  )
}
