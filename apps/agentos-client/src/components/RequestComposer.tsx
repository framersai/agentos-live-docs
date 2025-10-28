import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Paperclip, Play, Sparkle } from "lucide-react";
import { useSessionStore } from "@/state/sessionStore";

const requestSchema = z.object({
  persona: z.string().min(1, "Persona id required"),
  input: z.string().min(1, "Provide some user input"),
  mode: z.enum(["chat", "voice"])
});

type RequestSchema = z.infer<typeof requestSchema>;

interface RequestComposerProps {
  onSubmit: (payload: RequestSchema) => void;
}

export function RequestComposer({ onSubmit }: RequestComposerProps) {
  const [isStreaming, setStreaming] = useState(false);
  const form = useForm<RequestSchema>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      persona: "atlas-systems-architect",
      input: "What’s the next task for our audio pipeline?",
      mode: "chat"
    }
  });

  const activeSessionId = useSessionStore((state) => state.activeSessionId);

  const handleSubmit = form.handleSubmit((values) => {
    setStreaming(true);
    onSubmit(values);
    setTimeout(() => setStreaming(false), 600); // optimistic UX until wiring to backend
  });

  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Request composer</p>
        <h2 className="text-lg font-semibold text-slate-100">Prototype turns and replay transcripts</h2>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        <label className="space-y-2 text-sm text-slate-300">
          Persona id
          <input
            type="text"
            {...form.register("persona")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-1 flex-col space-y-2 text-sm text-slate-300">
          User input
          <textarea
            rows={6}
            {...form.register("input")}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </label>
        <fieldset className="flex items-center gap-4 text-xs text-slate-400">
          <legend className="sr-only">Mode</legend>
          {(["chat", "voice"] as const).map((mode) => (
            <label key={mode} className="inline-flex items-center gap-2">
              <input
                type="radio"
                value={mode}
                {...form.register("mode")}
                className="h-3 w-3 border-white/20 bg-slate-950 text-sky-500 focus:ring-sky-500"
              />
              {mode.toUpperCase()}
            </label>
          ))}
        </fieldset>
        <div className="mt-auto flex flex-col gap-3 text-xs text-slate-400">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5"
            disabled={isStreaming}
          >
            <Play className="h-4 w-4" />
            {isStreaming ? "Streaming..." : "Send to AgentOS"}
          </button>
          <button
            type="button"
            onClick={() => activeSessionId && onSubmit({ persona: form.getValues("persona"), input: "? Replay transcript", mode: "chat" })}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400/40"
          >
            <Paperclip className="h-4 w-4" /> Attach transcript snapshot
          </button>
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <Sparkle className="mt-0.5 h-3 w-3 text-sky-400" />
            Workbench requests stay local. Wire this UI to your dev API to drive real @agentos/core sessions.
          </div>
        </div>
      </form>
    </div>
  );
}
