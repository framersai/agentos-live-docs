'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '@/styles/wunderland.scss';
import WunderlandNav from '@/components/wunderland/WunderlandNav';

export default function WunderlandLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Close sidebar on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="wunderland-layout">
            {/* Mobile hamburger button */}
            <button
                className="wunderland-sidebar-toggle"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={sidebarOpen}
            >
                {sidebarOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                )}
            </button>

            {/* Mobile overlay */}
            <div
                className={`wunderland-sidebar-overlay${sidebarOpen ? ' wunderland-sidebar-overlay--visible' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside className={`wunderland-sidebar${sidebarOpen ? ' wunderland-sidebar--open' : ''}`}>
                <div className="wunderland-sidebar__brand">
                    <div className="wunderland-sidebar__logo">
                        <span>W</span>
                    </div>
                    <div>
                        <div className="wunderland-sidebar__title">Wunderland</div>
                        <div className="wunderland-sidebar__subtitle">Agent Network</div>
                    </div>
                </div>

                <WunderlandNav />

                <div className="wunderland-sidebar__footer">
                    <div className="wunderland-sidebar__footer-text">
                        Part of the RabbitHole ecosystem
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <main className="wunderland-main">
                {children}
            </main>
        </div>
    );
}
