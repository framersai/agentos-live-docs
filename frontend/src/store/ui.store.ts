// File: frontend/src/store/ui.store.ts
/**
 * @fileoverview Pinia store for managing global UI state.
 * This includes theme management (light, dark, holographic), global loading indicators,
 * modal management, notifications, and other cross-cutting UI concerns.
 * @module store/ui
 */
import { defineStore } from 'pinia';
import { AppTheme, UiModal, UiNotification, AppNotificationType } from '../types/ui.types';
import { storageService, StorageType } from '../services/storageService'; // For persisting theme

const THEME_STORAGE_KEY = 'app-active-theme';
const DEFAULT_THEME = AppTheme.LIGHT; // Or AppTheme.HOLOGRAPHIC if that's the default future vision

/**
 * @interface UiState
 * @description Represents the state managed by the UI store.
 */
export interface UiState {
  /** The currently active application theme. */
  currentTheme: AppTheme;
  /** Indicates if a global, blocking loading indicator is active. */
  isGlobalLoading: boolean;
  /** A message to display with the global loading indicator, if any. */
  globalLoadingMessage: string | null;
  /** An array of active modals to be displayed. */
  activeModals: UiModal[];
  /** An array of active notifications (toasts) to be displayed. */
  activeNotifications: UiNotification[];
  /** Counter for generating unique notification IDs. */
  _notificationIdCounter: number;
  /** Main content area's scroll lock state, useful for modals. */
  isScrollLocked: boolean;
}

/**
 * `useUiStore` Pinia store definition.
 * Manages global UI states like theme, loading, modals, and notifications.
 */
export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    currentTheme: DEFAULT_THEME,
    isGlobalLoading: false,
    globalLoadingMessage: null,
    activeModals: [],
    activeNotifications: [],
    _notificationIdCounter: 0,
    isScrollLocked: false,
  }),

  getters: {
    /**
     * Gets the currently active theme.
     * @returns {AppTheme} The active theme.
     */
    getActiveTheme: (state): AppTheme => state.currentTheme,

    /**
     * Checks if any modal is currently active.
     * @returns {boolean} True if at least one modal is active.
     */
    isModalActive: (state): boolean => state.activeModals.length > 0,

    /**
     * Gets the topmost active modal, if any.
     * @returns {UiModal | undefined} The topmost modal or undefined.
     */
    getTopmostModal: (state): UiModal | undefined =>
      state.activeModals.length > 0 ? state.activeModals[state.activeModals.length - 1] : undefined,
  },

  actions: {
    /**
     * Initializes the theme by loading the persisted theme from storage
     * or detecting system preference.
     * Should be called once when the application starts.
     */
    initializeTheme() {
      const persistedTheme = storageService.get<AppTheme>(StorageType.Local, THEME_STORAGE_KEY);
      if (persistedTheme && Object.values(AppTheme).includes(persistedTheme)) {
        this.setTheme(persistedTheme);
      } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme(AppTheme.DARK); // Prefer dark if system preference is dark and no user choice
      } else {
        this.setTheme(DEFAULT_THEME); // Fallback to default
      }
    },

    /**
     * Sets the application theme and applies it to the document.
     * Persists the chosen theme to local storage.
     * @param {AppTheme} theme - The theme to activate.
     */
    setTheme(theme: AppTheme) {
      if (!Object.values(AppTheme).includes(theme)) {
        console.warn(`[UiStore] Attempted to set invalid theme: ${theme}`);
        return;
      }

      if (typeof document !== 'undefined') {
        const htmlElement = document.documentElement;
        // Remove all potential theme classes before adding the new one
        Object.values(AppTheme).forEach(t => htmlElement.classList.remove(t));
        htmlElement.classList.add(theme);
      }
      this.currentTheme = theme;
      storageService.set<AppTheme>(StorageType.Local, THEME_STORAGE_KEY, theme);
      console.debug(`[UiStore] Theme changed to: ${theme}`);
    },

    /**
     * Toggles the global loading indicator.
     * @param {boolean} isLoading - True to show, false to hide.
     * @param {string | null} [message=null] - Optional message for the loading indicator.
     */
    setGlobalLoading(isLoading: boolean, message: string | null = null) {
      this.isGlobalLoading = isLoading;
      this.globalLoadingMessage = message;
      if (isLoading) {
        this.setScrollLock(true); // Often good to lock scroll during global loading
      } else {
        // Only unlock if no modals are active that also require scroll lock
        if (this.activeModals.length === 0) {
            this.setScrollLock(false);
        }
      }
    },

    /**
     * Opens a new modal. Modals are stacked.
     * @param {Omit<UiModal, 'id' | 'isOpen'>} modalProps - Properties for the modal to open.
     * `component` is the Vue component to render.
     * `props` are passed to the component.
     * @returns {string} The ID of the opened modal.
     */
    openModal(modalProps: Omit<UiModal, 'id' | 'isOpen'>): string {
      const modalId = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newModal: UiModal = {
        ...modalProps,
        id: modalId,
        isOpen: true,
      };
      this.activeModals.push(newModal);
      this.setScrollLock(true); // Lock scroll when a modal opens
      return modalId;
    },

    /**
     * Closes a specific modal by its ID.
     * @param {string} modalId - The ID of the modal to close.
     */
    closeModal(modalId: string) {
      const modalIndex = this.activeModals.findIndex(m => m.id === modalId);
      if (modalIndex !== -1) {
        this.activeModals.splice(modalIndex, 1);
        // If no more modals are open, unlock scroll
        if (this.activeModals.length === 0 && !this.isGlobalLoading) {
          this.setScrollLock(false);
        }
      } else {
        console.warn(`[UiStore] Attempted to close non-existent modal with ID: ${modalId}`);
      }
    },

    /**
     * Closes the topmost active modal.
     */
    closeTopmostModal() {
      if (this.activeModals.length > 0) {
        this.closeModal(this.activeModals[this.activeModals.length - 1].id);
      }
    },

    /**
     * Adds a notification (toast) to be displayed.
     * @param {Omit<UiNotification, 'id'>} notificationProps - Properties for the notification.
     * @returns {number} The ID of the added notification.
     */
    addNotification(notificationProps: Omit<UiNotification, 'id'>): number {
      const notificationId = this._notificationIdCounter++;
      const newNotification: UiNotification = {
        ...notificationProps,
        id: notificationId,
        type: notificationProps.type || AppNotificationType.INFO, // Default to INFO
        duration: notificationProps.duration === undefined ? 5000 : notificationProps.duration, // Default duration 5s, 0 for persistent
      };
      this.activeNotifications.push(newNotification);

      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(notificationId);
        }, newNotification.duration);
      }
      return notificationId;
    },

    /**
     * Removes a specific notification by its ID.
     * @param {number} notificationId - The ID of the notification to remove.
     */
    removeNotification(notificationId: number) {
      this.activeNotifications = this.activeNotifications.filter(n => n.id !== notificationId);
    },

    /**
     * Locks or unlocks page scrolling.
     * @param {boolean} lock - True to lock scroll, false to unlock.
     */
    setScrollLock(lock: boolean) {
        if (typeof document === 'undefined') return;
        if (lock) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // For html element too
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        this.isScrollLocked = lock;
    }
  },
});