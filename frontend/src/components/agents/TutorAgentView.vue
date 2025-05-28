<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, PropType, nextTick } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition, AgentId } from '@/services/agent.service';
import { voiceSettingsManager, type VoiceApplicationSettings, type TutorLevel } from '@/services/voice.settings.service'; // Added TutorLevel
import { chatAPI, type ChatMessagePayloadFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { AcademicCapIcon, ChevronDownIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked';
import hljs from 'highlight.js'; // For enhanceCodeBlockHTMLInTutor
// Assuming AdvancedHistoryConfig is defined elsewhere with these new properties.
// For this file to be self-contained for fixing, I'll define a local version.
// Ideally, update the canonical AdvancedHistoryConfig in advancedConversation.manager.ts
import { HistoryStrategyPreset } from '@/services/advancedConversation.manager'; // Assuming this enum exists

interface AdvancedHistoryConfig {
  numRecentMessagesToPrioritize?: number;
  maxContextTokens?: number;
  simpleRecencyMessageCount?: number;
  strategyPreset?: HistoryStrategyPreset; // Only allow HistoryStrategyPreset or undefined
  relevancyThreshold?: number;
  numRelevantOlderMessagesToInclude?: number;
  filterHistoricalSystemMessages?: boolean;
  charsPerTokenEstimate?: number;
  // Added based on usage in this file:
  summarizeIntermediateHistory?: boolean;
  intermediateSummaryPrompt?: string;
  summarizeIntermediateHistoryThreshold?: number;
  includeSystemMessagesInSummary?: boolean;
}

// Default config if not fully imported
const DEFAULT_ADVANCED_HISTORY_CONFIG_LOCAL: AdvancedHistoryConfig = {
  numRecentMessagesToPrioritize: 5,
  maxContextTokens: 3000,
  simpleRecencyMessageCount: 10,
  strategyPreset: HistoryStrategyPreset.RECENT_CONVERSATION,
  relevancyThreshold: 0.5,
  numRelevantOlderMessagesToInclude: 2,
  filterHistoricalSystemMessages: false,
  charsPerTokenEstimate: 4,
  summarizeIntermediateHistory: false, // Default to false unless overridden
  includeSystemMessagesInSummary: false, // Default to false
};


// TypeScript declaration for the global Mermaid object
declare var mermaid: any;

const props = defineProps({
  agentId: { type: String as PropType<AgentId>, required: true },
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
}>();

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

const isLoadingResponse = ref(false);
const currentAgentSystemPrompt = ref('');
const agentDisplayName = computed(() => props.agentConfig.label || "Professor Astra");

const currentTutorLevel = ref<TutorLevel>(
  (agentStore.getAgentContext(props.agentId)?.tutorLevel as TutorLevel) ||
  (voiceSettingsManager.settings?.defaultTutorLevel as TutorLevel) ||
  'intermediate'
);
const showLevelSelector = ref(false);
const levelSelectorRef = ref<HTMLElement | null>(null);
const tutorLevels: { id: TutorLevel; label: string; description: string }[] = [
  { id: 'beginner', label: 'Beginner', description: 'Foundational concepts, simple language, more direct guidance.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Detailed explanations, assumes some prior knowledge, balanced guidance and Socratic questioning.' },
  { id: 'expert', label: 'Expert', description: 'Advanced topics, concise & technical, expects more independent thinking, deeper Socratic dive.' },
];

const mainContentDisplayAreaId = computed(() => `${props.agentId}-main-content-display-tutor`);
const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${agentDisplayName.value}] Error loading prompt:`, e);
      currentAgentSystemPrompt.value = "You are Professor Astra. Your goal is to help users learn effectively. Adapt to {{TUTOR_LEVEL}}. Use tools like `createQuizItem` and explain concepts clearly using Markdown for slides. Ask guiding questions. Consider Mermaid diagrams for visuals if {{GENERATE_DIAGRAM}} is true.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Professor Astra. Your goal is to help users learn effectively. Adapt to {{TUTOR_LEVEL}}. Use tools like `createQuizItem` and explain concepts clearly using Markdown for slides. Ask guiding questions. Consider Mermaid diagrams for visuals if {{GENERATE_DIAGRAM}} is true.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

watch(currentTutorLevel, (newLevel, oldLevel) => {
  agentStore.updateAgentContext({ tutorLevel: newLevel, agentId: props.agentId });
  const currentSettings = voiceSettingsManager.settings || {} as VoiceApplicationSettings;
  voiceSettingsManager.updateSettings({ ...currentSettings, defaultTutorLevel: newLevel });
  
  toast?.add({type: 'info', title: 'Tutor Level Updated', message: `${agentDisplayName.value} will now teach at the ${newLevel} level.`, duration: 3500});
  
  if (oldLevel && newLevel !== oldLevel && mainContentToDisplay.value?.data && !mainContentToDisplay.value.title?.includes(`${agentDisplayName.value} Ready`)) {
    const currentTopic = mainContentToDisplay.value.title?.replace(/^(Professor Astra on: |Processing: )/, "").substring(0,50).trim() || 'the current topic';
    handleNewUserInput(`Following up on our discussion about "${currentTopic}", please adjust your explanation and approach for a ${newLevel} learner.`);
  }
});

const setTutorLevel = (level: TutorLevel) => {
  currentTutorLevel.value = level;
  showLevelSelector.value = false;
};

const getRecentTopicsSummaryForPrompt = (): string => {
  const agentMessages = chatStore.getMessagesForAgent(props.agentId);
  const userTopics = agentMessages
    .filter(m => m.role === 'user' && m.content && m.content.trim().length > 5 && !m.content.toLowerCase().startsWith("please adjust"))
    .slice(-5) 
    .map(m => m.content!.length > 40 ? m.content!.substring(0, 40) + "..." : m.content)
    .filter((value, index, self) => self.indexOf(value) === index) 
    .slice(-2); 

  if (userTopics.length === 0) return "a new topic";
  if (userTopics.length === 1) return `our discussion on "${userTopics[0]}"`;
  return `our discussions on "${userTopics.join('" and "')}"`;
};

const SVG_ICON_COPY_STRING_TUTOR = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-xs"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`;
const SVG_ICON_CHECK_STRING_TUTOR = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-xs text-green-500 dark:text-green-400"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;

const addAllCopyButtonListenersToCodeBlocksInTutor = (containerElement: HTMLElement) => {
  containerElement.querySelectorAll('button.copy-code-button-placeholder').forEach(buttonEl => {
    const button = buttonEl as HTMLElement;
    if (button.dataset.listenerAttached === 'true') return;

    const codeBlockWrapper = button.closest('.enhanced-code-block-ephemeral');
    if (!codeBlockWrapper) return;

    const rawCode = decodeURIComponent((codeBlockWrapper as HTMLElement).dataset.rawCode || '');
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      try {
        await navigator.clipboard.writeText(rawCode);
        button.innerHTML = SVG_ICON_CHECK_STRING_TUTOR;
        setTimeout(() => { button.innerHTML = SVG_ICON_COPY_STRING_TUTOR; }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        button.textContent = 'Error'; // Simple error indication
        setTimeout(() => { button.innerHTML = SVG_ICON_COPY_STRING_TUTOR; }, 2000);
      }
    });
    button.dataset.listenerAttached = 'true';
  });
};

const enhanceCodeBlockHTMLInTutor = (rawCodeBlockMatch: string): string => {
  const langMatch = rawCodeBlockMatch.match(/^```(\S*)\n/);
  const lang = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : 'plaintext';
  let code = rawCodeBlockMatch.replace(/^```\S*\n?/, '').replace(/\n```$/, '');
  code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  const highlightedHtml = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  
  return `
    <div class="enhanced-code-block-ephemeral" data-lang="${lang}" data-raw-code="${encodeURIComponent(code)}">
      <div class="code-header-ephemeral">
        <span class="code-language-tag-ephemeral">${lang}</span>
        <button class="copy-code-button-placeholder btn btn-xs btn-ghost-ephemeral" title="Copy code" aria-label="Copy code snippet">
          ${SVG_ICON_COPY_STRING_TUTOR}
        </button>
      </div>
      <pre><code class="language-${lang} hljs">${highlightedHtml}</code></pre>
    </div>`;
};


const handleNewUserInput = async (text: string) => {
  if (!text.trim() || isLoadingResponse.value) return;

  const userMessage: StoreChatMessage = chatStore.addMessage({ role: 'user', content: text, timestamp: Date.now(), agentId: props.agentId });
  isLoadingResponse.value = true;
  
  const currentTopicTitle = mainContentToDisplay.value?.title?.replace(/^(Professor Astra on: |Processing:|Ready$)/, "").trim() || text.substring(0,30).trim() || "the current topic";
  const thinkingData = `## ${currentTopicTitle}\n\n${agentDisplayName.value} is preparing your lesson on: *"${text.substring(0,40)}..."*\n\n<div class="professor-astra-spinner-container mx-auto my-6"><div class="professor-astra-spinner"></div></div>\n\nTailoring explanation for the ${currentTutorLevel.value} level...`;
  chatStore.updateMainContent({ 
    agentId: props.agentId, type: 'markdown',
    data: thinkingData,
    title: `Processing: ${text.substring(0,30)}...`,
    timestamp: Date.now()
  });
  chatStore.setMainContentStreaming(true, thinkingData);

  try {
    const recentTopicsSummary = getRecentTopicsSummaryForPrompt();
    const generateDiagrams = props.agentConfig.capabilities?.canGenerateDiagrams && (voiceSettingsManager.settings?.generateDiagrams ?? false);

    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings?.preferredCodingLanguage || 'general')
      .replace(/{{MODE}}/g, props.agentConfig.id)
      .replace(/{{TUTOR_LEVEL}}/g, currentTutorLevel.value)
      .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopicsSummary)
      .replace(/{{GENERATE_DIAGRAM}}/g, (generateDiagrams ?? false).toString()) // Ensure boolean to string
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(props.agentId) || { tutorLevel: currentTutorLevel.value }))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 
        `Focus on the Socratic method for chat replies. Main content should be structured for slides. Be highly interactive and adaptive to the ${currentTutorLevel.value} level. If a tool like createQuizItem is used, ensure the response guides the user appropriately. Use tools like \`createQuizItem\` or \`createFlashcard\` thoughtfully. Consider simple Mermaid diagrams for visual clarity if helpful.`
      );

    const maxHistory = props.agentConfig.capabilities?.maxChatHistory || 15;
    const historyConfig: AdvancedHistoryConfig = { 
        ...DEFAULT_ADVANCED_HISTORY_CONFIG_LOCAL, 
        numRecentMessagesToPrioritize: maxHistory,
        simpleRecencyMessageCount: maxHistory, 
        maxContextTokens: voiceSettingsManager.settings?.useAdvancedMemory ? 4000 : maxHistory * 150, 
        summarizeIntermediateHistory: true,
        intermediateSummaryPrompt: `Summarize the key concepts Professor Astra has explained and the student's main points of understanding or confusion so far in this tutoring session about "${currentTopicTitle}". Focus on knowledge gaps or confirmed understanding to inform Astra's next teaching step at the ${currentTutorLevel.value} level.`, // Updated prompt
        summarizeIntermediateHistoryThreshold: 5,
        includeSystemMessagesInSummary: false, // Explicitly set
    };
    
    const processedHistoryFromClient = await chatStore.getHistoryForApi(
      props.agentId, text, finalSystemPrompt, historyConfig
    );
    
    const payload: ChatMessagePayloadFE = {
      messages: [{role: 'user', content: text, timestamp: userMessage.timestamp, agentId: props.agentId}],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id,
      language: voiceSettingsManager.settings?.preferredCodingLanguage,
      generateDiagram: generateDiagrams,
      userId: 'frontend_user_tutor', 
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
      tutorMode: true, 
      tutorLevel: currentTutorLevel.value,
      stream: true,
    };
    
    let accumulatedContent = "";
    chatStore.clearStreamingMainContent(); 

    await chatAPI.sendMessageStream(
      payload,
      (chunk: string) => { // onChunkReceived
        if (chunk) {
          accumulatedContent += chunk;
          chatStore.appendStreamingMainContent(chunk);
          chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: accumulatedContent, 
            title: `${agentDisplayName.value} on: ${currentTopicTitle}`,
            timestamp: Date.now(),
          });
        }
      },
      async () => { // onStreamEnd
        isLoadingResponse.value = false; 
        chatStore.setMainContentStreaming(false);
        const finalContent = accumulatedContent.trim();

        if (!finalContent) {
          toast?.add({ type: 'info', title: `${agentDisplayName.value} Says`, message: "It seems I was lost in thought! Could you rephrase your question or ask about something else?", duration: 5000 });
          const currentData = mainContentToDisplay.value?.data as string || "";
          // Regex to match the thinking message more accurately
          const thinkingMessageRegex = new RegExp(`<h2>${currentTopicTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h2>\\s*<p>${agentDisplayName.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} is preparing your lesson on:.*?Tailoring explanation for the ${currentTutorLevel.value} level...</p>`, 's');

          chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: currentData.replace(thinkingMessageRegex, `<p>I'm ready for your next learning quest regarding "${currentTopicTitle}"!</p>`),
            title: `${agentDisplayName.value} Ready`, timestamp: Date.now()
          });
          return;
        }
        
        chatStore.addMessage({
            role: 'assistant', 
            content: `I've prepared some information on "${currentTopicTitle}" in the main view. What are your initial thoughts or questions on this?`,
            timestamp: Date.now(), agentId: props.agentId, 
        });
        // Final update to main content with the complete stream.
        // Mermaid rendering will be handled by the watcher on mainContentToDisplay.
        chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: finalContent,
            title: `${agentDisplayName.value} on: ${currentTopicTitle}`,
            timestamp: Date.now(),
        });
      },
      (error: Error) => { // onStreamError
        console.error(`[${agentDisplayName.value}] Chat stream error:`, error);
        const errorMessage = error.message || 'Professor Astra encountered a small hiccup. Please try again.';
        toast?.add({ type: 'error', title: `Tutor Stream Error`, message: errorMessage, duration: 7000 });
        chatStore.addMessage({ role: 'error', content: `Oops! A learning obstacle: ${errorMessage}`, timestamp: Date.now(), agentId: props.agentId });
        chatStore.updateMainContent({
          agentId: props.agentId, type: 'markdown',
          data: `<h3>Lesson Interrupted</h3><p>Professor Astra encountered an issue: <em>${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</em></p>`,
          title: 'Error', timestamp: Date.now()
        });
        isLoadingResponse.value = false; 
        chatStore.setMainContentStreaming(false);
      }
    );

  } catch (error: any) { // Catch errors from setting up the stream
    console.error(`[${agentDisplayName.value}] Chat API setup error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred connecting with Professor Astra.';
    toast?.add({ type: 'error', title: `Tutor Error`, message: errorMessage, duration: 7000 });
    chatStore.addMessage({ role: 'error', content: `Failed to get response: ${errorMessage}`, timestamp: Date.now(), agentId: props.agentId });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `<h3>Professor Astra System Error</h3><p>An issue occurred: <em>${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</em></p>`,
      title: 'Error', timestamp: Date.now()
    });
    isLoadingResponse.value = false; 
    chatStore.setMainContentStreaming(false);
  }
};

marked.setOptions({
    breaks: true,
    gfm: true,
    pedantic: false
});

// Add syntax highlighting using marked's extension API
marked.use({
    async: false,
    renderer: {
        code(code: string, infostring: string | undefined, escaped: boolean) {
            const lang = (infostring || '').split(/\s+/)[0];
            try {
                const highlighted = hljs.highlight(code, { language: lang || 'plaintext', ignoreIllegals: true }).value;
                return `<pre><code class="language-${lang} hljs">${highlighted}</code></pre>`;
            } catch {
                return `<pre><code>${code}</code></pre>`;
            }
        }
    }
});

const renderMarkdownForTutorView = (content: string | null): string => {
    if (content === null) return '';
    try {
        const contentWithEnhancedCode = content.replace(/```([a-zA-Z0-9\-_]*)\n([\s\S]*?)```/g, (match) => {
            return enhanceCodeBlockHTMLInTutor(match);
        });
        return marked.parse(contentWithEnhancedCode);
    } catch (e) {
        console.error(`[${agentDisplayName.value}] Error parsing markdown:`, e);
        return `<p class="text-red-500 dark:text-red-400">Error rendering lesson content.</p>`;
    }
};

watch(mainContentToDisplay, async (newContentObj) => {
    if (newContentObj?.data && typeof newContentObj.data === 'string') {
        const contentData = newContentObj.data;
        await nextTick(); 
        const mainDisplayElement = document.getElementById(mainContentDisplayAreaId.value);
        if (mainDisplayElement) {
            addAllCopyButtonListenersToCodeBlocksInTutor(mainDisplayElement);

            if (typeof mermaid !== 'undefined' && contentData.includes('```mermaid')) {
                 // Clear previous mermaid processed flags for re-rendering if content changes
                mainDisplayElement.querySelectorAll('[data-mermaid-processed="true"]').forEach(el => {
                    (el as HTMLElement).removeAttribute('data-mermaid-processed');
                    // If we transformed a <pre><code> to <pre class="mermaid">, we might need to revert or re-parse
                    // For simplicity, this assumes the raw ```mermaid``` blocks are still in `contentData`
                    // or that marked.parse will re-create the necessary structure.
                });

                const mermaidCodeBlocks = mainDisplayElement.querySelectorAll('code.language-mermaid');
                const mermaidDivs = mainDisplayElement.querySelectorAll('div.mermaid');
                
                const nodesToRun: Element[] = [];

                mermaidCodeBlocks.forEach(codeEl => {
                    const preParent = codeEl.parentElement;
                    if (preParent && preParent.tagName === 'PRE' && !(preParent as HTMLElement).dataset.mermaidProcessed) {
                        const mermaidText = codeEl.textContent || '';
                        if (mermaidText.trim()) {
                            // Replace pre's content with just the mermaid text, and add 'mermaid' class to pre
                            preParent.innerHTML = `<div class="mermaid-graph-container">${mermaidText}</div>`; // Wrap in a div for mermaid to target
                            const graphContainer = preParent.querySelector('.mermaid-graph-container');
                            if (graphContainer) {
                                nodesToRun.push(graphContainer);
                                (preParent as HTMLElement).dataset.mermaidProcessed = 'true';
                            }
                        }
                    }
                });

                mermaidDivs.forEach(divEl => {
                     if (!(divEl as HTMLElement).dataset.mermaidProcessed) {
                        // Check if it contains raw mermaid text or needs to be used as is
                        if (divEl.textContent?.trim().match(/^graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|quadrantChart|requirementDiagram|gitGraph|mindmap|timeline|sankey-beta/)) {
                           nodesToRun.push(divEl);
                           (divEl as HTMLElement).dataset.mermaidProcessed = 'true';
                        }
                    }
                });
                
                if(nodesToRun.length > 0) {
                    try { 
                        mermaid.initialize({ startOnLoad: false, theme: 'default' }); // Or use dynamic theme
                        mermaid.run({ nodes: nodesToRun }); 
                    } catch(e) { 
                        console.error("Mermaid run error in watcher:", e); 
                        nodesToRun.forEach(node => {
                            node.innerHTML = `<p class="text-red-500">Error rendering diagram</p>`;
                        });
                    }
                }
            }
        }
    }
}, { deep: true });


defineExpose({ handleNewUserInput });

const handleClickOutsideLevelSelector = (event: MouseEvent) => {
  if (levelSelectorRef.value && !levelSelectorRef.value.contains(event.target as Node)) {
    showLevelSelector.value = false;
  }
};

onMounted(() => {
  console.log(`[${agentDisplayName.value}] View Mounted. Current Level: ${currentTutorLevel.value}`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });
  document.addEventListener('click', handleClickOutsideLevelSelector, true);

  if (!mainContentToDisplay.value?.data || mainContentToDisplay.value.title === `${props.agentConfig.label} Ready` || mainContentToDisplay.value.title === `${agentDisplayName.value} Ready`) {
    const recentTopicsSummary = getRecentTopicsSummaryForPrompt(); 
    const welcomeHTML = `
<div class="professor-astra-welcome-container">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 mx-auto professor-astra-icon-glow">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
  <h2 class="professor-astra-welcome-title">Greetings! I am ${agentDisplayName.value}.</h2>
  <p class="professor-astra-welcome-subtitle">Teaching at the <strong>${currentTutorLevel.value}</strong> level. ${props.agentConfig.description || 'Ready to guide your learning exploration!'}</p>
  <p class="professor-astra-welcome-prompt">${props.agentConfig.inputPlaceholder || `What topic shall we explore today? Perhaps something related to ${recentTopicsSummary}?`}</p>
</div>`;
    // Welcome message is HTML, so it doesn't need renderMarkdownForTutorView for its own structure
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown', // Still treat as markdown type for consistency, even if pre-rendered HTML
      data: welcomeHTML, 
      title: `${agentDisplayName.value} Ready`, timestamp: Date.now(),
    });
  } else {
    // Trigger watcher if content already exists to process diagrams/listeners
    nextTick(() => {
        if (mainContentToDisplay.value?.data) {
            // Force watcher to re-evaluate by creating a new object if data itself is not reactive enough
            // This is a bit of a hack, direct call to processing function might be cleaner
             const currentData = mainContentToDisplay.value.data;
             chatStore.updateMainContent({
                agentId: props.agentId,
                type: mainContentToDisplay.value.type,
                data: currentData + " ", // Force change for watcher if needed
                title: mainContentToDisplay.value.title,
                timestamp: mainContentToDisplay.value.timestamp
             });
             chatStore.updateMainContent({ // Revert immediately
                agentId: props.agentId,
                type: mainContentToDisplay.value.type,
                data: currentData,
                title: mainContentToDisplay.value.title,
                timestamp: mainContentToDisplay.value.timestamp
             });
        }
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideLevelSelector, true);
});

</script>

<template>
  <div class="tutor-agent-view professor-astra-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls professor-astra-header">
      <div class="flex items-center gap-2.5 shrink-0">
        <AcademicCapIcon class="w-7 h-7 professor-astra-icon" :class="props.agentConfig.iconClass" />
        <span class="font-semibold text-lg professor-astra-title">{{ agentDisplayName }}</span>
      </div>
      <div class="relative" ref="levelSelectorRef">
        <button @click="showLevelSelector = !showLevelSelector" 
                class="btn btn-secondary btn-sm py-1.5 px-3 text-sm flex items-center gap-1.5 professor-astra-level-button"
                aria-haspopup="true" :aria-expanded="showLevelSelector" aria-controls="level-dropdown-menu">
          Level: <span class="font-medium">{{ currentTutorLevel }}</span>
          <ChevronDownIcon class="w-4 h-4 transition-transform" :class="{'rotate-180': showLevelSelector}" />
        </button>
        <transition name="dropdown-fade">
          <div v-if="showLevelSelector" id="level-dropdown-menu"
               class="dropdown-menu-private absolute top-full right-0 mt-1.5 w-72 origin-top-right z-20 professor-astra-dropdown-menu">
            <div class="p-1.5" role="menu">
              <button
                v-for="level in tutorLevels"
                :key="level.id"
                @click="setTutorLevel(level.id)"
                class="dropdown-item-private w-full group professor-astra-dropdown-item" 
                :class="{ 'active': currentTutorLevel === level.id }"
                role="menuitemradio" :aria-checked="currentTutorLevel === level.id"
              >
                <div class="text-left">
                  <span class="text-sm font-medium block">{{ level.label }}</span>
                  <p class="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-300 dark:group-hover:text-slate-400 transition-colors">{{ level.description }}</p>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic professor-astra-scrollbar overflow-y-auto" :id="mainContentDisplayAreaId">
      <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay-tutor professor-astra-loading-overlay">
        <div class="professor-astra-spinner-container"><div class="professor-astra-spinner"></div></div>
        <p class="mt-3 text-sm professor-astra-loading-text">Professor Astra is preparing your lesson...</p>
      </div>
      
      <template v-if="mainContentToDisplay?.data">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && 
                (mainContentToDisplay.type === 'compact-message-renderer-data' || 
                 (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming) || 
                 mainContentToDisplay.type === 'loading')"
          :content="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                    ? chatStore.streamingMainContentText 
                    : mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="p-1 h-full professor-astra-compact-renderer" 
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full professor-astra-prose-content"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                     ? renderMarkdownForTutorView(chatStore.streamingMainContentText + '▋') 
                     : renderMarkdownForTutorView(mainContentToDisplay.data as string)"
        ></div>
        <div v-else class="p-4 text-slate-400 dark:text-slate-500 italic h-full flex items-center justify-center professor-astra-placeholder">
          {{ agentDisplayName }} is preparing content. (Type: {{ mainContentToDisplay.type }})
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex flex-col items-center justify-center h-full p-4 text-center professor-astra-empty-state">
         <SparklesIcon class="w-12 h-12 mb-3 text-[var(--agent-tutor-accent-color-muted)] opacity-50"/>
        <p class="text-slate-500 dark:text-slate-400 italic">{{ props.agentConfig.inputPlaceholder || `What would you like to learn about with ${agentDisplayName}?` }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.professor-astra-view {
  --agent-tutor-accent-hue: 40; /* Amber */
  --agent-tutor-accent-saturation: 90%;
  --agent-tutor-accent-lightness: 55%;
  --agent-tutor-accent-color: hsl(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness));
  --agent-tutor-accent-color-muted: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.7);
  --agent-tutor-accent-color-darker: hsl(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), calc(var(--agent-tutor-accent-lightness) - 10%));
  --agent-tutor-bg-subtle-pattern: var(--bg-noise-texture);

  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
  
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--agent-tutor-bg-subtle-pattern);
    background-size: var(--bg-noise-size, 250px);
    opacity: 0.02; 
    pointer-events: none;
    z-index: 0;
  }
  > * { position: relative; z-index: 1; } 
}

.professor-astra-header {
  @apply p-2 px-3 border-b flex items-center justify-between gap-2 flex-wrap;
  border-bottom-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.3);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}

.professor-astra-icon {
  color: var(--agent-tutor-accent-color);
  filter: drop-shadow(0 1px 3px hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.5));
}
.professor-astra-title {
  color: var(--text-primary-dark, theme('colors.slate.100'));
}

.professor-astra-level-button {
  border-color: hsla(var(--agent-tutor-accent-hue), calc(var(--agent-tutor-accent-saturation) - 30%), calc(var(--agent-tutor-accent-lightness) - 10%), 0.5);
  background-color: hsla(var(--agent-tutor-accent-hue), calc(var(--agent-tutor-accent-saturation) - 40%), calc(var(--agent-tutor-accent-lightness) - 20%), 0.2);
  color: hsl(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), calc(var(--agent-tutor-accent-lightness) + 20%));
  &:hover {
    background-color: hsla(var(--agent-tutor-accent-hue), calc(var(--agent-tutor-accent-saturation) - 30%), calc(var(--agent-tutor-accent-lightness) - 15%), 0.3);
    border-color: hsla(var(--agent-tutor-accent-hue), calc(var(--agent-tutor-accent-saturation) - 20%), var(--agent-tutor-accent-lightness), 0.7);
  }
}

.professor-astra-dropdown-menu {
  @apply bg-slate-800/90 dark:bg-slate-900/95 backdrop-blur-md border rounded-lg shadow-2xl;
  border-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.4);
}
.professor-astra-dropdown-item {
  @apply text-slate-200 dark:text-slate-300 hover:bg-opacity-20;
  &:hover {
    background-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.15);
  }
  &.active {
    background-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.25) !important;
    @apply font-semibold text-white;
  }
}

.professor-astra-loading-overlay { 
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 30, 28, 22), 0.75);
  backdrop-filter: blur(3px);
}
.professor-astra-spinner-container { @apply relative w-10 h-10; }
.professor-astra-spinner { 
  @apply w-full h-full border-4 rounded-full animate-spin;
  border-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.2); 
  border-top-color: var(--agent-tutor-accent-color);
}
.professor-astra-loading-text {
  color: var(--agent-tutor-accent-color-muted);
  font-weight: 500;
  margin-top: theme('spacing.3');
}

.professor-astra-scrollbar {
  &::-webkit-scrollbar { @apply w-2 h-2; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--agent-tutor-accent-hue), 20%, 20%, 0.2); @apply rounded-full; }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.6);
    @apply rounded-full;
    border: 2px solid hsla(var(--agent-tutor-accent-hue), 20%, 20%, 0.2);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--agent-tutor-accent-color);
  }
  scrollbar-width: auto;
  scrollbar-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.6) hsla(var(--agent-tutor-accent-hue), 20%, 20%, 0.2);
}

.professor-astra-prose-content, .professor-astra-compact-renderer :deep(.prose) {
  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    @apply text-[var(--text-primary-dark)] border-b pb-1.5 mb-4;
    border-bottom-color: hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.4);
    color: hsl(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), calc(var(--agent-tutor-accent-lightness) + 20%));
  }
  :deep(p), :deep(li) {
    @apply text-[var(--text-secondary-dark)] my-3 leading-relaxed;
  }
  :deep(a) {
    color: var(--agent-tutor-accent-color);
    @apply hover:underline hover:text-[var(--agent-tutor-accent-color-darker)];
  }
  :deep(strong) {
    color: hsl(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), calc(var(--agent-tutor-accent-lightness) + 10%));
    font-weight: 600;
  }
  :deep(code:not(pre code):not(.language-mermaid code)) { /* Exclude mermaid code tags if they are bare */
    @apply px-1.5 py-1 rounded-md text-xs;
    background-color: hsla(var(--agent-tutor-accent-hue), 25%, 20%, 0.5);
    color: hsl(var(--agent-tutor-accent-hue), 40%, 75%);
    border: 1px solid hsla(var(--agent-tutor-accent-hue), 25%, 30%, 0.5);
  }
  /* :deep(pre) styling is handled by .enhanced-code-block-ephemeral or global prose if not enhanced */
  
  /* Ensure mermaid diagrams rendered by marked or direct v-html are centered and clear */
 :deep(div.mermaid), :deep(pre.mermaid) { /* Target divs or pres with mermaid class */
    @apply block text-center p-2 sm:p-4 bg-transparent my-4;
    svg { @apply mx-auto; } /* Center the SVG if mermaid.js wraps it */
  }
 :deep(code.language-mermaid) { 
    @apply hidden; /* Hide the raw ```mermaid code block rendered by marked's default path */
  }
}

/* Specific styling for enhanced code blocks within v-html from renderMarkdownForTutorView */
:deep(.enhanced-code-block-ephemeral) {
  @apply relative bg-slate-800 dark:bg-slate-900 rounded-lg my-4 shadow-md overflow-hidden;
}
:deep(.code-header-ephemeral) {
  @apply flex justify-between items-center px-3 py-1.5 bg-slate-700 dark:bg-slate-800 text-xs text-slate-400 dark:text-slate-500;
  border-bottom: 1px solid var(--border-color-dark, theme('colors.slate.700')); /* Adjusted var name */
}
:deep(.code-language-tag-ephemeral) {
  @apply font-mono uppercase tracking-wider;
}
:deep(button.copy-code-button-placeholder) {
  @apply p-1 text-slate-300 hover:text-slate-100; 
  .icon-xs { @apply w-4 h-4; }
}
:deep(.enhanced-code-block-ephemeral pre) {
  @apply p-3 pt-2 custom-scrollbar-thin overflow-auto bg-transparent !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
  max-height: 400px; /* Example max height for scroll */
}
:deep(.enhanced-code-block-ephemeral pre code.hljs) {
  @apply text-sm p-0 !important; /* Remove padding from hljs code block itself if pre handles it */
  background: transparent !important;
}
/* Line numbers are not part of enhanceCodeBlockHTMLInTutor, this was from a different component. Remove if not used. */
/*
:deep(.line-number-ephemeral) { ... }
:deep(.line-content-ephemeral) { ... }
*/

.professor-astra-welcome-container {
  @apply text-center p-6 flex flex-col items-center justify-center h-full;
}
.professor-astra-icon-glow {
  color: var(--agent-tutor-accent-color);
  filter: drop-shadow(0 0 18px hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.7))
          drop-shadow(0 0 30px hsla(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), var(--agent-tutor-accent-lightness), 0.5));
  animation: subtlePulse 2.8s infinite ease-in-out;
}
.professor-astra-icon-glow {
    --scale-pulse: 1.04;
    --opacity-pulse: 0.9;
}

.professor-astra-welcome-title {
  @apply text-3xl sm:text-4xl font-bold mt-4 mb-2 tracking-tight;
  color: hsl(var(--agent-tutor-accent-hue), var(--agent-tutor-accent-saturation), calc(var(--agent-tutor-accent-lightness) + 25%));
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
.professor-astra-welcome-subtitle {
  @apply text-lg text-[var(--text-secondary-dark)] mb-6 max-w-lg opacity-90;
}
.professor-astra-welcome-prompt {
  @apply text-base text-[var(--text-muted-dark)] italic;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s var(--ease-out-quad), transform 0.15s var(--ease-out-quad);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@keyframes subtlePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(var(--scale-pulse, 1.04));
    opacity: var(--opacity-pulse, 0.9);
  }
}
</style>