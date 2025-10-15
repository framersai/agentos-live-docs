// File: frontend/src/main.ts
/**
 * @file main.ts
 * @description Main entry point for the Vue application.
 * Initializes Vue, Pinia, and imports the configured Vue Router.
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // Import the router from the new file
import i18n from './i18n'; // Import i18n configuration
import './assets/main.scss';
// Import AUTH_TOKEN_KEY if needed directly in main, though it's mostly used by router/auth logic
// export const AUTH_TOKEN_KEY = 'vcaAuthToken'; // Already exported from router/index.ts

const app = createApp(App);

app.use(createPinia());
app.use(i18n); // Add i18n before router
app.use(router);

// Debug i18n setup
console.log('[main.ts] i18n initialized with locale:', i18n.global.locale.value);
console.log('[main.ts] i18n available locales:', i18n.global.availableLocales);
console.log('[main.ts] i18n messages loaded:', Object.keys(i18n.global.messages.value));

// Test translation
console.log('[main.ts] Test translation for common.welcome in current locale:', i18n.global.t('common.welcome'));

app.mount('#app');

