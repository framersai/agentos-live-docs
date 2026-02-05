'use client';

import { useState } from 'react';
import Link from 'next/link';
import '@/styles/admin.scss';

// Demo data
const demoStats = {
    pending: 23,
    inProgress: 8,
    completed: 156,
    highRisk: 3,
    avgWaitTime: '1.5h',
    avgCompletionTime: '2.3h',
    successRate: 98.5,
    activeAssistants: 12,
};

const demoTasks = [
    { id: 'task_7x2k', title: 'Review customer feedback analysis', client: 'ACME Corp', status: 'pending', priority: 'high', risk: 'low', hours: 2, created: '5 min ago' },
    { id: 'task_9m3p', title: 'Transcribe interview recordings', client: 'StartupXYZ', status: 'in_progress', priority: 'normal', risk: 'medium', hours: 4, created: '23 min ago', assignee: 'Jane D.' },
    { id: 'task_2k8n', title: 'Data entry from scanned documents', client: 'BigCo Inc', status: 'approved', priority: 'rush', risk: 'high', hours: 6, created: '1 hr ago' },
    { id: 'task_5j1q', title: 'Research competitor pricing', client: 'ACME Corp', status: 'pending', priority: 'normal', risk: 'low', hours: 3, created: '2 hr ago' },
    { id: 'task_8w4r', title: 'Verify user account information', client: 'FinTech Ltd', status: 'review', priority: 'high', risk: 'critical', hours: 1, created: '3 hr ago', assignee: 'Mark T.' },
    { id: 'task_3n7s', title: 'Summarize legal documents', client: 'LawFirm LLC', status: 'completed', priority: 'normal', risk: 'medium', hours: 5, created: '5 hr ago', assignee: 'Sarah K.' },
];

const demoAssistants = [
    { id: 'ast_1', name: 'Jane D.', status: 'active', rating: 4.9, tasksCompleted: 234, specialties: ['Data Entry', 'Research'] },
    { id: 'ast_2', name: 'Mark T.', status: 'active', rating: 4.8, tasksCompleted: 189, specialties: ['Verification', 'QA'] },
    { id: 'ast_3', name: 'Sarah K.', status: 'busy', rating: 4.7, tasksCompleted: 156, specialties: ['Legal', 'Documents'] },
    { id: 'ast_4', name: 'Alex P.', status: 'offline', rating: 4.9, tasksCompleted: 312, specialties: ['Transcription', 'Audio'] },
];

export default function AdminDashboard() {
    const [isGuest] = useState(true); // Demo mode

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar__brand">
                    <Link href="/">
                        <div className="sidebar__logo">
                            <span>R</span>
                        </div>
                    </Link>
                    <span className="sidebar__name">RabbitHole</span>
                </div>

                <div className="sidebar__section">
                    <div className="sidebar__section-title">Overview</div>
                    <nav className="sidebar__nav">
                        <Link href="/admin" className="sidebar__link sidebar__link--active">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link href="/admin/queue" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6" />
                                <line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" />
                                <circle cx="4" cy="6" r="2" fill="currentColor" />
                                <circle cx="4" cy="12" r="2" fill="currentColor" />
                                <circle cx="4" cy="18" r="2" fill="currentColor" />
                            </svg>
                            Task Queue
                        </Link>
                        <Link href="/admin/assistants" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Assistants
                        </Link>
                        <Link href="/admin/analytics" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 20V10" />
                                <path d="M12 20V4" />
                                <path d="M6 20v-6" />
                            </svg>
                            Analytics
                        </Link>
                    </nav>
                </div>

                <div className="sidebar__section">
                    <div className="sidebar__section-title">Security</div>
                    <nav className="sidebar__nav">
                        <Link href="/admin/access" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Access Requests
                            <span className="badge badge--coral" style={{ marginLeft: 'auto', padding: '2px 6px' }}>2</span>
                        </Link>
                        <Link href="/admin/audit" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Audit Log
                        </Link>
                    </nav>
                </div>

                <div className="sidebar__footer">
                    {isGuest ? (
                        <Link href="/login" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Sign In for Full Access
                        </Link>
                    ) : (
                        <Link href="/" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Demo Banner */}
                {isGuest && (
                    <div className="panel" style={{
                        marginBottom: '1.5rem',
                        padding: '1rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.08), rgba(139, 92, 246, 0.08))',
                        borderLeft: '3px solid var(--color-accent)'
                    }}>
                        <div>
                            <strong style={{ color: 'var(--color-accent)' }}>Demo Mode</strong>
                            <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.75rem' }}>
                                You&apos;re viewing sample data. Sign in to manage real tasks.
                            </span>
                        </div>
                        <Link href="/signup" className="btn btn--primary btn--sm">Get Started</Link>
                    </div>
                )}

                <div className="page-header">
                    <div>
                        <h1 className="page-header__title">Dashboard</h1>
                        <p className="page-header__subtitle">Overview of task queue and team performance</p>
                    </div>
                    <div className="page-header__actions">
                        <button className="btn btn--secondary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6" />
                                <path d="M1 20v-6h6" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="dashboard-stats">
                    <div className="stat-card stat-card--gold">
                        <div className="stat-card__header">
                            <span className="stat-card__label">Pending</span>
                            <div className="stat-card__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card__value">{demoStats.pending}</div>
                        <div className="stat-card__delta stat-card__delta--up">↑ 3 from yesterday</div>
                    </div>

                    <div className="stat-card stat-card--cyan">
                        <div className="stat-card__header">
                            <span className="stat-card__label">In Progress</span>
                            <div className="stat-card__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card__value">{demoStats.inProgress}</div>
                        <div className="stat-card__delta stat-card__delta--neutral">{demoStats.activeAssistants} assistants active</div>
                    </div>

                    <div className="stat-card stat-card--emerald">
                        <div className="stat-card__header">
                            <span className="stat-card__label">Completed Today</span>
                            <div className="stat-card__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card__value">{demoStats.completed}</div>
                        <div className="stat-card__delta stat-card__delta--up">{demoStats.successRate}% success rate</div>
                    </div>

                    <div className="stat-card stat-card--coral">
                        <div className="stat-card__header">
                            <span className="stat-card__label">High Risk</span>
                            <div className="stat-card__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card__value">{demoStats.highRisk}</div>
                        <div className="stat-card__delta stat-card__delta--neutral">Needs attention</div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
                    {/* Recent Tasks */}
                    <div className="section">
                        <div className="section__header">
                            <h2 className="section__title">Recent Tasks</h2>
                            <Link href="/admin/queue" className="btn btn--ghost">View All →</Link>
                        </div>

                        <div className="data-table task-table">
                            <div className="data-table__header task-table__header">
                                <span>Task</span>
                                <span>Client</span>
                                <span>Status</span>
                                <span>Priority</span>
                                <span>Risk</span>
                                <span>Est.</span>
                            </div>

                            {demoTasks.map((task) => (
                                <div key={task.id} className="data-table__row task-table__row data-table__row--clickable">
                                    <div className="data-table__cell">
                                        <div className="data-table__cell--bold">{task.title}</div>
                                        <div className="data-table__cell--mono">{task.id} · {task.created}</div>
                                    </div>
                                    <div className="data-table__cell data-table__cell--mono">{task.client}</div>
                                    <div className="data-table__cell">
                                        <span className={`badge badge--${getStatusColor(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="data-table__cell">
                                        <span className={`badge badge--${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="data-table__cell">
                                        <div className="risk-indicator">
                                            <span className={`risk-indicator__dot risk-indicator__dot--${task.risk}`}></span>
                                            <span className="risk-indicator__label">{task.risk}</span>
                                        </div>
                                    </div>
                                    <div className="data-table__cell data-table__cell--mono">{task.hours}h</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Assistants */}
                    <div className="section">
                        <div className="section__header">
                            <h2 className="section__title">Active Assistants</h2>
                            <Link href="/admin/assistants" className="btn btn--ghost">View All →</Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {demoAssistants.map((assistant) => (
                                <div key={assistant.id} className="panel" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--color-accent), #8b5cf6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {assistant.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{assistant.name}</div>
                                            <div className="text-label">{assistant.tasksCompleted} tasks · ⭐ {assistant.rating}</div>
                                        </div>
                                        <span className={`badge badge--${assistant.status === 'active' ? 'emerald' : assistant.status === 'busy' ? 'gold' : 'neutral'}`}>
                                            {assistant.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'pending': return 'gold';
        case 'approved': return 'cyan';
        case 'in_progress': return 'cyan';
        case 'review': return 'violet';
        case 'completed': return 'emerald';
        case 'rejected': return 'coral';
        default: return 'neutral';
    }
}

function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'rush': return 'coral';
        case 'high': return 'gold';
        case 'normal': return 'neutral';
        case 'low': return 'neutral';
        default: return 'neutral';
    }
}
