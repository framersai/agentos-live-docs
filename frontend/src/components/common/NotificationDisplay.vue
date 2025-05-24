<template>
  <div
    class="notification-display-container"
    role="region"
    aria-live="assertive"
    aria-relevant="additions"
    :data-voice-target-region="'notifications-area'"
  >
    <TransitionGroup
      name="notification-item"
      tag="div"
      class="notification-list"
    >
      <div
        v-for="notification in uiStore.activeNotifications"
        :key="notification.id"
        class="notification-item"
        :class="[`type-${notification.type}`, themeClass]"
        role="alert"
        :aria-labelledby="`notification-title-${notification.id}`"
        :aria-describedby="`notification-message-${notification.id}`"
        :data-voice-target="`notification-${notification.id}`"
      >
        <div class="notification-icon-wrapper">
          <component :is="getIconForType(notification.type)" class="notification-icon" aria-hidden="true" />
        </div>
        <div class="notification-content">
          <h4
            v-if="notification.title"
            :id="`notification-title-${notification.id}`"
            class="notification-title"
            :data-voice-target="`notification-${notification.id}-title`"
          >
            {{ notification.title }}
          </h4>
          <p
            :id="`notification-message-${notification.id}`"
            class="notification-message"
            :data-voice-target="`notification-${notification.id}-message`"
          >
            {{ notification.message }}
          </p>
          <div v-if="notification.actions && notification.actions.length > 0" class="notification-actions">
            <AppButton
              v-for="(action, index) in notification.actions"
              :key="index"
              variant="custom"
              size="xs"
              class="notification-action-button"
              :class="`action-type-${notification.type}`"
              @click="handleActionClick(notification.id, action.onClick)"
              :data-voice-target="`notification-${notification.id}-action-${index + 1}`"
            >
              {{ action.label }}
            </AppButton>
          </div>
        </div>
        <AppButton
          v-if="!notification.duration || notification.duration === 0"
          variant="custom"
          size="xs" :pill="true"
          class="notification-close-button"
          :aria-label="t('common.closeNotification')"
          :title="t('common.closeNotification')"
          :data-voice-target="`notification-${notification.id}-close-button`"
          @click="uiStore.removeNotification(notification.id)"
        >
          <XMarkIcon class="w-4 h-4" />
        </AppButton>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
/**
 * @file NotificationDisplay.vue
 * @description Displays global notifications (toasts) managed by the UiStore.
 * Notifications are themeable, accessible, and can include actions.
 */
import { computed } from 'vue';
import { useUiStore } from '../../store/ui.store';
import type { AppNotificationType } from '../../types/ui.types';
import AppButton from './AppButton.vue'; // Assuming AppButton is SOTA
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'; // Using solid for more impact
import { useI18n } from '../../composables/useI18n';

const uiStore = useUiStore();
const { t } = useI18n();

/**
 * Computes the theme-specific class for notifications.
 * @returns {string} The theme class.
 */
const themeClass = computed(() => `theme-${uiStore.currentTheme}`);

/**
 * Gets the appropriate icon component for a given notification type.
 * @param {AppNotificationType} type - The type of the notification.
 * @returns {VueComponent} The icon component.
 */
const getIconForType = (type: AppNotificationType) => {
  switch (type) {
    case AppNotificationType.SUCCESS: return CheckCircleIcon;
    case AppNotificationType.WARNING: return ExclamationTriangleIcon;
    case AppNotificationType.ERROR: return XCircleIcon;
    case AppNotificationType.INFO:
    default:
      return InformationCircleIcon;
  }
};

/**
 * Handles clicks on notification action buttons.
 * Closes the notification after the action is performed.
 * @param {number} notificationId - The ID of the notification.
 * @param {() => void} onClickAction - The action callback to execute.
 */
const handleActionClick = (notificationId: number, onClickAction: () => void) => {
  onClickAction();
  uiStore.removeNotification(notificationId);
};
</script>

<style scoped>
.notification-display-container {
  position: fixed;
  bottom: var(--space-4, 1rem);
  right: var(--space-4, 1rem);
  z-index: var(--z-index-notifications, 2000);
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align notifications to the right */
  gap: var(--space-3, 0.75rem);
  max-width: calc(100% - 2 * var(--space-4, 1rem)); /* Prevent overflow on small screens */
  width: var(--notification-container-width, 24rem); /* Tailwind w-96 */
}
@media (max-width: 639px) { /* sm breakpoint */
    .notification-display-container {
        left: var(--space-2, 0.5rem);
        right: var(--space-2, 0.5rem);
        bottom: var(--space-2, 0.5rem);
        width: auto;
        align-items: center; /* Center on mobile */
    }
}


.notification-list {
  display: contents; /* Allow TransitionGroup to manage direct children */
}

.notification-item {
  display: flex;
  align-items: flex-start; /* Align icon with top of text */
  padding: var(--space-4, 1rem);
  border-radius: var(--app-notification-border-radius, var(--app-border-radius-lg));
  box-shadow: var(--app-notification-shadow, var(--app-shadow-lg));
  width: 100%;
  position: relative; /* For close button */
  overflow: hidden; /* For transition and potential internal effects */

  /* Base themeable styles */
  background-color: var(--app-notification-bg, var(--app-surface-color));
  color: var(--app-notification-text-color, var(--app-text-color));
  border: 1px solid var(--app-notification-border-color, var(--app-border-color));
}

/* Type-specific styling using CSS variables */
.notification-item.type-info {
  background-color: var(--app-notification-info-bg, var(--app-info-bg-subtle));
  color: var(--app-notification-info-text, var(--app-info-text-strong));
  border-left: 4px solid var(--app-notification-info-accent, var(--app-info-color));
}
.notification-item.type-success {
  background-color: var(--app-notification-success-bg, var(--app-success-bg-subtle));
  color: var(--app-notification-success-text, var(--app-success-text-strong));
  border-left: 4px solid var(--app-notification-success-accent, var(--app-success-color));
}
.notification-item.type-warning {
  background-color: var(--app-notification-warning-bg, var(--app-warning-bg-subtle));
  color: var(--app-notification-warning-text, var(--app-warning-text-strong));
  border-left: 4px solid var(--app-notification-warning-accent, var(--app-warning-color));
}
.notification-item.type-error {
  background-color: var(--app-notification-error-bg, var(--app-danger-bg-subtle));
  color: var(--app-notification-error-text, var(--app-danger-text-strong));
  border-left: 4px solid var(--app-notification-error-accent, var(--app-danger-color));
}

.notification-icon-wrapper {
  flex-shrink: 0;
  margin-right: var(--space-3, 0.75rem);
  padding-top: 0.125rem; /* Slight alignment adjustment */
}
.notification-icon {
  width: 1.25rem; /* Tailwind w-5 h-5 */
  height: 1.25rem;
  /* Color is inherited from parent .notification-item text color */
}

.notification-content {
  flex-grow: 1;
}
.notification-title {
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-semibold);
  margin-bottom: var(--space-1, 0.25rem);
  /* Color inherited */
}
.notification-message {
  font-size: var(--app-font-size-sm);
  line-height: 1.5;
  /* Color inherited, but might be slightly muted */
  opacity: 0.9;
}
.notification-actions {
  margin-top: var(--space-3, 0.75rem);
  display: flex;
  gap: var(--space-2, 0.5rem);
}
.notification-action-button.app-button { /* Target AppButton root */
  /* Custom styling for action buttons within notifications */
  padding: var(--app-chip-padding-y-xs, 0.25rem) var(--app-chip-padding-x-xs, 0.5rem);
  font-size: var(--app-font-size-xs);
  border-radius: var(--app-border-radius-md);
  background-color: var(--app-notification-action-bg, rgba(0,0,0,0.05));
  color: var(--app-notification-action-text, currentColor); /* Inherit from notification type text color */
  border: 1px solid var(--app-notification-action-border, rgba(0,0,0,0.1));
}
.notification-action-button.app-button:hover {
  background-color: var(--app-notification-action-hover-bg, rgba(0,0,0,0.1));
}
.notification-item.type-info .notification-action-button.app-button {
    background-color: var(--app-info-bg); color: var(--app-info-contrast-text-color); border-color: var(--app-info-border-color);
} /* Similar for success, warning, error */


.notification-close-button.app-button {
  position: absolute;
  top: var(--space-2, 0.5rem);
  right: var(--space-2, 0.5rem);
  color: var(--app-notification-close-icon-color, currentColor); /* Inherit from notification type text color */
  opacity: 0.7;
  padding: var(--space-1, 0.25rem); /* Smaller padding for close icon button */
}
.notification-close-button.app-button:hover {
  opacity: 1;
  background-color: var(--app-notification-close-hover-bg, rgba(0,0,0,0.1));
}

/* Transitions for notification items */
.notification-item-enter-active,
.notification-item-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Spring-like transition */
}
.notification-item-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.notification-item-leave-to {
  opacity: 0;
  transform: scale(0.8) translateX(50%);
}
@media (max-width: 639px) {
    .notification-item-enter-from {
        opacity: 0;
        transform: translateY(100%);
    }
    .notification-item-leave-to {
        opacity: 0;
        transform: scale(0.8) translateY(50%);
    }
}

/* Holographic theme adjustments */
.theme-holographic .notification-item {
  background-color: var(--holographic-notification-bg, rgba(var(--holographic-panel-rgb), 0.8));
  color: var(--holographic-notification-text, var(--holographic-text-primary));
  border: 1px solid var(--holographic-notification-border, var(--holographic-border-translucent));
  box-shadow: var(--holographic-notification-shadow, var(--holographic-shadow-lg));
  backdrop-filter: var(--app-blur-sm);
}
.theme-holographic .notification-item.type-info { border-left-color: var(--holographic-info-accent, #00f2ff); }
.theme-holographic .notification-item.type-success { border-left-color: var(--holographic-success-accent, #00ffaa); }
.theme-holographic .notification-item.type-warning { border-left-color: var(--holographic-warning-accent, #ffdd00); }
.theme-holographic .notification-item.type-error { border-left-color: var(--holographic-danger-accent, #ff4d80); }

.theme-holographic .notification-action-button.app-button {
    background-color: var(--holographic-button-bg-translucent);
    color: var(--holographic-text-secondary);
    border-color: var(--holographic-border-translucent);
}
.theme-holographic .notification-action-button.app-button:hover {
    background-color: var(--holographic-button-hover-bg);
    color: var(--holographic-accent);
}
.theme-holographic .notification-close-button.app-button {
    color: var(--holographic-text-muted);
}
.theme-holographic .notification-close-button.app-button:hover {
    color: var(--holographic-text-primary);
    background-color: var(--holographic-surface-hover);
}
</style>