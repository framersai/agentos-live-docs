// File: frontend/src/components/common/AppConfirmationModal.vue
<template>
  <div
    class="app-confirmation-modal p-2"
    role="document"
    :data-voice-target-region="voiceTargetIdPrefix + 'region'"
  >
    <p class="confirmation-message mb-6" :data-voice-target="voiceTargetIdPrefix + 'message'">
      {{ message }}
    </p>

    <div v-if="details" class="confirmation-details text-sm text-muted-color mb-4 p-3 bg-surface-inset-color rounded-md">
        <pre class="whitespace-pre-wrap">{{ details }}</pre>
    </div>

    <div class="confirmation-actions">
      <AppButton
        variant="secondary"
        @click="handleCancel"
        :data-voice-target="voiceTargetIdPrefix + 'cancel-button'"
        ref="cancelButtonRef"
      >
        {{ cancelButtonText || t('common.cancel') }}
      </AppButton>
      <AppButton
        :variant="confirmButtonVariant"
        @click="handleConfirm"
        :loading="isLoading"
        :data-voice-target="voiceTargetIdPrefix + 'confirm-button'"
      >
        {{ confirmButtonText || t('common.confirm') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AppConfirmationModal.vue
 * @description A reusable modal content component for confirm/cancel dialogs.
 * Used within GlobalModalRenderer.
 * @property {string} message - The main confirmation message. Required.
 * @property {string} [title] - Optional title (often provided by GlobalModalRenderer).
 * @property {string} [details] - Optional additional details to display.
 * @property {string} [confirmButtonText] - Custom text for the confirm button.
 * @property {'primary'|'danger'|'success'|'warning'} [confirmButtonVariant='primary'] - Variant for confirm button.
 * @property {string} [cancelButtonText] - Custom text for the cancel button.
 * @property {string} [voiceTargetIdPrefix='confirm-modal-'] - Voice target prefix.
 * @emits confirm - When the confirm action is chosen.
 * @emits cancel - When the cancel action is chosen or modal is dismissed.
 */
import { ref, PropType, onMounted } from 'vue';
import AppButton from './AppButton.vue';
import { useI18n } from '../../composables/useI18n';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'link' | 'custom';


const props = defineProps({
  message: { type: String, required: true },
  title: { type: String, default: '' }, // Title can be passed from UiModal.title
  details: { type: String, default: '' },
  confirmButtonText: { type: String, default: '' },
  confirmButtonVariant: { type: String as PropType<ButtonVariant>, default: 'primary' },
  cancelButtonText: { type: String, default: '' },
  isLoading: { type: Boolean, default: false }, // For async confirmations
  voiceTargetIdPrefix: { type: String, default: 'confirm-modal-' },
});

const emit = defineEmits<{
  (e: 'confirm'): void; // Emits simple confirm
  (e: 'cancel'): void; // Emits simple cancel
  (e: 'close-modal'): void; // To be caught by GlobalModalRenderer if needed for internal close
}>();

const { t } = useI18n();
const cancelButtonRef = ref<InstanceType<typeof AppButton> | null>(null);

const handleConfirm = () => {
  emit('confirm');
  // GlobalModalRenderer or the service that opened it will typically handle emit('close-modal')
  // or this component can emit it directly if it's always supposed to close on action.
  // emit('close-modal');
};

const handleCancel = () => {
  emit('cancel');
  // emit('close-modal');
};

onMounted(() => {
  // Auto-focus the cancel or confirm button for accessibility and quicker interaction
  // Focusing cancel is often safer by default.
  cancelButtonRef.value?.focus?.();
});
</script>

<style scoped>
.confirmation-message {
  font-size: var(--app-font-size-base);
  color: var(--app-text-color);
  line-height: 1.6;
}
.confirmation-details {
    font-size: var(--app-font-size-sm);
    color: var(--app-text-muted-color);
    background-color: var(--app-surface-inset-color);
    border-radius: var(--app-border-radius-md);
    padding: var(--space-3);
    max-height: 200px;
    overflow-y: auto;
}
.confirmation-details pre {
    white-space: pre-wrap;
    word-break: break-all;
    font-family: var(--app-font-family-mono);
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3, 0.75rem);
  margin-top: var(--space-6, 1.5rem);
  padding-top: var(--space-4, 1rem);
  border-top: 1px solid var(--app-modal-divider-color, var(--app-border-color-light));
}

/* Holographic theme specifics */
.theme-holographic .confirmation-message {
  color: var(--holographic-text-primary);
}
.theme-holographic .confirmation-details {
    background-color: var(--holographic-surface-inset-translucent);
    color: var(--holographic-text-secondary);
    border: 1px solid var(--holographic-border-very-subtle);
}
.theme-holographic .confirmation-actions {
  border-top-color: var(--holographic-border-translucent);
}
/* AppButton will handle its own holographic styling for variants */
</style>