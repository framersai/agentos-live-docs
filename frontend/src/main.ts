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
import './assets/main.scss';
// Import AUTH_TOKEN_KEY if needed directly in main, though it's mostly used by router/auth logic
// export const AUTH_TOKEN_KEY = 'vcaAuthToken'; // Already exported from router/index.ts

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');