// File: frontend/src/components/layouts/UnifiedChatLayout.vue
/**
 * @file UnifiedChatLayout.vue
 * @description A unified layout component for chat-centric views (PublicHome, PrivateHome).
 * Includes slots for main agent content, the EphemeralChatLog, and VoiceInput.
 * Manages the overall page structure, full-height behavior, and "Ephemeral Harmony"
 * themed background effects. Ensures content areas are correctly padded and scrollable.
 *
 * @component UnifiedChatLayout
 * @props {boolean} isVoiceInputProcessing - Indicates if voice input is currently being processed (for VoiceInput state).
 * @props {string} [currentAgentInputPlaceholder] - Placeholder text for the VoiceInput component.
 * @props {boolean} [showEphemeralLog=true] - Controls visibility of the EphemeralChatLog.
 *
 * @emits transcription - Emits the transcribed text from VoiceInput.
 * @emits voice-input-processing - Emits the processing state of VoiceInput.
 *
 * @version 2.1.0 - Fixed ResizeObserver error by ensuring elements are mounted before observation.
 */
<script setup lang="ts">
import { ref, computed, type CSSProperties, onMounted, onUnmounted, type Ref, nextTick, watch } from 'vue';
import EphemeralChatLog from '@/components/EphemeralChatLog.vue';
import VoiceInput from '@/components/VoiceInput.vue';
import { useUiStore } from '@/store/ui.store';

/**
 * Defines the props accepted by the UnifiedChatLayout component.
 */
const props = defineProps<{
  /** Indicates if the voice input component is currently processing audio. */
  isVoiceInputProcessing: boolean;
  /** Optional placeholder text to be passed to the VoiceInput component. */
  currentAgentInputPlaceholder?: string;
  /** Controls whether the EphemeralChatLog component is rendered. */
  showEphemeralLog?: { type: boolean, default: true };
}>();

/**
 * Defines the events emitted by this component, typically relayed from child components.
 */
const emit = defineEmits<{
  /** Emitted when VoiceInput provides a new transcription. */
  (e: 'transcription', value: string): void;
  /** Emitted when VoiceInput's processing state changes. */
  (e: 'voice-input-processing', status: boolean): void;
}>();

const uiStore = useUiStore();
const layoutWrapperRef: Ref<HTMLElement | null> = ref(null);
const ephemeralLogRef: Ref<InstanceType<typeof EphemeralChatLog> | null> = ref(null);
const voiceInputSectionRef: Ref<HTMLElement | null> = ref(null);

/**
 * Handles the 'transcription' event from the VoiceInput component.
 * @param {string} transcription - The transcribed text.
 */
const handleTranscription = (transcription: string): void => {
  emit('transcription', transcription);
};

/**
 * Handles the 'processing-audio' event from the VoiceInput component.
 * @param {boolean} status - The current audio processing status.
 */
const handleVoiceProcessing = (status: boolean): void => {
  emit('voice-input-processing', status);
};

/**
 * @computed numOrbitingShapes
 * @description Number of orbiting shapes for the background effect. Can be adjusted for performance/density.
 * @returns {number}
 */
const numOrbitingShapes = computed(() => uiStore.isReducedMotionPreferred ? 3 : 8);


/**
 * Provides dynamic CSS styles for each orbiting shape container.
 * Creates varied animation durations, delays, and transform properties for a natural, random effect.
 * @param {number} index - The index of the orbiting shape, used for varying styles.
 * @returns {CSSProperties} A CSS style object for the orbiting shape container.
 */
const orbitStyleProvider = (index: number): CSSProperties => ({
  animationDuration: `${40 + Math.random() * 60}s`,
  animationDelay: `-${Math.random() * 80}s`,
  transform: `rotate(${Math.random() * 360}deg) translateX(${20 + Math.random() * 60}vmax) translateY(${Math.random() * 40 - 20}vmax) rotate(-${Math.random() * 360}deg)`,
  opacity: 0.01 + Math.random() * 0.03,
  zIndex: 0,
});

/**
 * Provides dynamic CSS styles for each orbiting shape itself.
 * Creates varied sizes, background colors (theme-aware), animation durations, border radius, and blurs.
 * @param {number} index - The index of the orbiting shape.
 * @returns {CSSProperties} A CSS style object for the orbiting shape.
 */
const shapeStyleProvider = (index: number): CSSProperties => {
  const accentVar1 = Math.random() > 0.5 ? '--color-accent-primary' : '--color-accent-secondary';
  const accentVar2 = Math.random() > 0.5 ? '--color-accent-interactive' : '--color-accent-glow';

  return {
    width: `${25 + Math.random() * 90}px`,
    height: `${25 + Math.random() * 90}px`,
    backgroundColor: `hsla(var(${accentVar1}-h), var(${accentVar1}-s), var(${accentVar1}-l), ${0.05 + Math.random() * 0.1})`,
    animationDuration: `${30 + Math.random() * 40}s`,
    borderRadius: Math.random() > 0.4 ? '50%' : `${Math.random()*35 + 15}% ${Math.random()*35 + 15}%`,
    filter: `blur(${3 + Math.random() * 5}px) saturate(1.2)`,
    boxShadow: `0 0 ${10 + Math.random() * 20}px hsla(var(${accentVar2}-h), var(${accentVar2}-s), var(${accentVar2}-l), 0.08)`,
  };
};

/**
 * Updates CSS custom properties for dynamic padding calculations based on
 * header, ephemeral log, and voice input heights.
 */
const updateDynamicLayoutHeights = async () => {
  await nextTick(); // Ensure DOM updates are flushed before measurements

  if (!layoutWrapperRef.value) return;
  const rootStyle = layoutWrapperRef.value.style;

  const headerEl = document.querySelector('.app-header-ephemeral') as HTMLElement;
  const headerHeight = headerEl ? headerEl.offsetHeight : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-actual-height')) || 60;
  rootStyle.setProperty('--header-actual-height', `${headerHeight}px`);

  let ephemeralLogHeight = 0;
  if (props.showEphemeralLog && ephemeralLogRef.value?.$el) {
    const el = ephemeralLogRef.value.$el as HTMLElement;
    if (el && el.offsetHeight !== undefined) { // Check if it's a valid element
        ephemeralLogHeight = el.offsetHeight;
    }
  }
  rootStyle.setProperty('--ephemeral-log-actual-height', `${ephemeralLogHeight}px`);
  
  let voiceInputHeight = 0;
  if (voiceInputSectionRef.value) {
    voiceInputHeight = voiceInputSectionRef.value.offsetHeight || 0;
  }
  rootStyle.setProperty('--voice-input-actual-height', `${voiceInputHeight}px`);
};

let resizeObserver: ResizeObserver | null = null;

const setupResizeObserver = async () => {
  await nextTick(); // Wait for DOM to be ready

  if (typeof ResizeObserver !== 'undefined') {
    if (resizeObserver) { // Disconnect previous observer if any
        resizeObserver.disconnect();
    }
    resizeObserver = new ResizeObserver(updateDynamicLayoutHeights);

    if (props.showEphemeralLog && ephemeralLogRef.value?.$el) {
      const el = ephemeralLogRef.value.$el as HTMLElement;
      if (el instanceof Element) { // Ensure it's an Element
        resizeObserver.observe(el);
      } else {
        console.warn('[UnifiedChatLayout] ephemeralLogRef.$el is not a valid Element for ResizeObserver.');
      }
    }
    if (voiceInputSectionRef.value && voiceInputSectionRef.value instanceof Element) {
      resizeObserver.observe(voiceInputSectionRef.value);
    } else if (voiceInputSectionRef.value) {
        console.warn('[UnifiedChatLayout] voiceInputSectionRef.value is not a valid Element for ResizeObserver.');
    }
  }
};

onMounted(async () => {
  await updateDynamicLayoutHeights(); // Initial calculation after DOM is ready
  window.addEventListener('resize', updateDynamicLayoutHeights);
  await setupResizeObserver(); // Setup observer after initial mount
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDynamicLayoutHeights);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(() => props.showEphemeralLog, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    // When showEphemeralLog changes, DOM structure might change.
    // Need to wait for that change to apply, then re-setup observer.
    await nextTick(); // Wait for DOM update due to v-if on EphemeralChatLog
    await setupResizeObserver(); // Re-initialize observer for potentially new/removed element
    await updateDynamicLayoutHeights(); // And recalculate heights
  }
}, { flush: 'post' }); // flush: 'post' ensures watch triggers after DOM updates

</script>

<template>
  <div class="unified-chat-layout-wrapper" ref="layoutWrapperRef">
    <div class="unified-chat-background-effects" aria-hidden="true">
      <div class="fixed-holo-grid"></div>
      <template v-if="!uiStore.isReducedMotionPreferred">
        <div
          v-for="i in numOrbitingShapes"
          :key="`orbit-${i}`"
          class="orbit-container"
          :style="orbitStyleProvider(i)"
        >
          <div class="orbiting-shape" :style="shapeStyleProvider(i)"></div>
        </div>
      </template>
    </div>

    <EphemeralChatLog v-if="props.showEphemeralLog" ref="ephemeralLogRef"/>

    <div class="unified-main-content-area">
      <slot name="main-content">
        <div class="flex-grow flex items-center justify-center p-6 text-center text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))] italic text-sm">
          Your main agent content will appear here.
        </div>
      </slot>
    </div>

    <div class="unified-voice-input-section" ref="voiceInputSectionRef">
      <VoiceInput
        :is-processing="props.isVoiceInputProcessing"
        :input-placeholder="props.currentAgentInputPlaceholder"
        @transcription="handleTranscription"
        @processing-audio="handleVoiceProcessing"
      />
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/layout/_unified-chat-layout.scss
</style>