// File: frontend/src/main.ts
/**
 * @fileoverview Main entry point for the Vue 3 application.
 * Initializes Vue, Pinia for state management, Vue Router for navigation,
 * vue-i18n for internationalization, and other global plugins and services.
 * This file orchestrates the bootstrapping of the application.
 * @module main
 */
import { createApp, App as VueAppInstance, provide } from 'vue'; // Removed h as it wasn't used directly here
import { createPinia, Pinia } from 'pinia';
import { Router } from 'vue-router';
import { I18n } from 'vue-i18n';

import App from './App.vue';
import { createAppRouter } from './router';
import { setupI18nPlugin, LanguageCode, LocaleMessages } from './composables/useI18n'; // useI18n itself is not directly used here, but setupI18nPlugin is
import { apiService, IApiService } from './services/apiService'; // Removed ApiServiceConfig as it's not used here
import { seoService, ISeoService } from './services/seoService';
import { storageService, IStorageService } from './services/storageService';
import { voiceCommandService, IVoiceCommandService } from './services/voiceCommandService'; // Added VoiceCommandService
import { dynamicUIAgent, DynamicUIAgentService } from './services/dynamicUIAgent.service'; // Added DynamicUIAgentService


import { useAuthStore } from './features/auth/store/auth.store';
import { useUiStore } from './store/ui.store';
import { useVoiceStore } from './store/voice.store'; // Ensure this is created and imported

// Import THE ONE main CSS file that handles all other @imports internally.
import './assets/main.css';

/**
 * Asynchronously initializes and mounts the Vue application.
 * This function sets up all core plugins and services before mounting the root component.
 * @async
 * @function bootstrap
 * @throws {Error} If any critical part of the initialization fails.
 */
async function bootstrap(): Promise<void> {
  try {
    const app: VueAppInstance = createApp(App);

    // 1. Initialize Pinia (State Management)
    const pinia: Pinia = createPinia();
    app.use(pinia);
    console.debug('[Bootstrap] Pinia initialized.');

    // Provide core services via Vue's provide/inject system for Composition API usage.
    app.provide<IApiService>('apiService', apiService);
    app.provide<ISeoService>('seoService', seoService);
    app.provide<IStorageService>('storageService', storageService);
    app.provide<IVoiceCommandService>('voiceCommandService', voiceCommandService);
    app.provide<DynamicUIAgentService>('dynamicUIAgent', dynamicUIAgent);
    // Add other services like notificationService (often part of UiStore actions)

    // 2. Initialize Vue Router
    const router: Router = createAppRouter();
    app.use(router);
    console.debug('[Bootstrap] Vue Router initialized.');

    // 3. Initialize Internationalization (vue-i18n)
    const i18nInstance: I18n<LocaleMessages, LanguageCode> = await setupI18nPlugin(app);
    app.provide<I18n<LocaleMessages, LanguageCode>>('i18n', i18nInstance); // Provide the instance
    console.debug('[Bootstrap] vue-i18n initialized.');

    // Make $t and $i18n globally available on component instances (Options API).
    // For Composition API, use `useI18n()`.
    app.config.globalProperties.$t = i18nInstance.global.t;
    app.config.globalProperties.$i18n = i18nInstance.global;

    // 4. Initialize Core Stores & Services that depend on plugins
    const authStore = useAuthStore();
    const uiStore = useUiStore();
    const voiceStore = useVoiceStore(); // Initialize voice store

    // Initialize theme from storage/system preference
    uiStore.initializeTheme();

    // Configure ApiService's onUnauthorized callback AFTER authStore is available
    apiService.setOnUnauthorizedCallback(async () => { // Ensure onUnauthorizedCallback is public in ApiService or use a setter
      await authStore.logout(); // Auth store handles actual logout logic and navigation
    });

    // Initialize auth state (checks for persisted token)
    // This is now typically handled by the router guard calling authStore.initializeAuth()
    // await authStore.initializeAuth(); // Call it once here if not solely relying on router guard
    // If router guard handles it, ensure Pinia is setup BEFORE router for guard to access store.

    // Initialize Voice Command Service (depends on stores being ready)
    await voiceCommandService.initialize();
    console.debug('[Bootstrap] Core stores and services initialized.');


    // 5. Global Vue Error Handler
    app.config.errorHandler = (err, instance, info) => {
      console.error('[Vue ErrorHandler] Unhandled error:', err);
      console.error('[Vue ErrorHandler] Component instance:', instance);
      console.error('[Vue ErrorHandler] Vue-specific info:', info);
      // Example: uiStore.addNotification({ type: 'error', title: 'Application Error', message: 'An unexpected error occurred.' });
      // In production, send to an error tracking service.
    };

    // 6. Wait for router to be ready before mounting
    // This ensures async operations in navigation guards (like authStore.initializeAuth()) complete.
    await router.isReady();
    console.debug('[Bootstrap] Vue Router is ready.');

    // 7. Mount the application to the DOM
    app.mount('#app');
    console.info(`[Bootstrap] Voice Chat Assistant mounted. Mode: ${import.meta.env.MODE}. Version: ${import.meta.env.VITE_APP_VERSION || 'N/A'}`);

  } catch (error: any) { // Catch any type of error during bootstrap
    console.error("[Bootstrap] Critical error during application initialization:", error);
    const appRoot = document.getElementById('app');
    if (appRoot) {
      appRoot.innerHTML = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2rem; text-align: center; color: #ef4444; background-color: #fee2e2; border: 1px solid #fca5a5; border-radius: 0.5rem; margin: 1rem;">
          <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;">Application Initialization Failed</h1>
          <p style="font-size: 1rem; margin-bottom: 0.5rem;">A critical error occurred while starting Voice Chat Assistant.</p>
          <p style="font-size: 0.875rem; color: #7f1d1d;">Please try refreshing the page. If the problem persists, contact support.</p>
          ${import.meta.env.DEV ? `<pre style="font-size: 0.75rem; color: #4b5563; text-align: left; background-color: #f3f4f6; padding: 0.5rem; border-radius: 0.25rem; margin-top: 1rem; white-space: pre-wrap; word-break: break-all;">${error.message}\n${error.stack}</pre>` : ''}
        </div>
      `;
    }
    throw error; // Re-throw to make it clear in the console that bootstrapping failed.
  }
}

// Initiate the bootstrap process
bootstrap();