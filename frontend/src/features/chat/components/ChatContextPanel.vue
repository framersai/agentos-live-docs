<template>
  <Transition
    name="slide-fade-context-panel"
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-x-full opacity-0"
    enter-to-class="transform translate-x-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-x-0 opacity-100"
    leave-to-class="transform translate-x-full opacity-0"
  >
    <aside
      v-if="isVisible && contextData"
      class="chat-context-panel"
      role="complementary"
      aria-labelledby="context-panel-title"
      :data-voice-target-region="voiceTargetIdPrefix + 'region'"
    >
      <AppCard variant="flat" padding="none" class="h-full flex flex-col">
        <template #header>
          <div class="context-panel-header">
            <h3 id="context-panel-title" class="panel-title" :data-voice-target="voiceTargetIdPrefix + 'title'">
              {{ panelTitle }}
            </h3>
            <AppButton
              variant="tertiary"
              size="sm" :pill="true"
              :icon="XMarkIcon"
              :aria-label="t('common.closePanel')"
              :title="t('common.closePanel')"
              :data-voice-target="voiceTargetIdPrefix + 'close-button'"
              @click="handleClose"
            />
          </div>
        </template>

        <div class="panel-content fancy-scrollbar" :data-voice-target="voiceTargetIdPrefix + 'content-area'">
          <div v-if="contextData.type" class="context-item" :data-voice-target="voiceTargetIdPrefix + 'type-info'">
            <strong class="context-label">{{ t('chat.contextPanel.typeLabel') }}</strong>
            <span class="context-value type-badge">{{ contextData.type }}</span>
          </div>

          <div v-if="contextData.summary" class="context-item" :data-voice-target="voiceTargetIdPrefix + 'summary'">
            <strong class="context-label">{{ t('chat.contextPanel.summaryLabel') }}</strong>
            <p class="context-value text-sm">{{ contextData.summary }}</p>
          </div>

          <div v-if="contextData.elements && contextData.elements.length > 0" class="context-item" :data-voice-target="voiceTargetIdPrefix + 'elements-list'">
            <strong class="context-label">{{ elementsLabel }}</strong>
            <div class="context-tags-list">
              <span
                v-for="(element, index) in contextData.elements"
                :key="element + index"
                class="context-tag"
                :data-voice-target="voiceTargetIdPrefix + `element-tag-${index + 1}`"
              >
                {{ element }}
              </span>
            </div>
          </div>

          <div v-if="contextData.sourceLink" class="context-item" :data-voice-target="voiceTargetIdPrefix + 'source-link-item'">
            <strong class="context-label">{{ t('chat.contextPanel.sourceLinkLabel') }}</strong>
            <a
              :href="contextData.sourceLink"
              target="_blank"
              rel="noopener noreferrer"
              class="context-link"
              :data-voice-target="voiceTargetIdPrefix + 'source-link'"
            >
              {{ t('chat.contextPanel.viewSourceLink') }} <ArrowTopRightOnSquareIcon class="inline w-3 h-3 ml-1" />
            </a>
          </div>

          <div v-if="contextData.difficulty" class="context-item">
            <strong class="context-label">{{t('chat.contextPanel.difficultyLabel')}}</strong>
            <span class="context-value difficulty-badge" :class="`difficulty-${contextData.difficulty.toLowerCase()}`">{{ contextData.difficulty }}</span>
          </div>
        </div>

        <template #footer v-if="$slots.footerActions">
            <div class="panel-footer-actions">
                <slot name="footerActions"></slot>
            </div>
        </template>
      </AppCard>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
/**
 * @file ChatContextPanel.vue
 * @description A side panel that displays contextual information related to the current chat discussion.
 * Examples include details about a LeetCode problem, system design components, or key concepts.
 * It is themeable, responsive (slides in/out), accessible, and voice-navigable.
 */
import { computed, PropType } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import type { ChatContextData } from '../store/chat.store'; // Assuming this type is defined
import AppCard from '../../../components/common/AppCard.vue';
import AppButton from '../../../components/common/AppButton.vue';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  /**
   * Controls the visibility of the panel.
   * @type {boolean}
   * @required
   */
  isVisible: {
    type: Boolean,
    required: true,
  },
  /**
   * The contextual data to display in the panel.
   * @type {ChatContextData | null}
   */
  contextData: {
    type: Object as PropType<ChatContextData | null>,
    default: null,
  },
  /**
   * Optional title for the panel. If not provided, a default will be used.
   * @type {string}
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * Prefix for voice target IDs to ensure uniqueness.
   * @type {string}
   * @default 'chat-context-panel-'
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'chat-context-panel-',
  },
});

const emit = defineEmits<{
  /** Emitted when the panel's close button is clicked. */
  (e: 'close'): void;
}>();

const { t } = useI18n();

/** The title displayed in the panel header. */
const panelTitle = computed(() => props.title || props.contextData?.type || t('chat.contextPanel.defaultTitle'));

/** Label for the 'elements' section, can be context-dependent. */
const elementsLabel = computed(() => {
  if (props.contextData?.type?.toLowerCase().includes('system')) {
    return t('chat.contextPanel.componentsLabel');
  } else if (props.contextData?.type?.toLowerCase().includes('leet') || props.contextData?.type?.toLowerCase().includes('coding')) {
    return t('chat.contextPanel.dataStructuresAlgorithmsLabel');
  }
  return t('chat.contextPanel.keyElementsLabel');
});

/** Handles the click on the close button. */
const handleClose = () => {
  emit('close');
};

</script>

<style scoped>
.chat-context-panel {
  position: fixed;
  top: var(--app-header-height, 4rem); /* Align below header */
  right: 0;
  bottom: var(--app-input-area-height, 6rem); /* Align above input area */
  width: 100%; /* Full width on small screens */
  max-width: var(--app-context-panel-width, 24rem); /* Tailwind w-96 */
  background-color: var(--app-context-panel-bg, var(--app-surface-color));
  border-left: 1px solid var(--app-context-panel-border, var(--app-border-color));
  box-shadow: var(--app-shadow-xl-left, -10px 0 20px -10px rgba(0,0,0,0.1));
  z-index: var(--z-index-side-panel, 900);
  display: flex; /* Needed for AppCard fullHeight to work if card is direct child */
}
@media (max-width: 639px) { /* sm breakpoint */
    .chat-context-panel {
        top: 0;
        bottom: 0;
        border-left-width: 0;
        max-width: 100%; /* Take full width on mobile if it slides over */
        /* Animation might change for mobile (e.g., slide from bottom or full overlay) */
    }
}

.context-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
  border-bottom: 1px solid var(--app-context-panel-divider, var(--app-border-color-light));
  flex-shrink: 0; /* Prevent header from shrinking */
}
.panel-title {
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-semibold);
  color: var(--app-heading-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel-content {
  flex-grow: 1; /* Allow content to take available space and scroll */
  overflow-y: auto;
  padding: var(--space-4, 1rem);
  space-y: var(--space-4, 1rem);
}
.context-item {
  padding-bottom: var(--space-3, 0.75rem);
}
.context-item:not(:last-child) {
  border-bottom: 1px dashed var(--app-context-panel-item-divider, var(--app-border-color-extralight));
}
.context-label {
  display: block;
  font-size: var(--app-font-size-xs);
  font-weight: var(--app-font-weight-medium);
  color: var(--app-text-muted-color);
  margin-bottom: var(--space-1, 0.25rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.context-value {
  color: var(--app-text-color);
}
.context-value.type-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: var(--app-font-size-sm);
  font-weight: var(--app-font-weight-medium);
  border-radius: var(--app-border-radius-md);
  background-color: var(--app-primary-bg-subtle);
  color: var(--app-primary-text-strong);
  text-transform: capitalize;
}
.context-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2, 0.5rem);
  margin-top: var(--space-1, 0.25rem);
}
.context-tag {
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  font-size: var(--app-font-size-xs);
  background-color: var(--app-tag-bg, var(--app-surface-inset-color));
  color: var(--app-tag-text-color, var(--app-text-secondary-color));
  border-radius: var(--app-border-radius-pill);
  border: 1px solid var(--app-tag-border-color, var(--app-border-color-light));
}
.context-link {
  font-size: var(--app-font-size-sm);
  color: var(--app-link-color);
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;
}
.context-link:hover {
  color: var(--app-link-hover-color);
  text-decoration: underline;
}
.difficulty-badge { /* Shared with ChatMessageItem, could be global */
    @apply px-2 py-0.5 text-xs font-semibold rounded-full;
}
.difficulty-easy { @apply bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300; }
.difficulty-medium { @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300; }
.difficulty-hard { @apply bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300; }

.panel-footer-actions {
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    border-top: 1px solid var(--app-context-panel-divider, var(--app-border-color-light));
    background-color: var(--app-context-panel-footer-bg, transparent); /* Make distinct if needed */
    display: flex;
    justify-content: flex-end; /* Or center, depending on design */
    gap: var(--space-2, 0.5rem);
}


/* Holographic theme */
.theme-holographic .chat-context-panel {
  background-color: var(--holographic-panel-bg-deep-translucent);
  border-left-color: var(--holographic-border-translucent);
  box-shadow: var(--holographic-shadow-lg-left);
}
.theme-holographic .context-panel-header,
.theme-holographic .panel-footer-actions {
  border-color: var(--holographic-border-very-subtle);
}
.theme-holographic .panel-title { color: var(--holographic-text-accent); text-shadow: var(--holographic-text-glow-xs); }
.theme-holographic .context-item:not(:last-child) { border-color: var(--holographic-border-very-subtle); }
.theme-holographic .context-label { color: var(--holographic-text-muted); }
.theme-holographic .context-value { color: var(--holographic-text-primary); }
.theme-holographic .context-value.type-badge {
    background-color: var(--holographic-accent-bg-translucent);
    color: var(--holographic-accent-text-strong);
    border: 1px solid var(--holographic-accent-bg-translucent-border);
}
.theme-holographic .context-tag {
    background-color: var(--holographic-tag-bg);
    color: var(--holographic-tag-text);
    border-color: var(--holographic-tag-border);
}
.theme-holographic .context-link { color: var(--holographic-link-color); }
.theme-holographic .context-link:hover { color: var(--holographic-link-hover-color); }
</style>