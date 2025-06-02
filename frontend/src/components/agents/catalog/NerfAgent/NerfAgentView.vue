<script setup lang="ts">
import { computed, inject, onMounted, PropType, toRef } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/layouts/CompactMessageRenderer/CompactMessageRenderer.vue';
import { ChatBubbleLeftEllipsisIcon, SparklesIcon } from '@heroicons/vue/24/outline';

// Assuming composable and types are in a subdirectory "Nerf"
import { useNerfAgent } from './useNerfAgent';
// NerfAgentTypes might not be directly needed in the view if composable handles all typed state

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
  // cleanup, // Call in onUnmounted if defined in composable
  handleNewUserInput, // Exposed for VoiceInput integration
  renderMarkdown, // Provided by composable for direct markdown rendering if needed
} = useNerfAgent(agentConfigAsRef, toast);

onMounted(async () => {
  await initialize(props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });

  // Initial welcome message if no content exists
  if (!mainContentToDisplay.value?.data || mainContentToDisplay.value?.title === `${props.agentConfig.label} Ready`) {
    const welcomeMarkdown = `
<div class="nerf-welcome-container">
  <div class="nerf-icon-wrapper">
    <ChatBubbleLeftEllipsisIcon class="nerf-main-icon" />
  </div>
  <h2 class="nerf-welcome-title">Hi, I'm ${agentDisplayName.value}!</h2>
  <p class="nerf-welcome-subtitle">${props.agentConfig.description || 'Your friendly general assistant.'}</p>
  <p class="nerf-welcome-prompt">${props.agentConfig.inputPlaceholder || 'What can I help you with?'}</p>
</div>`;
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown', // Welcome message is simple markdown
      data: welcomeMarkdown,
      title: `${agentDisplayName.value} Ready`,
      timestamp: Date.now(),
    });
  }
});

// If composable has a cleanup function:
// import { onUnmounted } from 'vue';
// onUnmounted(() => {
//   cleanup();
// });

defineExpose({ handleNewUserInput });

</script>

<template>
  <div class="general-agent-view nerf-agent-view">
    <div class="nerf-header">
      <div class="nerf-header-title-group">
        <ChatBubbleLeftEllipsisIcon class="nerf-header-icon" :class="props.agentConfig.iconClass" />
        <span class="nerf-header-title">{{ agentDisplayName }}</span>
      </div>
      </div>
    
    <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming && !(mainContentToDisplay && mainContentToDisplay.data)" class="nerf-loading-overlay">
      <div class="nerf-spinner-container"><div class="nerf-spinner"></div></div>
      <p class="nerf-loading-text">{{ agentDisplayName }} is thinking...</p>
    </div>
    
    <div class="nerf-main-content-area">
      <template v-if="mainContentToDisplay?.data">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && (mainContentToDisplay.type === 'compact-message-renderer-data' || mainContentToDisplay.type === 'loading' || (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming && mainContentToDisplay.data.includes('---SLIDE_BREAK---')))"
          :content="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                        ? chatStore.streamingMainContentText 
                        : mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="nerf-compact-renderer" 
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose-futuristic nerf-prose-content"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                      ? renderMarkdown(chatStore.streamingMainContentText + '▋') 
                      : renderMarkdown(mainContentToDisplay.data as string)"
        ></div>
        <div v-else class="nerf-placeholder">
          {{ agentDisplayName }} received content of type: {{ mainContentToDisplay.type }}.
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="nerf-empty-state">
          <SparklesIcon class="nerf-empty-icon"/>
        <p class="nerf-empty-text">{{ props.agentConfig.inputPlaceholder || `Ask ${agentDisplayName} anything!` }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@import '@/styles/abstracts/_variables.scss';
@import '@/styles/abstracts/_mixins.scss';

// Styles are identical to the original GeneralAgentView.vue's nerf-specific styles
.nerf-agent-view {
  --nerf-accent-h: var(--color-accent-secondary-h, #{$default-color-accent-secondary-h});
  --nerf-accent-s: var(--color-accent-secondary-s, #{$default-color-accent-secondary-s});
  --nerf-accent-l: var(--color-accent-secondary-l, #{$default-color-accent-secondary-l});
  
  --nerf-bg-h: var(--color-bg-primary-h, #{$default-color-bg-primary-h});
  --nerf-bg-s: var(--color-bg-primary-s, #{$default-color-bg-primary-s});
  --nerf-bg-l: calc(var(--color-bg-primary-l, #{$default-color-bg-primary-l}) - 2%);

  @apply flex flex-col h-full w-full overflow-hidden;
  background-color: hsl(var(--nerf-bg-h), var(--nerf-bg-s), var(--nerf-bg-l));
  background-image: 
    radial-gradient(ellipse at 80% 10%, hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 20% 90%, hsla(var(--nerf-accent-h), calc(var(--nerf-accent-s) - 10%), calc(var(--nerf-accent-l) - 5%), 0.08) 0%, transparent 50%),
    var(--bg-grid-texture-subtle, linear-gradient(hsla(0,0%,100%,0.02) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.02) 1px, transparent 1px)); // Added fallback for grid texture
  background-size: cover, cover, var(--bg-grid-size, 50px) var(--bg-grid-size, 50px); // Added fallback for grid size
  color: var(--color-text-primary);
  border: 1px solid hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.1);
  box-shadow: inset 0 0 30px hsla(var(--nerf-bg-h), var(--nerf-bg-s), calc(var(--nerf-bg-l) - 10%), 0.5);
}

.nerf-header {
  @apply p-3 px-4 border-b flex items-center justify-between gap-2 text-sm shadow-md backdrop-blur-sm;
  background-color: hsla(var(--nerf-bg-h), var(--nerf-bg-s), calc(var(--nerf-bg-l) + 4%), 0.85);
  border-bottom-color: hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.25);
  
  .nerf-header-title-group { @apply flex items-center gap-2.5; }
  .nerf-header-icon {
    @apply w-6 h-6 shrink-0;
    color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l));
    filter: drop-shadow(0 0 6px hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.7));
  }
  .nerf-header-title {
    @apply font-semibold text-lg tracking-wide;
    color: var(--color-text-primary);
    text-shadow: 0 0 5px hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.2);
  }
}

.nerf-main-content-area {
  @apply flex-grow relative min-h-0 overflow-y-auto;
   @include custom-scrollbar(
    $thumb-color-var-prefix: '--nerf-accent',
    $thumb-base-alpha: 0.5,
    $thumb-hover-alpha: 0.7,
    $track-color-var-prefix: '--nerf-bg',
    $track_alpha: 0.3,
    $fb-thumb-h: $default-color-accent-secondary-h, 
    $fb-thumb-s: $default-color-accent-secondary-s,
    $fb-thumb-l: $default-color-accent-secondary-l,
    $fb-track-h: $default-color-bg-primary-h, 
    $fb-track-s: $default-color-bg-primary-s,
    $fb-track-l: calc(#{$default-color-bg-primary-l} - 2%)
  );
}

.nerf-loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: hsla(var(--nerf-bg-h), var(--nerf-bg-s), var(--nerf-bg-l), 0.7);
  backdrop-filter: blur(3px);
}
.nerf-spinner-container { @apply relative w-10 h-10 mb-2.5; }
.nerf-spinner {
  @apply w-full h-full border-[5px] rounded-full animate-spin;
  border-color: hsla(var(--nerf-accent-h), var(--nerf-accent-s), calc(var(--nerf-accent-l) + 10%), 0.25);
  border-top-color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l));
  box-shadow: 0 0 10px hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.3);
}
.nerf-loading-text {
  color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), calc(var(--nerf-accent-l) + 15%));
  @apply font-medium text-sm tracking-wider;
}

.nerf-compact-renderer { @apply p-2 sm:p-3 h-full; }

.prose-futuristic.nerf-prose-content {
  @apply p-4 md:p-6 h-full;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);

  :deep(h1), :deep(h2), :deep(h3) {
    @apply font-semibold tracking-tight border-b pb-1.5 mb-3;
    color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), calc(var(--nerf-accent-l) + 10%));
    border-bottom-color: hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.35);
  }
  :deep(h1) { @apply text-xl; } :deep(h2) { @apply text-lg; } :deep(h3) { @apply text-base; }

  :deep(p), :deep(li) { 
    color: var(--color-text-secondary);
    @apply my-2.5 leading-relaxed; 
  }
  :deep(a) {
    color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l));
    @apply hover:underline hover:brightness-125 font-medium;
    text-decoration-thickness: 1.5px;
  }
  :deep(strong) { color: var(--color-text-primary); font-weight: 600; }
  :deep(code:not(pre code)) {
    @apply px-1.5 py-1 rounded-sm text-xs;
    background-color: hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.15);
    color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), calc(var(--nerf-accent-l) + 20%));
    border: 1px solid hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.2);
  }
  :deep(pre) {
    @apply border text-sm my-3 p-3.5 rounded-md shadow-inner;
    background-color: hsla(var(--nerf-bg-h), var(--nerf-bg-s), calc(var(--nerf-bg-l) - 3%), 0.95);
    border-color: hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.25);
    @include custom-scrollbar(
      $thumb-color-var-prefix: '--nerf-accent', $thumb-base-alpha: 0.4, $thumb-hover-alpha: 0.6,
      $track-color-var-prefix: '--nerf-bg', $track-alpha: 0.1, $width: 6px,
      $fb-thumb-h: $default-color-accent-secondary-h, $fb-thumb-s: $default-color-accent-secondary-s, $fb-thumb-l: $default-color-accent-secondary-l,
      $fb-track-h: $default-color-bg-primary-h, $fb-track-s: $default-color-bg-primary-s, $fb-track-l: calc(#{$default-color-bg-primary-l} - 3%)
    );
  }
   :deep(blockquote) {
    @apply border-l-4 pl-4 italic my-4;
    color: var(--color-text-muted);
    border-left-color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l));
    background-color: hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.05);
    padding-top: $spacing-sm; 
    padding-bottom: $spacing-sm;
    border-radius: 0 $radius-md $radius-md 0;
  }
}

.nerf-placeholder, .nerf-empty-state {
  color: var(--color-text-muted);
  @apply italic text-center p-6 flex flex-col items-center justify-center h-full opacity-75;
}
.nerf-empty-icon {
  @apply w-12 h-12 mb-3.5 opacity-40;
  color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l));
  filter: drop-shadow(0 0 8px hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.4));
}
.nerf-empty-text { @apply text-sm; }

.nerf-welcome-container {
  @apply text-center p-6 flex flex-col items-center justify-center h-full;
  .nerf-icon-wrapper {
    @apply p-2.5 rounded-full mb-4 shadow-xl;
    background: radial-gradient(circle, hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.2) 0%, transparent 60%);
  }
  .nerf-main-icon {
    @apply w-16 h-16 mx-auto;
    color: hsl(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l));
    filter: drop-shadow(0 0 15px hsla(var(--nerf-accent-h), var(--nerf-accent-s), var(--nerf-accent-l), 0.6));
    animation: subtlePulseNerf 3s infinite ease-in-out; // Nerf-specific animation name
  }
  .nerf-welcome-title {
    @apply text-2xl sm:text-3xl font-bold mt-2 mb-1.5 tracking-wide;
    color: var(--color-text-primary);
    text-shadow: 0 1px 2px hsla(var(--nerf-bg-h), var(--nerf-bg-s), calc(var(--nerf-bg-l) - 20%), 0.5);
  }
  .nerf-welcome-subtitle {
    @apply text-base sm:text-lg mb-4 max-w-md opacity-90;
    color: var(--color-text-secondary);
  }
  .nerf-welcome-prompt {
    @apply text-sm italic;
    color: var(--color-text-muted);
  }
}

@keyframes subtlePulseNerf { // Renamed keyframe
  0%, 100% { opacity: 1; transform: scale(1) rotate(1deg); }
  50% { opacity: 0.85; transform: scale(1.04) rotate(-1deg); }
}

</style>