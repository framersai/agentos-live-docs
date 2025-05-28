/**
 * @file agent.service.ts
 * @description Defines available AI agents, their configurations, and capabilities.
 * Manages the registry of agents for the application.
 * @version 1.3.2 - Added 'showEphemeralChatLog' capability and refined default agent logic.
 */

import type { Component as VueComponentType, FunctionalComponent, ComputedOptions, MethodOptions } from 'vue';
import {
  ChatBubbleLeftEllipsisIcon,
  CodeBracketSquareIcon,
  UserCircleIcon,
  BookOpenIcon,
  CpuChipIcon,
  AcademicCapIcon,
  DocumentMagnifyingGlassIcon,
  BriefcaseIcon,
  CogIcon,      // Generic capability icon
  SparklesIcon, // Generic fallback / placeholder icon
  PresentationChartLineIcon, // For LC-Audit detailed capability
} from '@heroicons/vue/24/outline';

export type AgentId =
  | 'general_chat'         // "Nerf"
  | 'public-quick-helper'
  | 'coding_assistant'     // "CodePilot"
  | 'system_designer'      // "Architecton"
  | 'meeting_summarizer'   // "Meeting Scribe"
  | 'diary_agent'          // "Echo"
  | 'coding_interviewer'   // "AI Interviewer"
  | 'tutor_agent'          // "Professor Astra"
  | 'lc_audit_aide'        // New Agent ID
  // Placeholder/System IDs from errors
  | 'private-dashboard-placeholder'
  | 'rate-limit-exceeded'
  | 'public-welcome-placeholder'
  | 'no-public-agents-placeholder'
  | 'system-error'
  // Legacy/Alias IDs (ensure these are handled or migrated in calling code if possible)
  | 'general'              // Alias for general_chat
  | 'general-ai';          // Alias for general_chat

export interface IDetailedCapabilityItem {
  id: string;
  label: string;
  description?: string;
  icon?: VueComponentType | string;
}

export interface IAgentCapability {
  canGenerateDiagrams?: boolean;
  usesCompactRenderer?: boolean;
  acceptsVoiceInput?: boolean;
  maxChatHistory?: number;
  handlesOwnInput?: boolean;      // If true, the agent's dedicated view component handles user input directly
  showEphemeralChatLog?: boolean; // If false, the top floating ephemeral chat log will be hidden for this agent
}

export type AgentCategory = 'General' | 'Coding' | 'Productivity' | 'Learning' | 'Auditing' | 'Experimental' | 'Utility';

export interface IAgentDefinition {
  id: AgentId;
  label: string;
  description: string;
  longDescription?: string; // Optional: For more detailed info popups/modals
  iconComponent?: VueComponentType | string;
  iconClass?: string;
  avatar?: string; // Optional: Legacy or specific use for image path
  iconPath?: string; // Optional: Legacy or specific use for image path
  systemPromptKey: string;
  category: AgentCategory;
  capabilities: IAgentCapability;
  examplePrompts?: string[];
  tags?: string[];
  detailedCapabilities?: IDetailedCapabilityItem[];
  inputPlaceholder?: string;
  isPublic: boolean; // Determines if agent is available in public (non-authenticated) mode
  accessTier?: 'public' | 'member' | 'premium'; // For potential future tiered access
  themeColor?: string; // Optional: A hint for UI theming if needed beyond global theme
  holographicElement?: string; // Optional: Specific visual cue for this agent
  defaultVoicePersona?: string | { name?: string, voiceId?: string, lang?: string }; // Preferred TTS persona
  isBeta?: boolean;
  viewComponentName?: string; // Name of the dedicated Vue component for this agent's UI
}

const agents: IAgentDefinition[] = [
  {
    id: 'general_chat',
    label: 'Nerf',
    description: 'Your friendly general assistant for quick questions and information. Streamlined for efficiency.',
    iconComponent: ChatBubbleLeftEllipsisIcon,
    iconClass: 'text-orange-400 dark:text-orange-500', // Nerf's accent
    systemPromptKey: 'general_chat',
    category: 'General',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 8, showEphemeralChatLog: true },
    examplePrompts: ["What's the capital of Japan?", "Explain the theory of relativity simply.", "How do I make a good cup of coffee?"],
    tags: ['general knowledge', 'q&a', 'information', 'quick help', 'concise'],
    inputPlaceholder: 'Ask Nerf a quick question...',
    isPublic: true,
    accessTier: 'public',
  },
  { // Alias for 'general', maps to 'general_chat'
    id: 'general',
    label: 'Nerf (General)', // Label for clarity if this ID is ever directly shown
    description: 'General purpose assistant for quick questions. (Alias for Nerf)',
    iconComponent: ChatBubbleLeftEllipsisIcon,
    iconClass: 'text-orange-400 dark:text-orange-500',
    systemPromptKey: 'general_chat',
    category: 'General',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 8, showEphemeralChatLog: true },
    isPublic: true, accessTier: 'public',
  },
  { // Alias for 'general-ai'
    id: 'general-ai',
    label: 'Nerf (AI General)',
    description: 'General purpose AI assistant. (Alias for Nerf)',
    iconComponent: ChatBubbleLeftEllipsisIcon,
    iconClass: 'text-orange-400 dark:text-orange-500',
    systemPromptKey: 'general_chat',
    category: 'General',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 8, showEphemeralChatLog: true },
    isPublic: true, accessTier: 'public',
  },
  {
    id: 'public-quick-helper',
    label: 'Quick Helper',
    description: 'A streamlined public assistant for very brief answers to common questions.',
    iconComponent: SparklesIcon,
    iconClass: 'text-sky-400 dark:text-sky-500',
    systemPromptKey: 'general_chat', // Could have its own highly constrained prompt
    category: 'Utility',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: false, acceptsVoiceInput: true, maxChatHistory: 2, showEphemeralChatLog: true },
    inputPlaceholder: 'Ask a very short question...',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'coding_assistant',
    label: 'CodePilot',
    description: 'Expert coding assistance, debugging, and explanations across multiple languages.',
    iconComponent: CodeBracketSquareIcon,
    iconClass: 'text-rose-400 dark:text-rose-500',
    systemPromptKey: 'coding',
    category: 'Coding',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 15, showEphemeralChatLog: true, handlesOwnInput: true },
    examplePrompts: ["How to implement quicksort in Python?", "Debug this C++ snippet.", "Explain JavaScript closures."],
    tags: ['programming', 'dev', 'code', 'debug', 'algorithms', 'data structures'],
    inputPlaceholder: 'Ask CodePilot about code...',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'system_designer',
    label: 'Architecton',
    description: 'Collaboratively design and diagram complex software and system architectures.',
    iconComponent: CpuChipIcon,
    iconClass: 'text-indigo-400 dark:text-indigo-500',
    systemPromptKey: 'system_design',
    category: 'Coding',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 12, handlesOwnInput: true, showEphemeralChatLog: true },
    inputPlaceholder: 'Describe the system to design...',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'meeting_summarizer',
    label: 'Meeting Scribe',
    description: 'Processes your meeting notes or transcripts into clear, structured summaries with action items.',
    iconComponent: BriefcaseIcon,
    iconClass: 'text-cyan-400 dark:text-cyan-500',
    systemPromptKey: 'meeting',
    category: 'Productivity',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 5, handlesOwnInput: true, showEphemeralChatLog: false },
    inputPlaceholder: 'Paste notes or dictate discussion for summary...',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'diary_agent',
    label: 'Echo',
    description: 'Your personal, empathetic AI diary and notetaker for reflection and organizing thoughts.',
    iconComponent: BookOpenIcon,
    iconClass: 'text-purple-400 dark:text-purple-500',
    systemPromptKey: 'diary',
    category: 'Productivity',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: false, acceptsVoiceInput: true, maxChatHistory: 20, handlesOwnInput: true, showEphemeralChatLog: true },
    inputPlaceholder: 'Share your thoughts with Echo...',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'coding_interviewer',
    label: 'AI Interviewer',
    description: 'Simulates a technical coding interview, providing problems and evaluating solutions.',
    iconComponent: UserCircleIcon,
    iconClass: 'text-purple-500 dark:text-purple-600',
    systemPromptKey: 'coding_interviewer',
    category: 'Learning',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 20, handlesOwnInput: true, showEphemeralChatLog: true },
    inputPlaceholder: 'Ready for your mock coding interview?',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'tutor_agent',
    label: 'Professor Astra',
    description: 'Your adaptive AI tutor for exploring subjects and mastering concepts.',
    iconComponent: AcademicCapIcon,
    iconClass: 'text-amber-500 dark:text-amber-400',
    systemPromptKey: 'tutor',
    category: 'Learning',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 15, handlesOwnInput: true, showEphemeralChatLog: true },
    inputPlaceholder: 'What topic shall we learn today?',
    isPublic: true,
    accessTier: 'public',
  },
  {
    id: 'lc_audit_aide',
    label: 'LC-Audit',
    description: 'In-depth LeetCode problem analysis and interview aide. (Private)',
    iconComponent: DocumentMagnifyingGlassIcon,
    iconClass: 'text-teal-500 dark:text-teal-400',
    systemPromptKey: 'lc_audit_aide',
    category: 'Auditing',
    capabilities: {
      canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: false,
      maxChatHistory: 25, handlesOwnInput: true, showEphemeralChatLog: false, // LC-Audit hides ephemeral log
    },
    tags: ['leetcode', 'audit', 'interview prep', 'algorithms', 'data structures', 'problem solving'],
    detailedCapabilities: [
        { id: 'deep-analysis', label: 'Deep Problem Analysis', icon: CogIcon },
        { id: 'slideshow-viz', label: 'Visual Slideshows', icon: PresentationChartLineIcon },
        { id: 'commented-code', label: 'Exhaustive Code Comments', icon: CodeBracketSquareIcon },
    ],
    inputPlaceholder: 'Provide problem context for LC-Audit analysis...',
    isPublic: false, // PRIVATE
    accessTier: 'premium',
    isBeta: true,
    viewComponentName: 'LCAuditAgentView',
  },
  // System/Placeholder definitions (mostly for typing, not user-selectable)
  { id: 'private-dashboard-placeholder', label: 'Dashboard', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: false },
  { id: 'rate-limit-exceeded', label: 'Rate Limited', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'public-welcome-placeholder', label: 'Welcome', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'no-public-agents-placeholder', label: 'No Agents', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'system-error', label: 'Error', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: false },
];

class AgentService {
  private agentsMap: Map<AgentId, IAgentDefinition>;
  private defaultPublicAgentId: AgentId = 'general_chat';
  private defaultPrivateAgentId: AgentId = 'general_chat'; // Default private agent can also be 'general_chat' or a specific one

  constructor() {
    this.agentsMap = new Map();
    // Populate map, ensuring canonical IDs are preferred for aliased agents
    const canonicalAgents = new Map<AgentId, IAgentDefinition>();
    agents.forEach(agent => {
      if (!canonicalAgents.has(agent.id)) { // Add if not already added (handles first definition of an ID)
        canonicalAgents.set(agent.id, agent);
      }
    });
    // Explicitly map aliases if they exist in the 'agents' array and point to the canonical general_chat
    const generalChatAgent = canonicalAgents.get('general_chat');
    if (generalChatAgent) {
      if (agents.find(a => a.id === 'general')) this.agentsMap.set('general', generalChatAgent);
      if (agents.find(a => a.id === 'general-ai')) this.agentsMap.set('general-ai', generalChatAgent);
    }
    // Add all unique definitions to the main map
    canonicalAgents.forEach((value, key) => {
        this.agentsMap.set(key, value);
    });


    const firstPublic = Array.from(this.agentsMap.values()).find(a => a.isPublic && a.id === 'general_chat') || Array.from(this.agentsMap.values()).find(a => a.isPublic);
    if (firstPublic) this.defaultPublicAgentId = firstPublic.id;
    else if (this.agentsMap.get('general_chat')) this.defaultPublicAgentId = 'general_chat'; // Fallback if no agent marked public

    const privateDefault = Array.from(this.agentsMap.values()).find(a => !a.isPublic && a.viewComponentName) || // Prefer private agents with views
                           this.agentsMap.get('lc_audit_aide') || // Specific preference for LC-Audit if available
                           this.agentsMap.get(this.defaultPublicAgentId); // Fallback to public default
    if (privateDefault) this.defaultPrivateAgentId = privateDefault.id;

    // console.log('[AgentService] Initialized. Default Public:', this.defaultPublicAgentId, "Default Private:", this.defaultPrivateAgentId);
  }

  public getAgentById(id?: AgentId | null): IAgentDefinition | undefined {
    if (!id) return undefined;
    // Handle potential aliases transparently
    if (id === 'general' || id === 'general-ai') return this.agentsMap.get('general_chat');
    return this.agentsMap.get(id);
  }

  public getAllAgents(): IAgentDefinition[] {
    // Filters out aliases to prevent duplicates in UI selectors, showing only canonical versions
    const uniqueAgentSet = new Set<AgentId>();
    const uniqueList: IAgentDefinition[] = [];
    agents.forEach(agent => {
        const canonicalId = (agent.id === 'general' || agent.id === 'general-ai') ? 'general_chat' : agent.id;
        if (!uniqueAgentSet.has(canonicalId) && this.agentsMap.has(canonicalId)) { // Check if canonical is in map
            uniqueAgentSet.add(canonicalId);
            uniqueList.push(this.agentsMap.get(canonicalId)!);
        } else if (!uniqueAgentSet.has(agent.id) && this.agentsMap.has(agent.id) && !['general', 'general-ai'].includes(agent.id)) {
            // Add non-aliased agents that are not yet in the unique list
            uniqueAgentSet.add(agent.id);
            uniqueList.push(agent);
        }
    });
    return uniqueList;
  }

  public getPublicAgents(): IAgentDefinition[] {
    return this.getAllAgents().filter(agent => agent.isPublic);
  }

  public getPrivateAgents(): IAgentDefinition[] { // For authenticated areas
    return this.getAllAgents().filter(agent => !agent.isPublic || agent.accessTier !== 'public'); // Include non-public or tiered agents
  }
  
  public getDefaultAgent(): IAgentDefinition {
    const agent = this.getAgentById(this.defaultPrivateAgentId);
    if (agent) return agent;
    // Fallback chain
    const publicDefault = this.getDefaultPublicAgent();
    if (publicDefault) return publicDefault;
    const firstAvailable = Array.from(this.agentsMap.values())[0];
    if (firstAvailable) return firstAvailable;
    throw new Error("CRITICAL: No agents defined in AgentService. Cannot determine a default agent.");
  }

  public getDefaultPublicAgent(): IAgentDefinition {
    const agent = this.getAgentById(this.defaultPublicAgentId);
    if (agent && agent.isPublic) return agent;
    
    const firstPublicInList = this.getPublicAgents()[0];
    if (firstPublicInList) return firstPublicInList;

    // Absolute fallback if default public or first public isn't found (e.g. misconfiguration)
    const generalChatAgent = this.agentsMap.get('general_chat');
    if (generalChatAgent) return generalChatAgent; // Even if accidentally marked not public
    
    const firstEverAgent = Array.from(this.agentsMap.values())[0];
    if (firstEverAgent) return firstEverAgent;

    throw new Error("CRITICAL: No public agents available in AgentService.");
  }
}

export const agentService = new AgentService();