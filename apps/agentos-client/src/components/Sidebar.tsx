import { clsx } from "clsx";
import { Radio, Plus, CheckCircle2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useSessionStore } from "@/state/sessionStore";
import { AgentOSChunkType } from "@/types/agentos";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  onCreateSession: (opts?: { targetType?: 'persona' | 'agency'; personaId?: string; agencyId?: string; displayName?: string }) => void;
  onToggleCollapse?: () => void;
  currentTab?: 'compose' | 'agency' | 'personas' | 'workflows' | 'settings' | 'about';
}

const statusBadgeStyles: Record<string, string> = {
  idle: "bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200",
  streaming: "bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
  error: "bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30"
};

export function Sidebar({ onCreateSession, onToggleCollapse, currentTab }: SidebarProps) {
  const { t } = useTranslation();
  const sessions = useSessionStore((state) => state.sessions);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const setActiveSession = useSessionStore((state) => state.setActiveSession);
  const personas = useSessionStore((state) => state.personas);
  const agencies = useSessionStore((state) => state.agencies);
  const initialFilter = currentTab === 'agency' ? 'agency' : currentTab === 'compose' ? 'persona' : 'all';
  const [filter, setFilter] = useState<'all' | 'persona' | 'agency'>(initialFilter as any);
  const [showNew, setShowNew] = useState(false);
  const [newType, setNewType] = useState<'persona' | 'agency'>(agencies.length > 0 ? 'agency' : 'persona');
  const [newPersonaId, setNewPersonaId] = useState<string>("");
  const [newAgencyId, setNewAgencyId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  const preferDefaultPersona = (ids: string[]): string | undefined => {
    if (ids.includes('v_researcher')) return 'v_researcher';
    if (ids.includes('nerf_generalist')) return 'nerf_generalist';
    return ids[0];
  };

  const remotePersonaIds = useMemo(() => personas.filter(p => p.source === 'remote').map(p => p.id), [personas]);
  const defaultPersonaId = preferDefaultPersona(remotePersonaIds) ?? personas[0]?.id;

  const openNew = () => {
    setNewType(agencies.length > 0 ? 'agency' : 'persona');
    setNewPersonaId(defaultPersonaId || "");
    setNewAgencyId(agencies[0]?.id || "");
    setNewName('');
    setShowNew(true);
  };

  const createNew = () => {
    const opts = newType === 'agency'
      ? { targetType: 'agency' as const, agencyId: newAgencyId, displayName: newName || undefined }
      : { targetType: 'persona' as const, personaId: newPersonaId || defaultPersonaId, displayName: newName || undefined };
    onCreateSession(opts);
    setFilter(newType);
    setShowNew(false);
  };

  const sortedSessions = useMemo(() => {
    const base = [...sessions];
    const filtered = filter === 'all' ? base : base.filter((s) => s.targetType === filter);
    return filtered.sort((a, b) => {
      const latestA = a.events[0]?.timestamp ?? 0;
      const latestB = b.events[0]?.timestamp ?? 0;
      return latestB - latestA;
    });
  }, [sessions, filter]);

  return (
    <nav 
      className="flex h-full flex-col border-r border-slate-200 bg-slate-50 transition-colors dark:border-white/5 dark:bg-slate-950/60"
      aria-label={t("sidebar.labels.navigation", { defaultValue: "Session navigation" })}
    >
      {/* Header with branding and controls */}
      <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/5">
        <a href="https://agentos.sh" target="_blank" rel="noreferrer" className="inline-flex items-center">
          <img src="/logos/agentos-primary-no-tagline.svg" alt="AgentOS" className="h-8 w-auto" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} />
        </a>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
              {t("sidebar.sessionsLabel")}
            </p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("sidebar.title")}
            </h1>
          </div>
          <button
            onClick={openNew}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            title={t("sidebar.actions.newSession")}
            aria-label={t("sidebar.actions.newSession")}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        
        {/* Theme and Language Controls */}
        <div className="flex items-center justify-between gap-2" role="toolbar" aria-label={t("sidebar.labels.preferences", { defaultValue: "Preferences" })}>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>
      
      {/* Filter + Session List */}
      <div 
        className="flex-1 space-y-2 overflow-y-auto px-4 pb-8 pt-4"
        role="list"
        aria-label={t("sidebar.labels.sessionList", { defaultValue: "Active sessions" })}
      >
        <div className="mb-2 flex items-center gap-2 text-xs">
          <button onClick={() => setFilter('all')} className={clsx('rounded-full border px-2 py-0.5', filter === 'all' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300')}>All</button>
          <button onClick={() => setFilter('persona')} className={clsx('rounded-full border px-2 py-0.5', filter === 'persona' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300')}>Persona</button>
          <button onClick={() => setFilter('agency')} className={clsx('rounded-full border px-2 py-0.5', filter === 'agency' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300')}>Agency</button>
        </div>
        {sortedSessions.length === 0 ? (
          <div 
            className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-600 dark:border-white/5 dark:bg-slate-900/60 dark:text-slate-400"
            role="status"
          >
            {t("sidebar.emptyState")}
          </div>
        ) : (
          sortedSessions.map((session) => {
            const status = session.status;
            const statusLabel = t(`common.status.${status}` as const, { defaultValue: status });
            const isActive = activeSessionId === session.id;
            
            const targetBadge =
              session.targetType === "agency" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-sky-600 dark:text-sky-300">
                  <Users className="h-3 w-3" aria-hidden="true" /> {t("sidebar.badges.agency")}
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                  {t("sidebar.badges.persona")}
                </span>
              );
              
            return (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={clsx(
                  "flex w-full flex-col gap-2 rounded-xl border px-4 py-3 text-left transition",
                  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950",
                  isActive 
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500/60 dark:border-sky-500/60 dark:bg-slate-800" 
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/5 dark:bg-slate-900/40 dark:hover:border-white/10 dark:hover:bg-slate-900/60"
                )}
                role="listitem"
                aria-label={t("sidebar.session.ariaLabel", { 
                  defaultValue: "Session {{name}}, status: {{status}}", 
                  name: session.displayName, 
                  status: statusLabel 
                })}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    <Radio className="h-3 w-3 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                    <span className="sr-only">{t("sidebar.session.streamLabel")}</span>
                  </span>
                  <span 
                    className={clsx(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                      statusBadgeStyles[status]
                    )}
                    role="status"
                    aria-live="polite"
                  >
                    {statusLabel}
                  </span>
                </div>
                
                {/* Session Info */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {session.displayName}
                    </p>
                    {targetBadge}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {session.events.length === 0
                      ? t("sidebar.session.noActivity")
                      : new Date(session.events[0]!.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                
                {/* Completion Indicator */}
                {session.events.find((event) => event.type === AgentOSChunkType.FINAL_RESPONSE) && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    <span>{t("sidebar.session.completedTurn")}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <header className="mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">New session</h3>
            </header>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" checked={newType==='persona'} onChange={() => setNewType('persona')} />
                  <span>Persona</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" checked={newType==='agency'} onChange={() => setNewType('agency')} />
                  <span>Agency</span>
                </label>
              </div>
              {newType === 'persona' ? (
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">Persona</span>
                  <select value={newPersonaId} onChange={(e)=>setNewPersonaId(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900">
                    {[...personas].map(p => (
                      <option key={p.id} value={p.id}>{p.displayName}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">Agency</span>
                  <select value={newAgencyId} onChange={(e)=>setNewAgencyId(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900">
                    {[...agencies].map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">Name (optional)</span>
                <input value={newName} onChange={(e)=>setNewName(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900" />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setShowNew(false)} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300">Cancel</button>
              <button onClick={createNew} className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">Create</button>
            </div>
          </div>
        </div>
      )}
      {/* Footer links */}
      <footer className="mt-auto border-t border-slate-200 px-5 py-3 text-xs text-slate-600 dark:border-white/5 dark:text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <a href="https://vca.chat" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:underline dark:text-sky-300">
            <span>Marketplace</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="https://agentos.sh" target="_blank" rel="noreferrer" className="hover:underline">agentos.sh</a>
            <a href="https://frame.dev" target="_blank" rel="noreferrer" className="hover:underline">frame.dev</a>
            <a href="https://github.com/framersai/agentos" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
            <a href="https://github.com/framersai/agentos/stargazers" target="_blank" rel="noreferrer" aria-label="Star AgentOS on GitHub">★</a>
            <a href="https://github.com/framersai/agentos/fork" target="_blank" rel="noreferrer" aria-label="Fork AgentOS on GitHub">⎇</a>
          </div>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="ml-auto rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
              title="Hide sidebar"
            >
              Hide
            </button>
          )}
        </div>
      </footer>
    </nav>
  );
}
