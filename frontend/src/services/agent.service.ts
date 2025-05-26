// File: frontend/src/services/agent.service.ts
/**
 * @file agent.service.ts
 * @description Centralized service for defining and managing AI agent configurations and capabilities.
 * @version 1.0.3 - Ensured maxChatHistory is part of IAgentDefinition.capabilities.
 */

import { defineAsyncComponent, shallowRef, Component, ShallowRef, markRaw } from 'vue';
import {
    ChatBubbleLeftEllipsisIcon,
    BookOpenIcon,
    AcademicCapIcon,
    UserCircleIcon,
    BriefcaseIcon,
    CodeBracketSquareIcon,
    ShieldCheckIcon,
} from '@heroicons/vue/24/outline';

export type AgentId =
    | 'general'
    | 'diary'
    | 'tutor'
    | 'codingAssistant'
    | 'codingInterviewer'
    | 'businessMeeting'
    | 'systemDesigner';

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
        maxChatHistory?: number; // Ensured this is here
        usesCompactRenderer?: boolean;
    };
    avatar?: string;
}

class AgentService {
    private readonly _agents: ShallowRef<Readonly<IAgentDefinition[]>>;

    constructor() {
        this._agents = shallowRef<Readonly<IAgentDefinition[]>>(this.loadAgentDefinitions());
        console.log('[AgentService] Initialized. Agents:', this._agents.value.map(a => a.id).join(', '));
    }

    private loadAgentDefinitions(): IAgentDefinition[] {
        return [
            {
                id: 'general',
                label: 'General Assistant',
                icon: markRaw(ChatBubbleLeftEllipsisIcon),
                iconClass: 'text-sky-400 dark:text-sky-300',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/GeneralAgentView.vue')),
                description: 'Your versatile AI companion for a wide range of questions and tasks.',
                systemPromptKey: 'general_chat',
                isPubliclyAvailable: true,
                mainContentType: 'rich-text',
                canGenerateDiagrams: true,
                defaultModel: 'openai/gpt-4o-mini',
                inputPlaceholder: 'Ask me anything...',
                tags: ['general', 'chat', 'q&a'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 10 },
                avatar: 'general_avatar.svg',
            },
            {
                id: 'diary',
                label: 'Interactive Diary',
                icon: markRaw(BookOpenIcon),
                iconClass: 'text-emerald-400 dark:text-emerald-300',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/DiaryAgentView.vue')),
                description: 'A private space to reflect, journal, and capture your thoughts.',
                systemPromptKey: 'diary',
                isPubliclyAvailable: false,
                mainContentType: 'structured-log',
                canGenerateDiagrams: false,
                defaultModel: 'openai/gpt-4o-mini',
                defaultVoicePersona: { name: 'Echo' },
                inputPlaceholder: 'Share your thoughts for today...',
                tags: ['journal', 'reflection', 'personal'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: false, maxChatHistory: 20 },
                avatar: 'diary_avatar.svg',
            },
            {
                id: 'tutor',
                label: 'AI Tutor',
                icon: markRaw(AcademicCapIcon),
                iconClass: 'text-amber-400 dark:text-amber-300',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/TutorAgentView.vue')),
                description: 'Learn new concepts and solve problems step-by-step.',
                systemPromptKey: 'tutor',
                isPubliclyAvailable: true,
                mainContentType: 'slideshow',
                canGenerateDiagrams: true,
                defaultModel: 'openai/gpt-4o',
                inputPlaceholder: 'What would you like to learn about?',
                tags: ['education', 'learning', 'study'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 12 },
                avatar: 'tutor_avatar.svg',
            },
            {
                id: 'codingAssistant',
                label: 'Coding Assistant',
                icon: markRaw(CodeBracketSquareIcon),
                iconClass: 'text-rose-400 dark:text-rose-300',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/CodingAgentView.vue')),
                description: 'Get help with coding questions, debugging, and explanations.',
                systemPromptKey: 'coding',
                isPubliclyAvailable: true,
                mainContentType: 'interactive-code',
                canGenerateDiagrams: true,
                defaultModel: 'openai/gpt-4o',
                inputPlaceholder: 'Describe your coding challenge...',
                tags: ['coding', 'development', 'debug'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 15 },
                avatar: 'coding_avatar.svg',
            },
            {
                id: 'codingInterviewer',
                label: 'Coding Interviewer',
                icon: markRaw(UserCircleIcon),
                iconClass: 'text-red-500 dark:text-red-400',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/CodingInterviewerAgentView.vue')),
                description: 'Practice for technical interviews and get feedback.',
                systemPromptKey: 'coding_interviewer',
                isPubliclyAvailable: false,
                mainContentType: 'interactive-code',
                canGenerateDiagrams: true,
                defaultModel: 'openai/gpt-4o',
                inputPlaceholder: 'Ready for your mock interview?',
                tags: ['interview', 'practice', 'algorithms'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 15 },
                avatar: 'interviewer_avatar.svg',
            },
            {
                id: 'businessMeeting',
                label: 'Meeting Assistant',
                icon: markRaw(BriefcaseIcon),
                iconClass: 'text-cyan-400 dark:text-cyan-300',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/BusinessMeetingAgentView.vue')),
                description: 'Summarize notes, extract action items, and organize outcomes.',
                systemPromptKey: 'meeting',
                isPubliclyAvailable: false,
                mainContentType: 'structured-log',
                canGenerateDiagrams: false,
                defaultModel: 'openai/gpt-4o-mini',
                inputPlaceholder: 'Paste meeting notes for summarization...',
                tags: ['meetings', 'summary', 'productivity'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: false, maxChatHistory: 5 },
                avatar: 'meeting_avatar.svg',
            },
            {
                id: 'systemDesigner',
                label: 'System Designer',
                icon: markRaw(ShieldCheckIcon),
                iconClass: 'text-indigo-400 dark:text-indigo-300',
                uiComponent: defineAsyncComponent(() => import('@/components/agents/SystemDesignerAgentView.vue')),
                description: 'Design and visualize system architectures. Discuss patterns.',
                systemPromptKey: 'system_design',
                isPubliclyAvailable: false,
                mainContentType: 'diagram-canvas',
                canGenerateDiagrams: true,
                defaultModel: 'openai/gpt-4o',
                inputPlaceholder: 'Describe the system you want to design...',
                tags: ['architecture', 'software-design', 'diagrams'],
                capabilities: { supportsVoiceInput: true, usesCompactRenderer: true, maxChatHistory: 10 },
                avatar: 'designer_avatar.svg',
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
            console.warn("[AgentService] 'general' agent not found, returning first available agent as default.");
            return this._agents.value[0];
        }
        throw new Error('[AgentService] No agents defined.');
    }

    public getDefaultPublicAgent(): Readonly<IAgentDefinition> {
        const publicAgents = this.getPublicAgents();
        const defaultPublic = publicAgents.find(agent => agent.id === 'general') || publicAgents[0];
        if (defaultPublic) return defaultPublic;
        if (this._agents.value.length > 0 && this._agents.value[0].isPubliclyAvailable) return this._agents.value[0];
        throw new Error('[AgentService] No public agents defined or default general agent is not public.');
    }
}

export const agentService = new AgentService();