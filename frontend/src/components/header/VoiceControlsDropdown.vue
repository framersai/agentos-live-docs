// File: src/components/header/VoiceControlsDropdown.vue
/**
 * @file VoiceControlsDropdown.vue
 * @description Dropdown component for managing voice and TTS settings in the header.
 * @version 1.0.1 - Corrected settings access and added click-outside close.
 */
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { SpeakerWaveIcon, ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'; // Using outline consistently
import { CheckIcon } from '@heroicons/vue/24/solid'; // CheckIcon is often better as solid for selection
import { voiceSettingsManager, VoiceOption, VoiceApplicationSettings } from '@/services/voice.settings.service';

export default defineComponent({
  name: 'VoiceControlsDropdown',
  components: { SpeakerWaveIcon, ChevronDownIcon, CheckIcon, AdjustmentsHorizontalIcon },
  setup() {
    const isOpen = ref(false);
    const dropdownRef = ref<HTMLElement | null>(null); // For click outside

    const settings = voiceSettingsManager.settings as VoiceApplicationSettings; // Ensure type
    const availableVoices = voiceSettingsManager.ttsVoicesForCurrentProvider; // Corrected property name

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside, true);
    });

    const selectProvider = (providerKey: 'browser' | 'openai') => {
      const newTtsProvider: VoiceApplicationSettings['ttsProvider'] = providerKey === 'browser' ? 'browser_tts' : 'openai_tts';
      voiceSettingsManager.updateSetting('ttsProvider', newTtsProvider);
    };

    const selectVoice = (voiceId: string) => {
      voiceSettingsManager.updateSetting('selectedTtsVoiceId', voiceId);
      // isOpen.value = false; // Optionally close dropdown on selection
    };

    const setVolume = (event: Event) => {
      const target = event.target as HTMLInputElement;
      voiceSettingsManager.updateSetting('ttsVolume', parseFloat(target.value));
    };
    const setRate = (event: Event) => {
      const target = event.target as HTMLInputElement;
      voiceSettingsManager.updateSetting('ttsRate', parseFloat(target.value));
    };
    const setPitch = (event: Event) => {
      const target = event.target as HTMLInputElement;
      voiceSettingsManager.updateSetting('ttsPitch', parseFloat(target.value));
    };
    const toggleAutoPlayTts = () => {
        voiceSettingsManager.updateSetting('autoPlayTts', !settings.autoPlayTts);
    };

    const currentVoiceName = computed(() => {
        const voice = voiceSettingsManager.getCurrentTtsVoice(); // Corrected method name
        if (voice) return voice.name;
        return settings.ttsProvider === 'browser_tts' ? 'Browser Default' : 'OpenAI Default';
    });
    
    const currentProviderLabel = computed(() => {
        if (settings.ttsProvider === 'browser_tts') return 'Browser';
        if (settings.ttsProvider === 'openai_tts') return 'OpenAI';
        return 'Select Provider';
    });

    return {
      isOpen,
      dropdownRef,
      settings,
      availableVoices,
      toggleDropdown,
      selectProvider,
      selectVoice,
      setVolume,
      setRate,
      setPitch,
      toggleAutoPlayTts,
      currentVoiceName,
      currentProviderLabel,
      voicesAreLoaded: voiceSettingsManager.ttsVoicesLoaded, // Corrected property name
    };
  },
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      id="voice-settings-button"
      class="nav-button flex items-center gap-1.5"
      aria-haspopup="true"
      :aria-expanded="isOpen.toString()"
      title="Voice & Speech Settings"
    >
      <AdjustmentsHorizontalIcon class="w-4 h-4" /> <span class="font-medium text-sm hidden md:inline">Voice</span>
      <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition name="dropdown-fade">
      <div
        v-show="isOpen"
        class="dropdown-menu w-80 md:w-96"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="voice-settings-button"
      >
        <div class="dropdown-header">
          <h3 class="font-medium">Voice & Speech Settings</h3>
        </div>
        <div class="dropdown-content p-3 space-y-4">
          <div class="flex items-center justify-between">
            <label for="autoPlayTtsToggle" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Auto-Play Responses
            </label>
            <label class="toggle-switch-sm">
                <input id="autoPlayTtsToggle" type="checkbox" :checked="settings.autoPlayTts" @change="toggleAutoPlayTts" class="sr-only">
                <span class="slider-sm"></span>
            </label>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">TTS Provider</label>
            <div class="flex gap-2">
              <button
                @click="selectProvider('browser')"
                :class="['btn-tab flex-1', settings.ttsProvider === 'browser_tts' ? 'active' : '']"
              >
                Browser
              </button>
              <button
                @click="selectProvider('openai')"
                :class="['btn-tab flex-1', settings.ttsProvider === 'openai_tts' ? 'active' : '']"
                disabled 
              >
                OpenAI <span class="text-xs opacity-70">(Soon)</span>
              </button>
            </div>
          </div>

          <div v-if="voicesAreLoaded.value">
            <label for="voiceSelect" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Select Voice ({{ currentProviderLabel }})
            </label>
            <div class="relative">
                <select
                    id="voiceSelect"
                    :value="settings.selectedTtsVoiceId"
                    @change="selectVoice(($event.target as HTMLSelectElement).value)"
                    class="select-input w-full appearance-none pr-8"
                    :disabled="availableVoices.length === 0"
                >
                    <option v-if="availableVoices.length === 0" value="" disabled>No voices for {{currentProviderLabel}}</option>
                    <option v-else-if="!settings.selectedTtsVoiceId && availableVoices.length > 0" value="" disabled selected>Select a voice</option>
                    <option v-for="voice in availableVoices" :key="voice.id" :value="voice.id">
                    {{ voice.name }} ({{ voice.lang }})
                    </option>
                </select>
                <ChevronDownIcon class="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div v-else class="text-xs text-center py-2 text-gray-500 dark:text-gray-400">Loading voices...</div>


          <div>
            <label for="volumeSlider" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Volume: <span class="font-semibold">{{ Math.round(settings.ttsVolume * 100) }}%</span>
            </label>
            <input
              type="range" id="volumeSlider"
              :value="settings.ttsVolume" @input="setVolume"
              min="0" max="1" step="0.01"
              class="range-slider-compact"
            />
          </div>

          <div>
            <label for="rateSlider" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Rate: <span class="font-semibold">{{ settings.ttsRate.toFixed(1) }}x</span>
            </label>
            <input
              type="range" id="rateSlider"
              :value="settings.ttsRate" @input="setRate"
              min="0.5" max="2" step="0.1"
              class="range-slider-compact"
            />
          </div>
           <div>
            <label for="pitchSlider" class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Pitch: <span class="font-semibold">{{ settings.ttsPitch.toFixed(1) }}</span>
            </label>
            <input
              type="range" id="pitchSlider"
              :value="settings.ttsPitch" @input="setPitch"
              min="0" max="2" step="0.1"
              class="range-slider-compact"
            />
          </div>
          
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
/* Assuming these base styles are available from a global scope or Header.vue for consistency */
.nav-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700/60
        focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none
        transition-colors duration-150;
}
.dropdown-menu {
  @apply absolute top-full mt-1.5 right-0 origin-top-right bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl backdrop-blur-md z-50;
}
.dropdown-header { @apply px-3.5 py-2.5 border-b border-gray-200 dark:border-gray-700 text-sm; }
.dropdown-header h3 { @apply text-gray-800 dark:text-gray-100; }
.dropdown-content { /* Already defined in Header.vue, but here for component self-containment if needed */ }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.15s ease-out, transform 0.15s ease-out; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }

.select-input {
  @apply w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors;
}

.range-slider-compact {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer;
}
.range-slider-compact::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-primary-500 dark:bg-primary-400 rounded-full cursor-pointer shadow;
}
.range-slider-compact::-moz-range-thumb {
  @apply w-4 h-4 bg-primary-500 dark:bg-primary-400 rounded-full cursor-pointer border-0 shadow;
}

.btn-tab {
  @apply px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 ease-in-out;
  @apply border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700;
}
.btn-tab.active {
  @apply bg-primary-500 text-white border-primary-500 dark:bg-primary-500 dark:border-primary-500 dark:text-white hover:bg-primary-600 dark:hover:bg-primary-600;
}
.btn-tab:disabled {
    @apply opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800;
}

.toggle-switch-sm { @apply relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer; }
.toggle-switch-sm .slider-sm { @apply absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out; }
.toggle-switch-sm .slider-sm:before { content: ""; @apply absolute h-4 w-4 left-[2px] bottom-[2px] bg-white rounded-full transition-transform duration-200 ease-in-out shadow; }
.toggle-switch-sm input:checked + .slider-sm { @apply bg-primary-500 dark:bg-primary-500; }
.toggle-switch-sm input:checked + .slider-sm:before { transform: translateX(0.75rem); }

/* Ensure primary colors are available for Tailwind JIT (these are fine as placeholders) */
.bg-primary-500 { } .dark\:bg-primary-400 { } .text-primary-600 { } .dark\:text-primary-300 { }
.border-primary-500 { } .dark\:border-primary-400 { }
.dark\:bg-primary-500 { } .hover\:bg-primary-600 { } .dark\:hover\:bg-primary-600 { }
</style>