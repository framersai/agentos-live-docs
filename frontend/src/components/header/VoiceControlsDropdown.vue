/**
 * @file VoiceControlsDropdown.vue
 * @description Dropdown component for managing voice and TTS settings in the header.
 * @version 1.2.2 - Ensured correction for non-existent Tailwind ring offset class.
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
      if (isOpen.value) {
        requestAnimationFrame(updateAllSliderFills);
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside, true);
    });

    const selectProvider = (provider: VoiceApplicationSettings['ttsProvider']) => {
      voiceSettingsManager.updateSetting('ttsProvider', provider);
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
        voiceSettingsManager.updateSetting(key, parsedValue as any);
        updateSliderFillForElement(target);
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

    watch(
      () => [settings.ttsVolume, settings.ttsRate, settings.ttsPitch, settings.ttsProvider],
      () => {
        if (isOpen.value) {
          requestAnimationFrame(updateAllSliderFills);
        }
      },
      { deep: true, flush: 'post' }
    );

    watch(isOpen, (newVal) => {
      if (newVal) {
        requestAnimationFrame(updateAllSliderFills);
      }
    });

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
    };
  },
});
</script>

<template>
  <div class="vcd" ref="dropdownRef"> <button
      @click="toggleDropdown"
      id="voice-settings-button"
      class="vcd__trigger" aria-haspopup="true"
      :aria-expanded="isOpen ? 'true' : 'false'" title="Voice & Speech Settings"
    >
      <AdjustmentsHorizontalIcon class="icon-sm" />
      <span class="vcd__trigger-text">Voice</span> <ChevronDownIcon class="icon-xs vcd__trigger-chevron" :class="{ 'rotated': isOpen }" /> </button>

    <transition name="dropdown-float">
      <div
        v-show="isOpen"
        class="vcd__menu" role="menu"
        aria-orientation="vertical"
        aria-labelledby="voice-settings-button"
      >
        <div class="vcd__header"> <h3 class="vcd__title">Voice & Speech Output</h3> <button @click="navigateToSettings" class="vcd__settings-btn" title="Go to All Settings"> <Cog6ToothIcon class="icon-sm"/>
          </button>
        </div>

        <div class="vcd__content"> <div class="flex items-center justify-between">
            <label for="autoPlayTtsToggleHeader" class="vcd__label">Auto-Play Responses</label> <label class="toggle-switch-analog">
              <input id="autoPlayTtsToggleHeader" type="checkbox" :checked="settings.autoPlayTts" @change="toggleAutoPlayTts" class="sr-only peer" />
              <span class="toggle-switch-track"></span> <span class="toggle-switch-knob"></span>  </label>
          </div>

          <div>
            <label class="vcd__label-sm">TTS Provider: <span class="vcd__label-value">{{ currentProviderLabel }}</span></label> <div class="vcd__provider-tabs"> <button @click="selectProvider('browser_tts')" :class="['vcd__provider-tab', settings.ttsProvider === 'browser_tts' ? 'active' : '']">Browser</button> <button @click="selectProvider('openai_tts')" :class="['vcd__provider-tab', settings.ttsProvider === 'openai_tts' ? 'active' : '']">OpenAI</button> </div>
          </div>

          <div v-if="voicesAreLoaded">
            <label for="voiceSelectHeader" class="vcd__label-sm">Voice: <span class="vcd__label-value truncate">{{ currentVoiceName }}</span></label> <div class="relative">
              <select id="voiceSelectHeader" :value="settings.selectedTtsVoiceId || ''" @change="selectVoice($event)"
                class="form-select-analog w-full" :disabled="currentProviderVoices.length === 0">
                <option v-if="currentProviderVoices.length === 0" value="" disabled>No voices for {{currentProviderLabel}}</option>
                <option v-else value="">Default for {{currentProviderLabel}}</option>
                <option v-for="voice in currentProviderVoices" :key="voice.id" :value="voice.id">
                  {{ voice.name.length > 35 ? voice.name.substring(0,32)+'...' : voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>
          </div>
          <div v-else class="vcd__label-sm text-center py-2 text-gray-500 dark:text-gray-400 italic">Loading voices...</div> <div class="vcd__range-slider-group pt-1"> <div>
              <label :for="'volumeSliderHeader-' + settings.ttsProvider" class="vcd__label-sm">Volume: <span class="font-semibold">{{ Math.round(settings.ttsVolume * 100) }}%</span></label> <input type="range" :id="'volumeSliderHeader-' + settings.ttsProvider" :value="settings.ttsVolume" @input="handleRangeInput('ttsVolume', $event)" min="0" max="1" step="0.01" class="vcd__range-slider" /> </div>
            <div>
              <label :for="'rateSliderHeader-' + settings.ttsProvider" class="vcd__label-sm">Rate: <span class="font-semibold">{{ settings.ttsRate.toFixed(1) }}x</span></label>
              <input type="range" :id="'rateSliderHeader-' + settings.ttsProvider" :value="settings.ttsRate" @input="handleRangeInput('ttsRate', $event)" min="0.5" max="2.5" step="0.1" class="vcd__range-slider" /> </div>
            <div v-if="settings.ttsProvider === 'browser_tts'">
              <label :for="'pitchSliderHeader-' + settings.ttsProvider" class="vcd__label-sm">Pitch: <span class="font-semibold">{{ settings.ttsPitch.toFixed(1) }}</span></label>
              <input type="range" :id="'pitchSliderHeader-' + settings.ttsProvider" :value="settings.ttsPitch" @input="handleRangeInput('ttsPitch', $event)" min="0" max="2" step="0.1" class="vcd__range-slider" /> </div>
          </div>
        </div>

        <div class="vcd__footer"> <button @click="navigateToSettings" class="vcd__footer-btn-all-settings"> <Cog6ToothIcon class="icon-sm mr-1.5" /> All Settings
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

