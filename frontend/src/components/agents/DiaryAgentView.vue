// File: frontend/src/components/agents/DiaryAgentView.vue
/**
 * @file DiaryAgentView.vue
 * @description Dedicated view component for the Echo (Diary) agent.
 * Provides a rich interface for interacting with the diary, managing entries,
 * and visualizing thoughts with potential diagrams.
 * @version 1.1.0 - Switched to promptAPI for system prompt loading and refined metadata flow.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, nextTick, type PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store'; // Renamed ChatMessage to StoreChatMessage
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, promptAPI, type ChatMessagePayloadFE, type TextResponseDataFE, type FunctionCallResponseDataFE, type ChatResponseDataFE, type ChatMessageFE } from '@/utils/api'; // Added promptAPI
import type { ToastService } from '@/services/services';
import { BookOpenIcon, PlusCircleIcon, SparklesIcon, TrashIcon, PencilSquareIcon, ArrowPathIcon, CheckCircleIcon as SolidCheckCircleIcon, XCircleIcon, TagIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/vue/24/solid'; // Using solid check
import { marked } from 'marked';
import { diaryService, type DiaryEntry } from '@/services/diary.service';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager'; // Assuming this path

import { themeManager } from '@/theme/ThemeManager';
// If using a specific component for chat messages:
// import StoreChatMessageDisplay from '@/components/common/StoreChatMessageDisplay.vue'; // Example
// For now, assuming messages are simple enough or handled by a global component/CSS if StoreChatMessageDisplay is not defined

declare var mermaid: any; // If mermaid is global

const props = defineProps({
  agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
  (e: 'agent-event', event: { type: 'diary_entry_saved', entryId: string }): void;
  (e: 'agent-event', event: { type: 'diary_entries_cleared' }): void;
}>();

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');
const agentDisplayName = computed(() => props.agentConfig?.label || "Echo");

const isLoadingResponse = ref(false);
const currentAgentSystemPrompt = ref('');

// -- Diary Specific State --
const isComposingSession = ref(false);
const showEntryListModal = ref(false);
const storedEntries = ref<DiaryEntry[]>([]);
const selectedEntryToView = ref<DiaryEntry | null>(null);

const showMetadataConfirmation = ref(false);
const suggestedMetadata = ref<{ title: string; tags: string[]; mood?: string; summary: string; toolCallId: string; toolName: string; } | null>(null);
const userEditedTitle = ref('');
const userEditedTags = ref('');
const userEditedMood = ref('');

const chatLogRef = ref<HTMLElement | null>(null);
const entryPageRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const renderedEntryPageContentHtml = computed(() => {
  if (selectedEntryToView.value) {
    try {
      const header = `# ${selectedEntryToView.value.title}\n**Date:** ${new Date(selectedEntryToView.value.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n**Tags:** ${selectedEntryToView.value.tags.join(', ')}${selectedEntryToView.value.mood ? `  **Mood:** ${selectedEntryToView.value.mood}` : ''}\n\n---\n\n`;
      const fullMarkdown = header + selectedEntryToView.value.contentMarkdown;
      return marked.parse(fullMarkdown, { breaks: true, gfm: true });
    } catch (e) {
      console.error("Error parsing selected diary entry markdown:", e);
      return `<p class="text-red-500 dark:text-red-400">Error displaying entry.</p>`;
    }
  }
  if (isComposingSession.value) {
    const baseText = `## New Diary Entry - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n_Echo is listening... Share your thoughts, and I'll help structure them._\n\n<p class="text-xs text-purple-300/70 dark:text-purple-400/70 mt-4">**(Your entries are saved locally in your browser.)**</p>`;
    if (chatStore.isMainContentStreaming && chatStore.streamingMainContentText.startsWith("##")) {
      return marked.parse(chatStore.streamingMainContentText + '▋', { breaks: true, gfm: true });
    }
    return marked.parse(baseText, { breaks: true, gfm: true });
  }
  const mainContent = chatStore.getMainContentForAgent(props.agentId);
  if (mainContent && (mainContent.type === 'markdown' || mainContent.type === 'welcome' || mainContent.type === 'diary-entry-viewer')) {
      try { return marked.parse(mainContent.data as string, { breaks: true, gfm: true }); }
      catch (e) { console.error("Error parsing main content markdown:", e); return `<p class="text-red-500 dark:text-red-400">Error displaying content.</p>`;}
  }
  return '<div class="flex flex-col items-center justify-center h-full text-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-purple-400/30 dark:text-purple-500/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg><p class="text-slate-400 dark:text-slate-500 italic">Select an entry or start a new one with Echo.</p></div>';
});

const fetchSystemPrompt = async () => {
  const key = props.agentConfig?.systemPromptKey;
  const agentLabel = agentDisplayName.value;
  console.log(`[${agentLabel}] fetchSystemPrompt called with systemPromptKey: "${key}"`);

  if (key) {
    try {
      const response = await promptAPI.getPrompt(`${key}.md`);
      console.log(`[${agentLabel}] Prompt API response for key "${key}.md":`, response);
      if (response && response.data && typeof response.data.content === 'string') {
        currentAgentSystemPrompt.value = response.data.content;
      } else {
        console.error(`[${agentLabel}] Prompt API response for key "${key}" is invalid. Using fallback.`);
        currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool. Consider suggesting mind maps for complex thoughts. Finalize entry in Markdown.";
        toast?.add({type: 'warning', title: 'Prompt Load Issue', message: `Could not load custom instructions for ${agentLabel}. Using default behavior.`});
      }
    } catch (e: any) {
      console.error(`[${agentLabel}] Failed to load system prompt "${key}.md" via API:`, e.response?.data || e.message || e);
      currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool. Consider suggesting mind maps for complex thoughts. Finalize entry in Markdown.";
      toast?.add({type: 'error', title: 'Prompt Load Error', message: `Failed to load instructions for ${agentLabel}.`});
    }
  } else {
    console.warn(`[${agentLabel}] No systemPromptKey defined for agent. Using generic fallback prompt.`);
    currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool. Consider suggesting mind maps for complex thoughts. Finalize entry in Markdown.";
  }
  console.log(`[${agentLabel}] System prompt set (first 100 chars):`, currentAgentSystemPrompt.value.substring(0,100) + "...");
};

watch(() => props.agentConfig?.systemPromptKey, fetchSystemPrompt, { immediate: true });

async function loadStoredEntries() {
  isLoadingResponse.value = true;
  try {
    storedEntries.value = await diaryService.getAllEntries('createdAt', 'desc');
  } catch (error) {
    toast?.add({type: 'error', title: 'Error Loading Entries', message: 'Could not retrieve diary entries.'});
  } finally {
    isLoadingResponse.value = false;
  }
}

const handleNewUserInput = async (text: string, isContinuationOfToolResponse: boolean = false, toolCallIdToRespondTo?: string, toolOutput?: any) => {
  if (!text.trim() && !isContinuationOfToolResponse) {
    toast?.add({type: 'warning', title: 'Empty Input', message: 'Please share some thoughts with Echo.'});
    return;
  }
  isLoadingResponse.value = true;
  isComposingSession.value = true; // Ensure composing mode is active when user sends new input
  selectedEntryToView.value = null; // Clear any viewed entry

  const userMessage: ChatMessageFE = { role: 'user', content: text, timestamp: Date.now() };
  const messagesForLlm: ChatMessageFE[] = [];

  // System Prompt
  if (!currentAgentSystemPrompt.value) await fetchSystemPrompt(); // Ensure prompt is loaded
  
  const generateDiagrams = props.agentConfig.capabilities?.canGenerateDiagrams && (voiceSettingsManager.settings?.generateDiagrams ?? false);
  const recentTopics = storedEntries.value.slice(0, 3).map(e => e.title || e.summary?.substring(0,30)).filter(Boolean).join('; ') || 'your past reflections';

  const finalSystemPrompt = currentAgentSystemPrompt.value
    .replace(/{{CURRENT_DATE}}/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopics)
    .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({ ...agentStore.getAgentContext(props.agentId), isComposingSession: isComposingSession.value }))
    .replace(/{{GENERATE_DIAGRAM}}/g, (generateDiagrams ?? false).toString())
    .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on empathetic follow-up questions. If the user seems to be concluding their thoughts, call `suggestDiaryMetadata`. After metadata confirmation, generate the full Markdown entry. If complex thoughts are shared, consider if a mind map diagram would be helpful to include in the entry.');
  
  messagesForLlm.push({ role: 'system', content: finalSystemPrompt });

  // Add recent chat history from the store for THIS agent (Echo)
  const recentChatMessages = chatStore.getMessagesForAgent(props.agentId)
    .slice(-5) // Get last 5 messages for context
    .map(m => ({ role: m.role, content: m.content, tool_calls: m.tool_calls, tool_call_id: m.tool_call_id, name: m.name } as ChatMessageFE));
  messagesForLlm.push(...recentChatMessages);

  // Add current user message or tool response
  if (isContinuationOfToolResponse && toolCallIdToRespondTo && toolOutput) {
    messagesForLlm.push({
        role: 'tool',
        tool_call_id: toolCallIdToRespondTo,
        name: suggestedMetadata.value?.toolName || 'suggestDiaryMetadata', // Use the stored tool name
        content: JSON.stringify(toolOutput),
    });
    // The user's textual confirmation (like "Okay, save it") is implicitly handled by `text` argument
    // but the main signal is the tool result. We might also add the user's text as a separate message.
     if (text.trim()) { // If user provided text along with confirming tool
        chatStore.addMessage({ role: 'user', content: text, agentId: props.agentId, timestamp: Date.now() });
        // messagesForLlm.push({role: 'user', content: text}); // Add this explicit confirmation to LLM context
     }
  } else {
    chatStore.addMessage({ ...userMessage, agentId: props.agentId }); // Add user message to UI log
    messagesForLlm.push(userMessage);
  }

  // Update UI to show "Echo is composing..." in the entry page area
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `## Echo is Composing...\n\n<div class="flex justify-center my-8"><div class="diary-spinner"></div></div>\n\n_Reflecting on your thoughts to craft the perfect entry..._`,
    title: 'Echo Composing...', timestamp: Date.now()
  });

  try {
    const payload: ChatMessagePayloadFE = {
      messages: messagesForLlm,
      mode: props.agentConfig.id, // 'diary'
      // userId: agentStore.currentUserId || 
      userId: 'diary_user', // Ensure currentUserId is available
      conversationId: chatStore.getCurrentConversationId(props.agentId) || `diary-${Date.now()}`,
      stream: false, // Diary agent might benefit from full response for structured data
    };

    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data as ChatResponseDataFE;

    if (responseData.type === 'function_call_data' || (responseData as TextResponseDataFE).content?.includes('"tool_calls":')) {
        // Handle if response data is FunctionCallResponseDataFE or if content contains tool_calls (OpenAI new format)
        let toolCalls: any[] | undefined;
        let assistantMessageText: string | null = null;

        if (responseData.type === 'function_call_data') {
            const funcCallData = responseData as FunctionCallResponseDataFE;
            toolCalls = [{ id: funcCallData.toolCallId, type: 'function', function: { name: funcCallData.toolName, arguments: JSON.stringify(funcCallData.toolArguments) } }];
            assistantMessageText = funcCallData.assistantMessageText ?? null;
        } else { // Check if text response contains tool_calls array
            const textResponse = responseData as TextResponseDataFE;
            assistantMessageText = textResponse.content;
            try {
                // Attempt to parse content if it might be a JSON string containing the actual message with tool_calls
                // This logic might need refinement based on actual LLM output for tool calls via text
                const parsedContent = JSON.parse(textResponse.content || '{}');
                if (parsedContent.tool_calls) {
                    toolCalls = parsedContent.tool_calls;
                    assistantMessageText = parsedContent.content || assistantMessageText; // Prefer content from parsed object
                }
            } catch (e) { /* Not a JSON string, treat content as is */ }
        }
        
        if (assistantMessageText) { // Store assistant's textual part if any
             chatStore.addMessage({ role: 'assistant', content: assistantMessageText, agentId: props.agentId, model: responseData.model, timestamp: Date.now(), tool_calls: toolCalls });
        } else if (toolCalls) { // If no text but tool_calls exist, store a message indicating tool use
             chatStore.addMessage({ role: 'assistant', content: null, agentId: props.agentId, model: responseData.model, timestamp: Date.now(), tool_calls: toolCalls });
        }


        if (toolCalls && toolCalls[0].function.name === 'suggestDiaryMetadata') {
            const args = JSON.parse(toolCalls[0].function.arguments);
            suggestedMetadata.value = {
                title: args.tentativeTitle || `Entry - ${new Date().toLocaleDateString()}`,
                tags: args.suggestedTags || [],
                mood: args.suggestedMood || undefined,
                summary: args.summaryOfDiscussion || "Summary of your thoughts.",
                toolCallId: toolCalls[0].id,
                toolName: toolCalls[0].function.name,
            };
            userEditedTitle.value = suggestedMetadata.value.title;
            userEditedTags.value = suggestedMetadata.value.tags.join(', ');
            userEditedMood.value = suggestedMetadata.value.mood || '';
            showMetadataConfirmation.value = true;
            toast?.add({type:'info', title:'Entry Details Suggested', message:'Echo has suggested a title, tags, and mood. Please review.'});
        } else if (toolCalls) {
            // Handle other potential tools if any in the future
            console.warn("Received unhandled tool call:", toolCalls[0].function.name);
            // For now, just acknowledge
            await handleNewUserInput(`Okay, I see a tool call for ${toolCalls[0].function.name}. How should I proceed?`, true, toolCalls[0].id, {status: "Tool call received, pending action."} )
        }

    } else if ((responseData as TextResponseDataFE).content) { // Standard text response
      const assistantResponse = (responseData as TextResponseDataFE).content!;
      chatStore.addMessage({ role: 'assistant', content: assistantResponse, agentId: props.agentId, model: responseData.model, timestamp: Date.now() });
      
      // If this response is the final diary entry markdown (e.g., after metadata confirmation)
      const looksLikeFinalEntry = assistantResponse.trim().startsWith("## ") && isComposingSession.value && !showMetadataConfirmation.value;
      if (looksLikeFinalEntry && suggestedMetadata.value === null) { // Check if it's a direct finalization without tool call, or after tool_response
          // Heuristic: if it starts with H2 and we were composing, assume it's the final entry.
          // This might happen if the LLM decides to finalize without the tool_call explicitly.
          const title = agentStore.getAgentContext(props.agentId)?.finalEntryTitle || `Entry - ${new Date().toLocaleDateString()}`;
          const tags = agentStore.getAgentContext(props.agentId)?.finalEntryTags || [];
          const mood = agentStore.getAgentContext(props.agentId)?.finalEntryMood;

          const newEntry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'> = {
              title: title,
              contentMarkdown: assistantResponse, // The full markdown from LLM
              tags: Array.isArray(tags) ? tags : [],
              mood: mood,
              summary: agentStore.getAgentContext(props.agentId)?.finalEntrySummary || assistantResponse.substring(0,150) + "..."
          };
          const savedEntry = await diaryService.saveEntry(newEntry);
          toast?.add({type:'success', title:'Diary Entry Saved!', message:`"${savedEntry.title}" has been saved.`});
          emit('agent-event', {type:'diary_entry_saved', entryId: savedEntry.id});
          await loadStoredEntries();
          viewEntry(savedEntry); // Automatically view the newly saved entry
          isComposingSession.value = false;
          agentStore.clearAgentContext();
      } else {
        // Default behavior: update main content with the assistant's textual response for chat display
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: assistantResponse,
            title: `Echo Responding...`, timestamp: Date.now()
        });
      }
    }

  } catch (error: any) {
    console.error(`[${agentDisplayName.value}] Error in handleNewUserInput:`, error);
    toast?.add({ type: 'error', title: 'Interaction Error', message: 'Echo encountered a problem. Please try again.' });
    chatStore.addMessage({role:'error', content: `Error: ${error.message}`, agentId: props.agentId});
  } finally {
    isLoadingResponse.value = false;
    scrollToChatBottom();
    // Do not set isComposingSession to false here, allow user to continue conversation or finalize.
  }
};

const confirmMetadataAndFinalize = async () => {
  if (!suggestedMetadata.value) return;
  
  const finalTitle = userEditedTitle.value.trim() || suggestedMetadata.value.title;
  const finalTags = userEditedTags.value.split(',').map(t => t.trim()).filter(t => t);
  const finalMood = userEditedMood.value.trim() || suggestedMetadata.value.mood;

  const userConfirmationText = `Okay, let's use title: "${finalTitle}", tags: "${finalTags.join(', ')}", and mood: "${finalMood || 'not specified'}". Please write the full entry based on our discussion and your summary: "${suggestedMetadata.value.summary}".`;
  
  // Update agent context for the LLM to use when generating the final entry
  agentStore.updateAgentContext({
      finalEntryTitle: finalTitle,
      finalEntryTags: finalTags,
      finalEntryMood: finalMood,
      finalEntrySummary: suggestedMetadata.value.summary,
  });

  showMetadataConfirmation.value = false;
  await handleNewUserInput(userConfirmationText, true, suggestedMetadata.value.toolCallId, {
    status: "Metadata confirmed by user.",
    confirmedTitle: finalTitle,
    confirmedTags: finalTags,
    confirmedMood: finalMood,
    originalSummary: suggestedMetadata.value.summary
  });
  suggestedMetadata.value = null; // Clear after sending
};

const cancelMetadataSuggestion = () => {
  if (!suggestedMetadata.value) return;
  showMetadataConfirmation.value = false;
  const cancellationText = "Actually, let's hold off on finalizing. I want to add more to my thoughts.";
  chatStore.addMessage({ role: 'user', content: cancellationText, agentId: props.agentId, timestamp: Date.now() });
  
  // We don't need to send this to LLM necessarily, just clear state and allow user to continue
  suggestedMetadata.value = null;
  toast?.add({type:'info', title:'Suggestion Cancelled', message:'You can continue adding to your current entry.'});
  isComposingSession.value = true; // Ensure still composing
  scrollToChatBottom();
};

const startNewEntrySession = async () => {
  isComposingSession.value = true;
  selectedEntryToView.value = null;
  agentStore.clearAgentContext();
  showMetadataConfirmation.value = false;
  suggestedMetadata.value = null;
  
  const promptText = "Let's start a new diary entry. What's on your mind today? Feel free to share anything.";
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `## New Diary Entry - ${new Date().toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}\n\n_Echo is listening... Share your thoughts, and I'll help structure them._\n\n<p class="text-xs text-purple-300/70 dark:text-purple-400/70 mt-4">**(Your entries are saved locally in your browser.)**</p>`,
    title: `Drafting New Entry...`, timestamp: Date.now()
  });
  chatStore.addMessage({ role: 'assistant', content: promptText, timestamp: Date.now(), agentId: props.agentId });
  toast?.add({type:'info', title:'New Diary Entry Session', message:'Echo is ready to listen.'});
  scrollToChatBottom();
};

const viewEntry = (entry: DiaryEntry) => {
  selectedEntryToView.value = entry;
  isComposingSession.value = false;
  showEntryListModal.value = false;
  showMetadataConfirmation.value = false;
  toast?.add({type:'info', title:'Viewing Entry', message: `Displaying "${entry.title}"`});
  nextTick(() => { entryPageRef.value?.scrollTo({ top: 0, behavior: 'smooth' }); });
  // Render mermaid diagrams if present in the viewed entry
  nextTick(async () => {
    if (entryPageRef.value && typeof mermaid !== 'undefined' && entry.contentMarkdown.includes('```mermaid')) {
        await nextTick(); // Ensure DOM is fully updated with new content
        try {
            const mermaidElements = entryPageRef.value.querySelectorAll('.mermaid');
            if (mermaidElements.length > 0) {
                mermaid.run({nodes: mermaidElements});
            }
        } catch (e) { console.error('[DiaryAgentView] Error rendering Mermaid for viewed entry:', e); }
    }
  });
};

async function deleteEntryFromList(entryId: string, entryTitle: string) {
  if (confirm(`Are you sure you want to delete the entry: "${entryTitle}"? This cannot be undone.`)) {
    try {
      await diaryService.deleteEntry(entryId);
      toast?.add({type:'success', title:'Entry Deleted', message:`"${entryTitle}" has been removed.`});
      if (selectedEntryToView.value?.id === entryId) {
        selectedEntryToView.value = null;
        setDefaultMainContent();
      }
      await loadStoredEntries();
    } catch (error) {
      toast?.add({type:'error', title:'Deletion Failed', message:'Could not delete the entry.'});
      console.error('[DiaryAgentView] Error deleting entry:', error);
    }
  }
}

async function clearAllDiaryEntries() {
  if (confirm("Are you absolutely sure you want to delete ALL diary entries? This action is permanent.")) {
    if (confirm("Second confirmation: Deleting all entries. This is your last chance to cancel.")) {
        try {
          await diaryService.clearAllEntries();
          toast?.add({type:'success', title:'All Entries Cleared', message:'Your diary is now empty.'});
          storedEntries.value = [];
          selectedEntryToView.value = null;
          setDefaultMainContent();
          emit('agent-event', {type: 'diary_entries_cleared'});
        } catch (error) {
          toast?.add({type:'error', title:'Clear All Failed', message:'Could not clear all entries.'});
          console.error('[DiaryAgentView] Error clearing all entries:', error);
        }
    }
  }
}

const setDefaultMainContent = () => {
  const latestEntryTitles = storedEntries.value.length > 0 
    ? storedEntries.value.slice(0,2).map(e=>`"${e.title}"`).join(' and ') 
    : "your previous reflections";
  const welcomeMessage = `### ${agentDisplayName.value} - Your Empathetic Companion\n${props.agentConfig.description}\n\nYour diary entries are stored locally in your browser. You can start a new entry by talking to Echo, or browse existing entries using the "My Entries" button.\n\n${storedEntries.value.length > 0 ? `Recent entries include discussions about ${latestEntryTitles}.` : 'Ready to capture your thoughts.'}\n\nI can also help visualize complex thoughts with simple mind maps if you'd like!`;
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: welcomeMessage,
    title: `${agentDisplayName.value} Ready`, timestamp: Date.now(),
  });
};

const scrollToChatBottom = () => {
  nextTick(() => { 
    if (chatLogRef.value) {
      chatLogRef.value.scrollTo({ top: chatLogRef.value.scrollHeight, behavior: 'smooth' });
    }
  });
};

const triggerImport = () => { fileInputRef.value?.click(); };

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.type !== 'application/json') {
        toast?.add({type: 'error', title: 'Invalid File Type', message: 'Please select a valid JSON file for import.'});
        input.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonString = e.target?.result as string;
        const result = await diaryService.importEntries(jsonString);
        if (result.error) {
          toast?.add({type: 'error', title: 'Import Failed', message: result.error, duration: 7000});
        } else {
          toast?.add({type: 'success', title: 'Import Successful', message: `Imported ${result.importedCount} entries. Skipped ${result.skippedCount} duplicates/invalid.`});
          await loadStoredEntries();
          showEntryListModal.value = false;
        }
      } catch (err: any) {
        toast?.add({type: 'error', title: 'Import Error', message: `Could not parse file: ${err.message}`, duration: 7000});
      }
    };
    reader.onerror = () => toast?.add({type: 'error', title: 'File Read Error', message: 'Could not read the selected file.'});
    reader.readAsText(file);
    input.value = '';
  }
};

const exportAllEntries = async () => {
  if (storedEntries.value.length === 0) {
    toast?.add({type:'info', title:'No Entries', message:'There are no entries to export.'});
    return;
  }
  try {
    const jsonString = await diaryService.exportEntries();
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    link.setAttribute("download", `VCA_EchoDiary_Export_${timestamp}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast?.add({type:'success', title:'Export Successful', message:'Your diary entries have been downloaded.'});
  } catch (error) {
    toast?.add({type:'error', title:'Export Failed', message:'Could not export entries.'});
    console.error('[DiaryAgentView] Error exporting entries:', error);
  }
};

// Watch for changes in displayed HTML content to re-render Mermaid diagrams
watch(renderedEntryPageContentHtml, async (newHtml) => {
    if (newHtml && typeof mermaid !== 'undefined' && newHtml.includes('class="mermaid"')) { // Check if mermaid content exists
        await nextTick(); // Ensure DOM is updated
        try {
            const container = entryPageRef.value; // The main container for the rendered HTML
            if (container) {
                const mermaidElements = container.querySelectorAll('.mermaid');
                if (mermaidElements.length > 0) {
                    console.log(`[${agentDisplayName.value}] Found ${mermaidElements.length} Mermaid elements to render in entry page.`);
                    mermaid.run({ nodes: mermaidElements });
                }
            }
        } catch (e) {
            console.error(`[${agentDisplayName.value}] Error rendering Mermaid diagrams in entry page:`, e);
        }
    }
}, { deep: false, immediate: true }); // Immediate might be needed if initial content has diagrams


defineExpose({ handleNewUserInput });

onMounted(async () => {
  console.log(`[${agentDisplayName.value}] View Mounted. Agent Config:`, props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  
  if(typeof mermaid !== 'undefined' && mermaid.initialize) {
      mermaid.initialize({ startOnLoad: false, theme: themeManager.getCurrentTheme().value?.isDark ? 'dark' : 'default' });
  }

  await loadStoredEntries();
  if (!selectedEntryToView.value && !isComposingSession.value && storedEntries.value.length === 0) {
    setDefaultMainContent();
  } else if (storedEntries.value.length > 0 && !selectedEntryToView.value && !isComposingSession.value) {
    // If entries exist but none are selected/composing, view the latest one or show welcome
    // viewEntry(storedEntries.value[0]); // Option: view latest
    setDefaultMainContent(); // Option: show welcome
  }
  scrollToChatBottom(); // Scroll chat log on mount
});

onUnmounted(() => {
  // Cleanup if needed
});

</script>

<template>
  <div class="diary-agent-view flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-950 text-slate-100 dark:from-slate-950 dark:via-purple-950/50 dark:to-black">
    <div class="agent-header-controls p-3 px-4 border-b border-purple-400/20 dark:border-purple-600/30 flex items-center justify-between gap-2 shadow-lg bg-slate-900/50 dark:bg-slate-950/60 backdrop-blur-md z-10">
      <div class="flex items-center gap-3">
        <BookOpenIcon class="w-7 h-7 shrink-0 text-purple-300 dark:text-purple-400 opacity-80 filter-glow-purple" />
        <span class="font-semibold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 dark:from-purple-400 dark:via-pink-500 dark:to-rose-500">{{ agentDisplayName }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showEntryListModal = true" class="btn-header-action" title="View Past Entries">
          <ArrowPathIcon class="w-4 h-4" :class="{'animate-spin': isLoadingResponse && showEntryListModal}"/> My Entries
        </button>
        <button @click="startNewEntrySession" class="btn-header-action btn-primary-glow" title="Start a New Diary Entry">
          <PlusCircleIcon class="w-4 h-4"/> New Entry
        </button>
      </div>
    </div>

    <div class="flex-grow flex flex-col md:flex-row overflow-hidden diary-layout-container">
      <div ref="chatLogRef" class="w-full md:w-2/5 p-3.5 flex flex-col space-y-3 overflow-y-auto custom-scrollbar-diary-chat ephemeral-chat-panel border-r-0 md:border-r border-purple-500/10 dark:border-purple-700/20">
        <template v-for="message in chatStore.getMessagesForAgent(props.agentId)" :key="message.id">
            <div :class="[
                'chat-message-item-diary p-2 rounded-lg text-sm max-w-[90%] break-words shadow-md',
                message.role === 'user' ? 'ml-auto bg-pink-500/20 dark:bg-pink-700/30 border border-pink-500/40 dark:border-pink-600/50 text-pink-100 dark:text-pink-200' : '',
                message.role === 'assistant' ? 'mr-auto bg-purple-500/20 dark:bg-purple-700/30 border border-purple-500/40 dark:border-purple-600/50 text-purple-100 dark:text-purple-200' : '',
                message.role === 'system' || message.role === 'error' ? 'mx-auto bg-slate-600/30 dark:bg-slate-700/40 border border-slate-500/40 text-slate-300 dark:text-slate-400 text-xs italic' : ''
            ]">
                <div v-if="message.role === 'assistant' && message.tool_calls && message.tool_calls.length > 0 && !showMetadataConfirmation"
                     class="p-2.5 my-1 text-xs rounded-lg bg-slate-700/60 dark:bg-slate-800/70 border border-purple-500/40 dark:border-purple-600/50 text-purple-200 dark:text-purple-300 italic shadow-md">
                  <p class="font-semibold mb-1">Echo is suggesting entry details:</p>
                  <p v-if="message.content">{{ message.content }}</p>
                  <button @click="() => {
                                  const tc = message.tool_calls![0];
                                  const args = JSON.parse(tc.function.arguments);
                                  suggestedMetadata = { 
                                      title: args.tentativeTitle || '', 
                                      tags: args.suggestedTags || [], 
                                      mood: args.suggestedMood, 
                                      summary: args.summaryOfDiscussion || '', 
                                      toolCallId: tc.id, 
                                      toolName: tc.function.name 
                                  };
                                  userEditedTitle = suggestedMetadata!.title; 
                                  userEditedTags = (suggestedMetadata!.tags || []).join(', '); 
                                  userEditedMood = suggestedMetadata!.mood || '';
                                  showMetadataConfirmation = true;
                                }" 
                          class="text-pink-400 dark:text-pink-500 hover:text-pink-300 dark:hover:text-pink-400 underline mt-1 text-xxs">Review & Confirm Details</button>
                </div>
                <div v-else v-html="marked.parse(message.content || (message.role === 'error' ? '*Error processing message*' : '...'), { breaks: true, gfm: true })"></div>
            </div>
        </template>
        <div v-if="!chatStore.getMessagesForAgent(props.agentId).length && !isComposingSession" 
             class="text-center py-10 text-purple-300/50 dark:text-purple-400/50 italic text-sm opacity-70">
          Chat with Echo to compose your thoughts. Entries are saved locally.
        </div>
        <div v-if="isLoadingResponse && !isComposingSession && !showMetadataConfirmation" 
             class="flex justify-center items-center p-4 opacity-60">
          <SparklesIcon class="w-5 h-5 text-purple-300 dark:text-purple-400 animate-pulse filter-glow-purple" />
          <span class="ml-2 text-xs text-purple-200/70 dark:text-purple-300/70">Echo is thinking...</span>
        </div>

        <transition name="slide-up-fade">
          <div v-if="showMetadataConfirmation && suggestedMetadata" 
               class="sticky bottom-0 mt-auto p-4 border-t-2 border-purple-500/30 dark:border-purple-700/40 bg-slate-800/70 dark:bg-slate-900/80 rounded-t-lg shadow-2xl metadata-form backdrop-blur-sm">
            <h4 class="text-sm font-semibold text-purple-200 dark:text-purple-300 mb-2.5">Confirm Entry Details:</h4>
            <div class="space-y-2.5 text-xs">
              <div>
                <label for="editTitle" class="block text-purple-300/80 dark:text-purple-400/80 mb-1 font-medium">Title:</label>
                <input id="editTitle" type="text" v-model="userEditedTitle" class="form-input-diary" />
              </div>
              <div>
                <label for="editTags" class="block text-purple-300/80 dark:text-purple-400/80 mb-1 font-medium">Tags (comma-separated):</label>
                <input id="editTags" type="text" v-model="userEditedTags" class="form-input-diary" />
              </div>
              <div>
                <label for="editMood" class="block text-purple-300/80 dark:text-purple-400/80 mb-1 font-medium">Mood (optional):</label>
                <input id="editMood" type="text" v-model="userEditedMood" class="form-input-diary" />
              </div>
            </div>
            <div class="flex justify-end gap-2.5 mt-4">
              <button @click="cancelMetadataSuggestion" class="btn btn-secondary btn-xs !py-1.5 !px-2.5 !text-xs">Cancel</button>
              <button @click="confirmMetadataAndFinalize" class="btn btn-primary-glow btn-xs !py-1.5 !px-2.5 !text-xs"><SolidCheckCircleIcon class="w-4 h-4 mr-1"/> Confirm & Save</button>
            </div>
          </div>
        </transition>
      </div>

      <div ref="entryPageRef" class="w-full md:w-3/5 p-4 sm:p-6 md:p-8 flex-grow relative min-h-0 custom-scrollbar-diary-entry diary-page-panel overflow-y-auto">
        <div v-if="isLoadingResponse && isComposingSession && !showMetadataConfirmation" class="loading-overlay-diary-page">
          <SparklesIcon class="w-12 h-12 text-purple-300 dark:text-purple-400 animate-ping opacity-70 filter-glow-purple-strong" />
          <p class="mt-3 text-sm text-purple-200/70 dark:text-purple-300/70 tracking-wider">Echo is listening intently...</p>
        </div>
        
        <div class="prose prose-sm sm:prose-base dark:prose-invert max-w-none h-full diary-entry-content relative"
             :class="{'opacity-50 blur-[1px]': isLoadingResponse && isComposingSession && !showMetadataConfirmation}"
             v-html="renderedEntryPageContentHtml">
        </div>
        
        <div v-if="selectedEntryToView && !isComposingSession" class="absolute bottom-5 right-5 md:bottom-7 md:right-7 flex gap-3 diary-actions-corner">
          <button @click="() => toast?.add({type:'info', title:'Share Not Implemented', message:'Sharing entries coming soon.'})" class="btn-icon-diary" title="Share This Entry (Coming Soon)">
            <ShareIcon class="w-5 h-5"/>
          </button>
          <button @click="deleteEntryFromList(selectedEntryToView!.id, selectedEntryToView!.title)" class="btn-icon-diary" title="Delete This Entry">
            <TrashIcon class="w-5 h-5"/>
          </button>
          <button @click="() => { toast?.add({type: 'info', title:'Edit Not Implemented', message:'Editing entries coming soon.'})}" class="btn-icon-diary" title="Edit This Entry (Coming Soon)">
            <PencilSquareIcon class="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showEntryListModal" @click.self="showEntryListModal = false" class="fixed inset-0 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4 sm:p-6">
        <div class="bg-gradient-to-br from-slate-800/80 via-purple-900/40 to-slate-800/80 dark:from-slate-900/90 dark:via-purple-950/60 dark:to-slate-900/90 border border-purple-500/50 dark:border-purple-700/60 p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col glass-pane-dark">
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-purple-400/25 dark:border-purple-600/30">
            <h3 class="text-xl sm:text-2xl font-semibold text-purple-300 dark:text-purple-400 flex items-center gap-2.5"><BookOpenIcon class="w-6 h-6 opacity-80"/> Your Diary Entries</h3>
            <button @click="showEntryListModal = false" class="btn-icon-close">&times;</button>
          </div>
          <div class="flex items-center justify-between mb-3 gap-2">
            <button @click="triggerImport" class="btn-header-action btn-xs !py-1 !px-2.5" title="Import Entries from JSON">
              <ArrowUpTrayIcon class="w-3.5 h-3.5 mr-1"/> Import
            </button>
            <input type="file" ref="fileInputRef" @change="handleFileUpload" accept=".json" style="display: none;" />
            <button @click="exportAllEntries" class="btn-header-action btn-xs !py-1 !px-2.5" title="Export All Entries to JSON">
              <ArrowDownTrayIcon class="w-3.5 h-3.5 mr-1"/> Export All
            </button>
          </div>
          <div class="flex-grow overflow-y-auto custom-scrollbar-futuristic pr-2 space-y-2.5">
            <p v-if="isLoadingResponse && storedEntries.length === 0" class="text-slate-400 dark:text-slate-500 italic text-center py-8">Loading entries...</p>
            <p v-else-if="storedEntries.length === 0" class="text-slate-400 dark:text-slate-500 italic text-center py-8">No entries found. Your thoughts await!</p>
            <div v-for="entry in storedEntries" :key="entry.id"
                 @click="() => { viewEntry(entry); }"
                 class="entry-list-item group p-3.5 bg-slate-700/50 dark:bg-slate-800/60 hover:bg-purple-600/40 dark:hover:bg-purple-700/50 rounded-lg cursor-pointer transition-all duration-200 border border-purple-500/25 dark:border-purple-700/30 hover:border-purple-400/70 dark:hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-600/30">
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-purple-300 dark:text-purple-400 group-hover:text-pink-300 dark:group-hover:text-pink-400 text-base mb-0.5">{{ entry.title }}</h4>
                <span class="text-xxs text-slate-500 dark:text-slate-400 group-hover:text-slate-400 dark:group-hover:text-slate-300">{{ new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year:'2-digit'}) }}</span>
              </div>
              <p v-if="entry.tags && entry.tags.length" class="text-xs text-purple-400/80 dark:text-purple-500/80 mt-1 flex flex-wrap gap-1 items-center">
                <TagIcon class="w-3.5 h-3.5 mr-0.5 opacity-70"/> {{ entry.tags.join(', ') }}
              </p>
              <p v-if="entry.summary" class="text-xs text-slate-300/80 dark:text-slate-400/80 mt-1.5 truncate">{{ entry.summary }}</p>
              <p v-else class="text-xs text-slate-400/70 dark:text-slate-500/70 mt-1.5 italic truncate">{{ entry.contentMarkdown.substring(0, 80) }}...</p>
            </div>
          </div>
          <div v-if="storedEntries.length > 0" class="mt-5 pt-4 border-t border-purple-500/25 dark:border-purple-700/30 flex justify-end">
              <button @click="clearAllDiaryEntries" class="btn btn-danger-outline btn-xs !py-1.5 !px-3 text-xs">
                <TrashIcon class="w-3.5 h-3.5 mr-1.5"/> Clear All Entries
              </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
/* Styles from original user prompt */
:host, .diary-agent-view {
  --agent-diary-purple-h: 270;
  --agent-diary-purple-s: 60%; /* Adjusted for more vibrancy based on usage */
  --agent-diary-purple-l: 65%; /* Adjusted */
  
  --agent-diary-pink-h: 330;
  --agent-diary-pink-s: 75%; /* Adjusted */
  --agent-diary-pink-l: 70%; /* Adjusted */

  --agent-diary-neutral-h: 230; /* Cool neutral for diary */
}
/* General filter for icons or elements needing a soft purple glow */
.filter-glow-purple {
  filter: drop-shadow(0 0 8px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.6));
}
.dark .filter-glow-purple {
  filter: drop-shadow(0 0 10px hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 10%), calc(var(--agent-diary-purple-l) + 5%), 0.7));
}
/* Stronger glow for more prominent elements like loading spinners */
.filter-glow-purple-strong { 
  filter: drop-shadow(0 0 12px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.75))
          drop-shadow(0 0 22px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.45));
}
.dark .filter-glow-purple-strong {
  filter: drop-shadow(0 0 15px hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 10%), calc(var(--agent-diary-purple-l) + 5%), 0.85))
          drop-shadow(0 0 28px hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 10%), calc(var(--agent-diary-purple-l) + 5%), 0.55));
}

/* Header Buttons */
.btn-header-action {
  @apply btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 transition-all duration-200 ease-out;
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.4);
  background-color: hsla(var(--agent-diary-neutral-h), 15%, 25%, 0.4); 
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 20%));
  text-shadow: 0 1px 2px hsla(var(--agent-diary-neutral-h), 20%, 10%, 0.5);
  &:hover {
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 10%), 0.8);
    background-color: hsla(var(--agent-diary-neutral-h), 15%, 30%, 0.7);
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 25%));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.25);
  }
}
.dark .btn-header-action { /* Dark mode specific adjustments */
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 5%), 0.5);
  background-color: hsla(var(--agent-diary-neutral-h), 20%, 18%, 0.6);
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 20%));
   &:hover {
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 15%), 0.9);
    background-color: hsla(var(--agent-diary-neutral-h), 20%, 22%, 0.8);
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 30%));
   }
}
/* Primary Glow Button (e.g., New Entry) */
.btn-header-action.btn-primary-glow { 
  @apply bg-gradient-to-r text-white border-transparent shadow-lg;
  --gradient-from: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l));
  --gradient-to: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), var(--agent-diary-pink-l));
  background-image: linear-gradient(to right, var(--gradient-from), var(--gradient-to));
  &:hover {
    --gradient-from-hover: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 5%));
    --gradient-to-hover: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 5%));
    background-image: linear-gradient(to right, var(--gradient-from-hover), var(--gradient-to-hover));
    box-shadow: 0 0 18px hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) - 10%), 0.6);
  }
}

/* Chat Panel Styling */
.ephemeral-chat-panel {
  background: linear-gradient(160deg, 
    hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 25%), 0.6) 0%, 
    hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 5%), calc(var(--agent-diary-purple-l) - 30%), 0.75) 100%
  );
  backdrop-filter: blur(5px) brightness(0.9);
  box-shadow: inset -10px 0px 20px -8px rgba(0,0,0,0.3); 
  position: relative; 
  &::after { 
    content: ''; 
    @apply absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10;
    background: linear-gradient(to bottom, transparent, 
      hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 5%), calc(var(--agent-diary-purple-l) - 30%), 1) 90%
    );
  }
}
.dark .ephemeral-chat-panel {
   background: linear-gradient(160deg, 
    hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) - 10%), calc(var(--agent-diary-purple-l) - 35%), 0.7) 0%, 
    hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 40%), 0.85) 100%
  );
   &::after {
     background: linear-gradient(to bottom, transparent, 
      hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 40%), 1) 90%
    );
   }
}

/* Textarea style for metadata form */
.form-input-diary { 
  @apply w-full block px-2.5 py-1.5 rounded-md text-xs border;
  background-color: hsla(var(--agent-diary-neutral-h), 10%, 20%, 0.7); 
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 15%), 0.6);
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 15%));
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  &::placeholder { color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s), var(--agent-diary-pink-l), 0.6); }
  &:focus {
    outline: none;
    border-color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), var(--agent-diary-pink-l));
    background-color: hsla(var(--agent-diary-neutral-h), 10%, 25%, 0.8);
    box-shadow: 0 0 0 2px hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s), var(--agent-diary-pink-l), 0.3);
  }
}
.dark .form-input-diary {
  background-color: hsla(var(--agent-diary-neutral-h), 12%, 15%, 0.8); 
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 10%), 0.7);
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 20%));
   &::placeholder { color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 5%), 0.6); }
   &:focus {
    border-color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 5%));
    background-color: hsla(var(--agent-diary-neutral-h), 12%, 20%, 0.9);
   }
}

/* Entry Page Styling */
.diary-page-panel {
  background: 
    radial-gradient(ellipse at 50% -30%, hsla(var(--agent-diary-pink-h), 25%, 20%, 0.2), transparent 60%), /* Softer top glow */
    radial-gradient(ellipse at 15% 95%, hsla(var(--agent-diary-purple-h), 30%, 25%, 0.15), transparent 60%), /* Softer bottom glow */
    hsl(var(--agent-diary-neutral-h), 15%, 12%); /* Slightly lighter base for better readability */
  border-left: 1px solid hsla(var(--agent-diary-purple-h), 30%, 50%, 0.15); 
  box-shadow: 
    inset 8px 0px 25px -12px rgba(0,0,0,0.4), 
    0 0 80px hsla(var(--agent-diary-purple-h), 20%, 8%, 0.25) inset; 
  position: relative; 
  &::before { /* Subtle animated border */
    content: ""; 
    @apply absolute inset-[-1px] pointer-events-none z-0;
    border-radius: inherit; 
    border: 1px solid transparent;
    background: linear-gradient(120deg, 
      hsla(var(--agent-diary-pink-h),70%,70%,0.1), 
      hsla(var(--agent-diary-purple-h),60%,60%,0.1), 
      hsla(var(--agent-diary-pink-h),70%,70%,0.1)
    ) border-box; 
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; 
    mask-composite: exclude;
    opacity: 0.5;
    animation: subtle-border-pulse 10s infinite alternate ease-in-out; 
  }
}
.dark .diary-page-panel { /* Dark mode adjustments */
  background: 
    radial-gradient(ellipse at 50% -30%, hsla(var(--agent-diary-pink-h), 30%, 15%, 0.25), transparent 60%),
    radial-gradient(ellipse at 15% 95%, hsla(var(--agent-diary-purple-h), 35%, 20%, 0.2), transparent 60%),
    hsl(var(--agent-diary-neutral-h), 12%, 8%); 
  border-left-color: hsla(var(--agent-diary-purple-h), 35%, 40%, 0.2);
  box-shadow: 
    inset 8px 0px 25px -12px rgba(0,0,0,0.5), 
    0 0 100px hsla(var(--agent-diary-purple-h), 25%, 5%, 0.3) inset;
   &::before {
     background: linear-gradient(120deg, 
      hsla(var(--agent-diary-pink-h),80%,60%,0.15), 
      hsla(var(--agent-diary-purple-h),70%,50%,0.15), 
      hsla(var(--agent-diary-pink-h),80%,60%,0.15)
    ) border-box;
   }
}
@keyframes subtle-border-pulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

/* Styles for elements within v-html (prose) */
.diary-entry-content :deep(h2) { 
  @apply text-transparent bg-clip-text bg-gradient-to-r pb-2.5 mb-6 text-2xl font-bold tracking-tight;
  --title-gradient-from: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 15%));
  --title-gradient-to: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 15%));
  background-image: linear-gradient(to right, var(--title-gradient-from), var(--title-gradient-to));
  border-bottom: 1px solid hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.3);
  text-shadow: 0 0 12px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.4);
}
.diary-entry-content :deep(strong) { 
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 10%)); font-weight: 600;
}
.diary-entry-content :deep(p),
.diary-entry-content :deep(ul), 
.diary-entry-content :deep(ol) { 
  color: hsl(var(--text-secondary-dark-h, var(--agent-diary-pink-h)), calc(var(--text-secondary-dark-s, var(--agent-diary-pink-s)) - 20%), calc(var(--text-secondary-dark-l, var(--agent-diary-pink-l)) - 10%));
  @apply leading-relaxed text-base my-3;
}
.diary-entry-content :deep(hr) { 
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.3); @apply my-6;
}
.diary-entry-content :deep(a) { 
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 5%));
  &:hover { color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 10%)); }
}
/* Mermaid specific styles within entry content */
.diary-entry-content :deep(.mermaid) {
  @apply p-3 my-4 rounded-lg bg-slate-800/40 dark:bg-slate-900/50 border border-purple-500/30 dark:border-purple-600/40 shadow-md;
  svg { @apply max-w-full h-auto block mx-auto; }
}


/* Small text helper */
.text-xxs { @apply text-[0.7rem] leading-snug; }

/* Action buttons in the corner of entry view */
.btn-icon-diary {
  @apply p-2.5 rounded-lg transition-all duration-150 shadow-lg active:scale-90 backdrop-blur-sm;
  background-color: hsla(var(--agent-diary-neutral-h), 10%, 20%, 0.5); 
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), var(--agent-diary-pink-l)); 
  border: 1px solid hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 15%), 0.3);
  &:hover {
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 25%), 0.6);
    color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 15%)); 
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 5%), 0.6);
    box-shadow: 0 0 12px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 5%), 0.45);
  }
}
.dark .btn-icon-diary { /* Dark mode adjustments */
  background-color: hsla(var(--agent-diary-neutral-h), 12%, 15%, 0.6);
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 5%));
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 10%), 0.4);
   &:hover {
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) - 20%), 0.7);
    color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s), calc(var(--agent-diary-pink-l) + 20%));
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.7);
   }
}
/* Modal close button */
.btn-icon-close { 
  @apply p-1.5 rounded-full transition-colors duration-150 ease-in-out;
  color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.7);
  &:hover {
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s), calc(var(--agent-diary-purple-l) + 15%));
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.3);
  }
}
/* Entry list item hover effect */
.entry-list-item:hover h4 { 
  text-shadow: 0 0 10px hsla(var(--agent-diary-pink-h), calc(var(--agent-diary-pink-s) + 10%), calc(var(--agent-diary-pink-l) + 5%), 0.8);
}
/* Modal transition styles */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-fade-enter-active .glass-pane-dark, 
.modal-fade-leave-active .glass-pane-dark {
  transition: opacity 0.3s var(--ease-out-cubic, ease-out), transform 0.3s var(--ease-out-cubic, ease-out);
}
.modal-fade-enter-from .glass-pane-dark, 
.modal-fade-leave-to .glass-pane-dark {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
/* Scrollbar theming for diary view panels */
.custom-scrollbar-diary-chat,
.custom-scrollbar-diary-entry { 
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-track {
    background-color: hsla(var(--agent-diary-purple-h), 20%, 15%, 0.2); 
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--agent-diary-purple-h), 40%, 50%, 0.5); 
    border-radius: 10px;
    border: 2px solid transparent; /* Creates padding around thumb */
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: hsla(var(--agent-diary-pink-h), 50%, 60%, 0.7); 
  }
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: hsla(var(--agent-diary-purple-h), 40%, 50%, 0.5) hsla(var(--agent-diary-purple-h), 20%, 15%, 0.2); /* For Firefox */
}
.dark .custom-scrollbar-diary-chat, /* Dark mode scrollbar */
.dark .custom-scrollbar-diary-entry {
   &::-webkit-scrollbar-track { background-color: hsla(var(--agent-diary-purple-h), 25%, 10%, 0.3); }
   &::-webkit-scrollbar-thumb { background-color: hsla(var(--agent-diary-purple-h), 45%, 45%, 0.6); }
   &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--agent-diary-pink-h), 55%, 55%, 0.8); }
   scrollbar-color: hsla(var(--agent-diary-purple-h), 45%, 45%, 0.6) hsla(var(--agent-diary-purple-h), 25%, 10%, 0.3);
}

/* Loading overlay specific to diary page for better theming */
.loading-overlay-diary-page {
  @apply absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm;
  background-color: hsla(var(--agent-diary-neutral-h), 15%, 10%, 0.5); 
}
.dark .loading-overlay-diary-page {
  background-color: hsla(var(--agent-diary-neutral-h), 12%, 5%, 0.6);
}
/* Ensure spinner and text are visible and themed */
.diary-spinner {
  @apply w-10 h-10 border-4 rounded-full animate-spin;
  border-color: hsla(var(--agent-diary-purple-h), 50%, 60%, 0.25);
  border-left-color: hsl(var(--agent-diary-purple-h), 60%, 70%);
}

/* Glass pane effect for modals - Ensure var defaults are defined in your _variables.scss or similar */
.glass-pane-dark { 
  background: hsla(var(--color-bg-glass-h, 270), var(--color-bg-glass-s, 30%), var(--color-bg-glass-l, 20%), 0.7);
  backdrop-filter: blur(var(--blur-glass, 10px)) saturate(130%); 
  border: 1px solid hsla(var(--color-border-glass-h, 270), var(--color-border-glass-s, 40%), var(--color-border-glass-l, 50%), 0.3);
  box-shadow: var(--shadow-depth-xl, 0 25px 50px -12px rgba(0,0,0,0.5)); 
}
.dark .glass-pane-dark {
  background: hsla(var(--color-bg-glass-h-dark, 270), var(--color-bg-glass-s-dark, 30%), var(--color-bg-glass-l-dark, 15%), 0.85);
  border-color: hsla(var(--color-border-glass-h-dark, 270), var(--color-border-glass-s-dark, 40%), var(--color-border-glass-l-dark, 40%), 0.5);
}

</style>