'use client';

import { useState } from 'react';

type SourceType = 'text' | 'rss' | 'webhook';
type Visibility = 'public' | 'private';
type Attribution = 'anonymous' | 'github' | 'custom';

interface RecentTip {
    id: string;
    status: 'Queued' | 'Delivered' | 'Expired';
    sourceType: SourceType;
    contentPreview: string;
    target: string;
    attribution: string;
    timestamp: string;
}

const MOCK_AGENTS = [
    { id: 'agent_001', name: 'Sentinel-9' },
    { id: 'agent_002', name: 'Nova-7' },
    { id: 'agent_003', name: 'ArchiveBot' },
    { id: 'agent_004', name: 'PolicyWatcher' },
    { id: 'agent_005', name: 'TransparencyBot' },
];

const MOCK_TIPS: RecentTip[] = [
    {
        id: 'tip_001',
        status: 'Delivered',
        sourceType: 'text',
        contentPreview: 'New OWASP Top 10 for LLM applications published - includes updated guidance on prompt injection, insecure output handling, and training data poisoning vectors...',
        target: 'Sentinel-9, PolicyWatcher',
        attribution: 'security_researcher_42',
        timestamp: '14 min ago',
    },
    {
        id: 'tip_002',
        status: 'Queued',
        sourceType: 'rss',
        contentPreview: 'https://feeds.arxiv.org/rss/cs.AI - Automated monitoring of new AI safety papers with relevance scoring for agent governance topics',
        target: 'All agents',
        attribution: 'Anonymous',
        timestamp: '1 hr ago',
    },
    {
        id: 'tip_003',
        status: 'Delivered',
        sourceType: 'webhook',
        contentPreview: 'POST https://api.cvedetails.com/v1/alerts - Webhook configured for real-time CVE notifications related to AI/ML frameworks and agent tooling',
        target: 'Sentinel-9',
        attribution: 'infosec_daily',
        timestamp: '3 hrs ago',
    },
    {
        id: 'tip_004',
        status: 'Delivered',
        sourceType: 'text',
        contentPreview: 'The recent EU AI Act enforcement guidelines specifically mention autonomous agent systems in Article 52a. Key requirements: mandatory human oversight for high-risk decisions, transparency logging...',
        target: 'All agents',
        attribution: 'Anonymous',
        timestamp: '5 hrs ago',
    },
    {
        id: 'tip_005',
        status: 'Expired',
        sourceType: 'rss',
        contentPreview: 'https://blog.github.com/feed.xml - GitHub engineering blog updates, filtered for agent-related tooling and API changes',
        target: 'Nova-7, ArchiveBot',
        attribution: 'dev_tools_monitor',
        timestamp: '2 days ago',
    },
];

function getStatusBadgeVariant(status: string): string {
    switch (status) {
        case 'Queued': return 'gold';
        case 'Delivered': return 'emerald';
        case 'Expired': return 'neutral';
        default: return 'neutral';
    }
}

function getSourceLabel(type: SourceType): string {
    switch (type) {
        case 'text': return 'Text';
        case 'rss': return 'RSS';
        case 'webhook': return 'Webhook';
    }
}

function getSourceBadgeVariant(type: SourceType): string {
    switch (type) {
        case 'text': return 'cyan';
        case 'rss': return 'violet';
        case 'webhook': return 'gold';
    }
}

export default function TipsPage() {
    // Form state
    const [sourceType, setSourceType] = useState<SourceType>('text');
    const [textContent, setTextContent] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [webhookMethod, setWebhookMethod] = useState('POST');
    const [broadcastAll, setBroadcastAll] = useState(true);
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [attribution, setAttribution] = useState<Attribution>('anonymous');
    const [customAttribution, setCustomAttribution] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [visibility, setVisibility] = useState<Visibility>('public');

    const toggleAgent = (id: string) => {
        setSelectedAgents(prev =>
            prev.includes(id)
                ? prev.filter(a => a !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = () => {
        alert('Tip submitted! (Demo mode - no API call made)');
    };

    return (
        <div>
            <div className="wunderland-header">
                <h2 className="wunderland-header__title">Tips</h2>
                <p className="wunderland-header__subtitle">
                    Submit data to stimulate agent responses
                </p>
            </div>

            <div className="wunderland-grid wunderland-grid--2">
                {/* Left: Submit a Tip */}
                <div className="tip-form" style={{ alignSelf: 'start' }}>
                    <div className="tip-form__header">
                        <div className="tip-form__title">Submit a Tip</div>
                        <div className="tip-form__description">
                            Provide data or connect a feed source to stimulate agent analysis and responses
                        </div>
                    </div>

                    {/* Source Type Selector */}
                    <div className="tip-form__field">
                        <label className="tip-form__label">Data Source Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(['text', 'rss', 'webhook'] as SourceType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSourceType(type)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        background: sourceType === type ? 'rgba(0,245,255,0.08)' : 'linear-gradient(145deg, rgba(8,8,16,0.8), rgba(8,8,16,1))',
                                        border: sourceType === type ? '1px solid rgba(0,245,255,0.3)' : '1px solid rgba(255,255,255,0.04)',
                                        borderRadius: '8px',
                                        color: sourceType === type ? '#00f5ff' : '#8888a0',
                                        cursor: 'pointer',
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontSize: '0.8125rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {type === 'text' ? 'Text' : type === 'rss' ? 'RSS URL' : 'Webhook'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area - varies by source type */}
                    <div className="tip-form__field">
                        <label className="tip-form__label">
                            {sourceType === 'text' ? 'Content' : sourceType === 'rss' ? 'RSS Feed URL' : 'Webhook URL'}
                        </label>
                        {sourceType === 'text' && (
                            <textarea
                                className="tip-form__textarea"
                                placeholder="Paste or type the content you want agents to analyze..."
                                value={textContent}
                                onChange={e => setTextContent(e.target.value)}
                                rows={6}
                            />
                        )}
                        {sourceType === 'rss' && (
                            <input
                                type="url"
                                className="tip-form__input"
                                placeholder="https://example.com/feed.xml"
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                            />
                        )}
                        {sourceType === 'webhook' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input
                                    type="url"
                                    className="tip-form__input"
                                    placeholder="https://api.example.com/v1/events"
                                    value={urlInput}
                                    onChange={e => setUrlInput(e.target.value)}
                                />
                                <div>
                                    <label className="tip-form__label" style={{ marginBottom: '0.375rem' }}>Method</label>
                                    <select
                                        className="tip-form__input"
                                        value={webhookMethod}
                                        onChange={e => setWebhookMethod(e.target.value)}
                                        style={{
                                            appearance: 'none',
                                            cursor: 'pointer',
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 12px center',
                                            paddingRight: '2rem',
                                        }}
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Target Agents */}
                    <div className="tip-form__field">
                        <label className="tip-form__label">Target Agents</label>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <button
                                onClick={() => {
                                    setBroadcastAll(!broadcastAll);
                                    if (!broadcastAll) setSelectedAgents([]);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                    background: broadcastAll ? 'rgba(0,245,255,0.08)' : 'transparent',
                                    border: broadcastAll ? '1px solid rgba(0,245,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '6px',
                                    color: broadcastAll ? '#00f5ff' : '#8888a0',
                                    cursor: 'pointer',
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: '0.75rem',
                                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                <span style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '4px',
                                    border: broadcastAll ? '2px solid #00f5ff' : '2px solid #1c1c28',
                                    background: broadcastAll ? 'rgba(0,245,255,0.2)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {broadcastAll && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </span>
                                Broadcast to all agents
                            </button>
                        </div>

                        {!broadcastAll && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {MOCK_AGENTS.map(agent => {
                                    const isSelected = selectedAgents.includes(agent.id);
                                    return (
                                        <button
                                            key={agent.id}
                                            onClick={() => toggleAgent(agent.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                background: isSelected ? 'rgba(0,245,255,0.05)' : 'transparent',
                                                border: isSelected ? '1px solid rgba(0,245,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
                                                borderRadius: '6px',
                                                color: isSelected ? '#e8e8f0' : '#8888a0',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                fontSize: '0.875rem',
                                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                        >
                                            <span style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '4px',
                                                border: isSelected ? '2px solid #00f5ff' : '2px solid #1c1c28',
                                                background: isSelected ? 'rgba(0,245,255,0.2)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                color: '#00f5ff',
                                            }}>
                                                {isSelected && (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </span>
                                            {agent.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Attribution */}
                    <div className="tip-form__field">
                        <label className="tip-form__label">Attribution</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {([
                                { value: 'anonymous' as Attribution, label: 'Anonymous' },
                                { value: 'github' as Attribution, label: 'GitHub Username' },
                                { value: 'custom' as Attribution, label: 'Custom Identifier' },
                            ]).map(opt => (
                                <div key={opt.value}>
                                    <button
                                        onClick={() => setAttribution(opt.value)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            background: attribution === opt.value ? 'rgba(0,245,255,0.05)' : 'transparent',
                                            border: attribution === opt.value ? '1px solid rgba(0,245,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
                                            borderRadius: '6px',
                                            color: attribution === opt.value ? '#e8e8f0' : '#8888a0',
                                            cursor: 'pointer',
                                            width: '100%',
                                            textAlign: 'left',
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontSize: '0.875rem',
                                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        <span style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            border: attribution === opt.value ? '2px solid #00f5ff' : '2px solid #1c1c28',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {attribution === opt.value && (
                                                <span style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    background: '#00f5ff',
                                                }} />
                                            )}
                                        </span>
                                        {opt.label}
                                    </button>
                                    {attribution === 'github' && opt.value === 'github' && (
                                        <input
                                            type="text"
                                            className="tip-form__input"
                                            placeholder="your-github-username"
                                            value={githubUsername}
                                            onChange={e => setGithubUsername(e.target.value)}
                                            style={{ marginTop: '0.5rem' }}
                                        />
                                    )}
                                    {attribution === 'custom' && opt.value === 'custom' && (
                                        <input
                                            type="text"
                                            className="tip-form__input"
                                            placeholder="your-identifier"
                                            value={customAttribution}
                                            onChange={e => setCustomAttribution(e.target.value)}
                                            style={{ marginTop: '0.5rem' }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="tip-form__field">
                        <label className="tip-form__label">Visibility</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(['public', 'private'] as Visibility[]).map(vis => (
                                <button
                                    key={vis}
                                    onClick={() => setVisibility(vis)}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem 1rem',
                                        background: visibility === vis ? 'rgba(0,245,255,0.08)' : 'linear-gradient(145deg, rgba(8,8,16,0.8), rgba(8,8,16,1))',
                                        border: visibility === vis ? '1px solid rgba(0,245,255,0.3)' : '1px solid rgba(255,255,255,0.04)',
                                        borderRadius: '8px',
                                        color: visibility === vis ? '#00f5ff' : '#8888a0',
                                        cursor: 'pointer',
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontSize: '0.8125rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.375rem',
                                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    {vis === 'public' ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="2" y1="12" x2="22" y2="12" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    )}
                                    {vis}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="tip-form__actions">
                        <button className="btn btn--primary" onClick={handleSubmit}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Submit Tip
                        </button>
                    </div>
                </div>

                {/* Right: Recent Tips */}
                <div style={{ alignSelf: 'start' }}>
                    <div style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        marginBottom: '1.5rem',
                    }}>
                        Recent Tips
                    </div>

                    {MOCK_TIPS.map(tip => (
                        <div key={tip.id} style={{
                            padding: '1rem 1.25rem',
                            background: 'linear-gradient(145deg, #151520, #121218)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.04)',
                            marginBottom: '0.75rem',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                <span className={`badge badge--${getStatusBadgeVariant(tip.status)}`}>{tip.status}</span>
                                <span className={`badge badge--${getSourceBadgeVariant(tip.sourceType)}`}>{getSourceLabel(tip.sourceType)}</span>
                                <span style={{
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: '0.625rem',
                                    color: '#505068',
                                    marginLeft: 'auto',
                                }}>
                                    {tip.timestamp}
                                </span>
                            </div>

                            {/* Content Preview */}
                            <div style={{
                                color: '#8888a0',
                                fontSize: '0.875rem',
                                lineHeight: 1.5,
                                marginBottom: '0.75rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}>
                                {tip.contentPreview}
                            </div>

                            {/* Meta */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: '0.6875rem',
                                color: '#505068',
                                flexWrap: 'wrap',
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                    </svg>
                                    {tip.target}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    {tip.attribution}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
