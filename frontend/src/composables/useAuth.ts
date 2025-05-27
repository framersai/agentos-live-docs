// File: frontend/src/composables/useAuth.ts
/**
 * @file useAuth.ts
 * @description Composable for managing and accessing authentication state reactively.
 * It checks localStorage/sessionStorage for the auth token and updates API headers.
 * @version 1.0.0
 */
import { ref, onMounted, onUnmounted, readonly, type Ref, watch } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { AUTH_TOKEN_KEY } from '@/router';
import { api, authAPI } from '@/utils/api';
import { useStorage } from '@vueuse/core'; // To watch storage changes for cross-tab sync

// This ref will be updated by the checkAuthStatus and login/logout functions
const isAuthenticatedGlobal = ref<boolean>(false);
const authTokenGlobal = ref<string | null>(null);

// Use useStorage to react to changes in localStorage/sessionStorage,
// useful for logout/login in other tabs.
const localToken = useStorage<string | null>(AUTH_TOKEN_KEY, null, localStorage);
const sessionToken = useStorage<string | null>(AUTH_TOKEN_KEY, null, sessionStorage);


/**
 * @function checkAuthStatus
 * @description Checks authentication status from storage and updates reactive state and API headers.
 * @returns {boolean} True if authenticated, false otherwise.
 */
const checkAuthStatus = (): boolean => {
  if (typeof window !== 'undefined') {
    const tokenFromLocal = localStorage.getItem(AUTH_TOKEN_KEY);
    const tokenFromSession = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const currentToken = tokenFromLocal || tokenFromSession;

    authTokenGlobal.value = currentToken;
    isAuthenticatedGlobal.value = !!currentToken;

    if (currentToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    return isAuthenticatedGlobal.value;
  }
  // SSR or non-browser environment
  delete api.defaults.headers.common['Authorization'];
  authTokenGlobal.value = null;
  isAuthenticatedGlobal.value = false;
  return false;
};


export function useAuth() {
  const router = useRouter(); // Get router instance

  // Initial check on composable instantiation
  // This helps if the composable is used before App.vue's onMounted
  if (typeof window !== 'undefined' && !isAuthenticatedGlobal.value) {
    checkAuthStatus();
  }

  const login = (token: string, rememberMe: boolean): void => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_TOKEN_KEY, token);
    // Update local refs for useStorage to pick up the change for watchers
    if (rememberMe) {
        localToken.value = token;
        sessionToken.value = null; // Clear session if local is set
    } else {
        sessionToken.value = token;
        localToken.value = null; // Clear local if session is set
    }
    // checkAuthStatus(); // Directly called by token watchers now
  };

  const logout = async (redirectToLogin: boolean = true): Promise<void> => {
    // Attempt backend logout, but proceed with frontend logout regardless
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('[useAuth] Backend logout call failed, proceeding with frontend logout:', error);
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localToken.value = null;
    sessionToken.value = null;
    // checkAuthStatus(); // Directly called by token watchers now

    // TODO: Add logic to clear relevant Pinia stores (cost, chat, agent, ui)
    // This might involve importing stores here or emitting an event that App.vue handles.
    // For now, focusing on auth state.

    if (redirectToLogin) {
      router.push({ name: 'Login', query: {} }).catch(err => { // Clear any existing query params
        console.error("[useAuth] Router push to Login failed after logout:", err);
      });
    }
  };

  // Watch for direct changes to storage (e.g., from other tabs)
  watch([localToken, sessionToken], () => {
    console.log('[useAuth] Storage token changed, re-checking auth status.');
    checkAuthStatus();
  }, { deep: true });


  onMounted(() => {
    // Initial check and setup listeners when component using this composable mounts
    checkAuthStatus();
    if (typeof window !== 'undefined') {
      // Storage event is for other tabs, useStorage handles current tab reactivity.
      window.addEventListener('storage', checkAuthStatus);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', checkAuthStatus);
    }
  });

  return {
    /**
     * @property {Readonly<Ref<boolean>>} isAuthenticated - Reactive boolean indicating authentication status.
     */
    isAuthenticated: readonly(isAuthenticatedGlobal),
    /**
     * @property {Readonly<Ref<string | null>>} currentToken - Reactive ref holding the current auth token, or null.
     */
    currentToken: readonly(authTokenGlobal),
    /**
     * @function login
     * @description Call after successful authentication to store token and update state.
     * @param {string} token - The authentication token.
     * @param {boolean} rememberMe - Whether to persist the token in localStorage (true) or sessionStorage (false).
     */
    login,
    /**
     * @function logout
     * @description Clears authentication token from storage, updates state, and optionally redirects to login.
     * @param {boolean} [redirectToLogin=true] - Whether to redirect to the login page after logout.
     * @async
     */
    logout,
    /**
     * @function checkAuthStatus
     * @description Manually triggers a re-check of the authentication status from storage.
     * @returns {boolean} The current authentication status.
     */
    checkAuthStatus,
  };
}