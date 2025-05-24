<template>
  <Teleport to="body">
    <TransitionGroup name="modal-fade" tag="div" class="global-modal-stack-container">
      <div
        v-for="(modal, index) in uiStore.activeModals"
        :key="modal.id"
        class="modal-overlay"
        :class="{ 'is-topmost': index === uiStore.activeModals.length - 1 }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`modal-title-${modal.id}`"
        :data-voice-target-region="`modal-${modal.id}-region`"
        @mousedown.self="handleOverlayClick(modal)"
        :style="{ zIndex: baseZIndex + index }"
      >
        <AppCard
          class="modal-dialog"
          :class="[modal.options?.dialogClass, themeClass]"
          :style="{ maxWidth: modal.options?.maxWidth || '500px' }"
          variant="elevated"
          padding="none"
          role="document"
          :voice-target="`modal-${modal.id}-card`"
          :voice-target-id-prefix="`modal-${modal.id}-card-`"
        >
          <template #header v-if="modal.title || !modal.options?.persistent">
            <div class="modal-header">
              <h3 v-if="modal.title" :id="`modal-title-${modal.id}`" class="modal-title-text">
                {{ modal.title }}
              </h3>
              <AppButton
                v-if="!modal.options?.persistent"
                variant="tertiary"
                size="sm" :pill="true"
                class="modal-close-button"
                :icon="XMarkIcon"
                :aria-label="t('common.closeModal')"
                :title="t('common.closeModal')"
                :data-voice-target="`modal-${modal.id}-close-button`"
                @click="uiStore.closeModal(modal.id)"
              />
            </div>
          </template>

          <div class="modal-body fancy-scrollbar">
            <component
              :is="modal.component"
              v-bind="modal.props"
              @close-modal="uiStore.closeModal(modal.id)"
              @confirm-modal="(payload: any) => handleModalConfirm(modal.id, payload, modal.onConfirm)"
              @cancel-modal="() => handleModalCancel(modal.id, modal.onCancel)"
            />
          </div>

           <template #footer v-if="modal.showDefaultActions && !modal.options?.customFooter">
                <div class="modal-footer-actions">
                    <AppButton
                        variant="secondary"
                        :label="modal.cancelButtonText || t('common.cancel')"
                        @click="() => handleModalCancel(modal.id, modal.onCancel)"
                        :data-voice-target="`modal-${modal.id}-action-cancel`"
                    />
                    <AppButton
                        variant="primary"
                        :label="modal.confirmButtonText || t('common.confirm')"
                        @click="() => handleModalConfirm(modal.id, undefined, modal.onConfirm)"
                        :data-voice-target="`modal-${modal.id}-action-confirm`"
                    />
                </div>
            </template>
            <template #footer v-else-if="$slots[`footer-${modal.id}`] || modal.options?.customFooter">
                <slot :name="`footer-${modal.id}`">
                    <component v-if="modal.options?.customFooter" :is="modal.options.customFooter" />
                </slot>
            </template>
        </AppCard>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * @file GlobalModalRenderer.vue
 * @description Renders modals managed by the UiStore. Handles stacking, overlay clicks,
 * and transitions. Uses Teleport to render modals directly into the body.
 */
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { Teleport } from 'vue';
import { useUiStore } from '../../store/ui.store';
import type { UiModal } from '../../types/ui.types';
import AppCard from './AppCard.vue';
import AppButton from './AppButton.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { useI18n } from '../../composables/useI18n';

const uiStore = useUiStore();
const { t } = useI18n();

const baseZIndex = 3000; // Base z-index for modals

const themeClass = computed(() => `theme-${uiStore.currentTheme}`);

/** Handles clicks on the modal overlay (closes modal if not persistent). */
const handleOverlayClick = (modal: UiModal) => {
  if (!modal.options?.persistent) {
    uiStore.closeModal(modal.id);
  }
};

/** Handles confirmation from a modal's content component. */
const handleModalConfirm = (modalId: string, payload?: any, onConfirmCallback?: (payload?: any) => void | Promise<void>) => {
  if (onConfirmCallback) {
    const result = onConfirmCallback(payload);
    if (result instanceof Promise) {
        result.then(() => uiStore.closeModal(modalId)).catch(err => console.error("Modal onConfirm promise rejected:", err));
    } else {
        uiStore.closeModal(modalId);
    }
  } else {
    uiStore.closeModal(modalId);
  }
};

/** Handles cancellation from a modal's content component. */
const handleModalCancel = (modalId: string, onCancelCallback?: () => void | Promise<void>) => {
    if (onCancelCallback) {
        const result = onCancelCallback();
        if (result instanceof Promise) {
            result.then(() => uiStore.closeModal(modalId)).catch(err => console.error("Modal onCancel promise rejected:", err));
        } else {
            uiStore.closeModal(modalId);
        }
    } else {
        uiStore.closeModal(modalId);
    }
};


/** Handles Escape key press to close the topmost modal if not persistent. */
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && uiStore.activeModals.length > 0) {
    const topmostModal = uiStore.activeModals[uiStore.activeModals.length - 1];
    if (!topmostModal.options?.persistent) {
      uiStore.closeModal(topmostModal.id);
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscapeKey);
});

// Watch for active modals to manage body scroll lock (already handled in UiStore)
</script>

<style scoped>
.global-modal-stack-container {
  /* This div is just for TransitionGroup, no visual styling needed */
  /* It allows multiple modals to be transitioned independently */
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--app-modal-overlay-bg, rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4, 1rem); /* Padding for small screens */
  backdrop-filter: var(--app-blur-md);
  /* z-index is set dynamically */
}
.modal-overlay.is-topmost {
  /* Potentially slightly darker overlay for the active-most modal */
}

.modal-dialog { /* This targets AppCard */
  width: 100%;
  max-height: calc(100vh - (2 * var(--space-4, 1rem))); /* Ensure modal fits viewport */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Important for AppCard's internal structure */
  /* Theme specific background already handled by AppCard */
}
/* AppCard styles for variant, padding=none, etc., will apply */

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--app-modal-header-padding, var(--space-4, 1rem)); /* Default p-4 */
  border-bottom: 1px solid var(--app-modal-divider-color, var(--app-border-color));
  flex-shrink: 0; /* Prevent header from shrinking */
}
.modal-title-text {
  font-size: var(--app-modal-title-font-size, var(--app-font-size-lg));
  font-weight: var(--app-modal-title-font-weight, 600);
  color: var(--app-modal-title-color, var(--app-heading-color));
}
.modal-close-button.app-button {
  /* Custom styling for close button if AppButton defaults aren't enough */
  color: var(--app-modal-close-icon-color, var(--app-text-muted-color));
}
.modal-close-button.app-button:hover {
    color: var(--app-modal-close-icon-hover-color, var(--app-text-color));
    background-color: var(--app-surface-hover-color);
}

.modal-body {
  padding: var(--app-modal-body-padding, var(--space-4, 1rem)); /* Default p-4 */
  overflow-y: auto; /* Make modal body scrollable if content exceeds max-height */
  flex-grow: 1;
}

.modal-footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3, 0.75rem);
    padding: var(--app-modal-footer-padding, var(--space-4, 1rem));
    border-top: 1px solid var(--app-modal-divider-color, var(--app-border-color));
    background-color: var(--app-modal-footer-bg, transparent); /* Or distinct footer bg */
    flex-shrink: 0; /* Prevent footer from shrinking */
}


/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}


/* Holographic theme for modal */
.theme-holographic .modal-overlay {
    background-color: var(--holographic-modal-overlay-bg, rgba(10, 15, 31, 0.7));
    backdrop-filter: var(--holographic-blur-lg);
}
.theme-holographic .modal-dialog.app-card { /* Target AppCard specifically */
    /* AppCard holographic styles will apply. Can add more here if needed. */
    /* E.g., specific border glow for modals */
    box-shadow: var(--holographic-modal-shadow, 0 0 30px rgba(var(--holographic-accent-rgb), 0.3));
}
.theme-holographic .modal-header,
.theme-holographic .modal-footer-actions {
    border-color: var(--holographic-border-translucent);
}
.theme-holographic .modal-title-text {
    color: var(--holographic-text-accent);
    text-shadow: var(--holographic-text-glow-sm);
}
.theme-holographic .modal-close-button.app-button {
    color: var(--holographic-text-muted);
}
.theme-holographic .modal-close-button.app-button:hover {
    color: var(--holographic-text-primary);
    background-color: var(--holographic-surface-hover-translucent);
}
</style>