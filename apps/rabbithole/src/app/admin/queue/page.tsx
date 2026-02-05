'use client';

import { useState } from 'react';
import Link from 'next/link';
import '@/styles/admin.scss';

// Extended demo data
const demoTasks = [
    { id: 'task_7x2k', title: 'Review customer feedback analysis', client: 'ACME Corp', status: 'pending', priority: 'high', risk: 'low', hours: 2, created: '5 min ago', description: 'Analyze and categorize 50 customer feedback entries from Q4 survey.' },
    { id: 'task_9m3p', title: 'Transcribe interview recordings', client: 'StartupXYZ', status: 'in_progress', priority: 'normal', risk: 'medium', hours: 4, created: '23 min ago', assignee: 'Jane D.', description: '3 interview recordings totaling 2.5 hours need transcription.' },
    { id: 'task_2k8n', title: 'Data entry from scanned documents', client: 'BigCo Inc', status: 'approved', priority: 'rush', risk: 'high', hours: 6, created: '1 hr ago', description: 'Enter data from 120 scanned invoices into spreadsheet format.' },
    { id: 'task_5j1q', title: 'Research competitor pricing', client: 'ACME Corp', status: 'pending', priority: 'normal', risk: 'low', hours: 3, created: '2 hr ago', description: 'Compile pricing data for 15 competitors across 3 product categories.' },
    { id: 'task_8w4r', title: 'Verify user account information', client: 'FinTech Ltd', status: 'review', priority: 'high', risk: 'critical', hours: 1, created: '3 hr ago', assignee: 'Mark T.', description: 'Cross-check 200 user accounts against external verification database.' },
    { id: 'task_3n7s', title: 'Summarize legal documents', client: 'LawFirm LLC', status: 'completed', priority: 'normal', risk: 'medium', hours: 5, created: '5 hr ago', assignee: 'Sarah K.', description: 'Create executive summaries for 8 contract documents.' },
    { id: 'task_4m2x', title: 'Translate marketing materials', client: 'GlobalTech', status: 'pending', priority: 'low', risk: 'low', hours: 4, created: '6 hr ago', description: 'Translate product descriptions to Spanish and French.' },
    { id: 'task_6p9q', title: 'Quality check AI responses', client: 'AIStartup', status: 'in_progress', priority: 'high', risk: 'medium', hours: 2, created: '7 hr ago', assignee: 'Jane D.', description: 'Review and rate 500 AI-generated responses for accuracy.' },
];

export default function QueuePage() {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthModal, setShowAuthModal] = useState(false);

    const filteredTasks = demoTasks.filter(task => {
        if (statusFilter !== 'all' && task.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const toggleTask = (id: string) => {
        setSelectedTasks(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedTasks.length === filteredTasks.length) {
            setSelectedTasks([]);
        } else {
            setSelectedTasks(filteredTasks.map(t => t.id));
        }
    };

    const handleBulkAction = () => {
        setShowAuthModal(true);
    };

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
                        <Link href="/admin" className="sidebar__link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link href="/admin/queue" className="sidebar__link sidebar__link--active">
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
                    </nav>
                </div>

                <div className="sidebar__footer">
                    <Link href="/login" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Sign In for Full Access
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="page-header">
                    <div>
                        <h1 className="page-header__title">Task Queue</h1>
                        <p className="page-header__subtitle">Manage and assign incoming tasks</p>
                    </div>
                    <div className="page-header__actions">
                        <button className="btn btn--secondary" onClick={handleBulkAction}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Task
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="filters__search">
                        <svg className="filters__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="filters__search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className="filters__select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        className="filters__select"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="all">All Priority</option>
                        <option value="rush">Rush</option>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                {selectedTasks.length > 0 && (
                    <div className="bulk-actions">
                        <span className="bulk-actions__count">{selectedTasks.length} selected</span>
                        <div className="bulk-actions__buttons">
                            <button className="btn btn--sm btn--secondary" onClick={handleBulkAction}>Approve</button>
                            <button className="btn btn--sm btn--secondary" onClick={handleBulkAction}>Assign</button>
                            <button className="btn btn--sm btn--ghost" onClick={() => setSelectedTasks([])}>Clear</button>
                        </div>
                    </div>
                )}

                {/* Task Table */}
                <div className="data-table queue-table">
                    <div className="data-table__header queue-table__header">
                        <span>
                            <button
                                className={`checkbox ${selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 ? 'checkbox--checked' : ''}`}
                                onClick={toggleAll}
                            >
                                {selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        </span>
                        <span>Task</span>
                        <span>Status</span>
                        <span>Priority</span>
                        <span>Risk</span>
                        <span>Est.</span>
                        <span>Actions</span>
                    </div>

                    {filteredTasks.map((task) => (
                        <div key={task.id} className="data-table__row queue-table__row">
                            <div className="data-table__cell">
                                <button
                                    className={`checkbox ${selectedTasks.includes(task.id) ? 'checkbox--checked' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {selectedTasks.includes(task.id) && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="data-table__cell">
                                <div className="data-table__cell--bold">{task.title}</div>
                                <div className="data-table__cell--mono">
                                    {task.id} · {task.client} · {task.created}
                                    {task.assignee && <span style={{ color: 'var(--color-accent)' }}> · {task.assignee}</span>}
                                </div>
                            </div>
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
                            <div className="data-table__cell">
                                <button className="btn btn--sm btn--ghost" onClick={handleBulkAction}>View</button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTasks.length === 0 && (
                    <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>No tasks match your filters</p>
                    </div>
                )}
            </main>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-header__title">Sign In Required</h3>
                            <p className="modal-header__description">Please sign in to perform this action</p>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                                You&apos;re viewing demo data. To create, edit, or manage real tasks, you need to sign in.
                            </p>
                            <Link href="/signup" className="btn btn--primary" style={{ marginRight: '0.75rem' }}>
                                Get Started
                            </Link>
                            <Link href="/login" className="btn btn--secondary">
                                Sign In
                            </Link>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn--ghost" onClick={() => setShowAuthModal(false)}>
                                Continue Exploring
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
