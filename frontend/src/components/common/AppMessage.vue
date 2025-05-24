// File: frontend/src/components/common/AppMessage.vue
<template>
  <Transition name="message-fade">
    <div
      v-if="isVisible"
      class="app-message"
      :class="messageTypeClasses"
      role="alert"
      :aria-live="type === 'error' || type === 'warning' ? 'assertive' : 'polite'"
      :data-voice-target="voiceTargetId"
    >
      <div class="message-icon-wrapper">
        <component :is="iconComponent" class="message-icon" aria-hidden="true" />
      </div>
      <div class="message-content">
        <h4 v-if="title" class="message-title" :data-voice-target="voiceTargetId + '-title'">
          {{ title }}
        </h4>
        <p class="message-text" :data-voice-target="voiceTargetId + '-text'">
          <slot>{{ message }}</slot>
        </p>
      </div>
      <AppButton
        v-if="showClose"
        variant="custom"
        size="sm" :pill="true"
        class="message-close-button"
        :icon="XMarkIcon"
        :aria-label="t('common.closeMessage')"
        :title="t('common.closeMessage')"
        :data-voice-target="voiceTargetId + '-close-button'"
        @click="handleClose"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * @file AppMessage.vue
 * @description A component for displaying dismissible messages (info, success, warning, error).
 * Useful for form validation feedback, API errors, or general user notifications within a specific context.
 * Themeable, accessible, and voice-navigable.
 */
import { ref, computed, PropType, watch, onMounted } from 'vue';
import { useI18n } from '../../composables/useI18n';
import AppButton from './AppButton.vue';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid';

type MessageType = 'info' | 'success' | 'warning' | 'error';

const props = defineProps({
  /** The type of message, determines styling and icon. */
  type: { type: String as PropType<MessageType>, default: 'info' },
  /** Optional title for the message. */
  title: { type: String, default: '' },
  /** The main message content. */
  message: { type: String, required: true },
  /** If true, the message is initially visible. Can be controlled externally via v-model:visible. */
  visible: { type: Boolean, default: true },
  /** If true, shows a close button. */
  showClose: { type: Boolean, default: false },
  /** Duration in milliseconds to auto-hide. 0 for no auto-hide. */
  duration: { type: Number, default: 0 },
  /** Voice target ID for the message container. */
  voiceTarget: { type: String, default: 'app-message' },
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'close'): void;
}>();

const { t } = useI18n();
const isVisible = ref(props.visible);
let autoCloseTimer: number | undefined;

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
});

const voiceTargetId = computed(() => props.voiceTarget || `app-message-${props.type}-${Math.random().toString(36).substring(2,7)}`);

const messageTypeClasses = computed(() => [
  `message-type-${props.type}`,
  // Add theme-specific classes from uiStore if needed, e.g. uiStore.currentTheme
]);

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success': return CheckCircleIcon;
    case 'warning': return ExclamationTriangleIcon;
    case 'error': return XCircleIcon;
    case 'info':
    default: return InformationCircleIcon;
  }
});

const handleClose = () => {
  isVisible.value = false;
  emit('update:visible', false);
  emit('close');
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
};

const startAutoCloseTimer = () => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
  if (props.duration > 0) {
    autoCloseTimer = window.setTimeout(() => {
      handleClose();
    }, props.duration);
  }
};

watch(() => props.duration, () => {
  if (isVisible.value) startAutoCloseTimer();
});

onMounted(() => {
  if (isVisible.value) startAutoCloseTimer();
});
</script>

<style scoped>
.app-message {
  display: flex;
  align-items: flex-start;
  padding: var(--space-4, 1rem);
  border-radius: var(--app-message-border-radius, var(--app-border-radius-md));
  border-width: 1px;
  border-style: solid;
  position: relative; /* For close button */
}

/* Base type styles using CSS variables for theming */
.message-type-info {
  background-color: var(--app-message-info-bg, var(--app-info-bg-subtle));
  color: var(--app-message-info-text, var(--app-info-text-strong));
  border-color: var(--app-message-info-border, var(--app-info-border-color));
}
.message-type-success {
  background-color: var(--app-message-success-bg, var(--app-success-bg-subtle));
  color: var(--app-message-success-text, var(--app-success-text-strong));
  border-color: var(--app-message-success-border, var(--app-success-border-color));
}
.message-type-warning {
  background-color: var(--app-message-warning-bg, var(--app-warning-bg-subtle));
  color: var(--app-message-warning-text, var(--app-warning-text-strong));
  border-color: var(--app-message-warning-border, var(--app-warning-border-color));
}
.message-type-error {
  background-color: var(--app-message-error-bg, var(--app-danger-bg-subtle));
  color: var(--app-message-error-text, var(--app-danger-text-strong));
  border-color: var(--app-message-error-border, var(--app-danger-border-color));
}

.message-icon-wrapper {
  flex-shrink: 0;
  margin-right: var(--space-3, 0.75rem);
  padding-top: 0.125rem; /* Align icon slightly better with multi-line text */
}
.message-icon {
  width: 1.25rem; /* w-5 h-5 */
  height: 1.25rem;
  /* Color should match the text color of the specific message type */
  color: currentColor;
}

.message-content {
  flex-grow: 1;
}
.message-title {
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-semibold);
  margin-bottom: var(--space-1, 0.25rem);
  color: currentColor;
}
.message-text {
  font-size: var(--app-font-size-sm);
  line-height: 1.5;
  color: currentColor;
  opacity: 0.9;
}

.message-close-button { /* Targets AppButton */
  position: absolute;
  top: var(--space-2, 0.5rem);
  right: var(--space-2, 0.5rem);
  color: currentColor; /* Inherit color from message type */
  opacity: 0.7;
  padding: var(--space-1, 0.25rem) !important; /* Override AppButton padding if needed */
}
.message-close-button:hover {
  opacity: 1;
  background-color: var(--app-message-close-hover-bg, rgba(0,0,0,0.1)); /* Subtle hover */
}
.theme-dark .message-close-button:hover,
.theme-holographic .message-close-button:hover {
  background-color: var(--app-message-close-hover-bg-dark, rgba(255,255,255,0.1));
}


/* Transitions */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Holographic theme specifics */
.theme-holographic .app-message {
    backdrop-filter: var(--app-blur-xs);
    border-width: 1px;
    box-shadow: var(--holographic-glow-sm);
}
.theme-holographic .message-type-info {
    background-color: var(--holographic-info-bg-translucent);
    color: var(--holographic-info-text);
    border-color: var(--holographic-info-border-translucent);
}
/* ... similar for success, warning, error in holographic ... */
.theme-holographic .message-close-button {
    color: var(--holographic-text-muted);
}
.theme-holographic .message-close-button:hover {
    color: var(--holographic-text-primary);
    background-color: var(--holographic-surface-hover-translucent);
}
</style>