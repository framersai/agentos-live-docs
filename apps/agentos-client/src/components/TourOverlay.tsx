import { useEffect, useMemo, useRef, useState } from 'react';

type Step = {
  selector: string;
  title: string;
  body: string;
  radius?: number;
};

interface TourOverlayProps {
  open: boolean;
  steps: Step[];
  onClose: () => void;
  onDontShowAgain?: () => void;
  onRemindLater?: () => void;
}

export function TourOverlay({ open, steps, onClose, onDontShowAgain, onRemindLater }: TourOverlayProps) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const step = steps[index];

  const measure = () => {
    if (!open) return;
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect(r);
  };

  useEffect(() => {
    if (!open) return;
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, step?.selector]);

  useEffect(() => {
    if (!open) setIndex(0);
  }, [open]);

  const pathD = useMemo(() => {
    // Build an SVG path that covers the screen then cuts out a rounded rect over target
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const outer = `M0,0 H${vw} V${vh} H0 Z`;
    if (!rect) return outer;
    const padding = 8;
    const x = Math.max(0, rect.x - padding);
    const y = Math.max(0, rect.y - padding);
    const w = Math.min(vw, rect.width + padding * 2);
    const h = Math.min(vh, rect.height + padding * 2);
    const r = step.radius ?? 12;
    const inner = `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`;
    return `${outer} ${inner}`;
  }, [rect, step?.radius]);

  if (!open) return null;

  const atStart = index === 0;
  const atEnd = index === steps.length - 1;

  // Tooltip position
  const tooltipStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: Math.min(rect.y + rect.height + 12, window.innerHeight - 140),
        left: Math.min(rect.x, window.innerWidth - 320),
        width: 300,
      }
    : { position: 'fixed', top: 24, right: 24, width: 320 };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[60]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <path d={pathD} fill="black" fillRule="evenodd" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="black" opacity="0.5" mask="url(#tour-mask)" />
      </svg>

      <div
        style={tooltipStyle}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl transition dark:border-white/10 dark:bg-slate-900"
      >
        <header className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
          >
            Close
          </button>
        </header>
        <p className="text-xs text-slate-600 dark:text-slate-300">{step.body}</p>
        <footer className="mt-3 flex items-center justify-between text-xs">
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


