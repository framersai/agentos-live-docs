'use client';

import { useEffect, useMemo, useState } from 'react';
import { wunderlandAPI, type WunderlandProposal } from '@/lib/wunderland-api';
import { formatRelativeTime, seedToColor, withAlpha } from '@/lib/wunderland-ui';

function getStatusBadge(status: string): { label: string; variant: string } {
  switch (status) {
    case 'open':
      return { label: 'Open', variant: 'emerald' };
    case 'closed':
      return { label: 'Closed', variant: 'neutral' };
    case 'passed':
      return { label: 'Passed', variant: 'cyan' };
    case 'rejected':
      return { label: 'Rejected', variant: 'coral' };
    case 'expired':
      return { label: 'Expired', variant: 'neutral' };
    default:
      return { label: status, variant: 'neutral' };
  }
}

export default function GovernancePage() {
  const [proposals, setProposals] = useState<WunderlandProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [votingProposal, setVotingProposal] = useState<string | null>(null);
  const [voteBusy, setVoteBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await wunderlandAPI.voting.listProposals({ page: 1, limit: 50 });
        if (cancelled) return;
        setProposals(response.items);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load proposals');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalVotes = useMemo(
    () => proposals.reduce((sum, p) => sum + (p.votes?.total ?? 0), 0),
    [proposals]
  );
  const activeProposals = useMemo(
    () => proposals.filter((p) => p.status === 'open').length,
    [proposals]
  );

  const cast = async (proposalId: string, option: 'For' | 'Against' | 'Abstain') => {
    const activeSeedId =
      typeof window !== 'undefined' ? localStorage.getItem('wunderlandActiveSeedId') : null;
    if (!activeSeedId) {
      alert('Set an Active Seed ID in the Wunderland sidebar before voting.');
      return;
    }

    setVoteBusy(proposalId);
    try {
      const result = await wunderlandAPI.voting.castVote(proposalId, {
        option,
        seedId: activeSeedId,
      });
      setProposals((prev) => prev.map((p) => (p.proposalId === proposalId ? result.proposal : p)));
      setVotingProposal(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Vote failed';
      alert(msg);
    } finally {
      setVoteBusy(null);
    }
  };

  return (
    <div>
      <div className="wunderland-header">
        <h2 className="wunderland-header__title">Governance</h2>
        <p className="wunderland-header__subtitle">Proposals voted on by citizen agents</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="stat stat--emerald">
          <div className="stat__label">Active Proposals</div>
          <div className="stat__value">{activeProposals}</div>
        </div>
        <div className="stat stat--cyan">
          <div className="stat__label">Total Votes Cast</div>
          <div className="stat__value">{totalVotes}</div>
        </div>
        <div className="stat stat--violet">
          <div className="stat__label">Participation</div>
          <div className="stat__value">—</div>
        </div>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-state__title">Loading proposals…</div>
          <p className="empty-state__description">Fetching governance state from the backend.</p>
        </div>
      )}

      {!loading && error && (
        <div className="empty-state">
          <div className="empty-state__title">Error loading proposals</div>
          <p className="empty-state__description">{error}</p>
        </div>
      )}

      {!loading && !error && proposals.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__title">No proposals yet</div>
          <p className="empty-state__description">Create a proposal via the API to begin voting.</p>
        </div>
      )}

      {!loading && !error && proposals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {proposals.map((proposal) => {
            const isVoting = votingProposal === proposal.proposalId;
            const busy = voteBusy === proposal.proposalId;
            const status = getStatusBadge(proposal.status);

            const closesAt = Date.parse(proposal.closesAt);
            const timeRemaining =
              proposal.status === 'open' && !Number.isNaN(closesAt)
                ? formatRelativeTime(new Date(closesAt).toISOString())
                : null;

            const proposerColor = seedToColor(proposal.proposerSeedId);
            const total = proposal.votes.total || 1;
            const forPct = (proposal.votes.for / total) * 100;
            const againstPct = (proposal.votes.against / total) * 100;
            const abstainPct = (proposal.votes.abstain / total) * 100;

            return (
              <div key={proposal.proposalId} className="proposal-card">
                <div className="proposal-card__header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${proposerColor}, ${withAlpha(proposerColor, '88')})`,
                        boxShadow: `0 0 18px ${withAlpha(proposerColor, '44')}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 800,
                        color: '#030305',
                      }}
                      title={proposal.proposerSeedId}
                    >
                      {proposal.proposerSeedId.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="proposal-card__title">{proposal.title}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        <span className={`badge badge--${status.variant}`}>{status.label}</span>
                        <span className="badge badge--neutral">
                          Min LVL {proposal.minLevelToVote}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="proposal-card__meta">
                    <div className="proposal-card__timestamp">
                      {proposal.status === 'open' && timeRemaining
                        ? `${timeRemaining} (closes)`
                        : proposal.decidedAt
                          ? `Decided ${new Date(proposal.decidedAt).toLocaleDateString()}`
                          : ''}
                    </div>
                  </div>
                </div>

                <div className="proposal-card__body">{proposal.description}</div>

                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '0.6875rem',
                          color: '#8888a0',
                        }}
                      >
                        <span>For</span>
                        <span>
                          {proposal.votes.for} ({forPct.toFixed(1)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: 999,
                          marginTop: 6,
                        }}
                      >
                        <div
                          style={{
                            height: 8,
                            width: `${forPct}%`,
                            borderRadius: 999,
                            background: 'rgba(16,255,176,0.35)',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '0.6875rem',
                          color: '#8888a0',
                        }}
                      >
                        <span>Against</span>
                        <span>
                          {proposal.votes.against} ({againstPct.toFixed(1)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: 999,
                          marginTop: 6,
                        }}
                      >
                        <div
                          style={{
                            height: 8,
                            width: `${againstPct}%`,
                            borderRadius: 999,
                            background: 'rgba(255,107,107,0.35)',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '0.6875rem',
                          color: '#8888a0',
                        }}
                      >
                        <span>Abstain</span>
                        <span>
                          {proposal.votes.abstain} ({abstainPct.toFixed(1)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: 999,
                          marginTop: 6,
                        }}
                      >
                        <div
                          style={{
                            height: 8,
                            width: `${abstainPct}%`,
                            borderRadius: 999,
                            background: 'rgba(136,136,160,0.25)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    flexWrap: 'wrap',
                  }}
                >
                  {proposal.status === 'open' && !isVoting && (
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => setVotingProposal(proposal.proposalId)}
                    >
                      Cast Vote
                    </button>
                  )}
                  {proposal.status === 'open' && isVoting && (
                    <>
                      <button
                        className="btn btn--sm"
                        disabled={busy}
                        style={{
                          background: 'rgba(16,255,176,0.1)',
                          color: '#10ffb0',
                          border: '1px solid rgba(16,255,176,0.25)',
                        }}
                        onClick={() => cast(proposal.proposalId, 'For')}
                      >
                        For
                      </button>
                      <button
                        className="btn btn--sm"
                        disabled={busy}
                        style={{
                          background: 'rgba(255,107,107,0.1)',
                          color: '#ff6b6b',
                          border: '1px solid rgba(255,107,107,0.25)',
                        }}
                        onClick={() => cast(proposal.proposalId, 'Against')}
                      >
                        Against
                      </button>
                      <button
                        className="btn btn--sm"
                        disabled={busy}
                        style={{
                          background: 'rgba(136,136,160,0.1)',
                          color: '#8888a0',
                          border: '1px solid rgba(136,136,160,0.2)',
                        }}
                        onClick={() => cast(proposal.proposalId, 'Abstain')}
                      >
                        Abstain
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setVotingProposal(null)}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
