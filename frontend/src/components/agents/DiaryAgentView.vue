/**
 * @file DiaryAgentView.vue
 * @description UI component for the Interactive Diary agent "Echo".
 * Implements a dual-panel layout, local storage integration, tool call handling,
 * and enhanced "holographic elegant fancy" styling.
 * @version 1.1.1 - Fixed undefined Tailwind classes (btn-xs, rounded-inherit).
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, nextTick, type PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { ChatMessageFE } from '@/utils/api'; // Assuming this is used or will be for StoreChatMessage mapping
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE, type FunctionCallResponseDataFE, type ChatResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import { BookOpenIcon, PlusCircleIcon, SparklesIcon, TrashIcon, PencilSquareIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, TagIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked';
import { diaryService, type DiaryEntry } from '@/services/diary.service';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

// Import StoreChatMessage component if it's external, otherwise it's used directly in template
// import StoreChatMessage from '@/components/StoreChatMessage.vue'; // Example, if it's a separate component

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
      return marked.parse(`# ${selectedEntryToView.value.title}\n**Date:** ${new Date(selectedEntryToView.value.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n**Tags:** ${selectedEntryToView.value.tags.join(', ')}${selectedEntryToView.value.mood ? `  **Mood:** ${selectedEntryToView.value.mood}` : ''}\n\n---\n\n${selectedEntryToView.value.contentMarkdown}`);
    } catch (e) { console.error("Error parsing selected diary entry markdown:", e); return `<p class="text-red-400">Error displaying entry.</p>`; }
  }
  if (isComposingSession.value) {
    const baseText = `## New Diary Entry - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n_Echo is listening... Share your thoughts, and I'll help structure them._\n\n<p class="text-xs text-purple-300/70 mt-4">**(Your entries are saved locally in your browser.)**</p>`;
    if (chatStore.isMainContentStreaming && chatStore.streamingMainContentText.startsWith("##")) {
        return marked.parse(chatStore.streamingMainContentText + '▋');
    }
    return marked.parse(baseText);
  }
  const mainContent = chatStore.getMainContentForAgent(props.agentId);
  if (mainContent && (mainContent.type === 'markdown' || mainContent.type === 'welcome' || mainContent.type === 'diary-entry-viewer')) {
      try { return marked.parse(mainContent.data as string); }
      catch (e) { console.error("Error parsing main content markdown:", e); return `<p class="text-red-400">Error displaying content.</p>`;}
  }
  return '<div class="flex flex-col items-center justify-center h-full text-center"><SparklesIcon class="w-16 h-16 text-purple-400/30 mb-4"/><p class="text-slate-400 italic">Select an entry or start a new one with Echo.</p></div>';
});

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `/src/prompts/${props.agentConfig.systemPromptKey}.md?raw`); // Adjusted path assuming prompts are in src/prompts
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error("Failed to load system prompt from key:", props.agentConfig.systemPromptKey, e);
      currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool before finalizing an entry. Then, generate the entry in Markdown.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool before finalizing an entry. Then, generate the entry in Markdown.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

async function loadStoredEntries() {
  isLoadingResponse.value = true;
  try {
    storedEntries.value = await diaryService.getAllEntries('createdAt', 'desc');
  } catch (error) {
    toast?.add({type: 'error', title: 'Error Loading Entries', message: 'Could not load diary entries.'});
  } finally {
    isLoadingResponse.value = false;
  }
}

const handleNewUserInput = async (text: string, isContinuationOfToolResponse: boolean = false, toolCallIdToRespondTo?: string, toolOutput?: any) => {
  if (!text.trim() && !toolCallIdToRespondTo) {
      toast?.add({type: 'warning', title:'Empty Input', message: 'Please share your thoughts.'});
      return;
  }
  if (isLoadingResponse.value && !isContinuationOfToolResponse) return;

  isLoadingResponse.value = true;
  const timestamp = Date.now();
  let currentTurnMessagesForHistory: StoreChatMessage[] = [];

  if (toolCallIdToRespondTo) {
    const toolMessage = chatStore.addMessage({
      role: 'tool',
      content: JSON.stringify(toolOutput),
      tool_call_id: toolCallIdToRespondTo,
      name: suggestedMetadata.value?.toolName || 'suggestDiaryMetadata',
      agentId: props.agentId,
      timestamp,
    });
    currentTurnMessagesForHistory.push(toolMessage);
    if (text.trim()) {
        const userConfirmationMsg = chatStore.addMessage({ role: 'user', content: text, agentId: props.agentId, timestamp: timestamp + 1 });
        currentTurnMessagesForHistory.push(userConfirmationMsg);
    }
  } else {
    const userMsg = chatStore.addMessage({ role: 'user', content: text, agentId: props.agentId, timestamp });
    currentTurnMessagesForHistory.push(userMsg);
  }
  scrollToChatBottom();

  if (!isContinuationOfToolResponse && isComposingSession.value) {
     const currentDraftContent = renderedEntryPageContentHtml.value.replace(/<p class="text-xs.*?<\/p>/g, '');
     chatStore.setMainContentStreaming(true, `${currentDraftContent}\n\n> ${text}\n\n<div class="flex items-center justify-center p-4"><SparklesIcon class="w-5 h-5 text-purple-400 animate-pulse" /><em class="ml-2 text-sm text-purple-300/80">Echo is processing...</em></div>`);
  }

  try {
    const recentTopics = storedEntries.value.length > 0 ? storedEntries.value.slice(0,2).map(e => e.title).join(' and ') : "your previous reflections";
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{CURRENT_DATE}}/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
      .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopics)
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({ ...agentStore.currentAgentContext, isComposingSession: isComposingSession.value }))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on empathetic follow-up questions. If the user seems to be concluding their thoughts, call `suggestDiaryMetadata`. After metadata confirmation, generate the full Markdown entry.');

    const maxHist = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' ? props.agentConfig.capabilities.maxChatHistory : 20;
    const histConf: Partial<AdvancedHistoryConfig> = { numRecentMessagesToPrioritize: maxHist, simpleRecencyMessageCount: maxHist };
    
    const processedHistory = await chatStore.getHistoryForApi(
      props.agentId, text, finalSystemPrompt, histConf, currentTurnMessagesForHistory
    );
    
    const apiMessages: ChatMessageFE[] = currentTurnMessagesForHistory.map(m => {
        // Ensure role is one of the expected types for ChatMessageFE
        const validRole = (m.role === 'user' || m.role === 'assistant' || m.role === 'system' || m.role === 'tool') ? m.role : 'user'; // Default to 'user' or handle error if 'error' role is critical
        return {
            role: validRole as ChatMessageFE['role'],
            content: m.content,
            timestamp: m.timestamp,
            agentId: m.agentId,
            tool_call_id: m.tool_call_id,
            tool_calls: m.tool_calls, 
            name: m.name,
        };
    });

    const payload: ChatMessagePayloadFE = {
      messages: apiMessages,
      processedHistory: processedHistory,
      mode: props.agentConfig.id,
      language: voiceSettingsManager.settings.speechLanguage,
      userId: 'frontend_user_diary',
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
    };
    
    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data as ChatResponseDataFE; // Cast to union type

    if (responseData.type === 'function_call_data') {
      const funcCallData = responseData as FunctionCallResponseDataFE;
      chatStore.addMessage({
        role: 'assistant',
        content: funcCallData.assistantMessageText || `I'm suggesting some details for your entry...`,
        tool_calls: [{ id: funcCallData.toolCallId, type: 'function', function: { name: funcCallData.toolName, arguments: JSON.stringify(funcCallData.toolArguments)}}],
        agentId: props.agentId, model: funcCallData.model,
      });
      suggestedMetadata.value = { 
        title: funcCallData.toolArguments.tentativeTitle || '', 
        tags: funcCallData.toolArguments.suggestedTags || [], 
        mood: funcCallData.toolArguments.mood, 
        summary: funcCallData.toolArguments.summary || '', 
        toolCallId: funcCallData.toolCallId, 
        toolName: funcCallData.toolName 
      };
      userEditedTitle.value = funcCallData.toolArguments.tentativeTitle;
      userEditedTags.value = (funcCallData.toolArguments.suggestedTags as string[]).join(', ');
      userEditedMood.value = funcCallData.toolArguments.mood || '';
      showMetadataConfirmation.value = true;
    } else { // TextResponseDataFE
      const textData = responseData as TextResponseDataFE;
      const assistantContent = textData.content || "I'm listening. Tell me more.";
      if (assistantContent.trim().startsWith("## ") && isComposingSession.value) {
        const title = (agentStore.currentAgentContext?.finalEntryTitle as string) || assistantContent.split('\n')[0].replace("## ", "").trim() || "Diary Entry";
        const tagsMatch = assistantContent.match(/\*\*Tags:\*\*\s*\[(.*?)\]/i);
        const tags = tagsMatch && tagsMatch[1] ? tagsMatch[1].split(',').map(t => t.trim()) : [];
        const moodMatch = assistantContent.match(/\*\*Mood:\*\*\s*(.*)/i);
        const mood = (agentStore.currentAgentContext?.finalEntryMood as string) || (moodMatch ? moodMatch[1].trim() : undefined);

        const newEntryData: Omit<DiaryEntry, 'updatedAt' | 'createdAt'> & { createdAt?: string } = {
            id: agentStore.currentAgentContext?.editingEntryId as string || crypto.randomUUID(),
            title: title,
            contentMarkdown: assistantContent,
            tags: tags,
            mood: mood,
            summary: agentStore.currentAgentContext?.finalEntrySummary as string || undefined,
            ...(agentStore.currentAgentContext?.editingEntryCreatedAt
                ? { createdAt: agentStore.currentAgentContext.editingEntryCreatedAt as string }
                : {})
        };

        const savedEntry = await diaryService.saveEntry(newEntryData);
        
        selectedEntryToView.value = savedEntry;
        chatStore.addMessage({
          role: 'assistant', content: `I've saved this diary entry: "${savedEntry.title}". You can view it now.`,
          agentId: props.agentId, model: textData.model, usage: textData.usage,
        });
        toast?.add({type:'success', title:'Diary Entry Saved!', message:`Entry "${savedEntry.title}" stored locally.`});
        isComposingSession.value = false;
        showMetadataConfirmation.value = false;
        agentStore.clearAgentContext();
        await loadStoredEntries();
        emit('agent-event', {type: 'diary_entry_saved', entryId: savedEntry.id});

      } else {
        chatStore.addMessage({
          role: 'assistant', content: assistantContent,
          agentId: props.agentId, model: textData.model, usage: textData.usage,
        });
      }
    }
    scrollToChatBottom();

  } catch (error: any) {
    console.error(`[${props.agentConfig.label}Agent] Chat API error:`, error);
    const errorResponseMessage = error.response?.data?.message || error.message || 'An error occurred.';
    toast?.add({ type: 'error', title: `Echo Error`, message: errorResponseMessage });
    chatStore.addMessage({
      role: 'error', content: `Sorry, I encountered an issue: ${errorResponseMessage}`,
      agentId: props.agentId,
    });
  } finally {
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

const confirmMetadataAndFinalize = async () => {
  if (!suggestedMetadata.value) return;
  
  const finalTitle = userEditedTitle.value.trim() || suggestedMetadata.value.title;
  const finalTags = userEditedTags.value.split(',').map(t => t.trim()).filter(t => t);
  const finalMood = userEditedMood.value.trim() || suggestedMetadata.value.mood;

  const userConfirmationText = `Okay, let's use title: "${finalTitle}", tags: "${finalTags.join(', ')}", and mood: "${finalMood || 'not specified'}". Please write the full entry based on our discussion and your summary: "${suggestedMetadata.value.summary}".`;
  
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
  suggestedMetadata.value = null;
};

const cancelMetadataSuggestion = () => {
  if (!suggestedMetadata.value) return;
  showMetadataConfirmation.value = false;
  const cancellationText = "Actually, let's hold off on finalizing. I want to add more.";
  chatStore.addMessage({ role: 'user', content: cancellationText, agentId: props.agentId, timestamp: Date.now() });
  suggestedMetadata.value = null;
  toast?.add({type:'info', title:'Suggestion Cancelled', message:'You can continue adding to your thoughts.'});
  isComposingSession.value = true; 
};

const startNewEntrySession = async () => {
  isComposingSession.value = true;
  selectedEntryToView.value = null;
  agentStore.clearAgentContext();
  showMetadataConfirmation.value = false;
  
  const promptText = "Let's start a new diary entry. What's on your mind today?";
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `## New Diary Entry - ${new Date().toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}\n\n_Echo is listening... Share your thoughts, and I'll help structure them._\n\n<p class="text-xs text-purple-300/70 mt-4">**(Your entries are saved locally in your browser.)**</p>`,
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
    }
  }
}

async function clearAllDiaryEntries() {
  if (confirm("Are you sure you want to delete ALL diary entries? This action cannot be undone.")) {
    try {
      await diaryService.clearAllEntries();
      toast?.add({type:'success', title:'All Entries Cleared', message:'Your diary is now empty.'});
      storedEntries.value = [];
      selectedEntryToView.value = null;
      setDefaultMainContent();
      emit('agent-event', {type: 'diary_entries_cleared'});
    } catch (error) {
      toast?.add({type:'error', title:'Clear All Failed', message:'Could not clear all entries.'});
    }
  }
}

function setDefaultMainContent() {
  const latestEntryTitles = storedEntries.value.length > 0 ? storedEntries.value.slice(0,2).map(e=>`"${e.title}"`).join(' and ') : "your previous reflections";
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `### ${props.agentConfig.label} - Echo\n${props.agentConfig.description}\n\nYour diary entries are stored locally in your browser. You can start a new entry or browse existing ones.\n\n${storedEntries.value.length > 0 ? `Recent entries include discussions about ${latestEntryTitles}.` : 'Ready to capture your thoughts.'}`,
    title: `${props.agentConfig.label} Ready`, timestamp: Date.now(),
  });
}

const scrollToChatBottom = () => {
  nextTick(() => { chatLogRef.value?.scrollTo({ top: chatLogRef.value.scrollHeight, behavior: 'smooth'}); });
};

const triggerImport = () => {
  fileInputRef.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonString = e.target?.result as string;
        const result = await diaryService.importEntries(jsonString);
        if (result.error) {
          toast?.add({type: 'error', title: 'Import Failed', message: result.error, duration: 7000});
        } else {
          toast?.add({type: 'success', title: 'Import Successful', message: `Imported ${result.importedCount} entries. Skipped ${result.skippedCount} duplicates/invalid entries.`});
          await loadStoredEntries();
        }
      } catch (err) {
        toast?.add({type: 'error', title: 'Import Error', message: 'Could not read or parse the file.', duration: 7000});
      }
    };
    reader.readAsText(file);
    input.value = ''; 
  }
};

const exportAllEntries = async () => {
  try {
    const jsonString = await diaryService.exportEntries();
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `VCA_DiaryExport_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast?.add({type:'success', title:'Export Successful', message:'Your diary entries have been downloaded.'});
  } catch (error) {
    toast?.add({type:'error', title:'Export Failed', message:'Could not export entries.'});
  }
};


defineExpose({ handleNewUserInput });

onMounted(async () => {
  console.log(`[${props.agentConfig.label}] View Mounted`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  await loadStoredEntries();
  if (!selectedEntryToView.value && !isComposingSession.value) {
    setDefaultMainContent();
  }
});

</script>

<template>
  <div class="diary-agent-view flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-950 text-slate-100">
    <div class="agent-header-controls p-3 px-4 border-b border-purple-400/20 flex items-center justify-between gap-2 shadow-lg bg-slate-900/50 backdrop-blur-md z-10">
      <div class="flex items-center gap-3">
        <BookOpenIcon class="w-7 h-7 shrink-0 text-purple-300 opacity-80 filter-glow-purple" />
        <span class="font-semibold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400">{{ props.agentConfig.label }}</span>
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
            <div ref="chatLogRef" class="w-full md:w-2/5 p-3.5 flex flex-col space-y-3 overflow-y-auto custom-scrollbar-diary-chat ephemeral-chat-panel border-r-0 md:border-r border-purple-500/10">
        <template v-for="message in chatStore.getMessagesForAgent(props.agentId)" :key="message.id">
                      <component 
              v-if="message.role === 'user' || (message.role === 'assistant' && !message.tool_calls)"
              :is="'StoreChatMessage'" 
              :message="{role: message.role as 'user' | 'assistant', content: message.content || '', timestamp: message.timestamp }"
              class="chat-message-item-diary"
            />
            <div v-if="message.role === 'assistant' && message.tool_calls && message.tool_calls.length > 0 && !showMetadataConfirmation"
                 class="p-2.5 my-1 text-xs rounded-lg bg-slate-700/60 border border-purple-500/40 text-purple-200 italic shadow-md">
                <p class="font-semibold mb-1">Echo is suggesting entry details:</p>
                <p v-if="message.content">{{ message.content }}</p>
                 <button @click="() => {
                    const tc = message.tool_calls![0];
                    suggestedMetadata = { ...JSON.parse(tc.function.arguments), toolCallId: tc.id, toolName: tc.function.name };
                    userEditedTitle = suggestedMetadata!.title; userEditedTags = suggestedMetadata!.tags.join(', '); userEditedMood = suggestedMetadata!.mood || '';
                    showMetadataConfirmation = true;
                 }" class="text-pink-400 hover:text-pink-300 underline mt-1 text-xxs">Review & Confirm Details</button>
            </div>
        </template>

        <div v-if="!chatStore.getMessagesForAgent(props.agentId).length && !isComposingSession" class="text-center py-10 text-purple-300/50 italic text-sm opacity-70">
            Chat with Echo to compose your thoughts. Entries are saved locally.
        </div>
         <div v-if="isLoadingResponse && !isComposingSession && !showMetadataConfirmation" class="flex justify-center items-center p-4 opacity-60">
            <SparklesIcon class="w-5 h-5 text-purple-300 animate-pulse" />
            <span class="ml-2 text-xs text-purple-200/70">Echo is thinking...</span>
        </div>

        <transition name="slide-up-fade">
            <div v-if="showMetadataConfirmation && suggestedMetadata" class="mt-auto p-4 border-t-2 border-purple-500/30 bg-slate-800/70 rounded-b-lg shadow-2xl metadata-form">
                <h4 class="text-sm font-semibold text-purple-200 mb-2.5">Confirm Entry Details:</h4>
                <div class="space-y-2.5 text-xs">
                    <div>
                        <label for="editTitle" class="block text-purple-300/80 mb-1 font-medium">Title:</label>
                        <input id="editTitle" type="text" v-model="userEditedTitle" class="form-input-diary" />
                    </div>
                    <div>
                        <label for="editTags" class="block text-purple-300/80 mb-1 font-medium">Tags (comma-separated):</label>
                        <input id="editTags" type="text" v-model="userEditedTags" class="form-input-diary" />
                    </div>
                    <div>
                        <label for="editMood" class="block text-purple-300/80 mb-1 font-medium">Mood (optional):</label>
                        <input id="editMood" type="text" v-model="userEditedMood" class="form-input-diary" />
                    </div>
                </div>
                <div class="flex justify-end gap-2.5 mt-4">
                    <button @click="cancelMetadataSuggestion" class="btn btn-secondary btn-xs !p-1.5 !text-xs">Cancel</button>
                    <button @click="confirmMetadataAndFinalize" class="btn btn-primary-glow btn-xs !p-1.5 !text-xs"><CheckCircleIcon class="w-4 h-4 mr-1"/> Confirm & Save</button>
                </div>
            </div>
        </transition>
      </div>

            <div ref="entryPageRef" class="w-full md:w-3/5 p-4 sm:p-6 md:p-8 flex-grow relative min-h-0 custom-scrollbar-diary-entry diary-page-panel overflow-y-auto">
        <div v-if="isLoadingResponse && isComposingSession && !showMetadataConfirmation" class="loading-overlay-diary-page">
            <SparklesIcon class="w-12 h-12 text-purple-300 animate-ping opacity-70 filter-glow-purple-strong" />
            <p class="mt-3 text-sm text-purple-200/70 tracking-wider">Echo is listening intently...</p>
        </div>
        
        <div class="prose prose-sm sm:prose-base dark:prose-invert max-w-none h-full diary-entry-content relative"
             :class="{'opacity-50 blur-[1px]': isLoadingResponse && isComposingSession && !showMetadataConfirmation}"
             v-html="renderedEntryPageContentHtml">
        </div>
        
        <div v-if="selectedEntryToView && !isComposingSession" class="absolute bottom-5 right-5 md:bottom-7 md:right-7 flex gap-3 diary-actions-corner">
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
      <div v-if="showEntryListModal" @click.self="showEntryListModal = false" class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40 flex items-center justify-center p-4 sm:p-6">
        <div class="bg-gradient-to-br from-slate-800/80 via-purple-900/40 to-slate-800/80 border border-purple-500/50 p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col glass-pane-dark">
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-purple-400/25">
            <h3 class="text-xl sm:text-2xl font-semibold text-purple-300 flex items-center gap-2.5"><BookOpenIcon class="w-6 h-6 opacity-80"/> Your Diary Entries</h3>
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
            <p v-if="storedEntries.length === 0" class="text-slate-400 italic text-center py-8">No entries found. Your thoughts await!</p>
            <div v-for="entry in storedEntries" :key="entry.id"
                 @click="() => { viewEntry(entry); }"
                 class="entry-list-item group p-3.5 bg-slate-700/50 hover:bg-purple-600/40 rounded-lg cursor-pointer transition-all duration-200 border border-purple-500/25 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/25">
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-purple-300 group-hover:text-pink-300 text-md mb-0.5">{{ entry.title }}</h4>
                <span class="text-xxs text-slate-500 group-hover:text-slate-400">{{ new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year:'2-digit'}) }}</span>
              </div>
              <p v-if="entry.tags.length" class="text-xs text-purple-400/80 mt-1 flex flex-wrap gap-1 items-center">
                <TagIcon class="w-3.5 h-3.5 mr-0.5 opacity-70"/> {{ entry.tags.join(', ') }}
              </p>
               <p v-if="entry.summary" class="text-xs text-slate-300/80 mt-1.5 truncate">{{ entry.summary }}</p>
               <p v-else class="text-xs text-slate-400/70 mt-1.5 italic truncate">{{ entry.contentMarkdown.substring(0, 80) }}...</p>
            </div>
          </div>
           <div class="mt-5 pt-4 border-t border-purple-500/25 flex justify-end">
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
/* Define custom accent hues if not globally available or for local override */
:root {
  --accent-hue-purple: 270; /* Example for purple, adjust if needed */
  --accent-hue-pink: 330;   /* Example for pink, adjust if needed */
}

.filter-glow-purple { /* For icons */
  filter: drop-shadow(0 0 5px hsla(var(--accent-hue-purple, 270), 60%, 70%, 0.7));
}
.filter-glow-purple-strong {
  filter: drop-shadow(0 0 10px hsla(var(--accent-hue-purple, 270), 70%, 70%, 0.8))
          drop-shadow(0 0 20px hsla(var(--accent-hue-purple, 270), 70%, 70%, 0.5));
}

.btn-header-action {
    /* Removed btn-xs from @apply. Relies on py-1.5 px-3 text-xs for sizing. */
    /* For true consistency, define .btn-xs in main.css and use @apply btn btn-xs btn-secondary; */
    @apply btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5
           border-purple-500/30 hover:border-purple-400/70 
           bg-slate-700/30 hover:bg-slate-700/60 
           text-purple-200 hover:text-purple-100
           shadow-md hover:shadow-purple-500/20;
}
.btn-header-action.btn-primary-glow {
    @apply bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500
           text-white border-transparent shadow-lg hover:shadow-pink-500/40;
}

.ephemeral-chat-panel {
  background: linear-gradient(160deg, hsla(var(--accent-hue-purple, 270), 20%, 10%, 0.6) 0%, hsla(var(--accent-hue-purple, 270), 25%, 6%, 0.75) 100%);
  backdrop-filter: blur(5px);
  box-shadow: inset -12px 0px 25px -10px rgba(0,0,0,0.35);
  position: relative;
}
.ephemeral-chat-panel::after {
  content: ''; @apply absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10;
  background: linear-gradient(to bottom, transparent, hsla(var(--accent-hue-purple, 270), 25%, 6%, 1) 90%);
}

/* Ensure StoreChatMessage component is styled appropriately if it's a custom component */
.chat-message-item-diary :deep(.message-bubble-user) { /* Assuming StoreChatMessage renders .message-bubble-user */
    @apply bg-purple-600/50 hover:bg-purple-600/70 border border-purple-500/20 text-sm shadow-none max-w-[90%];
}
.chat-message-item-diary :deep(.message-bubble-assistant) { /* Assuming StoreChatMessage renders .message-bubble-assistant */
    @apply bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/40 text-sm shadow-none max-w-[90%];
}
.text-xxs { font-size: 0.65rem; line-height: 0.9rem; }

.diary-page-panel {
  background: 
    radial-gradient(ellipse at 50% -30%, hsla(var(--accent-hue-pink, 330), 25%, 20%, 0.3), transparent 70%),
    radial-gradient(ellipse at 15% 95%, hsla(var(--accent-hue-purple, 270), 30%, 25%, 0.25), transparent 70%),
    hsl(var(--neutral-hue-dark), 15%, 9%); /* Ensure --neutral-hue-dark is available or use a fallback */
  border-left: 1px solid hsla(var(--accent-hue-purple, 270), 30%, 50%, 0.1);
  box-shadow: 
    inset 10px 0px 30px -10px rgba(0,0,0,0.5),
    0 0 100px hsla(var(--accent-hue-purple, 270), 20%, 5%, 0.3) inset;
  position: relative;
}
.diary-page-panel::before {
    content: ""; 
    /* Removed 'rounded-inherit' from @apply. Added border-radius: inherit; directly below. */
    @apply absolute inset-[-1px] pointer-events-none z-0;
    border-radius: inherit; /* CSS way to inherit border-radius */
    border: 1px solid transparent;
    background: linear-gradient(120deg, hsla(var(--accent-hue-pink, 330),70%,70%,0.15), hsla(var(--accent-hue-purple, 270),60%,60%,0.15), hsla(var(--accent-hue-pink, 330),70%,70%,0.15)) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; mask-composite: exclude;
    opacity: 0.7; animation: subtle-border-pulse 8s infinite alternate;
}
@keyframes subtle-border-pulse {
    0% { opacity: 0.4; } 100% { opacity: 0.8; }
}

.metadata-form {
    backdrop-filter: blur(3px);
    box-shadow: inset 0 6px 10px -3px rgba(0,0,0,0.3);
}
.form-input-diary {
    @apply w-full block px-2.5 py-1.5 rounded-md text-xs
           bg-slate-700/50 border border-purple-500/50 
           text-slate-100 placeholder-slate-400
           focus:ring-1 focus:ring-pink-400 focus:border-pink-400 focus:bg-slate-700;
}

.diary-entry-content :deep(h2) {
  @apply text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-300 to-rose-300 border-b border-purple-300/30 pb-2.5 mb-6 text-2xl font-bold tracking-tight;
  text-shadow: 0 0 15px hsla(var(--accent-hue-purple, 270), 60%, 70%, 0.5);
}
.diary-entry-content :deep(strong) { @apply text-purple-200 font-semibold; }
.diary-entry-content :deep(p) { @apply text-slate-200/90 leading-relaxed text-base; }
.diary-entry-content :deep(ul), .diary-entry-content :deep(ol) { @apply text-slate-200/90; }
.diary-entry-content :deep(hr) { @apply border-purple-300/30 my-8; }
.diary-entry-content :deep(a) { @apply text-pink-300 hover:text-pink-200; }

.btn-icon-diary {
    @apply p-2.5 rounded-lg bg-slate-700/40 hover:bg-purple-600/50 text-slate-300 hover:text-white 
           transition-all duration-150 shadow-lg hover:shadow-purple-500/40 active:scale-90
           border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-sm;
}
.btn-icon-close {
    @apply p-1.5 rounded-full text-purple-300/70 hover:text-purple-100 hover:bg-purple-500/30 transition-colors;
}
.entry-list-item:hover h4 {
    text-shadow: 0 0 8px hsla(var(--accent-hue-pink), 80%, 70%, 0.7);
}
.modal-fade-enter-active .glass-pane-dark, .modal-fade-leave-active .glass-pane-dark {
    transition: opacity 0.3s var(--ease-out-cubic), transform 0.3s var(--ease-out-cubic); /* Assuming --ease-out-cubic is defined */
}
.modal-fade-enter-from .glass-pane-dark, .modal-fade-leave-to .glass-pane-dark {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

/* Custom scrollbar styling */
.custom-scrollbar-diary-chat::-webkit-scrollbar,
.custom-scrollbar-diary-entry::-webkit-scrollbar,
.custom-scrollbar-futuristic::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar-diary-chat::-webkit-scrollbar-track,
.custom-scrollbar-diary-entry::-webkit-scrollbar-track,
.custom-scrollbar-futuristic::-webkit-scrollbar-track {
  background-color: hsla(var(--accent-hue-purple, 270), 20%, 15%, 0.3);
  border-radius: 10px;
}
.custom-scrollbar-diary-chat::-webkit-scrollbar-thumb,
.custom-scrollbar-diary-entry::-webkit-scrollbar-thumb,
.custom-scrollbar-futuristic::-webkit-scrollbar-thumb {
  background-color: hsla(var(--accent-hue-purple, 270), 40%, 50%, 0.6);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.custom-scrollbar-diary-chat::-webkit-scrollbar-thumb:hover,
.custom-scrollbar-diary-entry::-webkit-scrollbar-thumb:hover,
.custom-scrollbar-futuristic::-webkit-scrollbar-thumb:hover {
  background-color: hsla(var(--accent-hue-pink, 330), 50%, 60%, 0.8);
}

.loading-overlay-diary-page {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 z-20 backdrop-blur-sm;
}

.glass-pane-dark { /* Ensure this class is used on the modal content if needed */
    background: hsla(var(--neutral-hue-dark, 230), 18%, 10%, 0.7); /* Example dark glass */
    backdrop-filter: blur(var(--glass-blur-dark, 16px)) saturate(130%);
    border: 1px solid hsla(var(--neutral-hue-dark, 230), 10%, 20%, 0.3);
    box-shadow: var(--glass-shadow-dark, 0 10px 35px 0 hsla(var(--neutral-hue-dark,230),25%,5%,0.35));
}

/* Ensure StoreChatMessage is a registered component or import it in the script setup */
/* For example, in <script setup>: import StoreChatMessage from '@/components/common/StoreChatMessage.vue'; */
/* The template uses <component :is="'StoreChatMessage'" ... /> which implies it might be dynamically loaded or globally registered. */
/* If it's a local component, it should be: <StoreChatMessage :message="..."/> after importing. */

</style>
