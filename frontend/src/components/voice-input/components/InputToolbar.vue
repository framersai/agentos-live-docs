// File: frontend/src/components/voice-input/components/InputToolbar.vue
<template>
  <div class="input-toolbar-holographic" :class="{ expanded: isExpanded }">
    <div class="toolbar-backdrop"></div>
    
    <div class="toolbar-content">
      <!-- Compact View -->
      <div v-if="!isExpanded" class="toolbar-compact">
        <button 
          @click="isExpanded = true" 
          class="expand-button"
          title="Show input options"
        >
          <PlusCircleIcon class="icon" />
        </button>
      </div>
      
      <!-- Expanded View -->
      <div v-else class="toolbar-expanded">
        <div class="toolbar-header">
          <span class="toolbar-title">Input Options</span>
          <button @click="close" class="close-button">
            <XMarkIcon class="icon-sm" />
          </button>
        </div>
        
        <div class="toolbar-options">
          <!-- File Upload -->
          <div class="option-group">
            <label class="option-label">Upload Files</label>
            <div class="file-upload-buttons">
              <button 
                @click="triggerFileUpload('text')"
                class="upload-button"
                :disabled="!features.textUpload"
                title="Upload text or PDF"
              >
                <DocumentTextIcon class="icon" />
                <span>Text/PDF</span>
              </button>
              
              <button 
                @click="triggerFileUpload('image')"
                class="upload-button"
                :disabled="!features.imageUpload"
                title="Upload image"
              >
                <PhotoIcon class="icon" />
                <span>Image</span>
              </button>
            </div>
            <input 
              ref="fileInputRef"
              type="file"
              :accept="currentAcceptTypes"
              @change="handleFileSelect"
              style="display: none"
            />
          </div>
          
          <!-- STT Engine -->
          <div class="option-group">
            <label class="option-label">Speech Engine</label>
            <div class="engine-toggle">
              <button
                @click="selectEngine('browser_webspeech_api')"
                class="engine-option"
                :class="{ active: currentSttEngine === 'browser_webspeech_api' }"
              >
                <GlobeAltIcon class="icon-sm" />
                <span>Browser</span>
              </button>
              
              <button
                @click="selectEngine('whisper_api')"
                class="engine-option"
                :class="{ active: currentSttEngine === 'whisper_api' }"
              >
                <CloudIcon class="icon-sm" />
                <span>Whisper</span>
              </button>
            </div>
          </div>
          
          <!-- Live Transcription Toggle -->
          <div class="option-group">
            <label class="option-label">
              <input
                type="checkbox"
                v-model="showLiveTranscription"
                class="option-checkbox"
              />
              Show live transcription
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Holographic effects -->
    <div class="holographic-glow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import {
  PlusCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  GlobeAltIcon,
  CloudIcon,
} from '@heroicons/vue/24/outline';

interface Features {
  textUpload: boolean;
  imageUpload: boolean;
  whisperApi: boolean;
}

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'file-upload', file: File): void;
  (e: 'stt-engine-change', engine: string): void;
}>();

const isExpanded = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const currentFileType = ref<'text' | 'image'>('text');

// Feature flags - can be props or computed based on backend capabilities
const features: Features = {
  textUpload: true,
  imageUpload: false, // Disabled for now
  whisperApi: true,
};

const currentSttEngine = computed(() => voiceSettingsManager.settings.sttPreference);
const showLiveTranscription = ref(true); // Local state for now

const currentAcceptTypes = computed(() => {
  return currentFileType.value === 'text' 
    ? '.txt,.pdf,.md,.doc,.docx'
    : '.jpg,.jpeg,.png,.webp,.gif';
});

function close() {
  isExpanded.value = false;
  setTimeout(() => emit('close'), 300); // Allow animation to complete
}

function triggerFileUpload(type: 'text' | 'image') {
  currentFileType.value = type;
  fileInputRef.value?.click();
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    emit('file-upload', file);
    input.value = ''; // Reset for next selection
  }
}

function selectEngine(engine: string) {
  voiceSettingsManager.updateSetting('sttPreference', engine as any);
  emit('stt-engine-change', engine);
}
</script>

<style scoped lang="scss">
.input-toolbar-holographic {
  position: absolute;
  bottom: calc(100% + 1rem);
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  
  &.expanded {
    .toolbar-backdrop {
      opacity: 1;
      transform: scale(1);
    }
    
    .holographic-glow {
      opacity: 1;
    }
  }
}

.toolbar-backdrop {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    135deg,
    hsla(var(--color-bg-primary-h), var(--color-bg-primary-s), calc(var(--color-bg-primary-l) * 0.95), 0.9),
    hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), calc(var(--color-bg-secondary-l) * 0.95), 0.85)
  );
  backdrop-filter: blur(20px) saturate(1.5);
  border-radius: 1rem;
  border: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.2);
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.toolbar-content {
  position: relative;
  z-index: 2;
  padding: 0.75rem;
  min-width: 280px;
}

.toolbar-compact {
  display: flex;
  justify-content: center;
}

.expand-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.1);
  border: 1px solid hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3);
  border-radius: 50%;
  color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.2);
    transform: scale(1.1);
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
}

.toolbar-expanded {
  animation: expandIn 0.3s ease forwards;
}

@keyframes expandIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toolbar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.1);
}

.toolbar-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  }
}

.toolbar-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
}

.file-upload-buttons {
  display: flex;
  gap: 0.5rem;
}

.upload-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.5);
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.3);
  border-radius: 0.5rem;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), calc(var(--color-bg-tertiary-l) * 1.1), 0.7);
    border-color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
}

.engine-toggle {
  display: flex;
  gap: 0.25rem;
  background: hsla(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), 0.5);
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.engine-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  font-size: 0.813rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.5);
  }
  
  &.active {
    background: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.2);
    color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  }
}

.option-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
}

.holographic-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    ellipse at center,
    hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 0;
  animation: holoPulse 4s ease-in-out infinite;
}

@keyframes holoPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}
</style>