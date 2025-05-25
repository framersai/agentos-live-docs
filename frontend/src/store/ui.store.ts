// File: src/store/ui.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // State
  const isFullscreen = ref(false);
  const showHeaderInFullscreenMinimal = ref(false); // Whether to show a minimal header when in fullscreen

  // Actions
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    if (!isFullscreen.value) {
      // When exiting fullscreen, always ensure the minimal header option is reset or shown
      showHeaderInFullscreenMinimal.value = false; 
    }
    // Note: Actual browser fullscreen API toggle would happen in the component
    // that calls this, or via a global event bus / service if preferred.
    // This store primarily tracks the *state* of the application's fullscreen mode.
  };

  const setFullscreen = (value: boolean) => {
    isFullscreen.value = value;
    if (!value) {
      showHeaderInFullscreenMinimal.value = false;
    }
  };

  const toggleShowHeaderInFullscreenMinimal = () => {
    if (isFullscreen.value) { // This toggle only makes sense if already in fullscreen
      showHeaderInFullscreenMinimal.value = !showHeaderInFullscreenMinimal.value;
    }
  };

  const setShowHeaderInFullscreenMinimal = (value: boolean) => {
     if (isFullscreen.value) {
        showHeaderInFullscreenMinimal.value = value;
     } else {
        showHeaderInFullscreenMinimal.value = false; // Can't show header options if not in FS
     }
  };


  return {
    // State
    isFullscreen,
    showHeaderInFullscreenMinimal,

    // Actions
    toggleFullscreen,
    setFullscreen,
    toggleShowHeaderInFullscreenMinimal,
    setShowHeaderInFullscreenMinimal,
  };
});