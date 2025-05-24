// File: frontend/src/features/auth/store/auth.store.ts
/**
 * @fileoverview Pinia store for managing authentication state, user profile,
 * API tokens, and subscription information.
 * @module features/auth/store/auth
 */
import { defineStore } from 'pinia';
import { apiService, IApiService, AUTH_TOKEN_STORAGE_KEY } from '../../../services/apiService';
import { storageService, StorageType } from '../../../services/storageService';
import { router } from '../../../router'; // Assuming router instance export for navigation
import type {
  User,
  LoginCredentials,
  RegistrationData,
  AuthResponse,
  SubscriptionTier,
  ApiKey,
} from '../../../types/auth.types'; // Ensure these types are well-defined
import { useUiStore } from '../../../store/ui.store';
import { AppError } from '../../../types/api.types';

/**
 * @interface AuthState
 * @description Represents the state managed by the authentication store.
 */
export interface AuthState {
  /** The currently authenticated user, or null if not authenticated. */
  currentUser: User | null;
  /** The user's current subscription tier, or null if not applicable/loaded. */
  currentSubscription: SubscriptionTier | null;
  /** Indicates if an authentication process (login, register, status check) is in progress. */
  isLoading: boolean;
  /** Stores any authentication-related error message. */
  authError: AppError | null;
  /** The JWT or session token. */
  token: string | null;
  /** Indicates if the auth state has been initialized (e.g., after checking persisted token). */
  isInitialized: boolean;
  /** Stores user-specific API keys for various providers. */
  userApiKeys: ApiKey[];
}

/**
 * `useAuthStore` Pinia store definition.
 * Manages user authentication, profile, tokens, and subscription status.
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    currentUser: null,
    currentSubscription: null,
    isLoading: false,
    authError: null,
    token: null,
    isInitialized: false,
    userApiKeys: [],
  }),

  getters: {
    /**
     * Checks if there is an authenticated user.
     * @returns {boolean} True if a user is authenticated.
     */
    isAuthenticated: (state): boolean => !!state.currentUser && !!state.token,

    /**
     * Gets the display name of the current user.
     * @returns {string} The user's display name or an empty string.
     */
    userDisplayName: (state): string => state.currentUser?.username || state.currentUser?.email || '',

    /**
     * Gets the current user's subscription tier ID.
     * @returns {string | undefined}
     */
    userTierId: (state): string | undefined => state.currentUser?.subscriptionTierId,

    /**
     * Checks if the user has a specific capability based on their subscription.
     * @param state - The current store state.
     * @returns (capability: string) => boolean
     */
    hasCapability: (state) => (capability: string): boolean => {
      return state.currentSubscription?.features?.includes(capability) ?? false;
    },
  },

  actions: {
    /**
     * Initializes the authentication state, typically by checking for a persisted token.
     * Should be called once when the application loads.
     */
    async initializeAuth() {
      if (this.isInitialized) return;

      this.setLoading(true);
      const persistedToken = storageService.get<string>(StorageType.Local, AUTH_TOKEN_STORAGE_KEY) ||
                             storageService.get<string>(StorageType.Session, AUTH_TOKEN_STORAGE_KEY);

      if (persistedToken) {
        this.token = persistedToken;
        apiService.setAuthToken(persistedToken); // Inform ApiService
        try {
          await this.fetchUserProfile(); // Fetch user profile if token exists
        } catch (error) {
          // Token might be invalid or expired
          console.warn('[AuthStore] Failed to fetch profile with persisted token:', error);
          await this.clearAuthData(); // Clear invalid token and user data
        }
      }
      this.isInitialized = true;
      this.setLoading(false);
    },

    /**
     * Logs in a user with the provided credentials.
     * @param {LoginCredentials} credentials - The user's login credentials.
     * @param {boolean} [rememberMe=false] - Whether to persist the session across browser restarts.
     * @returns {Promise<void>}
     * @throws {AppError} If login fails.
     */
    async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<void> {
      this.setLoading(true);
      this.setAuthError(null);
      const uiStore = useUiStore(); // Get UI store for global loading

      try {
        uiStore.setGlobalLoading(true, 'Logging in...');
        // The backend /api/v1/auth/login should return AuthResponse: { user: User, token: string, subscription?: SubscriptionTier }
        const response = await apiService.post<AuthResponse, LoginCredentials>('/auth/login', credentials);

        if (response.token && response.user) {
          this.setAuthData(response.token, response.user, response.subscription, rememberMe);
          // Navigate to home or intended redirect path
          const redirectPath = router.currentRoute.value.query.redirect as string || '/home';
          router.replace(redirectPath); // Use replace to avoid login page in history
        } else {
          throw new AppError('LOGIN_FAILED', 'Invalid response from login API.');
        }
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('LOGIN_FAILED', (error as Error).message || 'Login failed due to an unknown error.', error);
        this.setAuthError(appError);
        console.error('[AuthStore] Login failed:', appError);
        throw appError; // Re-throw for the component to handle
      } finally {
        this.setLoading(false);
        uiStore.setGlobalLoading(false);
      }
    },

    /**
     * Registers a new user.
     * @param {RegistrationData} data - The user registration data.
     * @returns {Promise<void>}
     * @throws {AppError} If registration fails.
     */
    async register(data: RegistrationData): Promise<void> {
      this.setLoading(true);
      this.setAuthError(null);
      const uiStore = useUiStore();
      try {
        uiStore.setGlobalLoading(true, 'Registering...');
        // Backend /api/v1/auth/register should return AuthResponse similar to login
        const response = await apiService.post<AuthResponse, RegistrationData>('/auth/register', data);

        if (response.token && response.user) {
          this.setAuthData(response.token, response.user, response.subscription, true); // Assume rememberMe on register
          router.replace('/home'); // Navigate to home after successful registration
        } else {
          throw new AppError('REGISTRATION_FAILED', 'Invalid response from registration API.');
        }
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('REGISTRATION_FAILED', (error as Error).message || 'Registration failed.', error);
        this.setAuthError(appError);
        console.error('[AuthStore] Registration failed:', appError);
        throw appError;
      } finally {
        this.setLoading(false);
        uiStore.setGlobalLoading(false);
      }
    },

    /**
     * Logs out the current user.
     * Clears authentication state and redirects to the login page.
     * @returns {Promise<void>}
     */
    async logout(): Promise<void> {
      this.setLoading(true);
      const uiStore = useUiStore();
      try {
        uiStore.setGlobalLoading(true, 'Logging out...');
        // Optionally call a backend logout endpoint if it exists (e.g., to invalidate server-side session/token)
        // await apiService.post('/auth/logout');
      } catch (error) {
        console.warn('[AuthStore] Error calling backend logout (if configured):', error);
        // Continue with client-side logout even if backend call fails
      } finally {
        await this.clearAuthData();
        this.setLoading(false);
        uiStore.setGlobalLoading(false);
        // Using `replace` to prevent user from navigating back to authenticated pages
        router.replace({ name: 'Login', query: { loggedOut: 'true' } });
      }
    },

    /**
     * Fetches the current user's profile and subscription details from the backend.
     * Typically called after login or when an existing token is detected.
     * @returns {Promise<void>}
     * @throws {AppError} If fetching fails.
     */
    async fetchUserProfile(): Promise<void> {
      if (!this.token) { // Should not happen if called correctly, but as a safeguard
        await this.clearAuthData();
        return;
      }
      this.setLoading(true);
      try {
        // Backend /api/v1/auth/me should return { user: User, subscription?: SubscriptionTier, apiKeys?: ApiKey[] }
        const response = await apiService.get<{ user: User, subscription?: SubscriptionTier, apiKeys?: ApiKey[] }>('/auth/me');
        this.currentUser = response.user;
        this.currentSubscription = response.subscription || null;
        this.userApiKeys = response.apiKeys || [];
        this.setAuthError(null); // Clear any previous auth error
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('PROFILE_FETCH_FAILED', (error as Error).message || 'Failed to fetch user profile.', error);
        this.setAuthError(appError);
        console.error('[AuthStore] Failed to fetch user profile:', appError);
        await this.clearAuthData(); // If profile fetch fails, token is likely invalid
        throw appError;
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * Updates the user's profile information.
     * @param {Partial<User>} profileData - The profile data to update.
     * @returns {Promise<void>}
     * @throws {AppError} If update fails.
     */
    async updateUserProfile(profileData: Partial<User>): Promise<void> {
        if (!this.isAuthenticated) throw new AppError('UNAUTHENTICATED', 'User must be authenticated to update profile.');
        this.setLoading(true);
        try {
            // Backend /api/v1/user/profile (example endpoint)
            const updatedUser = await apiService.put<User, Partial<User>>('/user/profile', profileData);
            this.currentUser = updatedUser;
            useUiStore().addNotification({ message: 'Profile updated successfully.', type: 'success'});
        } catch (error) {
            const appError = error instanceof AppError ? error : new AppError('PROFILE_UPDATE_FAILED', (error as Error).message || 'Failed to update profile.', error);
            this.setAuthError(appError); // Set error on auth store or a dedicated profile store
            throw appError;
        } finally {
            this.setLoading(false);
        }
    },

    /**
     * Sets authentication data in the store and persists the token.
     * @param {string} token - The authentication token.
     * @param {User} user - The user object.
     * @param {SubscriptionTier | null} subscription - The user's subscription tier.
     * @param {boolean} rememberMe - Whether to persist the token in localStorage.
     * @private
     */
    setAuthData(token: string, user: User, subscription: SubscriptionTier | null, rememberMe: boolean) {
      this.token = token;
      this.currentUser = user;
      this.currentSubscription = subscription;
      apiService.setAuthToken(token, rememberMe); // This handles storage via storageService
      this.setAuthError(null); // Clear any previous errors on successful auth
      this.isInitialized = true; // Mark as initialized
    },

    /**
     * Clears all authentication data from the store and storage.
     * @private
     */
    async clearAuthData() {
      this.currentUser = null;
      this.currentSubscription = null;
      this.token = null;
      this.userApiKeys = [];
      apiService.setAuthToken(null); // This clears from service and storage
      this.setAuthError(null);
      // Do not set isInitialized to false here, as it means initialization has run.
      // If re-initialization is needed, a separate flag or method might be better.
    },

    /**
     * Sets the loading state.
     * @param {boolean} isLoading - The new loading state.
     * @private
     */
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    /**
     * Sets the authentication error state.
     * @param {AppError | null} error - The error object or null to clear.
     * @private
     */
    setAuthError(error: AppError | null) {
      this.authError = error;
    },

    // Actions for managing User API Keys
    async fetchUserApiKeys(): Promise<void> {
        if(!this.isAuthenticated) return;
        this.setLoading(true);
        try {
            const keys = await apiService.get<ApiKey[]>('/user/api-keys'); // Example endpoint
            this.userApiKeys = keys;
        } catch (error) {
            console.error('[AuthStore] Failed to fetch user API keys:', error);
            useUiStore().addNotification({message: 'Failed to load your API keys.', type: 'error'});
        } finally {
            this.setLoading(false);
        }
    },

    async addUserApiKey(keyData: Omit<ApiKey, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiKey | null> {
        if(!this.isAuthenticated) return null;
        this.setLoading(true);
        try {
            const newKey = await apiService.post<ApiKey, typeof keyData>('/user/api-keys', keyData);
            this.userApiKeys.push(newKey);
            useUiStore().addNotification({message: `API key "${newKey.keyName || newKey.providerId}" added.`, type: 'success'});
            return newKey;
        } catch (error) {
            console.error('[AuthStore] Failed to add API key:', error);
            const errorMsg = (error as AppError).message || 'Failed to add API key.';
            useUiStore().addNotification({message: errorMsg, type: 'error'});
            return null;
        } finally {
            this.setLoading(false);
        }
    },

    async deleteUserApiKey(keyId: string): Promise<void> {
        if(!this.isAuthenticated) return;
        this.setLoading(true);
        try {
            await apiService.delete(`/user/api-keys/${keyId}`);
            this.userApiKeys = this.userApiKeys.filter(key => key.id !== keyId);
            useUiStore().addNotification({message: 'API key deleted.', type: 'success'});
        } catch (error) {
            console.error('[AuthStore] Failed to delete API key:', error);
            const errorMsg = (error as AppError).message || 'Failed to delete API key.';
            useUiStore().addNotification({message: errorMsg, type: 'error'});
        } finally {
            this.setLoading(false);
        }
    },
  },
});