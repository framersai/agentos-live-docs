import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import {
  AgentOSChunkType,
  type AgentOSAgencyUpdateChunk,
  type AgentOSWorkflowUpdateChunk,
  type AgentOSToolResultEmissionChunk,
  type AgentOSTextDeltaChunk,
  type AgentOSFinalResponseChunk,
  type AgentOSSystemProgressChunk,
  type AgentOSToolCallRequestChunk,
  type AgentOSResponse
} from "@/types/agentos";
import { AlertTriangle, Activity, Terminal, Users, GitBranch } from "lucide-react";
import { useSessionStore } from "@/state/sessionStore";
import { ArtifactViewer } from "@/components/ArtifactViewer";
import { exportAllData } from "@/lib/dataExport";

const chunkAccent: Record<string, string> = {
  [AgentOSChunkType.TEXT_DELTA]: "border-sky-500/40 bg-sky-500/5 text-sky-200",
  [AgentOSChunkType.FINAL_RESPONSE]: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  [AgentOSChunkType.TOOL_CALL_REQUEST]: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  [AgentOSChunkType.TOOL_RESULT_EMISSION]: "border-purple-400/40 bg-purple-400/10 text-purple-100",
  [AgentOSChunkType.ERROR]: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  [AgentOSChunkType.AGENCY_UPDATE]: "border-sky-400/40 bg-sky-400/10 text-sky-100",
  [AgentOSChunkType.WORKFLOW_UPDATE]: "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
};

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderWorkflowUpdate(chunk: AgentOSWorkflowUpdateChunk) {
  const tasks = chunk.workflow.tasks ? Object.entries(chunk.workflow.tasks) : [];
  const goalMetadata =
    chunk.workflow.metadata && typeof chunk.workflow.metadata === "object"
      ? (chunk.workflow.metadata as Record<string, unknown>).goal
      : undefined;
  const goal = typeof goalMetadata === "string" ? goalMetadata : undefined;

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Workflow</p>
          <p className="text-slate-100">{chunk.workflow.definitionId}</p>
        </div>
        <span className="text-xs text-slate-400">{formatStatus(chunk.workflow.status)}</span>
      </div>
      <dl className="grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
        <div>
          <dt className="uppercase tracking-[0.35em] text-slate-400">Workflow Id</dt>
          <dd className="truncate text-slate-100">{chunk.workflow.workflowId}</dd>
        </div>
        {goal && (
          <div>
            <dt className="uppercase tracking-[0.35em] text-slate-400">Goal</dt>
            <dd className="truncate text-slate-100">{goal}</dd>
          </div>
        )}
      </dl>
      {tasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Tasks</p>
          <ul className="space-y-2">
            {tasks.map(([taskId, taskSnapshot]) => (
              <li
                key={taskId}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3 w-3 text-slate-500" />
                  <span>{taskId}</span>
                </div>
                <span className="text-slate-400">{formatStatus(taskSnapshot.status)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function renderAgencyUpdate(chunk: AgentOSAgencyUpdateChunk) {
  const seats = chunk.agency.seats ?? [];
  const goal =
    chunk.agency.metadata && typeof chunk.agency.metadata.goal === "string"
      ? chunk.agency.metadata.goal
      : null;
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <div className="flex items-center gap-2 font-semibold text-slate-100">
        <Users className="h-4 w-4 text-sky-200" />
        Agency {chunk.agency.agencyId}
      </div>
      {goal && <p className="text-slate-200">{goal}</p>}
      <dl className="grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
        <div>
          <dt className="uppercase tracking-[0.35em] text-slate-400">Workflow</dt>
          <dd className="truncate text-slate-100">{chunk.agency.workflowId}</dd>
        </div>
        {chunk.agency.conversationId && (
          <div>
            <dt className="uppercase tracking-[0.35em] text-slate-400">Conversation</dt>
            <dd className="truncate text-slate-100">{chunk.agency.conversationId}</dd>
          </div>
        )}
      </dl>
      <div className="space-y-2">
        {seats.length === 0 ? (
          <p className="text-xs text-slate-300">No registered seats yet.</p>
        ) : (
          seats.map((seat) => (
            <div key={seat.roleId} className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">{seat.roleId}</p>
              <p className="text-sm text-slate-100">{seat.personaId}</p>
              <p className="text-xs text-slate-400">GMI: {seat.gmiInstanceId}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function renderEventBody(type: AgentOSChunkType | "log", payload: unknown): ReactNode {
  if (type === "log") {
    return (
      <div className="flex items-start gap-3 text-sm text-slate-200">
        <Terminal className="mt-0.5 h-4 w-4" />
        <p>{(payload as { message: string }).message}</p>
      </div>
    );
  }

  if (type === AgentOSChunkType.AGENCY_UPDATE) {
    return renderAgencyUpdate(payload as AgentOSAgencyUpdateChunk);
  }

  if (type === AgentOSChunkType.WORKFLOW_UPDATE) {
    return renderWorkflowUpdate(payload as AgentOSWorkflowUpdateChunk);
  }

  if (type === AgentOSChunkType.TOOL_RESULT_EMISSION) {
    const chunk = payload as AgentOSToolResultEmissionChunk;
    return (
      <div className="space-y-3 text-sm text-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Tool result</p>
            <p className="text-slate-100">{chunk.toolName}</p>
          </div>
          <span className={clsx("text-xs", chunk.isSuccess ? "text-emerald-300" : "text-rose-300")}>{chunk.isSuccess ? "Success" : "Failed"}</span>
        </div>
        {chunk.errorMessage && <p className="text-xs text-rose-300">{chunk.errorMessage}</p>}
        <ArtifactViewer result={chunk.toolResult} />
      </div>
    );
  }

  if (type === AgentOSChunkType.ERROR) {
    const errorPayload = payload as { message: string; code?: string };
    const msg = errorPayload.message || '';
    let help: string | null = null;
    if (/persona .* not found/i.test(msg)) {
      help = 'Persona not found. Pick a listed persona or switch session to a valid persona.';
    } else if (/access denied|requires tier/i.test(msg)) {
      help = 'Access denied. In development, enable AGENTOS_DEV_ALLOW_ALL=true and restart, or choose a free persona.';
    }
    return (
      <div className="flex items-start gap-3 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4" />
        <div>
          <p className="font-semibold">{errorPayload.message}</p>
          {errorPayload.code && <p className="text-xs text-slate-300">Code: {errorPayload.code}</p>}
          {help && <p className="text-xs text-amber-300">{help}</p>}
        </div>
      </div>
    );
  }

  if (type === AgentOSChunkType.FINAL_RESPONSE) {
    const finalPayload = payload as { finalResponseText: string | null; metadata?: Record<string, unknown> };
    return (
      <div className="space-y-3 text-sm text-slate-200">
        {finalPayload.finalResponseText && (
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-950/60 p-3 text-sm text-slate-100">
            {finalPayload.finalResponseText}
          </pre>
        )}
        {finalPayload.metadata && (
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950/60 p-3 text-xs text-slate-200">
            {JSON.stringify(finalPayload.metadata, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <pre className="max-h-64 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-relaxed">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}

/**
 * Animated streaming text renderer. It animates towards the provided `text` string.
 */
function StreamingText({ text, isActive }: { text: string; isActive: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const displayedRef = useRef("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const current = displayedRef.current;
    const target = text;

    // If target shrank (shouldn't happen), snap
    if (!target.startsWith(current)) {
      displayedRef.current = target;
      setDisplayed(target);
      return;
    }

    // If already up-to-date
    if (current === target) {
      if (!isActive && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Animate only the delta
    const delta = target.slice(current.length);
    const chunkSize = Math.max(1, Math.min(3, Math.floor(delta.length / 24))); // smooth chunks
    let index = 0;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      index += chunkSize;
      const next = current + delta.slice(0, Math.min(index, delta.length));
      displayedRef.current = next;
      setDisplayed(next);
      if (index >= delta.length) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 16); // ~60fps

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, isActive]);

  return (
    <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-950/60 p-3 text-sm text-slate-100">
      {displayed}
      {isActive && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse rounded-sm bg-sky-400/70 align-baseline" aria-hidden="true" />}
    </pre>
  );
}

type AggregatedAssistantRow = {
  kind: "assistant";
  streamId: string;
  personaId: string;
  createdAt: number;
  updatedAt: number;
  text: string;
  isFinal: boolean;
  debugLines: string[];
};

type SimpleRow = {
  kind: "event";
  id: string;
  timestamp: number;
  type: AgentOSChunkType | "log";
  payload: AgentOSResponse | { message: string; level?: string };
};

function buildAggregatedRows(events: ReturnType<typeof useSessionStore>["sessions"][number]["events"]): Array<AggregatedAssistantRow | SimpleRow> {
  // Work chronologically to aggregate, then we'll render newest-first as before
  const chronological = [...events].reverse();
  const rows: Array<AggregatedAssistantRow | SimpleRow> = [];
  const byStream: Record<string, AggregatedAssistantRow> = {};

  for (const e of chronological) {
    if (e.type === AgentOSChunkType.TEXT_DELTA) {
      const chunk = e.payload as AgentOSTextDeltaChunk;
      const row = byStream[chunk.streamId] || {
        kind: "assistant",
        streamId: chunk.streamId,
        personaId: chunk.personaId,
        createdAt: e.timestamp,
        updatedAt: e.timestamp,
        text: "",
        isFinal: false,
        debugLines: [],
      };
      row.text += chunk.textDelta || "";
      row.updatedAt = e.timestamp;
      byStream[chunk.streamId] = row;
      continue;
    }

    if (e.type === AgentOSChunkType.FINAL_RESPONSE) {
      const chunk = e.payload as AgentOSFinalResponseChunk;
      // Ensure row exists; the assistant might only send FINAL_RESPONSE text
      const row = byStream[chunk.streamId] || {
        kind: "assistant",
        streamId: chunk.streamId,
        personaId: chunk.personaId,
        createdAt: e.timestamp,
        updatedAt: e.timestamp,
        text: "",
        isFinal: false,
        debugLines: [],
      };
      if (chunk.finalResponseText) row.text += chunk.finalResponseText;
      row.updatedAt = e.timestamp;
      row.isFinal = true;
      byStream[chunk.streamId] = row;
      // Flush immediately as a row (and keep it in map in case more arrives — guard below)
      continue;
    }

    // Append debug lines for interesting chunks onto the most recent row for that stream if any
    if (
      e.type === AgentOSChunkType.SYSTEM_PROGRESS ||
      e.type === AgentOSChunkType.TOOL_CALL_REQUEST ||
      e.type === AgentOSChunkType.TOOL_RESULT_EMISSION ||
      e.type === AgentOSChunkType.ERROR
    ) {
      const chunk = e.payload as AgentOSResponse;
      const streamId = (chunk as any).streamId as string | undefined;
      if (streamId && byStream[streamId]) {
        const row = byStream[streamId];
        const stamp = new Date(e.timestamp).toLocaleTimeString();
        if (e.type === AgentOSChunkType.SYSTEM_PROGRESS) {
          const sp = chunk as AgentOSSystemProgressChunk;
          row.debugLines.push(`[${stamp}] progress: ${sp.message}${sp.progressPercentage != null ? ` (${sp.progressPercentage}%)` : ''}`);
        } else if (e.type === AgentOSChunkType.TOOL_CALL_REQUEST) {
          const tcr = chunk as AgentOSToolCallRequestChunk;
          row.debugLines.push(`[${stamp}] tool_call: ${tcr.toolCalls.map(tc => tc.name).join(', ')}`);
        } else if (e.type === AgentOSChunkType.TOOL_RESULT_EMISSION) {
          const tre = chunk as AgentOSToolResultEmissionChunk;
          row.debugLines.push(`[${stamp}] tool_result: ${tre.toolName} ${tre.isSuccess ? '✓' : '✕'}`);
        } else if (e.type === AgentOSChunkType.ERROR) {
          const err = chunk as any;
          row.debugLines.push(`[${stamp}] error: ${err.message || 'Unknown error'}`);
        }
        continue;
      }
    }

    // Fallback: push as a simple row
    rows.push({ kind: "event", id: e.id, timestamp: e.timestamp, type: e.type, payload: e.payload as any });
  }

  // Push all aggregated assistant rows into rows list
  for (const row of Object.values(byStream)) {
    rows.push(row);
  }

  // Render newest first (descending by timestamp/updatedAt)
  rows.sort((a, b) => {
    const ta = a.kind === "assistant" ? a.updatedAt : a.timestamp;
    const tb = b.kind === "assistant" ? b.updatedAt : b.timestamp;
    return tb - ta;
  });

  return rows;
}

export function SessionInspector() {
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const session = useSessionStore((state) => state.sessions.find((item) => item.id === state.activeSessionId));
  const removeSession = useSessionStore((s) => s.removeSession);
  const upsertSession = useSessionStore((s) => s.upsertSession);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const handleExport = () => {
    if (!session) return;
    const payload = {
      id: session.id,
      targetType: session.targetType,
      displayName: session.displayName,
      personaId: session.personaId,
      agencyId: session.agencyId,
      events: [...session.events].reverse() // chronological
    };
    const data = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentos-session-${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportAgency = () => {
    if (!session) return;
    const items = [...session.events]
      .reverse()
      .filter((e) => e.type === AgentOSChunkType.AGENCY_UPDATE)
      .map((e) => ({ timestamp: e.timestamp, ...(e.payload as any) }));
    const data = new Blob([JSON.stringify({ sessionId: session.id, agencyUpdates: items }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentos-agency-updates-${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportWorkflow = () => {
    if (!session) return;
    const items = [...session.events]
      .reverse()
      .filter((e) => e.type === AgentOSChunkType.WORKFLOW_UPDATE)
      .map((e) => ({ timestamp: e.timestamp, ...(e.payload as any) }));
    const data = new Blob([JSON.stringify({ sessionId: session.id, workflowUpdates: items }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentos-workflow-updates-${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!activeSessionId || !session) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/50">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Session timeline</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Output</h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400"></div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-400">
              Waiting for the first event. Use the left panel to compose a request.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/50">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Session timeline</p>
          {!renaming ? (
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{session.displayName}</h2>
          ) : (
            <div className="flex items-center gap-2">
              <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} className="rounded border border-slate-200 bg-white px-2 py-1 text-sm dark:border-white/10 dark:bg-slate-900" />
              <button type="button" onClick={() => { upsertSession({ id: session.id, displayName: nameDraft || 'Untitled' }); setRenaming(false); }} className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300">Save</button>
              <button type="button" onClick={() => setRenaming(false)} className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300">Cancel</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {!renaming && (
              <button
                type="button"
                onClick={() => { setNameDraft(session.displayName); setRenaming(true); }}
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/30"
                title="Rename session"
              >
                Rename
              </button>
            )}
            <div className="relative">
              <select
                aria-label="Export"
                title="Export options"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                onChange={(e) => {
                  const v = e.target.value; e.currentTarget.selectedIndex = 0; // reset
                  if (v === 'session') handleExport();
                  if (v === 'agency') handleExportAgency();
                  if (v === 'workflow') handleExportWorkflow();
                  if (v === 'all') exportAllData();
                }}
              >
                <option value="">Export…</option>
                <option value="session">Session</option>
                <option value="agency">Agency updates</option>
                <option value="workflow">Workflow trace</option>
                <option value="all">All data</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeSession(session.id)}
              className="rounded-full border border-rose-300 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-rose-700 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-300"
              title="Delete session"
            >
              Delete
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {session.events.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-400">
              Waiting for the first event. Use the composer to send a message or replay a transcript to populate the timeline.
            </div>
          ) : (
            buildAggregatedRows(session.events).map((row) => {
              if (row.kind === "assistant") {
                const isActive = !row.isFinal;
                return (
                  <div key={`assistant-${row.streamId}`} className={clsx("rounded-2xl border px-5 py-4", "border-sky-500/40 bg-sky-500/5 text-slate-100 dark:text-slate-100")}> 
                    <header className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold uppercase tracking-[0.35em]">Assistant</span>
                      <time>{new Date(row.updatedAt).toLocaleTimeString()}</time>
                    </header>
                    <StreamingText text={row.text} isActive={isActive} />
                    {row.debugLines.length > 0 && (
                      <details className="mt-3 rounded-lg border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-300">
                        <summary className="cursor-pointer select-none text-slate-200">Debug logs</summary>
                        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-slate-300">
{row.debugLines.join("\n")}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              }

              const chunkClass = chunkAccent[row.type] ?? "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/5 dark:bg-white/5 dark:text-slate-200";
              return (
                <Fragment key={row.id}>
                  <div className={clsx("rounded-2xl border px-5 py-4", chunkClass)}>
                    <header className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold uppercase tracking-[0.35em]">{row.type}</span>
                      <time>{new Date(row.timestamp).toLocaleTimeString()}</time>
                    </header>
                    {renderEventBody(row.type, row.payload)}
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
