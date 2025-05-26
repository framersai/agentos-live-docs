/**
 * @file VoiceControlsDropdown.vue
 * @description Dropdown component for managing voice and TTS settings in the header.
 * @version 1.2.0 - Fixed duplicate property errors, unused imports, empty CSS rules, and refined slider update logic.
 */
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { SpeakerWaveIcon, ChevronDownIcon, AdjustmentsHorizontalIcon, CheckIcon as SolidCheckIcon } from '@heroicons/vue/24/solid';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { VoiceOption, VoiceApplicationSettings } from '@/services/voice.settings.service'; // Use import type
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'VoiceControlsDropdown',
  components: {
    SpeakerWaveIcon,
    ChevronDownIcon,
    SolidCheckIcon,
    AdjustmentsHorizontalIcon,
    Cog6ToothIcon
  },
  setup() {
    const isOpen = ref(false);
    const dropdownRef = ref<HTMLElement | null>(null);
    const router = useRouter();

    // Reactive access to settings and related data from the service
    const settings = voiceSettingsManager.settings;
    const currentProviderVoices = voiceSettingsManager.ttsVoicesForCurrentProvider; // ComputedRef<VoiceOption[]>
    const voicesAreLoaded = voiceSettingsManager.ttsVoicesLoaded; // Ref<boolean>

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
      }
    };

    const updateSliderFillForElement = (element: HTMLInputElement | null) => {
      if (element && typeof element.min === 'string' && typeof element.max === 'string' && typeof element.value === 'string') {
        const value = parseFloat(element.value);
        const min = parseFloat(element.min);
        const max = parseFloat(element.max);
        if (!isNaN(value) && !isNaN(min) && !isNaN(max) && (max - min !== 0)) {
          const percentage = ((value - min) / (max - min)) * 100;
          element.style.setProperty('--slider-progress', `${Math.max(0, Math.min(100, percentage))}%`);
        } else if (max - min === 0 && value >= min) { // Handle case where min equals max
           element.style.setProperty('--slider-progress', `100%`);
        } else {
           element.style.setProperty('--slider-progress', `0%`);
        }
      }
    };

    const updateAllSliderFills = () => {
      if (dropdownRef.value) {
        dropdownRef.value.querySelectorAll<HTMLInputElement>('.range-slider-compact').forEach(updateSliderFillForElement);
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true);
      // Initialize slider fills when component mounts if dropdown is initially open (though unlikely here)
      // or to ensure styles are applied if values are set programmatically before first interaction.
      if (isOpen.value) {
        requestAnimationFrame(updateAllSliderFills); // Use rAF for updates after DOM is ready
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside, true);
    });

    const selectProvider = (provider: VoiceApplicationSettings['ttsProvider']) => {
      voiceSettingsManager.updateSetting('ttsProvider', provider);
      // Voices for the new provider might take a moment to load; sliders will update via watchers if settings change.
    };

    const selectVoice = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const voiceId = target.value;
      voiceSettingsManager.updateSetting('selectedTtsVoiceId', voiceId === "null" || voiceId === "" ? null : voiceId);
    };

    const handleRangeInput = (key: keyof VoiceApplicationSettings, event: Event) => {
      const target = event.target as HTMLInputElement;
      const parsedValue = parseFloat(target.value);
      if (!isNaN(parsedValue)) {
        // Cast to 'any' then to the specific type to satisfy TypeScript if keys have varied numeric types (e.g. number, float)
        // This assumes that all settings updated here are numeric.
        voiceSettingsManager.updateSetting(key, parsedValue as any);
        updateSliderFillForElement(target); // Update individual slider on input
      }
    };

    const toggleAutoPlayTts = () => {
      voiceSettingsManager.updateSetting('autoPlayTts', !settings.autoPlayTts);
    };

    const navigateToSettings = () => {
      isOpen.value = false;
      router.push('/settings');
    };

    const currentVoiceName = computed(() => {
      const voice = voiceSettingsManager.getCurrentTtsVoice();
      if (voice) {
        return voice.name.length > 25 ? voice.name.substring(0, 22) + '...' : voice.name;
      }
      if (!voicesAreLoaded.value) return "Loading...";
      if (currentProviderVoices.value.length === 0) return "No Voices";
      return "Default";
    });

    const currentProviderLabel = computed(() => {
      switch (settings.ttsProvider) {
        case 'browser_tts': return 'Browser';
        case 'openai_tts': return 'OpenAI';
        default: return 'Provider';
      }
    });

    // Watch for changes in relevant settings to update sliders, especially if changed programmatically
    watch(
      () => [settings.ttsVolume, settings.ttsRate, settings.ttsPitch, settings.ttsProvider],
      () => {
        if (isOpen.value) {
          // Use nextTick to ensure DOM has potentially re-rendered if provider change altered available sliders
          requestAnimationFrame(updateAllSliderFills);
        }
      },
      { deep: true, flush: 'post' } // flush post to ensure DOM elements are updated if provider changes inputs
    );

    // When dropdown opens, ensure sliders are visually updated
    watch(isOpen, (newVal) => {
      if (newVal) {
        // Use nextTick or rAF to ensure elements are visible and measurable
        requestAnimationFrame(updateAllSliderFills);
      }
    });

    // This return statement should contain unique keys.
    // The errors you encountered indicated duplicates in the version of the file being linted.
    // Ensure this list is exactly as you intend it, with no repeated property names.
    return {
      isOpen,
      dropdownRef,
      settings,
      currentProviderVoices,
      voicesAreLoaded,
      toggleDropdown,
      selectProvider,
      selectVoice,
      handleRangeInput,
      toggleAutoPlayTts,
      currentVoiceName,
      currentProviderLabel,
      navigateToSettings,
      // Expose the single-element updater if needed by @input directly for performance
      // or rely on the watchers. For this setup, direct call in handleRangeInput is good.
      // updateSliderFillForElement, // Not strictly needed to return if only used internally or via handleRangeInput
    };
  },
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
  <button
      @click="toggleDropdown"
      id="voice-settings-button"
      class="nav-button"
      aria-haspopup="true"
      :aria-expanded="isOpen" title="Voice & Speech Settings"
    >
      <AdjustmentsHorizontalIcon class="icon-sm" />
      <span class="font-medium text-sm hidden md:inline">Voice</span>
      <ChevronDownIcon class="icon-xs transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition name="dropdown-float">
      <div
        v-show="isOpen"
        class="dropdown-menu w-72 sm:w-80 md:w-[22rem]"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="voice-settings-button"
      >
        <div class="dropdown-header">
          <h3 class="dropdown-title">Voice & Speech Output</h3>
          <button @click="navigateToSettings" class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors" title="Go to All Settings">
            <Cog6ToothIcon class="icon-sm text-gray-500 dark:text-gray-400"/>
          </button>
        </div>

        <div class="dropdown-content p-4 space-y-5">
          <div class="flex items-center justify-between">
            <label for="autoPlayTtsToggleHeader" class="dropdown-label">Auto-Play Responses</label>
            <label class="toggle-switch">
              <input id="autoPlayTtsToggleHeader" type="checkbox" :checked="settings.autoPlayTts" @change="toggleAutoPlayTts" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </div>

          <div>
            <label class="dropdown-label-sm mb-2">TTS Provider: <span class="font-semibold text-primary-600 dark:text-primary-400">{{ currentProviderLabel }}</span></label>
            <div class="grid grid-cols-2 gap-2.5">
              <button @click="selectProvider('browser_tts')" :class="['btn-tab-sm', settings.ttsProvider === 'browser_tts' ? 'active' : '']">Browser</button>
              <button @click="selectProvider('openai_tts')" :class="['btn-tab-sm', settings.ttsProvider === 'openai_tts' ? 'active' : '']">OpenAI</button>
            </div>
          </div>

          <div v-if="voicesAreLoaded">
            <label for="voiceSelectHeader" class="dropdown-label-sm mb-1.5">Voice: <span class="font-semibold text-primary-600 dark:text-primary-400 truncate max-w-[150px] inline-block align-bottom">{{ currentVoiceName }}</span></label>
            <div class="relative">
              <select id="voiceSelectHeader" :value="settings.selectedTtsVoiceId || ''" @change="selectVoice($event)"
                class="form-select w-full" :disabled="currentProviderVoices.length === 0">
                <option v-if="currentProviderVoices.length === 0" value="" disabled>No voices for {{currentProviderLabel}}</option>
                <option v-else value="">Default for {{currentProviderLabel}}</option> <option v-for="voice in currentProviderVoices" :key="voice.id" :value="voice.id">
                  {{ voice.name.length > 35 ? voice.name.substring(0,32)+'...' : voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>
          </div>
          <div v-else class="dropdown-label-sm text-center py-2 text-gray-500 dark:text-gray-400 italic">Loading voices...</div>

          <div class="space-y-4 pt-1">
            <div>
              <label :for="'volumeSliderHeader-' + settings.ttsProvider" class="dropdown-label-sm mb-1.5">Volume: <span class="font-semibold">{{ Math.round(settings.ttsVolume * 100) }}%</span></label>
              <input type="range" :id="'volumeSliderHeader-' + settings.ttsProvider" :value="settings.ttsVolume" @input="handleRangeInput('ttsVolume', $event)" min="0" max="1" step="0.01" class="range-slider-compact" />
            </div>
            <div>
              <label :for="'rateSliderHeader-' + settings.ttsProvider" class="dropdown-label-sm mb-1.5">Rate: <span class="font-semibold">{{ settings.ttsRate.toFixed(1) }}x</span></label>
              <input type="range" :id="'rateSliderHeader-' + settings.ttsProvider" :value="settings.ttsRate" @input="handleRangeInput('ttsRate', $event)" min="0.5" max="2.5" step="0.1" class="range-slider-compact" />
            </div>
            <div v-if="settings.ttsProvider === 'browser_tts'">
              <label :for="'pitchSliderHeader-' + settings.ttsProvider" class="dropdown-label-sm mb-1.5">Pitch: <span class="font-semibold">{{ settings.ttsPitch.toFixed(1) }}</span></label>
              <input type="range" :id="'pitchSliderHeader-' + settings.ttsProvider" :value="settings.ttsPitch" @input="handleRangeInput('ttsPitch', $event)" min="0" max="2" step="0.1" class="range-slider-compact" />
            </div>
          </div>
        </div>

        <div class="dropdown-footer">
          <button @click="navigateToSettings" class="btn btn-ghost btn-sm w-full justify-center text-sm">
            <Cog6ToothIcon class="icon-sm mr-1.5" /> All Settings
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
/* Using global .nav-button, .dropdown-menu, .dropdown-header, .dropdown-content, .form-select, .toggle-switch */
/* Specific styles or overrides for VoiceControlsDropdown */

.dropdown-title {
  @apply text-base font-semibold text-gray-800 dark:text-gray-100;
}
.dropdown-label { /* For main labels like Auto-Play */
  @apply text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer;
}
.dropdown-label-sm { /* For sub-labels like Volume, Rate */
  @apply block text-xs font-medium text-gray-500 dark:text-gray-400;
}

.btn-tab-sm { /* Smaller tabs for provider selection */
  @apply px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors duration-150 ease-in-out flex-1 text-center
        shadow-sm hover:shadow focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-850;
  @apply border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/40
        hover:bg-gray-50 dark:hover:bg-gray-700;
}
.btn-tab-sm.active {
  @apply bg-primary-500 text-white border-primary-500 dark:bg-primary-500 dark:border-primary-500
        hover:bg-primary-600 dark:hover:bg-primary-600 shadow-md;
}
.btn-tab-sm:disabled {
  @apply opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500;
}

.range-slider-compact {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer transition-opacity hover:opacity-90;
  --slider-progress: 0%; /* Will be updated by JS */
  /* Apply the base background color that the gradient will go over */
  /* For light mode, this is gray-300. For dark mode, gray-600 (from @apply above) */
  background-color: theme('colors.gray.300'); /* Default to light track */
  background-image: linear-gradient(to right, theme('colors.primary.500') var(--slider-progress), transparent var(--slider-progress));
}
.dark .range-slider-compact {
  background-color: theme('colors.gray.600'); /* Default to dark track */
  background-image: linear-gradient(to right, theme('colors.primary.400') var(--slider-progress), transparent var(--slider-progress));
}

.range-slider-compact::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-primary-600 dark:bg-primary-400 rounded-full cursor-pointer shadow
        border-2 border-white dark:border-gray-700; /* Make thumb pop a bit */
}
.range-slider-compact::-moz-range-thumb {
  @apply w-4 h-4 bg-primary-600 dark:bg-primary-400 rounded-full cursor-pointer border-0 shadow;
}

.dropdown-footer {
  @apply px-3 py-2.5 border-t border-gray-200 dark:border-gray-700/60;
}

/* Dropdown animation - subtle float and fade */
.dropdown-float-enter-active,
.dropdown-float-leave-active {
  transition: opacity 0.2s var(--ease-out-cubic), transform 0.2s var(--ease-out-cubic);
}
.dropdown-float-enter-from,
.dropdown-float-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

.icon-sm { @apply w-4 h-4; }
.icon-xs { @apply w-3.5 h-3.5; }

/* Comments for removed empty rules:
.form-select {}
.toggle-switch {}
*/
</style>