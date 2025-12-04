'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/widget-demo', label: 'Demo' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`gpw-nav ${isScrolled ? 'gpw-nav-scrolled' : ''}`}
      role="banner"
    >
      <div className="gpw-container">
        <nav className="flex items-center justify-between h-16 md:h-18" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="GitPayWidget home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gpw-purple-600 to-gpw-pink-500 flex items-center justify-center shadow-gpw-sm group-hover:shadow-gpw-glow transition-shadow duration-300">
              <span className="text-white font-bold text-lg font-display">$</span>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gpw-accent-yellow rounded-full animate-pulse" />
            </div>
            <span className="font-display text-2xl font-bold">
              <span className="text-gpw-purple-600 dark:text-gpw-purple-400">Git</span>
              <span className="text-gpw-pink-500">Pay</span>
              <span className="text-gpw-purple-700 dark:text-gpw-purple-300">Widget</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`gpw-nav-link ${isActive(link.href) ? 'gpw-nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="gpw-btn-ghost p-2.5 rounded-xl"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Dashboard / Login */}
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex gpw-btn-secondary text-sm px-4 py-2"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              className="gpw-btn-primary text-sm px-4 py-2"
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden gpw-btn-ghost p-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gpw-border pb-4 animate-fade-in">
            <nav className="flex flex-col gap-1 pt-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`gpw-nav-link ${isActive(link.href) ? 'gpw-nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-gpw-border" />
              <Link href="/dashboard" className="gpw-nav-link">
                Dashboard
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}





