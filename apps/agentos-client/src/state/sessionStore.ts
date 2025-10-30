import { create } from "zustand";
import type { AgentOSAgencyUpdateChunk, AgentOSResponse } from "@agentos/core";

export type SessionEvent = {
  id: string;
  timestamp: number;
  type: AgentOSResponse["type"] | "log";
  payload: AgentOSResponse | { message: string; level?: "info" | "warning" | "error" };
};

export type SessionTargetType = "persona" | "agency";

export interface PersonaDefinition {
  id: string;
  displayName: string;
  description?: string;
  archetype?: string;
  tags?: string[];
  traits?: string[];
  capabilities?: string[];
  metadata?: Record<string, unknown>;
}

export interface AgencyParticipantDefinition {
  roleId: string;
  personaId?: string;
  notes?: string;
}

export interface AgencyDefinition {
  id: string;
  name: string;
  goal?: string;
  workflowId?: string;
  participants: AgencyParticipantDefinition[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgentSession {
  id: string;
  targetType: SessionTargetType;
  displayName: string;
  personaId?: string;
  agencyId?: string;
  status: "idle" | "streaming" | "error";
  events: SessionEvent[];
}

type SessionUpdate = Partial<Omit<AgentSession, "id">> & Pick<AgentSession, "id">;

interface SessionState {
  sessions: AgentSession[];
  personas: PersonaDefinition[];
  agencies: AgencyDefinition[];
  agencySessions: Record<string, AgentOSAgencyUpdateChunk["agency"]>;
  activeSessionId: string | null;
  activeAgencyId: string | null;
  upsertSession: (session: SessionUpdate) => void;
  appendEvent: (sessionId: string, event: SessionEvent) => void;
  setActiveSession: (sessionId: string) => void;
  addPersona: (persona: PersonaDefinition) => void;
  updatePersona: (personaId: string, updates: Partial<PersonaDefinition>) => void;
  removePersona: (personaId: string) => void;
  addAgency: (agency: AgencyDefinition) => void;
  updateAgency: (agencyId: string, updates: Partial<AgencyDefinition>) => void;
  removeAgency: (agencyId: string) => void;
  setActiveAgency: (agencyId: string | null) => void;
  applyAgencySnapshot: (agency: AgentOSAgencyUpdateChunk["agency"]) => void;
}

const defaultPersonas: PersonaDefinition[] = [
  {
    id: "atlas-systems-architect",
    displayName: "Atlas Systems Architect",
    description: "Designs resilient multi-agent topologies and long-running workflows.",
    tags: ["systems", "architecture"],
    traits: ["Analytical", "Calm", "Long-horizon planning"],
    capabilities: ["workflow-authoring", "policy-audits"],
    metadata: { tier: "pro" }
  },
  {
    id: "meridian-product-strategist",
    displayName: "Meridian Product Strategist",
    description: "Synthesises customer signals and agent telemetry into actionable roadmaps.",
    tags: ["product", "strategy"],
    traits: ["Collaborative", "Outcomes-first"],
    capabilities: ["insight-synthesis", "agency-briefing"]
  },
  {
    id: "solstice-research-analyst",
    displayName: "Solstice Research Analyst",
    description: "Conducts rapid literature reviews and evaluates emergent agency behaviour.",
    tags: ["research", "analysis"],
    traits: ["Curious", "Rigorous"],
    capabilities: ["rag", "agency-observation"]
  }
];

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  personas: defaultPersonas,
  agencies: [],
  agencySessions: {},
  activeSessionId: null,
  activeAgencyId: null,
  upsertSession: (session) =>
    set((state) => {
      const existingIndex = state.sessions.findIndex((s) => s.id === session.id);
      if (existingIndex === -1) {
        const nextSession: AgentSession = {
          id: session.id,
          targetType: session.targetType ?? "persona",
          displayName: session.displayName ?? "Untitled session",
          personaId: session.personaId,
          agencyId: session.agencyId,
          status: session.status ?? "idle",
          events: session.events ?? []
        };
        return { sessions: [nextSession, ...state.sessions].slice(0, 25) };
      }
      const nextSessions = [...state.sessions];
      nextSessions[existingIndex] = {
        ...nextSessions[existingIndex],
        ...session,
        events: session.events ?? nextSessions[existingIndex].events
      };
      return { sessions: nextSessions };
    }),
  appendEvent: (sessionId, event) =>
    set((state) => {
      const nextSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              events: [event, ...session.events].slice(0, 200)
            }
          : session
      );
      return { sessions: nextSessions };
    }),
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
  addPersona: (persona) =>
    set((state) => {
      const exists = state.personas.some((item) => item.id === persona.id);
      const personas = exists
        ? state.personas.map((item) => (item.id === persona.id ? { ...item, ...persona } : item))
        : [persona, ...state.personas];
      return { personas };
    }),
  updatePersona: (personaId, updates) =>
    set((state) => ({
      personas: state.personas.map((persona) => (persona.id === personaId ? { ...persona, ...updates } : persona))
    })),
  removePersona: (personaId) =>
    set((state) => ({
      personas: state.personas.filter((persona) => persona.id !== personaId),
      agencies: state.agencies.map((agency) => ({
        ...agency,
        participants: agency.participants.map((participant) =>
          participant.personaId === personaId ? { ...participant, personaId: undefined } : participant
        )
      }))
    })),
  addAgency: (agency) =>
    set((state) => {
      const exists = state.agencies.some((item) => item.id === agency.id);
      const agencies = exists
        ? state.agencies.map((item) => (item.id === agency.id ? { ...item, ...agency, updatedAt: agency.updatedAt } : item))
        : [agency, ...state.agencies];
      return { agencies, activeAgencyId: agency.id };
    }),
  updateAgency: (agencyId, updates) =>
    set((state) => ({
      agencies: state.agencies.map((agency) =>
        agency.id === agencyId
          ? {
              ...agency,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : agency
      )
    })),
  removeAgency: (agencyId) =>
    set((state) => ({
      agencies: state.agencies.filter((agency) => agency.id !== agencyId),
      activeAgencyId: state.activeAgencyId === agencyId ? null : state.activeAgencyId
    })),
  setActiveAgency: (agencyId) => set({ activeAgencyId: agencyId }),
  applyAgencySnapshot: (agency) =>
    set((state) => ({
      agencySessions: {
        ...state.agencySessions,
        [agency.agencyId]: agency
      }
    }))
}));
