// File: frontend/src/services/agent.service.ts
/**
 * @file agent.service.ts
 * @description Service for managing AI agent definitions and configurations.
 * @version 1.3.2 - Finalized IAgentDefinition with robust capabilities, iconPath, examplePrompts, and isPublic.
 * All AGENT_DEFINITIONS updated to conform. AgentId type includes all necessary IDs.
 */

import { type Component as VueComponentType } from 'vue';
import {
  AcademicCapIcon, BeakerIcon, BoltIcon, BookOpenIcon, BriefcaseIcon, BugAntIcon,
  ChatBubbleLeftEllipsisIcon, CodeBracketIcon, CommandLineIcon, CpuChipIcon,
  CubeTransparentIcon, DocumentTextIcon, LightBulbIcon, MagnifyingGlassIcon,
  PaintBrushIcon, PencilSquareIcon, PuzzlePieceIcon, RectangleGroupIcon,
  ScaleIcon, SparklesIcon, SquaresPlusIcon, UserGroupIcon, VariableIcon, WrenchScrewdriverIcon,
  InformationCircleIcon,
  HomeIcon // Keep HomeIcon for potential default
} from '@heroicons/vue/24/outline';

export interface IAgentVoicePersona {
  name?: string;
  voiceId?: string;
  lang?: string;
}

export interface IAgentCapabilities {
  maxChatHistory?: number;
  canGenerateDiagrams?: boolean;
  usesCompactRenderer?: boolean;
  supportsAutoClear?: boolean;
  canUseTools?: boolean;
  proficientTools?: string[];
  handlesOwnInput?: boolean; // If true, the agent's UI component handles input and API calls
}

export interface IAgentDefinition {
  id: AgentId;
  label: string;
  description: string;
  systemPromptKey: string;
  inputPlaceholder: string;
  uiComponent?: string | (() => Promise<VueComponentType>);
  icon?: VueComponentType;
  iconClass?: string;
  avatar?: string; // e.g., 'general_avatar.png' (resolved from public/assets/avatars/)
  iconPath?: string; // e.g., '/assets/agent-icons/general-icon.svg' (for ChatWindow welcome)
  examplePrompts?: string[]; // For ChatWindow welcome
  themeColor?: string; // CSS variable or direct value
  holographicElement?: string; // Identifier for specific holographic styling
  defaultVoicePersona?: IAgentVoicePersona | string;
  capabilities?: IAgentCapabilities; // All capability flags nested here
  isPublic?: boolean; // Standardized for public availability
  sortOrder?: number;
}

export type AgentId =
  | 'general'
  | 'codingAssistant'
  | 'systemsDesigner'
  | 'codingInterviewer'
  | 'tutorAgent'
  | 'diaryAgent'
  | 'meetingSummarizer'
  | 'businessMeetingAgent' // Ensures this is a valid AgentId
  | 'customAgent1'
  | 'publicReadOnlyAgent'
  | 'system-error'
  | 'private-dashboard-placeholder'
  | 'public-welcome-placeholder'
  | 'no-public-agents-placeholder'
  | 'rate-limit-exceeded';

const AGENT_DEFINITIONS: ReadonlyArray<IAgentDefinition> = [
  {
    id: 'general', label: 'General Assistant',
    description: 'Versatile AI for queries and discussions.',
    systemPromptKey: 'general_chat', inputPlaceholder: 'Ask anything...',
    icon: ChatBubbleLeftEllipsisIcon, iconClass: 'text-sky-500 bg-sky-500/10',
    avatar: 'general_avatar.png', iconPath: '/assets/agent-icons/general.svg',
    examplePrompts: ["Explain black holes", "Ideas for a healthy dinner?", "Tell me a joke"],
    capabilities: { maxChatHistory: 10, canGenerateDiagrams: true, usesCompactRenderer: false, handlesOwnInput: false, supportsAutoClear: true },
    isPublic: true, sortOrder: 1,
  },
  {
    id: 'codingAssistant', label: 'Coding Co-Pilot',
    description: 'Your AI pair programmer for code, debugging, and explanations.',
    systemPromptKey: 'coding', inputPlaceholder: 'Describe your coding task...',
    uiComponent: () => import('@/components/agents/CodingAgentView.vue'),
    icon: CodeBracketIcon, iconClass: 'text-emerald-500 bg-emerald-500/10',
    avatar: 'coding_avatar.png', iconPath: '/assets/agent-icons/coding.svg',
    examplePrompts: ["Python function to sort a list", "Debug this JS snippet", "Explain closures"],
    capabilities: { maxChatHistory: 20, canGenerateDiagrams: true, usesCompactRenderer: true, handlesOwnInput: true, supportsAutoClear: false, canUseTools: true, proficientTools: ['code_interpreter'] },
    isPublic: false, sortOrder: 10,
  },
  {
    id: 'systemsDesigner', label: 'Systems Architect',
    description: 'Design software systems, architectures, and discuss trade-offs.',
    systemPromptKey: 'system_design', inputPlaceholder: 'Describe the system to design...',
    uiComponent: () => import('@/components/agents/SystemsDesignAgentView.vue'),
    icon: CubeTransparentIcon, iconClass: 'text-purple-500 bg-purple-500/10',
    avatar: 'systems_avatar.png', iconPath: '/assets/agent-icons/systems.svg',
    examplePrompts: ["Design a scalable chat app", "Microservices vs Monolith for e-commerce", "CAP theorem explained"],
    capabilities: { maxChatHistory: 15, canGenerateDiagrams: true, usesCompactRenderer: true, handlesOwnInput: true, supportsAutoClear: true },
    isPublic: false, sortOrder: 20,
  },
  {
    id: 'businessMeetingAgent', label: 'Meeting Facilitator',
    description: 'Helps prepare for, run, and summarize business meetings.',
    systemPromptKey: 'meeting', inputPlaceholder: 'What about your meeting?',
    uiComponent: () => import('@/components/agents/BusinessMeetingAgentView.vue'),
    icon: BriefcaseIcon, iconClass: 'text-blue-500 bg-blue-500/10',
    avatar: 'meeting_avatar.png', iconPath: '/assets/agent-icons/meeting.svg',
    examplePrompts: ["Generate agenda for project kickoff", "Summarize these notes...", "Remote meeting best practices"],
    capabilities: { maxChatHistory: 10, canGenerateDiagrams: false, usesCompactRenderer: true, handlesOwnInput: true, supportsAutoClear: true },
    isPublic: false, sortOrder: 30,
  },
  {
    id: 'codingInterviewer', label: 'Coding Interviewer',
    description: 'Practice coding interview questions and get feedback.',
    systemPromptKey: 'coding_interviewer', inputPlaceholder: 'Ready for a mock interview?',
    uiComponent: () => import('@/components/agents/CodingInterviewerAgentView.vue'),
    icon: UserGroupIcon, iconClass: 'text-indigo-500 bg-indigo-500/10',
    avatar: 'interviewer_avatar.png', iconPath: '/assets/agent-icons/interviewer.svg',
    examplePrompts: ["Start Python interview", "Medium array question", "Review my Fibonacci solution"],
    capabilities: { maxChatHistory: 25, canGenerateDiagrams: false, usesCompactRenderer: true, handlesOwnInput: true, supportsAutoClear: false },
    isPublic: false, sortOrder: 40,
  },
  {
    id: 'diaryAgent', label: 'Personal Diary',
    description: 'A private space for your thoughts and reflections.',
    systemPromptKey: 'diary', inputPlaceholder: 'What\'s on your mind today?',
    uiComponent: () => import('@/components/agents/DiaryAgentView.vue'),
    icon: BookOpenIcon, iconClass: 'text-rose-500 bg-rose-500/10',
    avatar: 'diary_avatar.png', iconPath: '/assets/agent-icons/diary.svg',
    examplePrompts: ["Today I felt...", "Reflecting on my week...", "An idea I had:"],
    capabilities: { maxChatHistory: 50, canGenerateDiagrams: false, usesCompactRenderer: false, handlesOwnInput: true, supportsAutoClear: true },
    isPublic: false, sortOrder: 50, // Typically private
  },
  // Fallback Public Agent if General is not Public for some reason
  {
    id: 'publicReadOnlyAgent', label: 'Info Assistant',
    description: 'Provides information based on pre-defined knowledge. Read-only interactions.',
    systemPromptKey: 'general_chat', // Can reuse or have a specific one
    inputPlaceholder: 'Ask a question...',
    icon: InformationCircleIcon, iconClass: 'text-gray-500 bg-gray-500/10',
    avatar: 'public_avatar.png', iconPath: '/assets/agent-icons/public-info.svg',
    examplePrompts: ["What is this app?", "How does voice input work?"],
    capabilities: { maxChatHistory: 2, canGenerateDiagrams: false, usesCompactRenderer: false, handlesOwnInput: false, supportsAutoClear: true },
    isPublic: true, sortOrder: 100, // Lower priority if general is public
  },
];

class AgentService {
  private agents: ReadonlyArray<IAgentDefinition>;
  private defaultAgent: Readonly<IAgentDefinition>;
  private defaultPublicAgent: Readonly<IAgentDefinition>;

  constructor(definitions: ReadonlyArray<IAgentDefinition>) {
    this.agents = Object.freeze([...definitions].sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)));
    
    const generalAgent = this.agents.find(a => a.id === 'general');
    if (!generalAgent) {
      console.error("Critical: 'general' agent definition is missing. Falling back to first agent.");
      this.defaultAgent = this.agents[0];
      if (!this.defaultAgent) throw new Error("AgentService: No agents defined.");
    } else {
      this.defaultAgent = generalAgent;
    }
    
    const publicGeneral = this.agents.find(a => a.id === 'general' && a.isPublic);
    this.defaultPublicAgent = publicGeneral || this.agents.find(a => a.isPublic) || this.defaultAgent;

    if (!this.defaultPublicAgent) {
        console.warn("AgentService: No specifically public default agent found. Falling back to overall default.");
        this.defaultPublicAgent = this.defaultAgent;
    }
  }

  public getAllAgents(): ReadonlyArray<IAgentDefinition> { return this.agents; }
  public getPublicAgents(): ReadonlyArray<IAgentDefinition> { return this.agents.filter(agent => agent.isPublic); }
  public getAgentById(agentId: AgentId): Readonly<IAgentDefinition> | undefined { return this.agents.find(agent => agent.id === agentId); }
  public getDefaultAgent(): Readonly<IAgentDefinition> { return this.defaultAgent; }
  public getDefaultPublicAgent(): Readonly<IAgentDefinition> { return this.defaultPublicAgent; }
}

export const agentService = new AgentService(AGENT_DEFINITIONS);