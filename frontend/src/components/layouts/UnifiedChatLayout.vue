// File: frontend/src/layouts/UnifiedChatLayout.vue
/**
 * @file UnifiedChatLayout.vue
 * @description A unified layout component for chat-centric views (PublicHome, PrivateHome).
 * Includes slots for main agent content, the EphemeralChatLog, and VoiceInput.
 * Manages the overall page structure and background effects for the "Ephemeral Harmony" theme.
 * @version 1.0.0
 */
<script setup lang="ts">
import { ref, computed, type CSSProperties } from 'vue';
import EphemeralChatLog from '@/components/EphemeralChatLog.vue';
import VoiceInput from '@/components/VoiceInput.vue'; // Assuming VoiceInput.vue is correctly refactored

// Props might be needed to pass down to VoiceInput or control layout variations
const props = defineProps<{
  isVoiceInputProcessing: boolean; // To pass to VoiceInput
  currentAgentInputPlaceholder?: string;
}>();

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'voice-input-processing', status: boolean): void;
}>();

const handleTranscription = (transcription: string) => {
  emit('transcription', transcription);
};

const handleVoiceProcessing = (status: boolean) => {
  emit('voice-input-processing', status);
};


// Background Effects (example from your PrivateHome.vue)
const numOrbitingShapes = 10; // Or make it a prop for density control
const orbitStyleProvider = (index: number): CSSProperties => ({
  animationDuration: `${30 + Math.random() * 50}s`,
  animationDelay: `-${Math.random() * 70}s`,
  transform: `rotate(${Math.random() * 360}deg) translateX(${25 + Math.random() * 40}vmax) translateY(${Math.random() * 20 - 10}vmax) rotate(-${Math.random() * 300}deg)`,
  opacity: 0.015 + Math.random() * 0.04,
  zIndex: -2, // Ensure behind main UI elements but above absolute page background
});

const shapeStyleProvider = (index: number): CSSProperties => ({
  width: `${30 + Math.random() * 100}px`,
  height: `${30 + Math.random() * 100}px`,
  backgroundColor: `hsla(var(${Math.random() > 0.5 ? '--color-accent-primary-h' : '--color-accent-secondary-h'}), var(${Math.random() > 0.5 ? '--color-accent-primary-s' : '--color-accent-secondary-s'}), var(${Math.random() > 0.5 ? '--color-accent-primary-l' : '--color-accent-secondary-l'}), ${0.1 + Math.random() * 0.2})`,
  animationDuration: `${25 + Math.random() * 35}s`,
  borderRadius: Math.random() > 0.3 ? '50%' : `${Math.random()*40 + 10}% ${Math.random()*40 + 10}%`,
  filter: `blur(${2 + Math.random() * 4}px) saturate(1.1)`,
  boxShadow: `0 0 ${8 + Math.random() * 15}px hsla(var(${Math.random() > 0.5 ? '--color-accent-primary-h' : '--color-accent-secondary-h'}), 70%, 60%, 0.1)`,
});

</script>

<template>
  <div class="unified-chat-layout-wrapper">
    <div class="unified-chat-background-effects" aria-hidden="true">
      <div class="fixed-holo-grid"></div>
      <div
        v-for="i in numOrbitingShapes"
        :key="`orbit-${i}`"
        class="orbit-container"
        :style="orbitStyleProvider(i)"
      >
        <div class="orbiting-shape" :style="shapeStyleProvider(i)"></div>
      </div>
    </div>

    <EphemeralChatLog />

    <div class="unified-main-content-area">
      <slot name="main-content">
        <p class="p-6 text-center text-neutral-text-muted">Main agent content will appear here.</p>
      </slot>
    </div>

    <div class="unified-voice-input-section">
      <VoiceInput
        :is-processing="props.isVoiceInputProcessing"
        @transcription="handleTranscription"
        @processing-audio="handleVoiceProcessing"
        />
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/layout/_unified-chat-layout.scss
// Keyframes for orbitEffect and shapeTransformEffect should be in _keyframes.scss
</style>