import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Frame',
  description: 'Thoughts on AI, infrastructure, and the future of computing',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen paper-bg">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-ink-600 dark:text-paper-400 hover:text-frame-green transition-colors">
            Frame
          </Link>
          <span className="text-ink-400">/</span>
          <span className="text-ink-800 dark:text-paper-200">Blog</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold ink-text mb-4">
            Blog
          </h1>
          <p className="text-lg text-ink-600 dark:text-paper-300">
            Thoughts on AI, infrastructure, and the future of computing
          </p>
        </div>

        {/* Coming Soon State */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-12 bg-paper-100 dark:bg-ink-900 rounded-lg shadow-lg animate-paper-fold">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-frame-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold ink-text mb-3">
                Coming Soon
              </h2>
              <p className="text-ink-600 dark:text-paper-300 mb-6">
                We're preparing thoughtful content about the intersection of AI and human agency.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mt-8 p-6 bg-white dark:bg-ink-950 rounded-md">
                <h3 className="text-lg font-medium mb-3">Stay Updated</h3>
                <p className="text-sm text-ink-600 dark:text-paper-400 mb-4">
                  Subscribe to our newsletter for updates on new posts and Frame ecosystem developments.
                </p>
                <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 rounded-md border border-ink-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-paper-100 placeholder-ink-400 dark:placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-frame-green"
                    disabled
                  />
                  <button
                    type="submit"
                    className="btn-primary opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs text-ink-500 dark:text-paper-500 mt-2">
                  Newsletter coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Blog Posts (blurred) */}
          <div className="opacity-20 blur-sm pointer-events-none">
            {[1, 2, 3].map((i) => (
              <article key={i} className="mb-8 p-6 bg-paper-100 dark:bg-ink-900 rounded-lg">
                <div className="h-4 bg-ink-300 dark:bg-ink-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-ink-200 dark:bg-ink-800 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-ink-100 dark:bg-ink-800 rounded"></div>
                  <div className="h-2 bg-ink-100 dark:bg-ink-800 rounded w-5/6"></div>
                  <div className="h-2 bg-ink-100 dark:bg-ink-800 rounded w-4/6"></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
