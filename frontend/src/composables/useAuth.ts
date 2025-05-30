// File: frontend/src/composables/useAuth.ts
/**
 * @file useAuth.ts
 * @version 1.1.1
 * @description Composable for managing authentication. Logout ensures page refresh/redirect.
 * Now correctly imports Pinia stores for reset.
 */
import { ref, onMounted, onUnmounted, readonly, type Ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { AUTH_TOKEN_KEY } from '@/router';
import { api, authAPI } from '@/utils/api';
import { useStorage } from '@vueuse/core';

// Import Pinia stores for reset on logout
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
import { useAgentStore } from '@/store/agent.store';
import { useUiStore } from '@/store/ui.store';


const isAuthenticatedGlobal = ref<boolean>(false);
const authTokenGlobal = ref<string | null>(null);

const localToken = useStorage<string | null>(AUTH_TOKEN_KEY, null, localStorage);
const sessionToken = useStorage<string | null>(AUTH_TOKEN_KEY, null, sessionStorage);

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
  delete api.defaults.headers.common['Authorization'];
  authTokenGlobal.value = null;
  isAuthenticatedGlobal.value = false;
  return false;
};


export function useAuth() {
  const router = useRouter();
  const route = useRoute();

  if (typeof window !== 'undefined' && !isAuthenticatedGlobal.value && !authTokenGlobal.value) {
    checkAuthStatus();
  }

  const login = (token: string, rememberMe: boolean): void => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_TOKEN_KEY, token);
    if (rememberMe) {
        localToken.value = token;
        sessionToken.value = null;
    } else {
        sessionToken.value = token;
        localToken.value = null;
    }
    // checkAuthStatus() will be triggered by token watchers or manually in App.vue/Login.vue
  };

  const logout = async (redirectTo: string = '/login', forceReloadPage: boolean = true): Promise<void> => {
    // Instantiate stores here to call $reset or specific clear actions
    const chatStore = useChatStore();
    const costStore = useCostStore();
    const agentStore = useAgentStore();
    const uiStore = useUiStore();

    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('[useAuth] Backend logout call failed, proceeding with frontend logout:', error);
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localToken.value = null;
    sessionToken.value = null;
    
    isAuthenticatedGlobal.value = false;
    authTokenGlobal.value = null;
    delete api.defaults.headers.common['Authorization'];

    // Reset Pinia stores to their initial state
    // Ensure your stores have a $reset method (Pinia default) or a custom clearAllData action.
    try {
      chatStore.$reset(); // Assumes $reset exists and works
      costStore.$reset();
      agentStore.$reset();
      uiStore.$reset(); // This might re-initialize theme to system default.
                       // ThemeManager's persistence logic should handle this.
      console.log('[useAuth] Pinia stores reset.');
    } catch (storeResetError) {
      console.error("[useAuth] Error resetting Pinia stores during logout:", storeResetError);
    }

    // Navigation and Reloading
    if (redirectTo) {
      const currentPath = window.location.pathname; // Get current path directly from window.location
      const currentFullPath = route.fullPath; // For checking against router's view

      if (currentPath === redirectTo && forceReloadPage) {
        // If already on the target page (e.g., /login), and a reload is forced.
        window.location.assign(redirectTo); // assign() is like clicking a link to the page.
      } else {
        // Navigate using Vue Router.
        router.push(redirectTo).then(() => {
          // After router push, if we are now on the target path and a reload is still desired.
          if (window.location.pathname === redirectTo && forceReloadPage) {
            window.location.reload(); // Standard browser reload
          }
        }).catch(err => {
          console.error(`[useAuth] Router push to ${redirectTo} failed after logout. Forcing navigation via window.location.href. Error:`, err);
          window.location.href = redirectTo; // Hard navigation as a fallback.
        });
      }
    } else if (forceReloadPage) {
      // If no specific redirect path is given but forceReload is true, reload the current page.
      window.location.reload();
    }
    // If neither redirectTo nor forceReloadPage, it just logs out without navigation/reload.
  };

  if (typeof window !== 'undefined') {
      watch([localToken, sessionToken], () => {
        checkAuthStatus();
      }, { deep: true });

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === AUTH_TOKEN_KEY) {
            checkAuthStatus();
        }
      };
      window.addEventListener('storage', handleStorageChange);
      onUnmounted(() => {
          window.removeEventListener('storage', handleStorageChange);
      });
  }
  
  onMounted(() => {
    checkAuthStatus();
  });

  return {
    isAuthenticated: readonly(isAuthenticatedGlobal),
    currentToken: readonly(authTokenGlobal),
    login,
    logout,
    checkAuthStatus,
  };
}