import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Paperclip, Play, Sparkle, Users } from "lucide-react";
import { useSessionStore, type SessionTargetType } from "@/state/sessionStore";

const requestSchema = z
  .object({
    targetType: z.enum(["persona", "agency"]),
    personaId: z.string().optional(),
    agencyId: z.string().optional(),
    input: z.string().min(1, "Provide some user input"),
    mode: z.enum(["chat", "voice"]),
    workflowId: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.targetType === "persona" && !data.personaId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select a persona", path: ["personaId"] });
    }
    if (data.targetType === "agency" && !data.agencyId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select an agency", path: ["agencyId"] });
    }
  });

export type RequestComposerPayload = z.infer<typeof requestSchema>;

interface RequestComposerProps {
  onSubmit: (payload: RequestComposerPayload) => void;
}

export function RequestComposer({ onSubmit }: RequestComposerProps) {
  const [isStreaming, setStreaming] = useState(false);
  const personas = useSessionStore((state) => state.personas);
  const agencies = useSessionStore((state) => state.agencies);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const activeAgencyId = useSessionStore((state) => state.activeAgencyId);
  const setActiveAgency = useSessionStore((state) => state.setActiveAgency);

  const defaultPersonaId = personas[0]?.id ?? "";
  const fallbackAgencyId = agencies[0]?.id ?? "";
  const defaultAgencyId = activeAgencyId ?? fallbackAgencyId;
  const initialTarget: SessionTargetType = agencies.length > 0 ? "agency" : "persona";

  const form = useForm<RequestComposerPayload>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      targetType: initialTarget,
      personaId: initialTarget === "persona" ? defaultPersonaId : undefined,
      agencyId: initialTarget === "agency" ? defaultAgencyId : undefined,
      input: "What's the next task for our audio pipeline?",
      mode: "chat"
    }
  });

  const targetType = form.watch("targetType");
  const personaId = form.watch("personaId");
  const agencyId = form.watch("agencyId");
  const { errors } = form.formState;

  useEffect(() => {
    if (targetType === "persona" && !personaId && personas[0]) {
      form.setValue("personaId", personas[0].id, { shouldValidate: true });
    }
    if (targetType === "agency" && (!agencyId || !agencies.some((item) => item.id === agencyId))) {
      const fallback = activeAgencyId ?? agencies[0]?.id;
      if (fallback) {
        form.setValue("agencyId", fallback, { shouldValidate: true });
      }
    }
  }, [targetType, personaId, agencyId, personas, agencies, activeAgencyId, form]);

  useEffect(() => {
    if (targetType === "agency" && agencyId) {
      setActiveAgency(agencyId);
    }
  }, [targetType, agencyId, setActiveAgency]);

  useEffect(() => {
    if (personas.length === 0 && targetType === "persona") {
      form.setValue("targetType", "agency");
    }
  }, [personas, targetType, form]);

  useEffect(() => {
    if (agencies.length === 0 && targetType === "agency") {
      form.setValue("targetType", "persona");
    }
  }, [agencies, targetType, form]);

  const personaOptions = useMemo(
    () =>
      personas.map((persona) => ({
        id: persona.id,
        label: persona.displayName
      })),
    [personas]
  );

  const agencyOptions = useMemo(
    () =>
      agencies.map((agency) => ({
        id: agency.id,
        label: agency.name
      })),
    [agencies]
  );

  const processSubmission = (values: RequestComposerPayload) => {
    setStreaming(true);
    if (values.targetType === "agency") {
      setActiveAgency(values.agencyId ?? null);
    }
    onSubmit(values);
    setTimeout(() => setStreaming(false), 600);
  };

  const handleSubmit = form.handleSubmit(processSubmission);

  const handleReplay = () => {
    void form.handleSubmit((values) => processSubmission({ ...values, input: "? Replay transcript" }))();
  };

  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Request composer</p>
        <h2 className="text-lg font-semibold text-slate-100">Prototype turns and replay transcripts</h2>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        <fieldset className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <legend className="sr-only">Target</legend>
          {(["persona", "agency"] as const).map((value) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                value={value}
                {...form.register("targetType")}
                disabled={value === "agency" && agencies.length === 0}
                className="h-3 w-3 border-white/20 bg-slate-950 text-sky-500 focus:ring-sky-500 disabled:opacity-30"
              />
              {value.toUpperCase()}
            </label>
          ))}
          {agencies.length === 0 && (
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Create an agency to enable collectives</span>
          )}
        </fieldset>

        {targetType === "persona" ? (
          <label className="space-y-2 text-sm text-slate-300">
            Persona
            <select
              {...form.register("personaId")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              <option value="" disabled>
                Select a persona
              </option>
              {personaOptions.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.label}
                </option>
              ))}
            </select>
            {errors.personaId && <p className="text-xs text-rose-300">{errors.personaId.message}</p>}
          </label>
        ) : (
          <label className="space-y-2 text-sm text-slate-300">
            Agency
            <select
              {...form.register("agencyId", {
                onChange: (event) => setActiveAgency(event.target.value || null)
              })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              <option value="" disabled>
                Select an agency
              </option>
              {agencyOptions.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.label}
                </option>
              ))}
            </select>
            {errors.agencyId && <p className="text-xs text-rose-300">{errors.agencyId.message}</p>}
          </label>
        )}

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

        {targetType === "agency" && (
          <p className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs text-sky-100">
            <Users className="h-3 w-3 text-sky-300" />
            Streaming will include AGENCY_UPDATE chunks for seat coordination.
          </p>
        )}

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
            onClick={handleReplay}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400/40"
            disabled={!activeSessionId}
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
