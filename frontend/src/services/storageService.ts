// File: frontend/src/services/storageService.ts
/**
 * @fileoverview Service for abstracting interactions with browser storage (localStorage and sessionStorage).
 * Provides type-safe methods for getting, setting, and removing items, enhancing reliability and maintainability.
 * @module services/storageService
 */

/**
 * Defines the types of browser storage that can be used.
 * @enum {string} StorageType
 */
export enum StorageType {
  /** Represents `localStorage`, persisting data until explicitly cleared or by user action. */
  Local = 'localStorage',
  /** Represents `sessionStorage`, persisting data for the duration of the page session. */
  Session = 'sessionStorage',
}

/**
 * Interface for the Storage Service.
 * Defines the contract for interacting with browser storage.
 * @interface IStorageService
 */
export interface IStorageService {
  /**
   * Retrieves an item from the specified storage.
   * Parses the item from JSON; returns null if the item doesn't exist or parsing fails.
   *
   * @template T - The expected type of the stored item.
   * @param {StorageType} type - The type of storage to access (Local or Session).
   * @param {string} key - The key of the item to retrieve.
   * @returns {T | null} The retrieved item, or null if not found or if a parsing error occurs.
   * @example
   * const user = storageService.get<User>(StorageType.Local, 'currentUser');
   */
  get<T>(type: StorageType, key: string): T | null;

  /**
   * Stores an item in the specified storage.
   * The item will be automatically `JSON.stringify`-ed before being stored.
   *
   * @template T - The type of the item to store.
   * @param {StorageType} type - The type of storage to use (Local or Session).
   * @param {string} key - The key under which to store the item.
   * @param {T} value - The item to store.
   * @returns {void}
   * @example
   * storageService.set<User>(StorageType.Local, 'currentUser', { id: 1, name: 'Alice' });
   */
  set<T>(type: StorageType, key: string, value: T): void;

  /**
   * Removes an item from the specified storage.
   *
   * @param {StorageType} type - The type of storage to access (Local or Session).
   * @param {string} key - The key of the item to remove.
   * @returns {void}
   * @example
   * storageService.remove(StorageType.Local, 'currentUser');
   */
  remove(type: StorageType, key: string): void;

  /**
   * Clears all items from the specified storage type.
   * Use with caution as this will remove all data stored by the application in that storage.
   *
   * @param {StorageType} type - The type of storage to clear (Local or Session).
   * @returns {void}
   * @example
   * storageService.clear(StorageType.Local);
   */
  clear(type: StorageType): void;

  /**
   * Checks if the specified storage type is available and usable in the current browser environment.
   * @param {StorageType} type - The type of storage to check.
   * @returns {boolean} True if available, false otherwise.
   */
  isAvailable(type: StorageType): boolean;
}

/**
 * Implements `IStorageService` for interacting with browser `localStorage` and `sessionStorage`.
 * Handles potential errors during storage operations, such as when storage is disabled or full.
 * @class StorageService
 * @implements {IStorageService}
 */
class StorageService implements IStorageService {
  private getRawStorage(type: StorageType): Storage | null {
    try {
      const storage = window[type];
      // Test if storage is actually available and usable (e.g., not disabled by browser settings, not full for a test item)
      const testKey = '__app_storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return storage;
    } catch (e) {
      console.warn(`[StorageService] ${type} is not available or access is denied. Error: ${(e as Error).message}`);
      return null;
    }
  }

  /** @inheritdoc */
  public isAvailable(type: StorageType): boolean {
    return this.getRawStorage(type) !== null;
  }

  /** @inheritdoc */
  public get<T>(type: StorageType, key: string): T | null {
    const storage = this.getRawStorage(type);
    if (!storage) {
      return null;
    }

    const item = storage.getItem(key);
    if (item === null) {
      return null;
    }

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[StorageService] Error parsing item from ${type} with key "${key}". Removing corrupted item. Error: ${(error as Error).message}`);
      // If parsing fails, the item is likely corrupted, so remove it.
      this.remove(type, key);
      return null;
    }
  }

  /** @inheritdoc */
  public set<T>(type: StorageType, key: string, value: T): void {
    const storage = this.getRawStorage(type);
    if (!storage) {
      console.warn(`[StorageService] Cannot set item. ${type} is not available.`);
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`[StorageService] Error setting item in ${type} for key "${key}". Error: ${(error as Error).message}. This might be due to storage limits.`);
      // Potentially handle QuotaExceededError specifically if needed
    }
  }

  /** @inheritdoc */
  public remove(type: StorageType, key: string): void {
    const storage = this.getRawStorage(type);
    if (!storage) {
      return;
    }
    storage.removeItem(key);
  }

  /** @inheritdoc */
  public clear(type: StorageType): void {
    const storage = this.getRawStorage(type);
    if (!storage) {
      return;
    }
    storage.clear();
  }
}

/**
 * Singleton instance of the `StorageService`.
 * This instance should be used throughout the application for all browser storage interactions.
 * @type {IStorageService}
 */
export const storageService: IStorageService = new StorageService();