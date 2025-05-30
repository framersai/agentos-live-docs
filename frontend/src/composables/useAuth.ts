// File: frontend/src/composables/useAuth.ts
/**
 * @file useAuth.ts
 * @version 1.2.0
 * @description Composable for managing authentication and a session-specific user identifier.
 * Logout ensures page refresh/redirect and clears session-specific ID.
 */
import { ref, onMounted, onUnmounted, readonly, type Ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AUTH_TOKEN_KEY } from '@/router'; // Assuming this is your main auth token key
import { api, authAPI } from '@/utils/api';
import { useStorage } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid'; // For generating session-specific IDs

// Import Pinia stores for reset on logout
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
import { useAgentStore } from '@/store/agent.store';
import { useUiStore } from '@/store/ui.store';

// Key for session-specific user ID
const SESSION_USER_ID_KEY = 'vcaSessionUserId';

// Reactive refs for global auth state
const isAuthenticatedGlobal = ref<boolean>(false);
const authTokenGlobal = ref<string | null>(null);

// Storage for actual auth token (shared password scenario)
const localToken = useStorage<string | null>(AUTH_TOKEN_KEY, null, localStorage);
const sessionToken = useStorage<string | null>(AUTH_TOKEN_KEY, null, sessionStorage);

// Reactive ref and storage for session-specific user ID
const sessionUserIdGlobal = ref<string | null>(null);
const storedSessionUserId = useStorage<string | null>(SESSION_USER_ID_KEY, null, sessionStorage);

const checkAuthStatus = (): boolean => {
  if (typeof window !== 'undefined') {
    const tokenFromLocal = localStorage.getItem(AUTH_TOKEN_KEY);
    const tokenFromSession = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const currentToken = tokenFromLocal || tokenFromSession;

    authTokenGlobal.value = currentToken;
    isAuthenticatedGlobal.value = !!currentToken; // Authentication based on shared password token

    if (currentToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    return isAuthenticatedGlobal.value;
  }
  delete api.defaults.headers.common['Authorization'];
  authTokenGlobal.value = null;
  isAuthenticatedGlobal.value = false;
  return false;
};

/**
 * Retrieves the current session-specific user ID.
 * If one doesn't exist in sessionStorage, it generates a new UUID, stores it, and returns it.
 * @returns {string} The session-specific user ID.
 */
const getOrGenerateSessionUserId = (): string => {
  if (storedSessionUserId.value) {
    sessionUserIdGlobal.value = storedSessionUserId.value;
    return storedSessionUserId.value;
  }
  const newId = uuidv4();
  storedSessionUserId.value = newId;
  sessionUserIdGlobal.value = newId;
  console.log('[Auth/Session] Generated new session User ID:', newId);
  return newId;
};

export function useAuth() {
  const router = useRouter();
  const route = useRoute();

  // Initialize auth status and session user ID on composable setup
  if (typeof window !== 'undefined') {
    if (!isAuthenticatedGlobal.value && !authTokenGlobal.value) {
      checkAuthStatus();
    }
    if (!sessionUserIdGlobal.value) {
      // Ensures sessionUserIdGlobal is populated from storage or generated
      sessionUserIdGlobal.value = getOrGenerateSessionUserId();
    }
  }

  const login = (token: string, rememberMe: boolean): void => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_TOKEN_KEY, token); // Store the shared auth token
    if (rememberMe) {
      localToken.value = token;
      sessionToken.value = null; // Clear session token if local is set
    } else {
      sessionToken.value = token;
      localToken.value = null; // Clear local token if session is set
    }
    // The shared auth state will update via watchers or checkAuthStatus.
    // The session-specific ID is independent of this shared auth token,
    // it's tied to the browser session. A new one is generated if not present.
    getOrGenerateSessionUserId(); // Ensure session ID exists on login
  };

  const logout = async (redirectTo: string = '/login', forceReloadPage: boolean = true): Promise<void> => {
    const chatStoreInstance = useChatStore();
    const costStoreInstance = useCostStore();
    const agentStoreInstance = useAgentStore();
    const uiStoreInstance = useUiStore();

    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('[useAuth] Backend logout call failed, proceeding with frontend logout:', error);
    }

    // Clear shared authentication token
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localToken.value = null;
    sessionToken.value = null;
    isAuthenticatedGlobal.value = false;
    authTokenGlobal.value = null;
    delete api.defaults.headers.common['Authorization'];

    // Clear session-specific user ID
    sessionStorage.removeItem(SESSION_USER_ID_KEY);
    storedSessionUserId.value = null;
    sessionUserIdGlobal.value = null;
    console.log('[Auth/Session] Cleared session User ID on logout.');

    try {
      chatStoreInstance.$reset();
      costStoreInstance.$reset();
      agentStoreInstance.$reset();
      uiStoreInstance.$reset();
      console.log('[useAuth] Pinia stores reset.');
    } catch (storeResetError) {
      console.error("[useAuth] Error resetting Pinia stores during logout:", storeResetError);
    }

    if (redirectTo) {
        const currentPath = window.location.pathname;
      if (currentPath === redirectTo && forceReloadPage) {
        window.location.assign(redirectTo);
      } else {
        router.push(redirectTo).then(() => {
          if (window.location.pathname === redirectTo && forceReloadPage) {
            window.location.reload();
          }
        }).catch(err => {
          console.error(`[useAuth] Router push to ${redirectTo} failed after logout. Forcing navigation. Error:`, err);
          window.location.href = redirectTo;
        });
      }
    } else if (forceReloadPage) {
      window.location.reload();
    }
    // If neither redirectTo nor forceReloadPage, it just logs out without navigation/reload.
  };


  if (typeof window !== 'undefined') {
    // Watch for changes in stored auth tokens
    watch([localToken, sessionToken], () => {
      checkAuthStatus();
    }, { deep: true });

    // Watch for changes in stored session user ID (e.g., if cleared by another tab, though less likely with sessionStorage)
    watch(storedSessionUserId, (newVal) => {
        if (newVal) {
            sessionUserIdGlobal.value = newVal;
        } else {
            // If it got cleared elsewhere, generate a new one for this context
            sessionUserIdGlobal.value = getOrGenerateSessionUserId();
        }
    });

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY) {
        checkAuthStatus();
      }
      if (event.key === SESSION_USER_ID_KEY) {
        storedSessionUserId.value = event.newValue; // Update from storage event
        sessionUserIdGlobal.value = event.newValue ? event.newValue : getOrGenerateSessionUserId();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange);
    });
  }
  
  onMounted(() => {
    checkAuthStatus();
    // Ensure sessionUserIdGlobal is initialized from sessionStorage or generated
    sessionUserIdGlobal.value = getOrGenerateSessionUserId();
  });

  // Expose a computed property for the session user ID
  const currentSessionUserId = computed(() => {
    if (!sessionUserIdGlobal.value) {
      return getOrGenerateSessionUserId(); // Ensure it's available
    }
    return sessionUserIdGlobal.value;
  });

  return {
    isAuthenticated: readonly(isAuthenticatedGlobal),
    currentToken: readonly(authTokenGlobal),
    /**
     * A unique identifier for the current browser session.
     * Persists in sessionStorage. Used for stateless user tracking.
     */
    sessionUserId: currentSessionUserId, // Changed to be a computed ref
    login,
    logout,
    checkAuthStatus,
    getOrGenerateSessionUserId, // Expose this if direct call is needed elsewhere
  };
}