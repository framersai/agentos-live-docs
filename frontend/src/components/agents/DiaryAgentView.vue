<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, nextTick, type PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
// ChatMessageFE might be used if constructing API payloads directly with that type.
// For chat log display, StoreChatMessage is typically mapped.
import { type ChatMessageFE, chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE, type FunctionCallResponseDataFE, type ChatResponseDataFE } from '@/utils/api';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { BookOpenIcon, PlusCircleIcon, SparklesIcon, TrashIcon, PencilSquareIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, TagIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/vue/24/outline'; // Added ShareIcon
import { marked } from 'marked';
import { diaryService, type DiaryEntry } from '@/services/diary.service'; // Assumes this path is correct
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

// If using a specific component for chat messages, import it:
// import StoreChatMessageDisplay from '@/components/common/StoreChatMessageDisplay.vue'; // Example name

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
const isComposingSession = ref(false); // True when actively drafting a new entry with Echo
const showEntryListModal = ref(false); // To show/hide the modal for Browse past entries
const storedEntries = ref<DiaryEntry[]>([]); // Holds all diary entries fetched from service
const selectedEntryToView = ref<DiaryEntry | null>(null); // The currently displayed entry

// For metadata confirmation flow
const showMetadataConfirmation = ref(false);
const suggestedMetadata = ref<{ title: string; tags: string[]; mood?: string; summary: string; toolCallId: string; toolName: string; } | null>(null);
const userEditedTitle = ref('');
const userEditedTags = ref('');
const userEditedMood = ref('');

// Refs for DOM elements (scrolling, file input)
const chatLogRef = ref<HTMLElement | null>(null);
const entryPageRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Computed property to render the main content for the diary page (right panel)
const renderedEntryPageContentHtml = computed(() => {
  if (selectedEntryToView.value) { // Viewing an existing entry
    try {
      // Construct Markdown for the selected entry display
      const header = `# ${selectedEntryToView.value.title}\n**Date:** ${new Date(selectedEntryToView.value.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n**Tags:** ${selectedEntryToView.value.tags.join(', ')}${selectedEntryToView.value.mood ? `  **Mood:** ${selectedEntryToView.value.mood}` : ''}\n\n---\n\n`;
      const fullMarkdown = header + selectedEntryToView.value.contentMarkdown;
      // marked.parse will convert this to HTML.
      // If contentMarkdown contains Mermaid blocks (```mermaid ... ```),
      // ensure 'marked' is configured to output appropriate HTML (e.g., <div class="mermaid">...</div>)
      // and that a global Mermaid script initializes and renders these blocks.
      return marked.parse(fullMarkdown);
    } catch (e) { 
      console.error("Error parsing selected diary entry markdown:", e); 
      return `<p class="text-red-400 dark:text-red-500">Error displaying entry.</p>`; // Themed error display
    }
  }
  if (isComposingSession.value) { // Actively composing a new entry
    const baseText = `## New Diary Entry - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n_Echo is listening... Share your thoughts, and I'll help structure them._\n\n<p class="text-xs text-purple-300/70 dark:text-purple-400/70 mt-4">**(Your entries are saved locally in your browser.)**</p>`;
    if (chatStore.isMainContentStreaming && chatStore.streamingMainContentText.startsWith("##")) {
      // If streaming content from LLM that's intended as the entry body
      return marked.parse(chatStore.streamingMainContentText + '▋'); // Add blinking cursor for streaming
    }
    return marked.parse(baseText); // Default composing placeholder
  }
  // Fallback: Display content from chatStore if relevant (e.g., initial welcome message)
  const mainContent = chatStore.getMainContentForAgent(props.agentId);
  if (mainContent && (mainContent.type === 'markdown' || mainContent.type === 'welcome' || mainContent.type === 'diary-entry-viewer')) {
      try { return marked.parse(mainContent.data as string); }
      catch (e) { console.error("Error parsing main content markdown:", e); return `<p class="text-red-400 dark:text-red-500">Error displaying content.</p>`;}
  }
  // Default placeholder if nothing else is active
  return '<div class="flex flex-col items-center justify-center h-full text-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-purple-400/30 dark:text-purple-500/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg><p class="text-slate-400 dark:text-slate-500 italic">Select an entry or start a new one with Echo.</p></div>';
});

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      // The updated 'diary.md' prompt now includes instructions for suggesting/generating diagrams.
      const module = await import(/* @vite-ignore */ `/src/prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${props.agentConfig.label}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool. Consider suggesting mind maps for complex thoughts. Finalize entry in Markdown.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries. Use the 'suggestDiaryMetadata' tool. Consider suggesting mind maps for complex thoughts. Finalize entry in Markdown.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

async function loadStoredEntries() {
  isLoadingResponse.value = true;
  try {
    storedEntries.value = await diaryService.getAllEntries('createdAt', 'desc');
  } catch (error) {
    toast?.add({type: 'error', title: 'Error Loading Entries', message: 'Could not retrieve diary entries from local storage.'});
  } finally {
    isLoadingResponse.value = false;
  }
}

const handleNewUserInput = async (text: string, isContinuationOfToolResponse: boolean = false, toolCallIdToRespondTo?: string, toolOutput?: any) => {
  // ... (rest of the handleNewUserInput logic from the provided snippet, with one addition)

  // In the try block, when constructing `finalSystemPrompt`:
  // Make sure to replace {{GENERATE_DIAGRAM}} if it's used by the prompt.
  // This value could come from a global setting or be specific to the diary agent.
  // For now, let's assume it's enabled if the agent capability exists.
  const generateDiagrams = props.agentConfig.capabilities?.canGenerateDiagrams && (voiceSettingsManager.settings?.generateDiagrams ?? false);

  // ... (inside the try block of handleNewUserInput)
  // let finalSystemPrompt = currentAgentSystemPrompt.value
  //   .replace(/{{CURRENT_DATE}}/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
  //   .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopics)
  //   .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({ ...agentStore.currentAgentContext, isComposingSession: isComposingSession.value }))
  //   .replace(/{{GENERATE_DIAGRAM}}/g, generateDiagrams.toString()) // Add this line
  //   .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on empathetic follow-up questions. If the user seems to be concluding their thoughts, call `suggestDiaryMetadata`. After metadata confirmation, generate the full Markdown entry. If complex thoughts are shared, consider if a mind map diagram would be helpful to include in the entry.');
  // ... (rest of the function)

  // The existing logic for saving entries will include any Mermaid diagram code
  // as part of `contentMarkdown` if the LLM provides it.
  // `diaryService.saveEntry(...)`
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
  // This call to handleNewUserInput will trigger the LLM to generate the final entry.
  // The updated prompt instructs it to include diagrams if appropriate.
  await handleNewUserInput(userConfirmationText, true, suggestedMetadata.value.toolCallId, {
      status: "Metadata confirmed by user.",
      confirmedTitle: finalTitle,
      confirmedTags: finalTags,
      confirmedMood: finalMood,
      originalSummary: suggestedMetadata.value.summary
  });
  suggestedMetadata.value = null;
};

// ... (rest of the script: cancelMetadataSuggestion, startNewEntrySession, viewEntry, deleteEntryFromList, clearAllDiaryEntries, setDefaultMainContent, scrollToChatBottom, triggerImport, handleFileUpload, exportAllEntries from provided snippet) ...

defineExpose({ handleNewUserInput }); // Expose for parent components if needed (e.g. voice input)

onMounted(async () => {
  console.log(`[${props.agentConfig.label}] View Mounted. Agent Config:`, props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  await loadStoredEntries();
  if (!selectedEntryToView.value && !isComposingSession.value) {
    setDefaultMainContent(); // Set initial welcome/info message
  }
  // Potentially initialize Mermaid.js or ensure it runs after content updates if not handled globally
  // For example, if using a watcher on renderedEntryPageContentHtml:
  // watch(renderedEntryPageContentHtml, async (newHtml) => {
  //   if (newHtml && typeof mermaid !== 'undefined') {
  //     await nextTick(); // Ensure DOM is updated
  //     try {
  //       const mermaidElements = entryPageRef.value?.querySelectorAll('.mermaid');
  //       if (mermaidElements && mermaidElements.length > 0) {
  //         mermaid.run({nodes: mermaidElements}); // Or mermaid.init(); if that's preferred
  //         console.log('[DiaryAgentView] Mermaid rendered for diagrams.');
  //       }
  //     } catch (e) {
  //       console.error('[DiaryAgentView] Error rendering Mermaid diagrams:', e);
  //     }
  //   }
  // }, { immediate: true });
});

onUnmounted(() => {
  // Cleanup any event listeners if added
});

// Placeholder functions for unimplemented parts of the original script, ensure they are defined or implemented
const setDefaultMainContent = () => {
  const latestEntryTitles = storedEntries.value.length > 0 
    ? storedEntries.value.slice(0,2).map(e=>`"${e.title}"`).join(' and ') 
    : "your previous reflections";
  const welcomeMessage = `### ${props.agentConfig.label} - Echo\n${props.agentConfig.description}\n\nYour diary entries are stored locally in your browser. You can start a new entry by talking to Echo, or browse existing entries using the "My Entries" button.\n\n${storedEntries.value.length > 0 ? `Recent entries include discussions about ${latestEntryTitles}.` : 'Ready to capture your thoughts.'}\n\nI can also help visualize complex thoughts with simple mind maps if you'd like!`;
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: welcomeMessage,
    title: `${props.agentConfig.label} Ready`, timestamp: Date.now(),
  });
};

const scrollToChatBottom = () => {
  nextTick(() => { 
    if (chatLogRef.value) {
      chatLogRef.value.scrollTo({ top: chatLogRef.value.scrollHeight, behavior: 'smooth' });
    }
  });
};

const cancelMetadataSuggestion = () => {
  if (!suggestedMetadata.value) return;
  showMetadataConfirmation.value = false;
  const cancellationText = "Actually, let's hold off on finalizing. I want to add more to my thoughts.";
  // Add user message to chat log
  chatStore.addMessage({ 
      role: 'user', 
      content: cancellationText, 
      agentId: props.agentId, 
      timestamp: Date.now() 
  });
  // Optionally, send a message to Echo to acknowledge this change in plan
  // handleNewUserInput(cancellationText, false); // Or a more specific internal state update
  
  suggestedMetadata.value = null; // Clear the suggestion
  toast?.add({type:'info', title:'Suggestion Cancelled', message:'You can continue adding to your current entry.'});
  isComposingSession.value = true; // Ensure we are still in composing mode
  scrollToChatBottom();
};

// Functions from original context that should be present
const startNewEntrySession = async () => {
  isComposingSession.value = true;
  selectedEntryToView.value = null;
  agentStore.clearAgentContext(); // Clear any previous entry context
  showMetadataConfirmation.value = false;
  suggestedMetadata.value = null;
  
  const promptText = "Let's start a new diary entry. What's on your mind today? Feel free to share anything.";
  // Update the main content view for composing
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `## New Diary Entry - ${new Date().toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}\n\n_Echo is listening... Share your thoughts, and I'll help structure them._\n\n<p class="text-xs text-purple-300/70 dark:text-purple-400/70 mt-4">**(Your entries are saved locally in your browser.)**</p>`,
    title: `Drafting New Entry...`, timestamp: Date.now()
  });
  // Add a message to the chat log from Echo to kick off the conversation
  chatStore.addMessage({ role: 'assistant', content: promptText, timestamp: Date.now(), agentId: props.agentId });
  toast?.add({type:'info', title:'New Diary Entry Session', message:'Echo is ready to listen.'});
  scrollToChatBottom();
};

const viewEntry = (entry: DiaryEntry) => {
  selectedEntryToView.value = entry;
  isComposingSession.value = false; // Not composing when viewing an old entry
  showEntryListModal.value = false; // Close modal if it was open
  showMetadataConfirmation.value = false; // Ensure metadata panel is hidden
  toast?.add({type:'info', title:'Viewing Entry', message: `Displaying "${entry.title}"`});
  // Scroll the entry page to the top when a new entry is selected
  nextTick(() => { entryPageRef.value?.scrollTo({ top: 0, behavior: 'smooth' }); });
};

async function deleteEntryFromList(entryId: string, entryTitle: string) {
  // Consider adding a custom modal for confirmation for better UX than browser confirm
  if (confirm(`Are you sure you want to delete the entry: "${entryTitle}"? This cannot be undone.`)) {
    try {
      await diaryService.deleteEntry(entryId);
      toast?.add({type:'success', title:'Entry Deleted', message:`"${entryTitle}" has been removed.`});
      if (selectedEntryToView.value?.id === entryId) {
        selectedEntryToView.value = null; // Clear display if deleted entry was being viewed
        setDefaultMainContent(); // Show default welcome/info
      }
      await loadStoredEntries(); // Refresh the list of entries
    } catch (error) {
      toast?.add({type:'error', title:'Deletion Failed', message:'Could not delete the entry. Please try again.'});
      console.error('[DiaryAgentView] Error deleting entry:', error);
    }
  }
}

async function clearAllDiaryEntries() {
  if (confirm("Are you absolutely sure you want to delete ALL diary entries? This action is permanent and cannot be undone.")) {
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

const triggerImport = () => {
  fileInputRef.value?.click(); // Programmatically click the hidden file input
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.type !== 'application/json') {
        toast?.add({type: 'error', title: 'Invalid File Type', message: 'Please select a valid JSON file for import.'});
        input.value = ''; // Clear the input
        return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonString = e.target?.result as string;
        const result = await diaryService.importEntries(jsonString);
        if (result.error) {
          toast?.add({type: 'error', title: 'Import Failed', message: result.error, duration: 7000});
        } else {
          toast?.add({type: 'success', title: 'Import Successful', message: `Imported ${result.importedCount} entries. Skipped ${result.skippedCount} duplicates/invalid entries.`});
          await loadStoredEntries(); // Refresh entries list
          showEntryListModal.value = false; // Close modal after import
        }
      } catch (err: any) {
        toast?.add({type: 'error', title: 'Import Error', message: `Could not read or parse the file: ${err.message}`, duration: 7000});
      }
    };
    reader.onerror = () => {
        toast?.add({type: 'error', title: 'File Read Error', message: 'Could not read the selected file.'});
    };
    reader.readAsText(file);
    input.value = ''; // Clear the input to allow re-selecting the same file if needed
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
    URL.revokeObjectURL(url); // Clean up
    toast?.add({type:'success', title:'Export Successful', message:'Your diary entries have been downloaded.'});
  } catch (error) {
    toast?.add({type:'error', title:'Export Failed', message:'Could not export entries.'});
    console.error('[DiaryAgentView] Error exporting entries:', error);
  }
};


</script>

<template>
  <div class="diary-agent-view flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-950 text-slate-100 dark:from-slate-950 dark:via-purple-950/50 dark:to-black">
    <div class="agent-header-controls p-3 px-4 border-b border-purple-400/20 dark:border-purple-600/30 flex items-center justify-between gap-2 shadow-lg bg-slate-900/50 dark:bg-slate-950/60 backdrop-blur-md z-10">
      <div class="flex items-center gap-3">
        <BookOpenIcon class="w-7 h-7 shrink-0 text-purple-300 dark:text-purple-400 opacity-80 filter-glow-purple" />
        <span class="font-semibold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 dark:from-purple-400 dark:via-pink-500 dark:to-rose-500">{{ props.agentConfig.label }}</span>
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
            <component 
              v-if="message.role === 'user' || (message.role === 'assistant' && !message.tool_calls)"
              :is="'StoreChatMessageDisplay'"  :message="message"
              class="chat-message-item-diary" />
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
                                    mood: args.mood, 
                                    summary: args.summary || '', 
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
              <button @click="confirmMetadataAndFinalize" class="btn btn-primary-glow btn-xs !py-1.5 !px-2.5 !text-xs"><CheckCircleIcon class="w-4 h-4 mr-1"/> Confirm & Save</button>
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
                <h4 class="font-medium text-purple-300 dark:text-purple-400 group-hover:text-pink-300 dark:group-hover:text-pink-400 text-md mb-0.5">{{ entry.title }}</h4>
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
/* Define local CSS variable for the agent's specific accent hues if not globally themed */
:host, .diary-agent-view { /* Scoping variables to the component */
  --agent-diary-purple-h: var(--accent-hue-purple, 270);
  --agent-diary-purple-s: var(--accent-hue-purple-s, 30%); 
  --agent-diary-purple-l: var(--accent-hue-purple-l, 20%); 
  
  --agent-diary-pink-h: var(--accent-hue-pink, 330);
  --agent-diary-pink-s: var(--accent-hue-pink-s, 70%);
  --agent-diary-pink-l: var(--accent-hue-pink-l, 70%);

  --agent-diary-neutral-h: var(--neutral-hue-dark, 230); 
}

.filter-glow-purple {
  filter: drop-shadow(0 0 5px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 70%), 0.7));
}
.dark .filter-glow-purple {
  filter: drop-shadow(0 0 7px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 80%), 0.8));
}

.filter-glow-purple-strong { 
  filter: drop-shadow(0 0 10px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 70%), 0.8))
          drop-shadow(0 0 20px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 70%), 0.5));
}
.dark .filter-glow-purple-strong {
  filter: drop-shadow(0 0 12px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 80%), 0.9))
          drop-shadow(0 0 25px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 80%), 0.6));
}

.btn-header-action {
  @apply btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5;
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.3);
  background-color: hsla(var(--agent-diary-neutral-h), 15%, 25%, 0.3); 
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 80%)); 
  
  &:hover {
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 60%), 0.7);
    background-color: hsla(var(--agent-diary-neutral-h), 15%, 30%, 0.6);
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 85%));
    box-shadow: 0 0 10px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.2);
  }
}
.dark .btn-header-action {
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 60%), 0.4);
  background-color: hsla(var(--agent-diary-neutral-h), 20%, 18%, 0.5);
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 85%));
   &:hover {
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 70%), 0.8);
    background-color: hsla(var(--agent-diary-neutral-h), 20%, 22%, 0.7);
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 90%), var(--agent-diary-purple-l, 90%));
  }
}

.btn-header-action.btn-primary-glow { 
  @apply bg-gradient-to-r text-white border-transparent shadow-lg;
  --gradient-from: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 90%), var(--agent-diary-purple-l, 65%));
  --gradient-to: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 90%), var(--agent-diary-pink-l, 70%));
  background-image: linear-gradient(to right, var(--gradient-from), var(--gradient-to));

  &:hover {
    --gradient-from-hover: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 100%), var(--agent-diary-purple-l, 70%));
    --gradient-to-hover: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 100%), var(--agent-diary-pink-l, 75%));
    background-image: linear-gradient(to right, var(--gradient-from-hover), var(--gradient-to-hover));
    box-shadow: 0 0 15px hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 80%), var(--agent-diary-pink-l, 60%), 0.5);
  }
}
.dark .btn-header-action.btn-primary-glow {
  --gradient-from: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 60%));
  --gradient-to: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 80%), var(--agent-diary-pink-l, 65%));
   &:hover {
    --gradient-from-hover: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 90%), var(--agent-diary-purple-l, 65%));
    --gradient-to-hover: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 90%), var(--agent-diary-pink-l, 70%));
    box-shadow: 0 0 18px hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 70%), var(--agent-diary-pink-l, 55%), 0.6);
  }
}


.ephemeral-chat-panel {
  background: linear-gradient(160deg, 
    hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s), var(--agent-diary-purple-l), 0.6) 0%, 
    hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 5%), calc(var(--agent-diary-purple-l) - 4%), 0.75) 100%
  );
  backdrop-filter: blur(5px);
  box-shadow: inset -12px 0px 25px -10px rgba(0,0,0,0.35); 
  position: relative; 

  &::after { 
    content: ''; 
    @apply absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10;
    background: linear-gradient(to bottom, transparent, 
      hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s) + 5%), calc(var(--agent-diary-purple-l) - 4%), 1) 90%
    );
  }
}
.dark .ephemeral-chat-panel {
   background: linear-gradient(160deg, 
    hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 40%), calc(var(--agent-diary-purple-l, 15%) - 5%), 0.7) 0%, 
    hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s, 40%) + 5%), calc(var(--agent-diary-purple-l, 15%) - 8%), 0.85) 100%
  );
   &::after {
     background: linear-gradient(to bottom, transparent, 
      hsla(var(--agent-diary-purple-h), calc(var(--agent-diary-purple-s, 40%) + 5%), calc(var(--agent-diary-purple-l, 15%) - 8%), 1) 90%
    );
   }
}

.chat-message-item-diary :deep(.message-bubble-user) {
  background-color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 60%), var(--agent-diary-pink-l, 50%), 0.3);
  border-color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 60%), var(--agent-diary-pink-l, 50%), 0.4);
  @apply text-sm shadow-none max-w-[90%];
}
.dark .chat-message-item-diary :deep(.message-bubble-user) {
  background-color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 50%), var(--agent-diary-pink-l, 40%), 0.4);
  border-color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 50%), var(--agent-diary-pink-l, 40%), 0.5);
}

.chat-message-item-diary :deep(.message-bubble-assistant) {
  background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 40%), var(--agent-diary-purple-l, 30%), 0.4);
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 40%), var(--agent-diary-purple-l, 30%), 0.5);
  @apply text-sm shadow-none max-w-[90%];
}
.dark .chat-message-item-diary :deep(.message-bubble-assistant) {
  background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 30%), var(--agent-diary-purple-l, 20%), 0.5);
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 30%), var(--agent-diary-purple-l, 20%), 0.6);
}

.text-xxs { @apply text-[0.65rem] leading-[0.9rem]; }

.diary-page-panel {
  background: 
    radial-gradient(ellipse at 50% -30%, hsla(var(--agent-diary-pink-h), 25%, 20%, 0.3), transparent 70%),
    radial-gradient(ellipse at 15% 95%, hsla(var(--agent-diary-purple-h), 30%, 25%, 0.25), transparent 70%),
    hsl(var(--agent-diary-neutral-h), 15%, 9%); 
  border-left: 1px solid hsla(var(--agent-diary-purple-h), 30%, 50%, 0.1); 
  box-shadow: 
    inset 10px 0px 30px -10px rgba(0,0,0,0.5), 
    0 0 100px hsla(var(--agent-diary-purple-h), 20%, 5%, 0.3) inset; 
  position: relative; 

  &::before { 
    content: ""; 
    @apply absolute inset-[-1px] pointer-events-none z-0;
    border-radius: inherit; 
    border: 1px solid transparent;
    background: linear-gradient(120deg, 
      hsla(var(--agent-diary-pink-h),70%,70%,0.15), 
      hsla(var(--agent-diary-purple-h),60%,60%,0.15), 
      hsla(var(--agent-diary-pink-h),70%,70%,0.15)
    ) border-box; 
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; 
    mask-composite: exclude;
    opacity: 0.7;
    animation: subtle-border-pulse 8s infinite alternate; 
  }
}
.dark .diary-page-panel {
  background: 
    radial-gradient(ellipse at 50% -30%, hsla(var(--agent-diary-pink-h), 30%, 15%, 0.35), transparent 70%),
    radial-gradient(ellipse at 15% 95%, hsla(var(--agent-diary-purple-h), 35%, 20%, 0.3), transparent 70%),
    hsl(var(--agent-diary-neutral-h), 12%, 5%); /* Even darker base */
  border-left-color: hsla(var(--agent-diary-purple-h), 35%, 40%, 0.15);
  box-shadow: 
    inset 10px 0px 30px -10px rgba(0,0,0,0.6), 
    0 0 120px hsla(var(--agent-diary-purple-h), 25%, 3%, 0.35) inset;
   &::before {
     background: linear-gradient(120deg, 
      hsla(var(--agent-diary-pink-h),80%,60%,0.2), 
      hsla(var(--agent-diary-purple-h),70%,50%,0.2), 
      hsla(var(--agent-diary-pink-h),80%,60%,0.2)
    ) border-box;
   }
}


.metadata-form {
  backdrop-filter: blur(3px);
  box-shadow: inset 0 6px 10px -3px rgba(0,0,0,0.3); 
}
.form-input-diary { 
  @apply w-full block px-2.5 py-1.5 rounded-md text-xs;
  background-color: hsla(var(--agent-diary-neutral-h), 10%, 20%, 0.5); 
  border: 1px solid hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 40%), var(--agent-diary-purple-l, 40%), 0.5);
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 80%), var(--agent-diary-pink-l, 85%)); 
  
  &::placeholder {
    color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 60%), var(--agent-diary-pink-l, 70%), 0.6);
  }
  &:focus {
    border-color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 70%), var(--agent-diary-pink-l, 70%));
    background-color: hsla(var(--agent-diary-neutral-h), 10%, 25%, 0.7);
    box-shadow: 0 0 8px hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 70%), var(--agent-diary-pink-l, 70%), 0.3);
  }
}
.dark .form-input-diary {
  background-color: hsla(var(--agent-diary-neutral-h), 12%, 15%, 0.6); 
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.6);
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 85%), var(--agent-diary-pink-l, 90%));
   &::placeholder {
    color: hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 65%), var(--agent-diary-pink-l, 75%), 0.6);
  }
   &:focus {
    border-color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 75%), var(--agent-diary-pink-l, 75%));
    background-color: hsla(var(--agent-diary-neutral-h), 12%, 20%, 0.8);
    box-shadow: 0 0 10px hsla(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 75%), var(--agent-diary-pink-l, 75%), 0.4);
  }
}

.diary-entry-content :deep(h2) { 
  @apply text-transparent bg-clip-text bg-gradient-to-r pb-2.5 mb-6 text-2xl font-bold tracking-tight;
  --title-gradient-from: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 80%));
  --title-gradient-to: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 90%), var(--agent-diary-pink-l, 85%));
  background-image: linear-gradient(to right, var(--title-gradient-from), var(--title-gradient-to));
  border-bottom: 1px solid hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.3);
  text-shadow: 0 0 15px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 70%), 0.5);
}
.dark .diary-entry-content :deep(h2) {
  --title-gradient-from: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 85%), var(--agent-diary-purple-l, 85%));
  --title-gradient-to: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 95%), var(--agent-diary-pink-l, 90%));
  border-bottom-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 60%), 0.4);
  text-shadow: 0 0 18px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 75%), 0.6);
}

.diary-entry-content :deep(strong) { 
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 75%)); font-weight: 600;
}
.dark .diary-entry-content :deep(strong) {
  color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 75%), var(--agent-diary-purple-l, 80%));
}

.diary-entry-content :deep(p) { 
  color: hsl(var(--text-secondary-dark-h, var(--agent-diary-pink-h)), var(--text-secondary-dark-s, calc(var(--agent-diary-pink-s, 70%) - 20%)), var(--text-secondary-dark-l, calc(var(--agent-diary-pink-l, 70%) - 10%)));
  @apply leading-relaxed text-base;
}
.dark .diary-entry-content :deep(p) {
  color: hsl(var(--text-secondary-dark-h, var(--agent-diary-pink-h)), var(--text-secondary-dark-s, calc(var(--agent-diary-pink-s, 70%) - 15%)), var(--text-secondary-dark-l, calc(var(--agent-diary-pink-l, 70%) - 5%)));
}


.diary-entry-content :deep(ul), .diary-entry-content :deep(ol) { 
  color: hsl(var(--text-secondary-dark-h, var(--agent-diary-pink-h)), var(--text-secondary-dark-s, calc(var(--agent-diary-pink-s, 70%) - 20%)), var(--text-secondary-dark-l, calc(var(--agent-diary-pink-l, 70%) - 10%)));
}
.dark .diary-entry-content :deep(ul), .dark .diary-entry-content :deep(ol) {
   color: hsl(var(--text-secondary-dark-h, var(--agent-diary-pink-h)), var(--text-secondary-dark-s, calc(var(--agent-diary-pink-s, 70%) - 15%)), var(--text-secondary-dark-l, calc(var(--agent-diary-pink-l, 70%) - 5%)));
}

.diary-entry-content :deep(hr) { 
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.3); @apply my-8;
}
.dark .diary-entry-content :deep(hr) {
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 60%), 0.4);
}

.diary-entry-content :deep(a) { 
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 80%), var(--agent-diary-pink-l, 75%));
  &:hover { color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 90%), var(--agent-diary-pink-l, 80%)); }
}
.dark .diary-entry-content :deep(a) {
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 85%), var(--agent-diary-pink-l, 80%));
  &:hover { color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 95%), var(--agent-diary-pink-l, 85%)); }
}


.btn-icon-diary {
  @apply p-2.5 rounded-lg transition-all duration-150 shadow-lg active:scale-90 backdrop-blur-sm;
  background-color: hsla(var(--agent-diary-neutral-h), 10%, 20%, 0.4); 
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 70%), var(--agent-diary-pink-l, 70%)); 
  border: 1px solid hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 40%), var(--agent-diary-purple-l, 40%), 0.2);
  
  &:hover {
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 30%), 0.5);
    color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 85%), var(--agent-diary-pink-l, 85%)); 
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.5);
    box-shadow: 0 0 12px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.4);
  }
}
.dark .btn-icon-diary {
  background-color: hsla(var(--agent-diary-neutral-h), 12%, 15%, 0.5);
  color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 75%), var(--agent-diary-pink-l, 75%));
  border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.3);
   &:hover {
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 40%), 0.6);
    color: hsl(var(--agent-diary-pink-h), var(--agent-diary-pink-s, 90%), var(--agent-diary-pink-l, 90%));
    border-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 60%), 0.6);
    box-shadow: 0 0 14px hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 60%), 0.5);
  }
}

.btn-icon-close { 
  @apply p-1.5 rounded-full transition-colors;
  color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 70%), 0.7);
  &:hover {
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 80%));
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 50%), var(--agent-diary-purple-l, 50%), 0.3);
  }
}
.dark .btn-icon-close {
  color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 75%), 0.8);
   &:hover {
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 80%), var(--agent-diary-purple-l, 85%));
    background-color: hsla(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 60%), 0.4);
  }
}


.entry-list-item:hover h4 { 
  text-shadow: 0 0 8px hsla(var(--agent-diary-pink-h), 80%, 70%, 0.7);
}
.dark .entry-list-item:hover h4 {
  text-shadow: 0 0 10px hsla(var(--agent-diary-pink-h), 85%, 75%, 0.8);
}


.modal-fade-enter-active .glass-pane-dark, 
.modal-fade-leave-active .glass-pane-dark {
  transition: opacity 0.3s var(--ease-out-cubic, ease-out), transform 0.3s var(--ease-out-cubic, ease-out);
}
.modal-fade-enter-from .glass-pane-dark, 
.modal-fade-leave-to .glass-pane-dark {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.custom-scrollbar-diary-chat,
.custom-scrollbar-diary-entry,
.custom-scrollbar-futuristic { 
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-track {
    background-color: hsla(var(--agent-diary-purple-h), 20%, 15%, 0.3); 
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--agent-diary-purple-h), 40%, 50%, 0.6); 
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: hsla(var(--agent-diary-pink-h), 50%, 60%, 0.8); 
  }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--agent-diary-purple-h), 40%, 50%, 0.6) hsla(var(--agent-diary-purple-h), 20%, 15%, 0.3);
}
.dark .custom-scrollbar-diary-chat,
.dark .custom-scrollbar-diary-entry,
.dark .custom-scrollbar-futuristic {
   &::-webkit-scrollbar-track { background-color: hsla(var(--agent-diary-purple-h), 25%, 10%, 0.4); }
   &::-webkit-scrollbar-thumb { background-color: hsla(var(--agent-diary-purple-h), 45%, 45%, 0.7); }
   &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--agent-diary-pink-h), 55%, 55%, 0.9); }
   scrollbar-color: hsla(var(--agent-diary-purple-h), 45%, 45%, 0.7) hsla(var(--agent-diary-purple-h), 25%, 10%, 0.4);
}


.loading-overlay-diary-page {
  @apply absolute inset-0 flex flex-col items-center justify-content-center z-20 backdrop-blur-sm;
  background-color: hsla(var(--agent-diary-neutral-h), 15%, 10%, 0.6); 
  .icon { 
    color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 60%), var(--agent-diary-purple-l, 65%));
  }
}
.dark .loading-overlay-diary-page {
  background-color: hsla(var(--agent-diary-neutral-h), 12%, 5%, 0.7);
   .icon {
     color: hsl(var(--agent-diary-purple-h), var(--agent-diary-purple-s, 70%), var(--agent-diary-purple-l, 70%));
   }
}

.glass-pane-dark { 
  background: hsla(var(--color-bg-glass-h, var.$default-color-bg-glass-h), var(--color-bg-glass-s, var.$default-color-bg-glass-s), var(--color-bg-glass-l, var.$default-color-bg-glass-l), var(--color-bg-glass-a, 0.7));
  backdrop-filter: blur(var(--blur-glass, #{var.$default-blur-glass})) saturate(130%); 
  border: 1px solid hsla(var(--color-border-glass-h, var.$default-color-border-glass-h), var(--color-border-glass-s, var.$default-color-border-glass-s), var(--color-border-glass-l, var.$default-color-border-glass-l), var(--color-border-glass-a, 0.3));
  box-shadow: var(--shadow-depth-xl, #{var.$scss-box-shadow-xl}); 
}
.dark .glass-pane-dark { /* Dark mode specific overrides for the modal's glass pane */
  background: hsla(var(--color-bg-glass-h-dark, var.$default-color-bg-glass-h), var(--color-bg-glass-s-dark, var.$default-color-bg-glass-s), var(--color-bg-glass-l-dark, calc(var.$default-color-bg-glass-l - 70%)), var(--color-bg-glass-a-dark, 0.85)); /* Example: darker glass */
  border-color: hsla(var(--color-border-glass-h-dark, var.$default-color-border-glass-h), var(--color-border-glass-s-dark, var.$default-color-border-glass-s), var(--color-border-glass-l-dark, calc(var.$default-color-border-glass-l - 60%)), var(--color-border-glass-a-dark, 0.5));
}

</style>