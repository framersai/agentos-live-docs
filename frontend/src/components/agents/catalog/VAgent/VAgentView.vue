<script setup lang="ts">
import { computed, inject, onMounted, PropType, toRef } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/layouts/CompactMessageRenderer/CompactMessageRenderer.vue';
import { CpuChipIcon, SparklesIcon } from '@heroicons/vue/24/outline'; // Icon for V

import { useVAgent } from './useVAgent';
// VAgentTypes might not be directly needed if composable handles all typed state for view

const props = defineProps({
  agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
}>();

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

const agentConfigAsRef = toRef(props, 'agentConfig');

const {
  isLoadingResponse,
  agentDisplayName,
  mainContentToDisplay,
  initialize,
  // cleanup, // Call in onUnmounted if defined
  handleNewUserInput,
  renderMarkdown,
} = useVAgent(agentConfigAsRef, toast);

onMounted(async () => {
  await initialize(props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });

  if (!mainContentToDisplay.value?.data || mainContentToDisplay.value?.title === `${props.agentConfig.label} Ready`) {
    const welcomeMarkdown = `
<div class="v-welcome-container">
  <div class="v-icon-wrapper">
    <CpuChipIcon class="v-main-icon" />
  </div>
  <h2 class="v-welcome-title">V Online.</h2>
  <p class="v-welcome-subtitle">${props.agentConfig.description || 'Advanced intelligence at your service. Pose your complex query or exploration.'}</p>
  <p class="v-welcome-prompt">${props.agentConfig.inputPlaceholder || 'What shall we delve into?'}</p>
</div>`;
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown',
      data: welcomeMarkdown,
      title: `${agentDisplayName.value} Ready`,
      timestamp: Date.now(),
    });
  }
});

// import { onUnmounted } from 'vue';
// onUnmounted(() => {
//   cleanup();
// });

defineExpose({ handleNewUserInput });

</script>

<template>
  <div class="general-agent-view v-agent-view">
    <div class="v-header">
      <div class="v-header-title-group">
        <CpuChipIcon class="v-header-icon" :class="props.agentConfig.iconClass" />
        <span class="v-header-title">{{ agentDisplayName }}</span>
      </div>
      </div>
    
    <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming && !(mainContentToDisplay && mainContentToDisplay.data)" class="v-loading-overlay">
      <div class="v-spinner-container"><div class="v-spinner"></div></div>
      <p class="v-loading-text">{{ agentDisplayName }} is processing...</p>
    </div>
    
    <div class="v-main-content-area">
      <template v-if="mainContentToDisplay?.data">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && (mainContentToDisplay.type === 'compact-message-renderer-data' || mainContentToDisplay.type === 'loading' || (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming && mainContentToDisplay.data.includes('---SLIDE_BREAK---')))"
          :content="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                        ? chatStore.streamingMainContentText 
                        : mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="v-compact-renderer" 
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose-futuristic v-prose-content"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                      ? renderMarkdown(chatStore.streamingMainContentText + '▋') 
                      : renderMarkdown(mainContentToDisplay.data as string)"
        ></div>
        <div v-else class="v-placeholder">
          {{ agentDisplayName }} is active. Main content type: {{ mainContentToDisplay.type }}.
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="v-empty-state">
          <SparklesIcon class="v-empty-icon"/> <p class="v-empty-text">{{ props.agentConfig.inputPlaceholder || `Initiate query with ${agentDisplayName}.` }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@import '@/styles/abstracts/_variables.scss';
@import '@/styles/abstracts/_mixins.scss';

.v-agent-view {
  --v-accent-h: var(--accent-hue-cyan, 180); // Cyan/Teal for V - more techy/intelligent feel
  --v-accent-s: var(--accent-saturation-vibrant, 90%);
  --v-accent-l: var(--accent-lightness-bright, 60%);
  
  --v-bg-h: var(--color-bg-primary-h, 220); // Darker, more sophisticated base
  --v-bg-s: var(--color-bg-primary-s, 25%);
  --v-bg-l: calc(var(--color-bg-primary-l, 16%) - 5%); // Even darker than Nerf

  @apply flex flex-col h-full w-full overflow-hidden;
  background-color: hsl(var(--v-bg-h), var(--v-bg-s), var(--v-bg-l));
  // Subtle network/plexus background for V
  background-image: 
    radial-gradient(circle at 15% 15%, hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.1) 0%, transparent 40%),
    radial-gradient(circle at 85% 75%, hsla(var(--v-accent-h), calc(var(--v-accent-s) - 20%), calc(var(--v-accent-l) + 10%), 0.07) 0%, transparent 50%),
    var(--bg-plexus-texture-dark); // Assuming a plexus texture CSS var exists or define it
  background-size: cover, cover, auto;
  color: var(--color-text-primary-on-dark, hsl(200, 30%, 90%));
  border: 1px solid hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.2);
  box-shadow: inset 0 0 40px hsla(var(--v-bg-h), var(--v-bg-s), calc(var(--v-bg-l) - 10%), 0.6);
}

.v-header {
  @apply p-3 px-4 border-b flex items-center justify-between gap-2 text-sm shadow-lg backdrop-blur-md; // More blur
  background-color: hsla(var(--v-bg-h), var(--v-bg-s), calc(var(--v-bg-l) + 3%), 0.88); // Slightly more opaque
  border-bottom-color: hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.3);
  
  .v-header-title-group { @apply flex items-center gap-2.5; }
  .v-header-icon {
    @apply w-6 h-6 shrink-0;
    color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
    filter: drop-shadow(0 0 8px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.8));
  }
  .v-header-title {
    @apply font-semibold text-lg tracking-normal; // Normal tracking for V's sophistication
    color: var(--color-text-primary-on-dark, hsl(200, 40%, 95%));
    text-shadow: 0 0 7px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.25);
  }
}

.v-main-content-area {
  @apply flex-grow relative min-h-0 overflow-y-auto;
   @include custom-scrollbar(
    $thumb-color-var-prefix: '--v-accent',
    $thumb-base-alpha: 0.6, $thumb-hover-alpha: 0.8,
    $track-color-var-prefix: '--v-bg', $track-alpha: 0.3, $width: 7px, // Slightly thicker scrollbar
    $fb-thumb-h: 180, $fb-thumb-s: 90%, $fb-thumb-l: 60%,
    $fb-track-h: 220, $fb-track-s: 25%, $fb-track-l: calc(16% - 7%)
  );
}

.v-loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: hsla(var(--v-bg-h), var(--v-bg-s), calc(var(--v-bg-l) + 2%), 0.75); // Darker overlay
  backdrop-filter: blur(3.5px);
}
.v-spinner-container { @apply relative w-11 h-11 mb-3; } // Slightly larger
.v-spinner { // More complex spinner for V
  @apply w-full h-full rounded-full;
  border: 3px solid hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.15);
  border-left-color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
  border-right-color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
  animation: v-spin 1s infinite cubic-bezier(0.4, 0, 0.2, 1); // Smoother spin
  box-shadow: 0 0 12px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.3);
}
.v-loading-text {
  color: hsl(var(--v-accent-h), var(--v-accent-s), calc(var(--v-accent-l) + 20%)); // Brighter text
  @apply font-medium text-sm tracking-wide;
}

.v-compact-renderer { @apply p-2 sm:p-3 h-full; }

.prose-futuristic.v-prose-content {
  @apply p-4 md:p-6 h-full; // Same padding
  font-size: var(--font-size-base);
  line-height: calc(var(--line-height-base) + 0.05); // Slightly more spacious line height for V

  :deep(h1), :deep(h2), :deep(h3) {
    @apply font-semibold tracking-tight border-b pb-2 mb-4; // Different spacing
    color: hsl(var(--v-accent-h), var(--v-accent-s), calc(var(--v-accent-l) + 15%));
    border-bottom-color: hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.4);
  }
  :deep(h1) { @apply text-xl sm:text-2xl; } 
  :deep(h2) { @apply text-lg sm:text-xl; } 
  :deep(h3) { @apply text-base sm:text-lg; }

  :deep(p), :deep(li) { 
    color: var(--color-text-secondary-on-dark, hsl(200, 20%, 85%)); // Slightly brighter secondary text
    @apply my-3 leading-relaxed; 
  }
  :deep(a) {
    color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
    @apply hover:underline hover:brightness-110 font-medium;
    text-decoration-thickness: 1px;
  }
  :deep(strong) { color: var(--color-text-primary-on-dark, hsl(200, 30%, 90%)); font-weight: 600; }
  :deep(code:not(pre code)) {
    @apply px-1.5 py-0.5 rounded-sm text-xs; // Slightly less padding
    background-color: hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.1);
    color: hsl(var(--v-accent-h), var(--v-accent-s), calc(var(--v-accent-l) + 25%));
    border: 1px solid hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.25);
  }
  :deep(pre) {
    @apply border text-sm my-4 p-4 rounded-lg shadow-md; // Slightly more prominent pre
    background-color: hsla(var(--v-bg-h), var(--v-bg-s), calc(var(--v-bg-l) - 5%), 0.98); // Darker code bg
    border-color: hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.3);
    @include custom-scrollbar(
      $thumb-color-var-prefix: '--v-accent', $thumb-base-alpha: 0.5, $thumb-hover-alpha: 0.7,
      $track-color-var-prefix: '--v-bg', $track-alpha: 0.15, $width: 7px,
      $fb-thumb-h: 180, $fb-thumb-s: 90%, $fb-thumb-l: 60%,
      $fb-track-h: 220, $fb-track-s: 25%, $fb-track-l: calc(16% - 10%)
    );
  }
   :deep(blockquote) {
    @apply border-l-4 pl-4 py-2 italic my-4 text-[0.95em];
    color: var(--color-text-muted-on-dark, hsl(200, 15%, 70%));
    border-left-color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
    background-color: hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.03); // Very subtle bg
    border-radius: 0 $radius-md $radius-md 0;
  }
}

.v-placeholder, .v-empty-state {
  color: var(--color-text-muted-on-dark, hsl(200, 15%, 70%));
  @apply italic text-center p-8 flex flex-col items-center justify-center h-full opacity-80;
}
.v-empty-icon {
  @apply w-14 h-14 mb-4 opacity-50; // Larger icon
  color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
  filter: drop-shadow(0 0 10px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.5));
}
.v-empty-text { @apply text-sm; }

.v-welcome-container {
  @apply text-center p-8 flex flex-col items-center justify-center h-full;
  .v-icon-wrapper {
    @apply p-3 rounded-lg mb-5 shadow-xl; // Different shape
    background: radial-gradient(circle, hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.15) 0%, transparent 65%);
  }
  .v-main-icon {
    @apply w-20 h-20 mx-auto; // Larger
    color: hsl(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l));
    filter: drop-shadow(0 0 20px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.7));
    animation: subtlePulseV 2.5s infinite ease-in-out;
  }
  .v-welcome-title {
    @apply text-3xl sm:text-4xl font-bold mt-2 mb-2 tracking-tight; // Tighter tracking, larger
    color: var(--color-text-primary-on-dark, hsl(200, 30%, 90%));
    text-shadow: 0 1px 3px hsla(var(--v-bg-h), var(--v-bg-s), calc(var(--v-bg-l) - 25%), 0.6);
  }
  .v-welcome-subtitle {
    @apply text-lg sm:text-xl mb-5 max-w-lg opacity-90; // Larger subtitle
    color: var(--color-text-secondary-on-dark, hsl(200, 20%, 85%));
  }
  .v-welcome-prompt {
    @apply text-base italic; // Larger prompt
    color: var(--color-text-muted-on-dark, hsl(200, 15%, 70%));
  }
}

@keyframes v-spin { /* Custom spin for V */
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes subtlePulseV {
  0%, 100% { opacity: 0.9; transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 15px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.6));}
  50% { opacity: 1; transform: scale(1.05) rotate(2deg); filter: drop-shadow(0 0 25px hsla(var(--v-accent-h), var(--v-accent-s), var(--v-accent-l), 0.8));}
}
</style>