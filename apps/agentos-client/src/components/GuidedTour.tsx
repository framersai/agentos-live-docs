import { useEffect, useState } from "react";

interface GuidedTourProps {
  open: boolean;
  onClose: () => void;
  onDontShowAgain?: () => void;
  onRemindLater?: () => void;
}

const steps: Array<{ title: string; body: string }> = [
  {
    title: "Compose",
    body: "Write a prompt, choose Persona or Agency, and submit to start a session.",
  },
  {
    title: "Agency",
    body: "Define a multi-seat collective. Seats map roles to personas and can attach workflows.",
  },
  {
    title: "Personas",
    body: "Browse remote personas (read-only) and create local ones. Local edits are stored in your browser.",
  },
  {
    title: "Workflows",
    body: "See available workflow definitions and monitor active workflow status from updates.",
  },
  {
    title: "Outputs",
    body: "Session timeline on the right shows streaming text, tool results, agency and workflow updates.",
  },
  {
    title: "Theme & Appearance",
    body: "Switch between Light/Dark/System and adjust appearance (Default/Compact/High contrast).",
  },
];

export function GuidedTour({ open, onClose, onDontShowAgain, onRemindLater }: GuidedTourProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) setIndex(0);
  }, [open, setIndex]);

  if (!open) return null;

  const atStart = index === 0;
  const atEnd = index === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <header className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick tour</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
          >
            Close
          </button>
        </header>
        <div className="mb-4 text-sm text-slate-700 dark:text-slate-200">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{steps[index].title}</p>
          <p className="mt-2">{steps[index].body}</p>
        </div>
        <footer className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Step {index + 1} / {steps.length}</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIndex(Math.max(0, index - 1))}
              disabled={atStart}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
            >
              Back
            </button>
            {onRemindLater && (
              <button
                type="button"
                onClick={() => { onRemindLater?.(); onClose(); }}
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
              >
                Remind me later
              </button>
            )}
            {onDontShowAgain && (
              <button
                type="button"
                onClick={() => { onDontShowAgain?.(); onClose(); }}
                className="rounded-full border border-rose-300 px-3 py-1 text-rose-700 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-300"
              >
                Don’t show again
              </button>
            )}
            {!atEnd ? (
              <button
                type="button"
                onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
                className="rounded-full bg-sky-500 px-3 py-1 font-semibold text-white"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-emerald-500 px-3 py-1 font-semibold text-white"
              >
                Done
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
