// File: frontend/src/services/agent.service.ts
/**
 * @file agent.service.ts
 * @description Centralized service for defining and managing AI agent configurations,
 * capabilities, and UI-related metadata.
 * @version 1.1.0 - Added themeColor, holographicElement, and callableTools to IAgentDefinition.
 * Ensured comprehensive JSDoc for all members.
 */

import { defineAsyncComponent, shallowRef, markRaw, type Component, type ShallowRef } from 'vue';
import {
  ChatBubbleLeftEllipsisIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BriefcaseIcon,
  CodeBracketSquareIcon,
  ShieldCheckIcon, // Used for SystemDesigner
} from '@heroicons/vue/24/outline';

/**
 * @typedef {string} AgentId
 * @description Type alias for unique agent identifiers.
 */
export type AgentId =
  | 'general'
  | 'diary'
  | 'tutor'
  | 'codingAssistant'
  | 'codingInterviewer'
  | 'businessMeeting'
  | 'systemDesigner';

/**
 * @interface IAgentToolDefinition
 * @description Defines a tool or function that an agent can declare its capability to use.
 */
export interface IAgentToolDefinition {
  /** The unique name of the tool/function. */
  toolName: string;
  /** A brief description of what the tool does. */
  description: string;
  /** Optional JSON schema for the tool's parameters. */
  parametersSchema?: any;
}


/**
 * @interface IAgentDefinition
 * @description Defines the complete configuration, capabilities, and UI metadata for an AI agent.
 */
export interface IAgentDefinition {
  id: AgentId;
  label: string;
  icon: Component;
  iconClass: string;
  uiComponent: ReturnType<typeof defineAsyncComponent>;
  description: string;
  systemPromptKey: string;
  defaultVoicePersona?: string | { name: string; voiceId?: string; lang?: string };
  isPubliclyAvailable: boolean;
  mainContentType: 'rich-text' | 'structured-log' | 'interactive-code' | 'diagram-canvas' | 'slideshow' | 'custom';
  canGenerateDiagrams: boolean;
  defaultModel?: string;
  inputPlaceholder?: string;
  tags?: string[];
  capabilities: {
    supportsVoiceInput?: boolean;
    prefersTextualOutput?: boolean;
    maxChatHistory?: number;
    usesCompactRenderer?: boolean;
    callableTools?: IAgentToolDefinition[];
  };
  avatar?: string;
  themeColor?: string;
  holographicElement?: string;
}

/**
 * @class AgentService
 * @classdesc Provides access to AI agent definitions and manages agent-related configurations.
 */
class AgentService {
  private static instance: AgentService;
  private readonly _agents: ShallowRef<Readonly<IAgentDefinition[]>>;

  private constructor() {
    this._agents = shallowRef<Readonly<IAgentDefinition[]>>(this.loadAgentDefinitions());
    console.log(`[AgentService] Initialized. Loaded ${this._agents.value.length} agent definitions.`);
  }

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  private loadAgentDefinitions(): IAgentDefinition[] {
    // Using avatar filenames directly as per previous agent.store.ts
    // These paths will be relative to public/assets/avatars/
    return [
      {
        id: 'general',
        label: 'General Assistant',
        icon: markRaw(ChatBubbleLeftEllipsisIcon),
        iconClass: 'text-sky-500 dark:text-sky-400', // Example color
        uiComponent: defineAsyncComponent(() => import('@/components/agents/GeneralAgentView.vue')),
        description: 'Your versatile AI companion for a wide range of questions and tasks.',
        systemPromptKey: 'general_chat',
        isPubliclyAvailable: true,
        mainContentType: 'rich-text',
        canGenerateDiagrams: true,
        defaultModel: 'openai/gpt-4o-mini',
        inputPlaceholder: 'Ask me anything or give me a task...',
        tags: ['general', 'chat', 'q&a', 'assistant'],
        capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 10 },
        avatar: 'avatar_general.svg',
        themeColor: 'var(--sky-500)', // Tailwind sky-500
        holographicElement: 'general-holo-grid',
      },
      {
        id: 'diary',
        label: 'Interactive Diary "Echo"',
        icon: markRaw(BookOpenIcon),
        iconClass: 'text-emerald-500 dark:text-emerald-400',
        uiComponent: defineAsyncComponent(() => import('@/components/agents/DiaryAgentView.vue')),
        description: 'A private space to reflect, journal, and capture your thoughts with empathy.',
        systemPromptKey: 'diary',
        isPubliclyAvailable: false,
        mainContentType: 'custom', // Specific two-page layout
        canGenerateDiagrams: false,
        defaultModel: 'openai/gpt-4o-mini',
        defaultVoicePersona: { name: 'Echo', lang: 'en-US' },
        inputPlaceholder: 'Share your thoughts, feelings, or today\'s events...',
        tags: ['journal', 'reflection', 'personal', 'mindfulness'],
        capabilities: { supportsVoiceInput: true, usesCompactRenderer: false, maxChatHistory: 20 },
        avatar: 'avatar_diary.svg',
        themeColor: 'var(--emerald-500)', // Tailwind emerald-500
        holographicElement: 'diary-ink-swirl',
      },
      {
        id: 'tutor',
        label: 'AI Tutor "Professor Astra"',
        icon: markRaw(AcademicCapIcon),
        iconClass: 'text-amber-500 dark:text-amber-400',
        uiComponent: defineAsyncComponent(() => import('@/components/agents/TutorAgentView.vue')),
        description: 'Learn new concepts, solve problems step-by-step, and get interactive quizzes.',
        systemPromptKey: 'tutor',
        isPubliclyAvailable: true,
        mainContentType: 'slideshow',
        canGenerateDiagrams: true,
        defaultModel: 'openai/gpt-4o',
        inputPlaceholder: 'What topic shall we explore today, or what problem can I help you solve?',
        tags: ['education', 'learning', 'study', 'quiz', 'explanation'],
        capabilities: {
          supportsVoiceInput: true,
          usesCompactRenderer: true,
          maxChatHistory: 12,
          callableTools: [
            { toolName: 'createQuizItem', description: 'Generates a multiple-choice quiz item (question, options, correct index, explanation).', parametersSchema: { /* JSON Schema for quiz item */ } },
            { toolName: 'createFlashcard', description: 'Generates a flashcard (front content, back content).', parametersSchema: { /* JSON Schema for flashcard */ } }
          ]
        },
        avatar: 'avatar_tutor.svg',
        themeColor: 'var(--amber-500)', // Tailwind amber-500
        holographicElement: 'tutor-knowledge-flow',
      },
      {
        id: 'codingAssistant',
        label: 'Coding Assistant "CodePilot"',
        icon: markRaw(CodeBracketSquareIcon),
        iconClass: 'text-rose-500 dark:text-rose-400',
        uiComponent: defineAsyncComponent(() => import('@/components/agents/CodingAgentView.vue')),
        description: 'Your expert pair programmer for coding questions, debugging, and explanations.',
        systemPromptKey: 'coding',
        isPubliclyAvailable: true,
        mainContentType: 'slideshow', // For explanations and code blocks
        canGenerateDiagrams: true,
        defaultModel: 'openai/gpt-4o',
        inputPlaceholder: 'Describe your coding challenge or ask a question...',
        tags: ['coding', 'development', 'debug', 'software', 'programming'],
        capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 15 },
        avatar: 'avatar_coding.svg',
        themeColor: 'var(--rose-500)',
        holographicElement: 'code-syntax-stream',
      },
      {
        id: 'codingInterviewer',
        label: 'Coding Interviewer "Eva"',
        icon: markRaw(UserCircleIcon),
        iconClass: 'text-violet-500 dark:text-violet-400',
        uiComponent: defineAsyncComponent(() => import('@/components/agents/CodingInterviewerAgentView.vue')),
        description: 'Practice for technical interviews with realistic problems and AI-driven feedback.',
        systemPromptKey: 'coding_interviewer',
        isPubliclyAvailable: false,
        mainContentType: 'slideshow',
        canGenerateDiagrams: true,
        defaultModel: 'openai/gpt-4o',
        inputPlaceholder: 'Ready to start your mock interview problem?',
        tags: ['interview', 'practice', 'algorithms', 'data structures'],
        capabilities: {
          supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 15,
          callableTools: [
            { toolName: 'generateCodingProblem', description: 'Generates a coding interview problem with specific difficulty and topic hints.' },
            { toolName: 'evaluateSolution', description: 'Evaluates a user-submitted code solution for correctness, efficiency, and style.'}
          ]
        },
        avatar: 'avatar_interviewer.svg',
        themeColor: 'var(--violet-500)',
        holographicElement: 'interview-qna-flow',
      },
      {
        id: 'businessMeeting',
        label: 'Meeting Assistant "Minutes"',
        icon: markRaw(BriefcaseIcon),
        iconClass: 'text-cyan-500 dark:text-cyan-400',
        uiComponent: defineAsyncComponent(() => import('@/components/agents/BusinessMeetingAgentView.vue')),
        description: 'Summarize meeting notes, extract action items, and organize discussion outcomes.',
        systemPromptKey: 'meeting',
        isPubliclyAvailable: false,
        mainContentType: 'custom', // Input text area + output summary
        canGenerateDiagrams: true,
        defaultModel: 'openai/gpt-4o-mini',
        inputPlaceholder: 'Paste meeting notes or a transcript to summarize...',
        tags: ['meetings', 'summary', 'productivity', 'action items'],
        capabilities: { supportsVoiceInput: true, usesCompactRenderer: false, maxChatHistory: 5 },
        avatar: 'avatar_meeting.svg',
        themeColor: 'var(--cyan-500)',
        holographicElement: 'meeting-timeline-dots',
      },
      {
        id: 'systemDesigner',
        label: 'System Designer "Architecton"',
        icon: markRaw(ShieldCheckIcon),
        iconClass: 'text-indigo-500 dark:text-indigo-400',
        uiComponent: defineAsyncComponent(() => import('@/components/agents/SystemsDesignAgentView.vue')),
        description: 'Collaboratively design and visualize complex system architectures and discuss patterns.',
        systemPromptKey: 'system_design',
        isPubliclyAvailable: false,
        mainContentType: 'slideshow', // Diagram + explanation slides
        canGenerateDiagrams: true,
        defaultModel: 'openai/gpt-4o',
        inputPlaceholder: 'Describe the system you want to design...',
        tags: ['architecture', 'software-design', 'diagrams', 'scalability'],
        capabilities: {
          supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 10,
          callableTools: [
            { toolName: 'generateArchitectureDiagram', description: 'Generates or updates a Mermaid diagram for the system architecture based on description.'}
          ]
        },
        avatar: 'avatar_designer.svg',
        themeColor: 'var(--indigo-500)',
        holographicElement: 'system-design-blueprint',
      },
    ];
  }

  public getAllAgents(): Readonly<IAgentDefinition[]> { return this._agents.value; }
  public getPublicAgents(): Readonly<IAgentDefinition[]> { return this._agents.value.filter(agent => agent.isPubliclyAvailable); }
  public getAgentById(id: AgentId | string): Readonly<IAgentDefinition> | undefined { return this._agents.value.find(agent => agent.id === id); }

  public getDefaultAgent(): Readonly<IAgentDefinition> {
    const defaultAgent = this.getAgentById('general');
    if (defaultAgent) return defaultAgent;
    if (this._agents.value.length > 0) {
      console.warn("[AgentService] Default 'general' agent not found. Returning the first available agent.");
      return this._agents.value[0];
    }
    throw new Error('[AgentService] CRITICAL: No agents defined.');
  }

  public getDefaultPublicAgent(): Readonly<IAgentDefinition> {
    const publicAgents = this.getPublicAgents();
    if (publicAgents.length === 0) {
        if (this._agents.value.length > 0) {
            console.warn("[AgentService] No public agents available. Falling back to the system's primary default agent.");
            return this.getDefaultAgent();
        }
        throw new Error('[AgentService] CRITICAL: No public agents defined and no agents at all.');
    }
    const defaultPublic = publicAgents.find(agent => agent.id === 'general') || publicAgents[0];
    return defaultPublic;
  }
}

export const agentService = AgentService.getInstance();