import { Fragment } from "react";
import { clsx } from "clsx";
import { AgentOSResponseChunkType } from "@agentos/core";
import { AlertTriangle, Activity, Terminal } from "lucide-react";
import { useSessionStore } from "@/state/sessionStore";

const chunkAccent: Record<string, string> = {
  [AgentOSResponseChunkType.TEXT_DELTA]: "border-sky-500/40 bg-sky-500/5 text-sky-200",
  [AgentOSResponseChunkType.FINAL_RESPONSE]: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  [AgentOSResponseChunkType.TOOL_CALL_REQUEST]: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  [AgentOSResponseChunkType.TOOL_RESULT_EMISSION]: "border-purple-400/40 bg-purple-400/10 text-purple-100",
  [AgentOSResponseChunkType.ERROR]: "border-rose-500/40 bg-rose-500/10 text-rose-100"
};

export function SessionInspector() {
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const session = useSessionStore((state) => state.sessions.find((item) => item.id === state.activeSessionId));

  if (!activeSessionId || !session) {
    return (
      <div className="flex h-full flex-1 items-center justify-center rounded-3xl border border-white/5 bg-slate-900/60">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 text-slate-500" />
          <p className="mt-3 text-sm text-slate-400">Select or create a session to inspect streaming events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Session timeline</p>
          <h2 className="text-lg font-semibold text-slate-100">{session.persona}</h2>
        </div>
        <span className="text-xs text-slate-500">{session.events.length} entries</span>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {session.events.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 text-sm text-slate-400">
              Waiting for the first event from your AgentOS runtime. Trigger a turn or replay a transcript to populate
              the timeline.
            </div>
          ) : (
            session.events.map((event) => {
              const payloadAny = event.payload as any;
              const chunkClass = chunkAccent[event.type] ?? "border-white/5 bg-white/5 text-slate-200";
              return (
                <Fragment key={event.id}>
                  <div className={clsx("rounded-2xl border px-5 py-4 shadow-panel", chunkClass)}>
                    <header className="mb-3 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold uppercase tracking-[0.35em] text-current">{event.type}</span>
                      <time>{new Date(event.timestamp).toLocaleTimeString()}</time>
                    </header>
                    {event.type === "log" ? (
                      <div className="flex items-start gap-3 text-sm text-slate-200">
                        <Terminal className="mt-0.5 h-4 w-4" />
                        <p>{payloadAny.message}</p>
                      </div>
                    ) : event.type === AgentOSResponseChunkType.ERROR ? (
                      <div className="flex items-start gap-3 text-sm">
                        <AlertTriangle className="mt-0.5 h-4 w-4" />
                        <div>
                          <p className="font-semibold">{payloadAny.message}</p>
                          {payloadAny.code && <p className="text-xs text-slate-300">Code: {payloadAny.code}</p>}
                        </div>
                      </div>
                    ) : (
                      <pre className="max-h-64 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {JSON.stringify(payloadAny, null, 2)}
                      </pre>
                    )}
                  </div>
                </Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
