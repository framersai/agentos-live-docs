// File: frontend/src/services/agent.service.ts
/**
 * @file agent.service.ts
 * @description Defines available AI agents, their configurations, and capabilities.
 * Manages the registry of agents for the application, including mapping to dedicated view components.
 * @version 1.4.0 - Added viewComponentName for all agents with corresponding view files.
 */

import type { Component as VueComponentType } from 'vue';
import {
  ChatBubbleLeftEllipsisIcon,
  CodeBracketSquareIcon,
  UserCircleIcon,
  BookOpenIcon,
  CpuChipIcon,
  AcademicCapIcon,
  DocumentMagnifyingGlassIcon,
  BriefcaseIcon,
  CogIcon,
  SparklesIcon,
  PresentationChartLineIcon,
} from '@heroicons/vue/24/outline';

export type AgentId =
  | 'general_chat'
  | 'public-quick-helper'
  | 'coding_assistant'
  | 'system_designer'
  | 'meeting_summarizer'
  | 'diary_agent'
  | 'coding_interviewer'
  | 'tutor_agent'
  | 'lc_audit_aide'
  // Placeholder/System IDs
  | 'private-dashboard-placeholder'
  | 'rate-limit-exceeded'
  | 'public-welcome-placeholder'
  | 'no-public-agents-placeholder'
  | 'system-error'
  // Legacy/Alias IDs
  | 'general'
  | 'general-ai';

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
  handlesOwnInput?: boolean;
  showEphemeralChatLog?: boolean;
}

export type AgentCategory = 'General' | 'Coding' | 'Productivity' | 'Learning' | 'Auditing' | 'Experimental' | 'Utility';

export interface IAgentDefinition {
  id: AgentId;
  label: string;
  description: string;
  longDescription?: string;
  iconComponent?: VueComponentType | string;
  iconClass?: string;
  avatar?: string;
  iconPath?: string;
  systemPromptKey: string; // Should always be present
  category: AgentCategory;
  capabilities: IAgentCapability;
  examplePrompts?: string[];
  tags?: string[];
  detailedCapabilities?: IDetailedCapabilityItem[];
  inputPlaceholder?: string;
  isPublic: boolean;
  accessTier?: 'public' | 'member' | 'premium';
  themeColor?: string;
  holographicElement?: string;
  defaultVoicePersona?: string | { name?: string, voiceId?: string, lang?: string };
  isBeta?: boolean;
  viewComponentName?: string; // Name of the dedicated Vue component for this agent's UI
}

const agents: IAgentDefinition[] = [
  {
    id: 'general_chat',
    label: 'Nerf',
    description: 'Your friendly general assistant for quick questions and information. Streamlined for efficiency.',
    iconComponent: ChatBubbleLeftEllipsisIcon,
    iconClass: 'text-orange-400 dark:text-orange-500',
    systemPromptKey: 'general_chat',
    category: 'General',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 8, showEphemeralChatLog: true, handlesOwnInput: true },
    examplePrompts: ["What's the capital of Japan?", "Explain the theory of relativity simply.", "How do I make a good cup of coffee?"],
    tags: ['general knowledge', 'q&a', 'information', 'quick help', 'concise'],
    inputPlaceholder: 'Ask Nerf a quick question...',
    isPublic: true,
    accessTier: 'public',
    viewComponentName: 'GeneralAgentView', // Added
  },
  {
    id: 'public-quick-helper', // This agent might not have a custom view if it's very simple
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
    // No viewComponentName, will use default MainContentView
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
    viewComponentName: 'CodingAgentView', // Added
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
    isPublic: true, // Assuming public, adjust if needed
    accessTier: 'public',
    viewComponentName: 'SystemsDesignAgentView', // Added
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
    isPublic: false, // Often private due to content sensitivity
    accessTier: 'member',
    viewComponentName: 'BusinessMeetingAgentView', // Added
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
    isPublic: false, // Typically private
    accessTier: 'member',
    viewComponentName: 'DiaryAgentView', // Added
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
    isPublic: true, // Could be public for practice
    accessTier: 'public',
    viewComponentName: 'CodingInterviewerAgentView', // Added
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
    isPublic: true, // Could be public
    accessTier: 'public',
    viewComponentName: 'TutorAgentView', // Added
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
      maxChatHistory: 25, handlesOwnInput: true, showEphemeralChatLog: false,
    },
    tags: ['leetcode', 'audit', 'interview prep', 'algorithms', 'data structures', 'problem solving'],
    detailedCapabilities: [
        { id: 'deep-analysis', label: 'Deep Problem Analysis', icon: CogIcon },
        { id: 'slideshow-viz', label: 'Visual Slideshows', icon: PresentationChartLineIcon },
        { id: 'commented-code', label: 'Exhaustive Code Comments', icon: CodeBracketSquareIcon },
    ],
    inputPlaceholder: 'Provide problem context for LC-Audit analysis...',
    isPublic: false,
    accessTier: 'premium',
    isBeta: true,
    viewComponentName: 'LCAuditAgentView', // Was already present
  },
  // Alias definitions (they don't need their own viewComponentName as getAgentById resolves to canonical)
  { id: 'general', label: 'Nerf (General)', description: 'Alias for Nerf', iconComponent: ChatBubbleLeftEllipsisIcon, systemPromptKey: 'general_chat', category: 'General', capabilities: {}, isPublic: true, accessTier: 'public' },
  { id: 'general-ai', label: 'Nerf (AI General)', description: 'Alias for Nerf', iconComponent: ChatBubbleLeftEllipsisIcon, systemPromptKey: 'general_chat', category: 'General', capabilities: {}, isPublic: true, accessTier: 'public' },
  // System/Placeholder definitions
  { id: 'private-dashboard-placeholder', label: 'Dashboard', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: false },
  { id: 'rate-limit-exceeded', label: 'Rate Limited', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'public-welcome-placeholder', label: 'Welcome', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'no-public-agents-placeholder', label: 'No Agents', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'system-error', label: 'Error', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: false },
];

class AgentService {
  private agentsMap: Map<AgentId, IAgentDefinition>;
  private defaultPublicAgentId: AgentId = 'general_chat';
  private defaultPrivateAgentId: AgentId = 'general_chat';

  constructor() {
    this.agentsMap = new Map();
    const canonicalAgents = new Map<AgentId, IAgentDefinition>();
    agents.forEach(agent => {
      // Prioritize first definition if multiple have same ID (e.g. canonical vs alias stub)
      if (!canonicalAgents.has(agent.id)) {
        canonicalAgents.set(agent.id, agent);
      }
    });

    // Ensure aliases point to the full canonical definition from `canonicalAgents`
    const generalChatCanonical = canonicalAgents.get('general_chat');
    if (generalChatCanonical) {
        this.agentsMap.set('general_chat', generalChatCanonical); // Ensure canonical is in
        if (agents.some(a => a.id === 'general')) this.agentsMap.set('general', generalChatCanonical);
        if (agents.some(a => a.id === 'general-ai')) this.agentsMap.set('general-ai', generalChatCanonical);
    }

    // Add all other canonical definitions
    canonicalAgents.forEach((agentDef, agentId) => {
        if (!this.agentsMap.has(agentId)){ // Add if not an alias already handled
            this.agentsMap.set(agentId, agentDef);
        }
    });


    const firstPublic = Array.from(this.agentsMap.values()).find(a => a.isPublic && a.id === 'general_chat') || Array.from(this.agentsMap.values()).find(a => a.isPublic);
    if (firstPublic) this.defaultPublicAgentId = firstPublic.id;
    else if (this.agentsMap.get('general_chat')) this.defaultPublicAgentId = 'general_chat';

    const privateDefault = Array.from(this.agentsMap.values()).find(a => !a.isPublic && a.viewComponentName) ||
                           this.agentsMap.get('lc_audit_aide') || // Specific preference
                           this.agentsMap.get(this.defaultPublicAgentId); // Fallback to public default if no other private default
    if (privateDefault) this.defaultPrivateAgentId = privateDefault.id;
  }

  public getAgentById(id?: AgentId | null): IAgentDefinition | undefined {
    if (!id) return undefined;
    if (id === 'general' || id === 'general-ai') return this.agentsMap.get('general_chat');
    return this.agentsMap.get(id);
  }

  public getAllAgents(): IAgentDefinition[] {
    // Return only canonical versions for UI selectors, no aliases
    const uniqueAgentDefinitions = new Map<AgentId, IAgentDefinition>();
    this.agentsMap.forEach(agent => {
        // Resolve alias to its canonical ID to ensure we only add canonical versions
        const canonicalId = (agent.id === 'general' || agent.id === 'general-ai') ? 'general_chat' : agent.id;
        const canonicalAgent = this.agentsMap.get(canonicalId);
        if (canonicalAgent && !uniqueAgentDefinitions.has(canonicalId)) {
             // Ensure we're adding the fully defined canonical agent
            if (canonicalAgent.systemPromptKey && !placeholderAgentIds.includes(canonicalId)) { // Filter out placeholders
                 uniqueAgentDefinitions.set(canonicalId, canonicalAgent);
            }
        }
    });
    return Array.from(uniqueAgentDefinitions.values());
  }
  
  public getPublicAgents(): IAgentDefinition[] {
    return this.getAllAgents().filter(agent => agent.isPublic);
  }

  public getPrivateAgents(): IAgentDefinition[] {
    return this.getAllAgents().filter(agent => !agent.isPublic || agent.accessTier !== 'public');
  }
  
  public getDefaultAgent(): IAgentDefinition { // For authenticated users
    const agent = this.getAgentById(this.defaultPrivateAgentId);
    if (agent && !placeholderAgentIds.includes(agent.id)) return agent;
    
    const publicDefault = this.getDefaultPublicAgent();
    if (publicDefault && !placeholderAgentIds.includes(publicDefault.id)) return publicDefault;
    
    const firstValidAgent = Array.from(this.agentsMap.values()).find(a => a.systemPromptKey && !placeholderAgentIds.includes(a.id));
    if (firstValidAgent) return firstValidAgent;

    throw new Error("CRITICAL: No valid agents defined in AgentService. Cannot determine a default agent.");
  }

  public getDefaultPublicAgent(): IAgentDefinition {
    const agent = this.getAgentById(this.defaultPublicAgentId);
    if (agent && agent.isPublic && !placeholderAgentIds.includes(agent.id)) return agent;
    
    const firstPublicInList = this.getPublicAgents().find(a => !placeholderAgentIds.includes(a.id));
    if (firstPublicInList) return firstPublicInList;

    const generalChatAgent = this.agentsMap.get('general_chat');
    if (generalChatAgent && !placeholderAgentIds.includes(generalChatAgent.id)) return generalChatAgent; // Fallback, ensure it's not a placeholder
        
    const firstEverValidAgent = Array.from(this.agentsMap.values()).find(a => a.systemPromptKey && !placeholderAgentIds.includes(a.id));
    if (firstEverValidAgent) return firstEverValidAgent;

    throw new Error("CRITICAL: No public agents available in AgentService.");
  }
}

const placeholderAgentIds: AgentId[] = [
    'private-dashboard-placeholder',
    'rate-limit-exceeded',
    'public-welcome-placeholder',
    'no-public-agents-placeholder',
    'system-error'
];


export const agentService = new AgentService();