// File: frontend/src/main.ts
/**
 * @fileoverview Main entry point for the Vue 3 application.
 * Initializes Vue, Pinia for state management, Vue Router for navigation,
 * vue-i18n for internationalization, and other global plugins and services.
 * This file orchestrates the bootstrapping of the application.
 * @module main
 */
import { createApp, App as VueAppInstance, provide, h } from 'vue';
import { createPinia, Pinia } from 'pinia';
import { Router } from 'vue-router';
import { I18n } from 'vue-i18n'; // Import I18n type

import App from './App.vue';
import { createAppRouter } from './router';
import { setupI18nPlugin, useI18n, LanguageCode, LocaleMessages } from './composables/useI18n';
import { apiService, IApiService, ApiServiceConfig } from './services/apiService';
import { seoService, ISeoService } from './services/seoService';
import { storageService, IStorageService } from './services/storageService';
import { useAuthStore } from './features/auth/store/auth.store';
import { useUiStore } from './store/ui.store'; // For global loading, holographic theme state

// Import global styles: Order can be important.
import './assets/main.css'; // Should primarily contain Tailwind directives and base imports
import './styles/_base.css';
import './styles/_typography.css';
import './styles/_animations.css'; // For holographic effects
import './styles/_accessibility.css';

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
    // This is generally preferred over attaching to globalProperties for better type safety and testability.
    app.provide<IApiService>('apiService', apiService);
    app.provide<ISeoService>('seoService', seoService);
    app.provide<IStorageService>('storageService', storageService);
    // Add other services like notificationService, voiceCommandService here once created.

    // 2. Initialize Vue Router
    const router: Router = createAppRouter();
    app.use(router);
    console.debug('[Bootstrap] Vue Router initialized.');

    // 3. Initialize Internationalization (vue-i18n)
    const i18nInstance: I18n<LocaleMessages, LanguageCode> = await setupI18nPlugin(app);
    app.provide<I18n<LocaleMessages, LanguageCode>>('i18n', i18nInstance);
    console.debug('[Bootstrap] vue-i18n initialized.');

    // Make $t available globally for convenience in templates if still desired,
    // though `useI18n()` is preferred in <script setup>.
    app.config.globalProperties.$t = i18nInstance.global.t;
    app.config.globalProperties.$i18n = i18nInstance.global;


    // 4. Initialize Authentication State (and other critical stores)
    // The authStore might need the router for redirects, so initialize after router.
    const authStore = useAuthStore();
    const uiStore = useUiStore(); // Initialize UI store for global loading, theme, etc.

    // Configure ApiService's onUnauthorized callback to use the authStore for logout.
    (apiService as any).onUnauthorizedCallback = async () => { // Cast to any if method is private/not on interface
      await authStore.logout(); // Perform logout actions (clear state, token)
      router.push({ name: 'Login', query: { sessionExpired: 'true' } });
    };

    // Attempt to initialize auth state (e.g., check for persisted token)
    // This is now handled within router.beforeEach by authStore.initializeAuth()
    // but an initial call might still be useful depending on app flow.
    // await authStore.initializeAuth();
    console.debug('[Bootstrap] Auth store initialized.');


    // 5. Global Error Handler for Vue
    app.config.errorHandler = (err, instance, info) => {
      console.error('[Vue ErrorHandler] Unhandled error:', err);
      console.error('[Vue ErrorHandler] Component instance:', instance);
      console.error('[Vue ErrorHandler] Vue-specific info:', info);
      // Optionally send to an error tracking service like Sentry/Bugsnag
      // uiStore.showGlobalError('An unexpected error occurred. Please try refreshing the page.');
    };

    // 6. Wait for router to be ready before mounting
    // This ensures any async operations in navigation guards (like auth checks) complete.
    await router.isReady();
    console.debug('[Bootstrap] Router is ready.');

    // 7. Mount the application to the DOM
    app.mount('#app');
    console.info(`[Bootstrap] Application mounted. Environment: ${import.meta.env.MODE}. Version: ${import.meta.env.VITE_APP_VERSION || 'N/A'}`);

  } catch (error) {
    console.error("[Bootstrap] Critical error during application initialization:", error);
    // Display a user-friendly error message in the DOM if #app exists
    const appRoot = document.getElementById('app');
    if (appRoot) {
      appRoot.innerHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; text-align: center; color: #d32f2f; background-color: #ffebee; border: 1px solid #ffcdd2; border-radius: 8px; margin: 20px;">
          <h1 style="font-size: 24px; margin-bottom: 15px;">Application Initialization Failed</h1>
          <p style="font-size: 16px; margin-bottom: 10px;">We're sorry, but a critical error occurred while starting the application. Our team has been notified.</p>
          <p style="font-size: 14px; color: #757575;">Please try refreshing the page. If the problem persists, please contact support.</p>
          ${import.meta.env.DEV ? `<pre style="font-size: 12px; color: #424242; text-align: left; background-color: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 15px; white-space: pre-wrap; word-break: break-all;">${(error as Error).message}\n${(error as Error).stack}</pre>` : ''}
        </div>
      `;
    }
    // Re-throw to make it clear in the console that bootstrapping failed.
    throw error;
  }
}

// Initiate the bootstrap process
bootstrap();