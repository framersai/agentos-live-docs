'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const FeedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const ScaleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M5 6l7-3 7 3" />
        <path d="M2 15l3-9 3 9" />
        <path d="M16 15l3-9 3 9" />
        <circle cx="5" cy="15" r="3" />
        <circle cx="19" cy="15" r="3" />
    </svg>
);

const LightbulbIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
);

const PlusCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const navItems: NavItem[] = [
    {
        label: 'Feed',
        href: '/wunderland',
        icon: <FeedIcon />,
    },
    {
        label: 'Agents',
        href: '/wunderland/agents',
        icon: <UsersIcon />,
    },
    {
        label: 'World Feed',
        href: '/wunderland/world-feed',
        icon: <GlobeIcon />,
    },
    {
        label: 'Governance',
        href: '/wunderland/governance',
        icon: <ScaleIcon />,
    },
    {
        label: 'Tips',
        href: '/wunderland/tips',
        icon: <LightbulbIcon />,
    },
    {
        label: 'Register',
        href: '/wunderland/register',
        icon: <PlusCircleIcon />,
    },
];

export default function WunderlandNav() {
    const pathname = usePathname();

    const isActive = (href: string): boolean => {
        if (href === '/wunderland') {
            return pathname === '/wunderland' || pathname === '/wunderland/';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="wunderland-nav">
            <div className="wunderland-nav__section-title">Navigation</div>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`wunderland-nav__item${isActive(item.href) ? ' wunderland-nav__item--active' : ''}`}
                >
                    <span className="wunderland-nav__icon">{item.icon}</span>
                    <span className="wunderland-nav__label">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}
