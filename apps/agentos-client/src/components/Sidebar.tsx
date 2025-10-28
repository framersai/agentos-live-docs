import { useMemo } from "react";
import { clsx } from "clsx";
import { Radio, Plus, CheckCircle2 } from "lucide-react";
import { useSessionStore } from "@/state/sessionStore";

interface SidebarProps {
  onCreateSession: () => void;
}

const statusBadgeStyles: Record<string, string> = {
  idle: "bg-slate-800/60 text-slate-200",
  streaming: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  error: "bg-rose-500/10 text-rose-300 border border-rose-500/30"
};

export function Sidebar({ onCreateSession }: SidebarProps) {
  const sessions = useSessionStore((state) => state.sessions);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const setActiveSession = useSessionStore((state) => state.setActiveSession);

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        const latestA = a.events[0]?.timestamp ?? 0;
        const latestB = b.events[0]?.timestamp ?? 0;
        return latestB - latestA;
      }),
    [sessions]
  );

  return (
    <aside className="flex h-full flex-col border-r border-white/5 bg-slate-950/60">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Sessions</p>
          <h2 className="text-lg font-semibold text-slate-100">AgentOS Workbench</h2>
        </div>
        <button
          onClick={onCreateSession}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5"
          title="New session"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-8">
        {sortedSessions.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 text-sm text-slate-400">
            Create a session to start streaming AgentOS events. Connect it to your backend or replay captured transcripts.
          </div>
        ) : (
          sortedSessions.map((session) => {
            const status = session.status;
            return (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={clsx(
                  "flex w-full flex-col gap-2 rounded-xl border border-white/5 bg-slate-900/40 px-4 py-3 text-left transition",
                  activeSessionId === session.id ? "ring-2 ring-sky-500/60" : "hover:border-white/10 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    <Radio className="h-3 w-3 text-sky-400" /> stream
                  </span>
                  <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", statusBadgeStyles[status])}>
                    {status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{session.persona}</p>
                  <p className="text-xs text-slate-400">
                    {session.events.length === 0
                      ? "No activity yet"
                      : new Date(session.events[0]!.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {session.events.find((event) => event.type === "FINAL_RESPONSE") && (
                  <div className="flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Completed turn
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
