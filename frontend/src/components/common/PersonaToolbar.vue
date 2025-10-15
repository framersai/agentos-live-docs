// File: frontend/src/components/common/PersonaToolbar.vue
<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import type { ToastService } from '@/services/services';
import type { AgentId, IAgentDefinition } from '@/services/agent.service';
import { useChatStore } from '@/store/chat.store';
import UsageStatusBadge from '@/components/common/UsageStatusBadge.vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { chatAPI } from '@/utils/api';

type PersonaModalView = 'editor' | 'library';

interface PersonaPreset {
  id: string;
  label: string;
  summary: string;
  persona: string;
}

const PERSONA_PRESETS_PER_PAGE = 4;

const props = withDefaults(defineProps<{
  agent: Readonly<IAgentDefinition> | undefined | null;
  showUsageBadge?: boolean;
  tokensTotal?: number | null;
  tokensUsed?: number | null;
  persistPersona?: boolean;
}>(), {
  showUsageBadge: false,
  tokensTotal: null,
  tokensUsed: null,
  persistPersona: true,
});

const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

const currentAgent = computed(() => props.agent ?? undefined);
const currentAgentId = computed<AgentId | null>(() => currentAgent.value?.id ?? null);
const activePersona = computed(() => currentAgentId.value ? chatStore.getPersonaForAgent(currentAgentId.value) : null);

const isPersonaModalOpen = ref(false);
const personaDraft = ref('');
const personaModalView = ref<PersonaModalView>('editor');
const personaPresetPage = ref(1);

const personaHasCustom = computed(() => !!activePersona.value?.trim());
const personaButtonLabel = computed(() => personaHasCustom.value ? 'Tone & Persona: Custom' : 'Tone & Persona');
const personaButtonDisabled = computed(() => !currentAgentId.value);

const personaTooltipText = computed(() => {
  const agentName = currentAgent.value?.label || 'this assistant';
  return personaHasCustom.value
    ? `${agentName} is using your custom persona settings. Click to adjust or clear them.`
    : `Add a persona overlay to tune tone or personality. ${agentName}'s core role stays the same.`;
});

const personaSummaryText = computed(() => {
  const value = activePersona.value?.trim();
  if (!value) return '';
  return value.length <= 160 ? value : `${value.slice(0, 160)}...`;
});

const personaDraftHasContent = computed(() => personaDraft.value.trim().length > 0);

const personaPresets: PersonaPreset[] = [
  {
    id: 'mentor',
    label: 'Calm Mentor',
    summary: 'Warm, patient explanations.',
    persona: `You are a calm senior mentor. Speak warmly, break solutions into numbered steps, explain trade-offs, and end with a concise recap plus the next step the user should take.`,
  },
  {
    id: 'pair-partner',
    label: 'Pair Partner',
    summary: 'Collaborative pair programmer.',
    persona: `You act as an enthusiastic pair-programming partner. Think out loud, ask brief confirmation questions, highlight alternative approaches, and keep the conversation collaborative.`,
  },
  {
    id: 'architect',
    label: 'System Architect',
    summary: 'Structured architecture insights.',
    persona: `You are a pragmatic system architect. Start with assumptions, outline architecture layers, mention scaling considerations, and suggest diagrams or models when helpful.`,
  },
  {
    id: 'debugging-buddy',
    label: 'Debugging Buddy',
    summary: 'Methodical debugging partner.',
    persona: `You are a methodical debugging partner. Form hypotheses, list likely root causes, suggest focused experiments, and interpret possible outcomes to converge on a fix.`,
  },
  {
    id: 'product-bridge',
    label: 'Product Translator',
    summary: 'Connects tech to user impact.',
    persona: `You translate technical decisions into product impact. Use plain language, emphasize user outcomes, note risks, and propose lightweight validation ideas.`,
  },
  {
    id: 'coach',
    label: 'Encouraging Coach',
    summary: 'Short study partner motivator.',
    persona: `You are an encouraging exam coach. Provide concise explanations, suggest memory aids, recommend spaced-repetition prompts, and motivate the user with positive reinforcement.`,
  },
];

const personaPresetTotalPages = computed(() => Math.max(1, Math.ceil(personaPresets.length / PERSONA_PRESETS_PER_PAGE)));
const personaPresetsForCurrentPage = computed(() => {
  const startIndex = (personaPresetPage.value - 1) * PERSONA_PRESETS_PER_PAGE;
  return personaPresets.slice(startIndex, startIndex + PERSONA_PRESETS_PER_PAGE);
});

const persistPersonaSetting = computed(() => Boolean(props.persistPersona));
const usageBadgeVisible = computed(() =>
  props.showUsageBadge &&
  typeof props.tokensTotal === 'number' &&
  typeof props.tokensUsed === 'number',
);

const openPersonaModal = (): void => {
  if (personaButtonDisabled.value) {
    toast?.add?.({
      type: 'warning',
      title: 'Select an Assistant',
      message: 'Pick an assistant before adjusting persona tone.',
    });
    return;
  }
  personaDraft.value = activePersona.value ?? '';
  personaModalView.value = 'editor';
  personaPresetPage.value = 1;
  isPersonaModalOpen.value = true;
};

const closePersonaModal = (): void => {
  isPersonaModalOpen.value = false;
};

const applyPersonaPreset = (preset: PersonaPreset): void => {
  personaDraft.value = preset.persona;
  personaModalView.value = 'editor';
};

const goToNextPersonaPresetPage = (): void => {
  if (personaPresetTotalPages.value <= 1) return;
  personaPresetPage.value = personaPresetPage.value >= personaPresetTotalPages.value ? 1 : personaPresetPage.value + 1;
};

const goToPreviousPersonaPresetPage = (): void => {
  if (personaPresetTotalPages.value <= 1) return;
  personaPresetPage.value = personaPresetPage.value <= 1 ? personaPresetTotalPages.value : personaPresetPage.value - 1;
};

const resetPersonaToDefault = async (): Promise<void> => {
  if (!currentAgentId.value) return;
  personaDraft.value = '';
  const success = await updatePersona(null, {
    successTitle: 'Default Persona Restored',
    successMessage: 'Cleared tone adjustments for this assistant.',
  });
  if (success) {
    isPersonaModalOpen.value = false;
  }
};

const updatePersona = async (
  persona: string | null,
  messages: { successTitle: string; successMessage: string },
): Promise<boolean> => {
  if (!currentAgentId.value) return false;
  const trimmed = personaDraft.value.trim();
  const personaToSave = persona ?? (trimmed ? trimmed : null);

  if (!personaToSave && persona !== null) {
    toast?.add?.({
      type: 'warning',
      title: 'Persona Required',
      message: 'Add some persona guidance or use the default persona.',
    });
    return false;
  }

  const agentId = currentAgentId.value;
  const previousPersona = chatStore.getPersonaForAgent(agentId);

  chatStore.setPersonaForAgent(agentId, personaToSave);
  personaDraft.value = personaToSave ?? '';

  try {
    if (persistPersonaSetting.value) {
      const conversationId = chatStore.getCurrentConversationId(agentId);
      await chatAPI.updatePersona({
        agentId,
        conversationId,
        persona: personaToSave,
      });
    }
    toast?.add?.({
      type: 'success',
      title: messages.successTitle,
      message: messages.successMessage,
    });
    return true;
  } catch (error) {
    chatStore.setPersonaForAgent(agentId, previousPersona ?? null);
    personaDraft.value = previousPersona ?? '';
    console.error('[PersonaToolbar] Failed to persist persona:', error);
    toast?.add?.({
      type: 'error',
      title: 'Failed to Save Persona',
      message: 'We could not update the persona. Please try again.',
    });
    return false;
  }
};

const savePersonaFromModal = async (): Promise<void> => {
  const success = await updatePersona(null, {
    successTitle: 'Persona Updated',
    successMessage: 'Tone adjustments saved for this assistant.',
  });
  if (success) {
    isPersonaModalOpen.value = false;
  }
};

watch(activePersona, (newPersona) => {
  if (!isPersonaModalOpen.value) {
    personaDraft.value = newPersona ?? '';
  }
});

watch(isPersonaModalOpen, (isOpen) => {
  if (!isOpen) {
    personaDraft.value = '';
  }
});

watch(currentAgentId, () => {
  personaPresetPage.value = 1;
  if (!isPersonaModalOpen.value) {
    personaDraft.value = activePersona.value ?? '';
  }
});
</script>

<template>
  <div class="persona-voice-toolbar" :class="{ 'persona-voice-toolbar--disabled': personaButtonDisabled }">
    <UsageStatusBadge
      v-if="usageBadgeVisible"
      class="persona-voice-toolbar__badge"
      :tokens-total="tokensTotal ?? undefined"
      :tokens-used="tokensUsed ?? undefined"
    />
    <button
      type="button"
      class="persona-voice-toolbar__button"
      :title="personaTooltipText"
      :disabled="personaButtonDisabled"
      @click="openPersonaModal"
    >
      {{ personaButtonLabel }}
    </button>
    <span
      v-if="!personaButtonDisabled && personaHasCustom && personaSummaryText"
      class="persona-voice-toolbar__summary"
      :title="personaSummaryText"
    >
      {{ personaSummaryText }}
    </span>
    <button
      v-if="!personaButtonDisabled && personaHasCustom"
      type="button"
      class="persona-voice-toolbar__clear"
      @click="resetPersonaToDefault"
    >
      Clear
    </button>
  </div>

  <transition name="fade">
    <div v-if="isPersonaModalOpen" class="persona-modal" role="dialog" aria-modal="true">
      <div class="persona-modal__backdrop" @click="closePersonaModal"></div>
      <div class="persona-modal__content">
        <div class="persona-modal__header">
          <h3>Adjust Persona Overlay</h3>
          <button class="persona-modal__close" type="button" @click="closePersonaModal">
            <XMarkIcon class="persona-modal__close-icon" />
          </button>
        </div>

        <p class="persona-modal__note">
          Persona overlays tweak tone and personality only; the assistant's core capabilities never change.
        </p>

        <div class="persona-modal__switcher" role="tablist" aria-label="Tone editor mode">
          <button
            type="button"
            class="persona-modal__tab"
            :class="{ 'persona-modal__tab--active': personaModalView === 'editor' }"
            @click="personaModalView = 'editor'"
          >
            Persona Editor
          </button>
          <button
            type="button"
            class="persona-modal__tab"
            :class="{ 'persona-modal__tab--active': personaModalView === 'library' }"
            @click="personaModalView = 'library'"
          >
            Persona Presets
          </button>
        </div>

        <div v-if="personaModalView === 'editor'" class="persona-modal__editor">
          <p class="persona-modal__hint">
            Describe the persona tone or emphasis you want layered on top of this assistant's role.
          </p>
          <textarea
            v-model="personaDraft"
            class="persona-modal__textarea"
            rows="6"
            placeholder="e.g. Calm, concise explanations with short follow-up questions."
          ></textarea>
        </div>

        <div v-else class="persona-library">
          <p class="persona-library__intro">
            Pick a persona preset to populate the editor instantly.
          </p>
          <div class="persona-library__grid">
            <article
              v-for="preset in personaPresetsForCurrentPage"
              :key="preset.id"
              class="persona-preset-card"
              :class="{ 'persona-preset-card--active': personaDraft.trim() === preset.persona.trim() }"
              @click="applyPersonaPreset(preset)"
            >
              <header>
                <h4>{{ preset.label }}</h4>
                <span>{{ preset.summary }}</span>
              </header>
              <p>{{ preset.persona }}</p>
            </article>
          </div>
          <div class="persona-library__pagination">
            <button type="button" @click="goToPreviousPersonaPresetPage" class="persona-library__page-button">
              ‹ Prev
            </button>
            <span class="persona-library__page-indicator">
              Page {{ personaPresetPage }} / {{ personaPresetTotalPages }}
            </span>
            <button type="button" @click="goToNextPersonaPresetPage" class="persona-library__page-button">
              Next ›
            </button>
          </div>
        </div>

        <div class="persona-modal__actions">
          <button
            type="button"
            class="persona-modal__button persona-modal__button--ghost"
            :disabled="!personaHasCustom"
            @click="resetPersonaToDefault"
          >
            Use default persona
          </button>
          <div class="persona-modal__actions-right">
            <button type="button" class="persona-modal__button" @click="closePersonaModal">
              Cancel
            </button>
            <button
              type="button"
              class="persona-modal__button persona-modal__button--primary"
              :disabled="!personaDraftHasContent"
              @click="savePersonaFromModal"
            >
              Save persona
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.persona-voice-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  padding: 0 0 12px;
}

.persona-voice-toolbar__badge {
  margin-right: auto;
}

.persona-voice-toolbar__button {
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.35);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.65);
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.persona-voice-toolbar__button:hover {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.25);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.45);
  color: var(--color-text-primary);
}

.persona-voice-toolbar--disabled .persona-voice-toolbar__button {
  opacity: 0.65;
  cursor: not-allowed;
}

.persona-voice-toolbar__summary {
  color: var(--color-text-muted);
  font-size: 0.76rem;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.persona-voice-toolbar__clear {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.persona-voice-toolbar__clear:hover {
  color: var(--color-text-primary);
}

.persona-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  z-index: 70;
}

.persona-modal__backdrop {
  position: absolute;
  inset: 0;
  background: hsla(var(--color-bg-backdrop-h, 220), var(--color-bg-backdrop-s, 26%), var(--color-bg-backdrop-l, 5%), 0.55);
  backdrop-filter: blur(6px);
}

.persona-modal__content {
  position: relative;
  width: min(680px, 100%);
  max-height: calc(100vh - 4rem);
  background: hsla(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), 0.96);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 25px 70px hsla(var(--color-shadow-h), var(--color-shadow-s), var(--color-shadow-l), 0.35);
  overflow-y: auto;
}

.persona-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
}

.persona-modal__close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0.35rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.persona-modal__close:hover {
  color: var(--color-text-primary);
  background: hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.2);
}

.persona-modal__close-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.persona-modal__note {
  margin: 0 0 8px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.persona-modal__switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.persona-modal__tab {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.persona-modal__tab--active {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.22);
  color: var(--color-text-primary);
}

.persona-modal__editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.persona-modal__hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

.persona-modal__textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.35);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.65);
  color: var(--color-text-primary);
  padding: 0.9rem 1rem;
  resize: vertical;
  min-height: 150px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.persona-modal__textarea:focus {
  outline: none;
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.5);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.85);
}

.persona-library {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.persona-library__intro {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin: 0;
}

.persona-library__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0.75rem;
}

.persona-preset-card {
  padding: 0.95rem;
  border-radius: 14px;
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.25);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.55);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.persona-preset-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.persona-preset-card h4 {
  font-size: 0.95rem;
  margin: 0;
  color: var(--color-text-primary);
}

.persona-preset-card span {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.persona-preset-card p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
}

.persona-preset-card:hover {
  transform: translateY(-2px);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.45);
}

.persona-preset-card--active {
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.65);
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.18);
}

.persona-library__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.persona-library__page-button {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
}

.persona-library__page-button:hover {
  background: hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.2);
  color: var(--color-text-primary);
}

.persona-modal__actions {
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.persona-modal__button {
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 600;
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.65);
  border: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.35);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.persona-modal__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.persona-modal__button--ghost {
  background: transparent;
}

.persona-modal__button--ghost:hover:not(:disabled) {
  color: var(--color-text-primary);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.4);
}

.persona-modal__button--primary {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.8);
  color: var(--color-text-on-accent, #0c1116);
  border: none;
}

.persona-modal__button--primary:hover:not(:disabled) {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 1);
  color: var(--color-text-primary);
}

.persona-modal__actions-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

@media (max-width: 600px) {
  .persona-modal {
    padding: 1.5rem 0.75rem;
    align-items: flex-end;
  }

  .persona-modal__content {
    width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 90vh;
  }

  .persona-modal__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .persona-modal__actions-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
