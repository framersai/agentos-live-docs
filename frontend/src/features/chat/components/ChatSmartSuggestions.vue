<template>
  <div
    v-if="suggestions && suggestions.length > 0"
    class="chat-smart-suggestions"
    :data-voice-target-region="voiceTargetIdPrefix + 'region'"
    role="toolbar"
    :aria-label="t('chat.smartSuggestions.ariaLabel')"
  >
    <div class="suggestions-header" v-if="title">
      <span class="suggestions-title" :data-voice-target="voiceTargetIdPrefix + 'title'">{{ title }}</span>
    </div>
    <div class="suggestions-list" :class="{ 'scrollable': isScrollable }">
      <AppButton
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.value || suggestion.label"
        variant="custom"
        size="sm"
        class="suggestion-chip"
        :class="[suggestion.type ? `suggestion-type-${suggestion.type}` : 'suggestion-type-general', { 'has-icon': !!suggestion.icon }]"
        :aria-label="t('chat.smartSuggestions.suggestionAriaLabel', { suggestionText: suggestion.label })"
        :data-voice-target="voiceTargetIdPrefix + `suggestion-${index + 1}`"
        @click="onSuggestionClick(suggestion)"
      >
        <component
          v-if="suggestion.icon"
          :is="suggestion.icon"
          class="suggestion-icon"
          aria-hidden="true"
        />
        <span class="suggestion-text">{{ suggestion.label }}</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ChatSmartSuggestions.vue
 * @description Displays a list of clickable smart suggestions for the user,
 * often related to the current chat context or AI capabilities.
 * These suggestions are themeable, accessible, and voice-navigable.
 * @property {ChatSuggestion[]} suggestions - Array of suggestion objects to display.
 * @property {string} [title] - Optional title for the suggestions section.
 * @property {string} [voiceTargetIdPrefix='chat-suggestions-'] - Prefix for voice target IDs.
 * @property {boolean} [isScrollable=true] - If the list should be horizontally scrollable.
 * @emits suggestion-clicked - When a suggestion chip is clicked.
 */
import { computed, PropType } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import type { ChatSuggestion } from '../store/chat.store';
import AppButton from '../../../components/common/AppButton.vue';
// Example icons could be imported here if ChatSuggestion provides icon component names as strings
// import { LightBulbIcon, CogIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  /**
   * An array of suggestion objects to display.
   * Each suggestion should conform to the `ChatSuggestion` interface.
   * @type {ChatSuggestion[]}
   * @required
   */
  suggestions: {
    type: Array as PropType<ChatSuggestion[]>,
    required: true,
  },
  /**
   * Optional title for the suggestions section.
   * If not provided, no title will be displayed.
   * @type {string}
   * @default ''
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * Prefix for voice target IDs to ensure uniqueness within the parent component.
   * @type {string}
   * @default 'chat-suggestions-'
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'chat-suggestions-',
  },
  /**
   * Determines if the list of suggestions should be horizontally scrollable if it overflows.
   * @type {boolean}
   * @default true
   */
  isScrollable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  /**
   * Emitted when a suggestion chip is clicked.
   * @param {ChatSuggestion} suggestion - The clicked suggestion object.
   */
  (e: 'suggestion-clicked', suggestion: ChatSuggestion): void;
}>();

const { t } = useI18n();

/**
 * Handles the click event on a suggestion chip.
 * Emits the 'suggestion-clicked' event with the clicked suggestion data.
 * @param {ChatSuggestion} suggestion - The suggestion object that was clicked.
 */
const onSuggestionClick = (suggestion: ChatSuggestion): void => {
  emit('suggestion-clicked', suggestion);
};
</script>

<style scoped>
.chat-smart-suggestions {
  padding: var(--space-2, 0.5rem) 0;
}

.suggestions-header {
  margin-bottom: var(--space-2, 0.5rem);
}

.suggestions-title {
  font-size: var(--app-font-size-xs, 0.75rem);
  font-weight: var(--app-font-weight-medium, 500);
  color: var(--app-text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestions-list {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--space-2, 0.5rem);
}
.suggestions-list.scrollable {
  overflow-x: auto;
  padding-bottom: var(--space-2, 0.5rem); /* Space for scrollbar */
}
.suggestions-list.scrollable::-webkit-scrollbar { height: 6px; }
.suggestions-list.scrollable::-webkit-scrollbar-track { background: var(--app-scrollbar-track-bg-light, var(--app-surface-inset-color)); border-radius: 3px;}
.suggestions-list.scrollable::-webkit-scrollbar-thumb { background: var(--app-scrollbar-thumb-bg-light, var(--app-border-color)); border-radius: 3px;}

.suggestion-chip.app-button {
  padding: var(--app-chip-padding-y, 0.375rem) var(--app-chip-padding-x, 0.75rem);
  border-radius: var(--app-chip-border-radius, var(--app-border-radius-pill));
  font-size: var(--app-font-size-sm, 0.875rem);
  font-weight: var(--app-font-weight-medium);
  line-height: 1.25;
  white-space: nowrap;
  background-color: var(--app-chip-bg, var(--app-surface-raised-color));
  color: var(--app-chip-text-color, var(--app-text-secondary-color));
  border: 1px solid var(--app-chip-border-color, var(--app-border-color));
  box-shadow: var(--app-shadow-xs);
  transition: all 0.2s ease-out;
}
.suggestion-chip.app-button:hover {
  background-color: var(--app-chip-hover-bg, var(--app-surface-hover-color));
  border-color: var(--app-chip-hover-border-color, var(--app-primary-color-light));
  color: var(--app-chip-hover-text-color, var(--app-primary-color));
  transform: translateY(-1px);
  box-shadow: var(--app-shadow-sm);
}
.suggestion-chip.app-button.has-icon .suggestion-text {
  margin-left: var(--space-1h, 0.375rem);
}
.suggestion-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--app-chip-icon-color, currentColor);
  opacity: 0.8;
}

/* Holographic Theme Adjustments */
.theme-holographic .suggestions-title {
  color: var(--holographic-text-muted);
}
.theme-holographic .suggestion-chip.app-button {
  background-color: var(--holographic-chip-bg, rgba(var(--holographic-panel-rgb), 0.4));
  color: var(--holographic-chip-text, var(--holographic-text-secondary));
  border-color: var(--holographic-chip-border, var(--holographic-border-translucent));
  box-shadow: none;
}
.theme-holographic .suggestion-chip.app-button:hover {
  background-color: var(--holographic-chip-hover-bg, rgba(var(--holographic-accent-rgb), 0.3));
  border-color: var(--holographic-accent);
  color: var(--holographic-accent-text-strong, var(--holographic-accent));
  box-shadow: var(--holographic-glow-xs-accent);
}
.theme-holographic .suggestion-icon {
    color: var(--holographic-chip-icon-color, var(--holographic-text-muted));
}
.theme-holographic .suggestion-chip.app-button:hover .suggestion-icon {
    color: var(--holographic-accent);
}
.theme-holographic .suggestions-list.scrollable::-webkit-scrollbar-track { background: rgba(var(--holographic-panel-rgb), 0.2); }
.theme-holographic .suggestions-list.scrollable::-webkit-scrollbar-thumb { background: rgba(var(--holographic-accent-rgb), 0.4); }
</style>