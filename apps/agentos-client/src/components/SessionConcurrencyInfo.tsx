/**
 * @fileoverview Session Concurrency Info Component
 * @description Explains current single-action constraint and future concurrent conversation support.
 */

import { Info, Lock, Unlock, MessageSquare, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface SessionConcurrencyInfoProps {
  sessionStatus: 'idle' | 'streaming' | 'error';
  className?: string;
}

/**
 * Information panel explaining session concurrency constraints and future capabilities.
 * 
 * **Current Behavior:**
 * - Each session processes one action at a time
 * - While streaming, new requests are queued/blocked
 * - Prevents conversation state conflicts
 * 
 * **Future Concurrent Conversations:**
 * - Multiple parallel conversations within same session
 * - Each conversation maintains separate context
 * - AgentOS supports up to 1000 concurrent streams
 * - Multiple clients can subscribe to same stream
 * 
 * **Benefits:**
 * - Ask follow-up questions while previous request processes
 * - Multi-threaded discussions with same persona
 * - Parallel agency workflows without blocking
 */
export function SessionConcurrencyInfo({ sessionStatus, className = '' }: SessionConcurrencyInfoProps) {
  const [expanded, setExpanded] = useState(false);

  const isStreaming = sessionStatus === 'streaming';

  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-slate-900/40 ${className}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <Lock className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <Unlock className="h-3.5 w-3.5 text-emerald-500" />
          )}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {isStreaming ? 'Single Action Mode' : 'Ready for Requests'}
          </span>
        </div>
        <Info className={`h-3.5 w-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-slate-200 pt-3 dark:border-white/10">
          {/* Current Constraint */}
          <div>
            <h4 className="mb-1.5 flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
              <Lock className="h-3 w-3" />
              Current Behavior
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              This session processes <strong>one action at a time</strong>. While a request is streaming, 
              new requests are blocked to prevent conversation state conflicts and ensure coherent responses.
            </p>
          </div>

          {/* Future Concurrent Support */}
          <div>
            <h4 className="mb-1.5 flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
              <Unlock className="h-3 w-3" />
              Concurrent Conversations (Future)
            </h4>
            <p className="mb-2 text-slate-600 dark:text-slate-400">
              AgentOS supports <strong>concurrent conversations</strong> within the same session:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Multiple parallel threads:</strong> Ask follow-up questions while previous requests process
              </li>
              <li>
                <strong>Separate conversation contexts:</strong> Each thread maintains its own history and state
              </li>
              <li>
                <strong>Up to 1000 concurrent streams:</strong> AgentOS can handle many simultaneous interactions
              </li>
              <li>
                <strong>Multi-client subscriptions:</strong> Multiple UI components can listen to the same stream
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="mb-1.5 flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
              <Zap className="h-3 w-3" />
              Benefits
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 h-3 w-3 flex-shrink-0 text-sky-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Multi-threaded discussions with the same persona
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-3 w-3 flex-shrink-0 text-purple-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Parallel agency workflows without blocking
                </span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="rounded border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Technical Details
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              AgentOS uses <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">StreamingManager</code> with 
              configurable concurrency limits. Each conversation thread gets a unique <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">conversationId</code> 
              while sharing the same <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">sessionId</code> for UI grouping.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

