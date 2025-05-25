// File: frontend/src/store/auth.store.ts
/**
 * @fileoverview Fixed authentication store with proper imports and error handling
 * @module store/auth
 */
import { defineStore } from 'pinia';
import { apiService, AUTH_TOKEN_STORAGE_KEY } from '../services/apiService';
import { storageService, StorageType } from '../services/storageService';
import type {
  User,
  LoginCredentials,
  RegistrationData,
  AuthResponse,
  SubscriptionTier,
  ApiKey,
  AppError,
} from '../types/api.types';

/**
 * Authentication state interface
 */
export interface AuthState {
  currentUser: User | null;
  currentSubscription: SubscriptionTier | null;
  isLoading: boolean;
  authError: AppError | null;
  token: string | null;
  isInitialized: boolean;
  userApiKeys: ApiKey[];
}

/**
 * Authentication store implementation
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
    isAuthenticated: (state): boolean => !!state.currentUser && !!state.token,
    userDisplayName: (state): string => state.currentUser?.username || state.currentUser?.email || '',
    userTierId: (state): string | undefined => state.currentUser?.subscriptionTierId,
    hasCapability: (state) => (capability: string): boolean => {
      return state.currentSubscription?.features?.includes(capability) ?? false;
    },
  },

  actions: {
    /**
     * Initialize authentication state
     */
    async initializeAuth() {
      if (this.isInitialized) return;

      this.setLoading(true);
      const persistedToken = storageService.get<string>(StorageType.Local, AUTH_TOKEN_STORAGE_KEY) ||
                             storageService.get<string>(StorageType.Session, AUTH_TOKEN_STORAGE_KEY);

      if (persistedToken) {
        this.token = persistedToken;
        apiService.setAuthToken(persistedToken);
        try {
          await this.fetchUserProfile();
        } catch (error) {
          console.warn('[AuthStore] Failed to fetch profile with persisted token:', error);
          await this.clearAuthData();
        }
      }
      this.isInitialized = true;
      this.setLoading(false);
    },

    /**
     * Login user with credentials
     */
    async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<void> {
      this.setLoading(true);
      this.setAuthError(null);

      try {
        const response = await apiService.post<AuthResponse>('/auth/login', credentials);

        if (response.token && response.user) {
          this.setAuthData(response.token, response.user, response.subscription || null, rememberMe);
        } else {
          throw new AppError('LOGIN_FAILED', 'Invalid response from login API.');
        }
      } catch (error) {
        const appError = error instanceof AppError 
          ? error 
          : new AppError('LOGIN_FAILED', (error as Error).message || 'Login failed');
        this.setAuthError(appError);
        throw appError;
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * Register new user
     */
    async register(data: RegistrationData): Promise<void> {
      this.setLoading(true);
      this.setAuthError(null);

      try {
        const response = await apiService.post<AuthResponse>('/auth/register', data);

        if (response.token && response.user) {
          this.setAuthData(response.token, response.user, response.subscription || null, true);
        } else {
          throw new AppError('REGISTRATION_FAILED', 'Invalid response from registration API.');
        }
      } catch (error) {
        const appError = error instanceof AppError 
          ? error 
          : new AppError('REGISTRATION_FAILED', (error as Error).message || 'Registration failed');
        this.setAuthError(appError);
        throw appError;
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
      this.setLoading(true);
      try {
        // Call backend logout if available
        await apiService.post('/auth/logout');
      } catch (error) {
        console.warn('[AuthStore] Backend logout failed:', error);
      } finally {
        await this.clearAuthData();
        this.setLoading(false);
      }
    },

    /**
     * Fetch user profile from backend
     */
    async fetchUserProfile(): Promise<void> {
      if (!this.token) {
        await this.clearAuthData();
        return;
      }

      this.setLoading(true);
      try {
        const response = await apiService.get<{ 
          user: User; 
          subscription?: SubscriptionTier; 
          apiKeys?: ApiKey[] 
        }>('/auth/me');
        
        this.currentUser = response.user;
        this.currentSubscription = response.subscription || null;
        this.userApiKeys = response.apiKeys || [];
        this.setAuthError(null);
      } catch (error) {
        const appError = error instanceof AppError 
          ? error 
          : new AppError('PROFILE_FETCH_FAILED', (error as Error).message || 'Failed to fetch profile');
        this.setAuthError(appError);
        await this.clearAuthData();
        throw appError;
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * Set authentication data
     */
    setAuthData(token: string, user: User, subscription: SubscriptionTier | null, rememberMe: boolean) {
      this.token = token;
      this.currentUser = user;
      this.currentSubscription = subscription;
      apiService.setAuthToken(token, rememberMe);
      this.setAuthError(null);
      this.isInitialized = true;
    },

    /**
     * Clear authentication data
     */
    async clearAuthData() {
      this.currentUser = null;
      this.currentSubscription = null;
      this.token = null;
      this.userApiKeys = [];
      apiService.setAuthToken(null);
      this.setAuthError(null);
    },

    /**
     * Set loading state
     */
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    /**
     * Set authentication error
     */
    setAuthError(error: AppError | null) {
      this.authError = error;
    },
  },
});