/**
 * @file diary.service.ts
 * @description Service for managing diary entries using local storage (localForage).
 * Provides CRUD operations, import/export, and ensures data persistence for the Diary Agent.
 * @version 1.1.0 - Added Import/Export functionality.
 */

import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface DiaryTag
 * @description Represents a tag associated with a diary entry.
 */
export interface DiaryTag {
  id: string;
  name: string;
}

/**
 * @interface DiaryEntry
 * @description Defines the structure of a diary entry.
 */
export interface DiaryEntry {
  id: string;
  title: string;
  contentMarkdown: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  tags: string[];
  mood?: string;
  summary?: string;
  isFavorite?: boolean;
  schemaVersion?: number;
}

/**
 * @interface DiaryExportData
 * @description Structure for exporting and importing diary data.
 */
export interface DiaryExportData {
    exportFormatVersion: string;
    exportedAt: string;
    entries: DiaryEntry[];
}

const DIARY_STORAGE_KEY = 'vcaUserDiaryEntries_v1.1'; // Versioned key
const CURRENT_EXPORT_VERSION = '1.1.0';

class DiaryService {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'VCADiaryApp', // Changed instance name slightly for clarity
      storeName: 'diary_entries', // More specific storeName
      description: 'Stores user diary entries locally for Voice Coding Assistant.',
    });
    console.log('[DiaryService] Initialized with localForage.');
  }

  async saveEntry(entryData: Omit<DiaryEntry, 'id' | 'updatedAt' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<DiaryEntry> {
    const now = new Date().toISOString();
    let entryToSave: DiaryEntry;

    if (entryData.id) {
      const existingEntry = await this.getEntry(entryData.id);
      if (!existingEntry) {
        // If trying to update a non-existent ID, treat as new or throw error.
        // For simplicity, we'll create it as new but log a warning.
        console.warn(`[DiaryService] Update called for non-existent ID ${entryData.id}. Creating as new.`);
         entryToSave = {
            id: entryData.id, // Use provided ID if trying to update
            title: entryData.title,
            contentMarkdown: entryData.contentMarkdown,
            createdAt: entryData.createdAt || now, // Use provided createdAt if available (e.g. during import)
            updatedAt: now,
            tags: entryData.tags || [],
            mood: entryData.mood,
            summary: entryData.summary,
            isFavorite: entryData.isFavorite || false,
            schemaVersion: 1,
        };
      } else {
        entryToSave = {
            ...existingEntry,
            title: entryData.title,
            contentMarkdown: entryData.contentMarkdown,
            tags: entryData.tags || existingEntry.tags,
            mood: entryData.mood !== undefined ? entryData.mood : existingEntry.mood,
            summary: entryData.summary !== undefined ? entryData.summary : existingEntry.summary,
            isFavorite: entryData.isFavorite !== undefined ? entryData.isFavorite : existingEntry.isFavorite,
            updatedAt: now,
            schemaVersion: existingEntry.schemaVersion || 1,
        };
      }
    } else {
      entryToSave = {
        id: uuidv4(),
        title: entryData.title,
        contentMarkdown: entryData.contentMarkdown,
        createdAt: entryData.createdAt || now,
        updatedAt: now,
        tags: entryData.tags || [],
        mood: entryData.mood,
        summary: entryData.summary,
        isFavorite: entryData.isFavorite || false,
        schemaVersion: 1,
      };
    }

    try {
      const entries = await this.getAllEntriesMap();
      entries.set(entryToSave.id, entryToSave);
      await this.store.setItem(DIARY_STORAGE_KEY, entries);
      console.log(`[DiaryService] Entry saved/updated: ${entryToSave.id} - "${entryToSave.title}"`);
      return entryToSave;
    } catch (error) {
      console.error('[DiaryService] Error saving entry:', error);
      throw new Error(`Failed to save diary entry: ${(error as Error).message}`);
    }
  }

  async getEntry(entryId: string): Promise<DiaryEntry | null> {
    try {
      const entries = await this.getAllEntriesMap();
      return entries.get(entryId) || null;
    } catch (error) {
      console.error(`[DiaryService] Error retrieving entry ${entryId}:`, error);
      return null;
    }
  }

  async getAllEntries(sortBy: 'createdAt' | 'updatedAt' | 'title' = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc'): Promise<DiaryEntry[]> {
    try {
      const entriesMap = await this.getAllEntriesMap();
      const entriesArray = Array.from(entriesMap.values());

      entriesArray.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else { 
          comparison = new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime(); // Default desc for dates
        }
        return sortOrder === 'asc' ? comparison * -1 : comparison; // Adjust if default date sort is not what's needed
      });
      // Correct date sorting:
      entriesArray.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        let comparison = 0;
        if (sortBy === 'title') {
            comparison = (valA as string).localeCompare(valB as string);
        } else { // createdAt or updatedAt
            comparison = new Date(valA as string).getTime() - new Date(valB as string).getTime();
        }
        return sortOrder === 'desc' ? comparison * -1 : comparison;
      });

      return entriesArray;
    } catch (error) {
      console.error('[DiaryService] Error retrieving all entries:', error);
      return [];
    }
  }

  private async getAllEntriesMap(): Promise<Map<string, DiaryEntry>> {
    const storedData = await this.store.getItem<Map<string, DiaryEntry> | DiaryEntry[]>(DIARY_STORAGE_KEY);
    if (Array.isArray(storedData)) { 
        console.warn("[DiaryService] Migrating old array-based diary storage to Map-based.");
        const map = new Map<string, DiaryEntry>();
        storedData.forEach(entry => {
            if (entry && entry.id && typeof entry.id === 'string') { // Basic validation
                 map.set(entry.id, entry);
            } else {
                console.warn("[DiaryService] Found invalid entry during migration:", entry);
            }
        });
        await this.store.setItem(DIARY_STORAGE_KEY, map);
        return map;
    }
    return storedData instanceof Map ? storedData : new Map<string, DiaryEntry>();
  }

  async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const entries = await this.getAllEntriesMap();
      if (entries.has(entryId)) {
        entries.delete(entryId);
        await this.store.setItem(DIARY_STORAGE_KEY, entries);
        console.log(`[DiaryService] Entry deleted: ${entryId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`[DiaryService] Error deleting entry ${entryId}:`, error);
      return false;
    }
  }

  async clearAllEntries(): Promise<void> {
    try {
      await this.store.removeItem(DIARY_STORAGE_KEY); // More direct way to clear for localForage
      // Or: await this.store.setItem(DIARY_STORAGE_KEY, new Map<string, DiaryEntry>());
      console.log('[DiaryService] All diary entries cleared.');
    } catch (error) {
      console.error('[DiaryService] Error clearing all entries:', error);
      throw new Error(`Failed to clear diary entries: ${(error as Error).message}`);
    }
  }

  async searchEntries(searchTerm: string): Promise<DiaryEntry[]> {
    if (!searchTerm.trim()) return this.getAllEntries();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const allEntries = await this.getAllEntries();
    return allEntries.filter(entry =>
      entry.title.toLowerCase().includes(lowerSearchTerm) ||
      entry.contentMarkdown.toLowerCase().includes(lowerSearchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }

  async getEntriesByTag(tagName: string): Promise<DiaryEntry[]> {
    const lowerTagName = tagName.toLowerCase();
    const allEntries = await this.getAllEntries();
    return allEntries.filter(entry =>
      entry.tags.some(tag => tag.toLowerCase() === lowerTagName)
    );
  }

  async getAllTags(): Promise<string[]> {
    const allEntries = await this.getAllEntries();
    const tagSet = new Set<string>();
    allEntries.forEach(entry => {
      (entry.tags || []).forEach(tag => tagSet.add(tag.trim()));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }

  /**
   * Exports all diary entries to a JSON string.
   * @returns {Promise<string>} A JSON string representing all diary entries.
   */
  async exportEntries(): Promise<string> {
    const entries = await this.getAllEntries('createdAt', 'asc'); // Export in chronological order
    const exportData: DiaryExportData = {
        exportFormatVersion: CURRENT_EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        entries: entries,
    };
    return JSON.stringify(exportData, null, 2); // Pretty print JSON
  }

  /**
   * Imports diary entries from a JSON string.
   * @param {string} jsonString - The JSON string containing diary entries.
   * @returns {Promise<{ importedCount: number; skippedCount: number; error?: string }>} Result of the import.
   */
  async importEntries(jsonString: string): Promise<{ importedCount: number; skippedCount: number; error?: string }> {
    let importedCount = 0;
    let skippedCount = 0;
    try {
      const exportData = JSON.parse(jsonString) as DiaryExportData;
      if (!exportData || !exportData.entries || !Array.isArray(exportData.entries) || exportData.exportFormatVersion !== CURRENT_EXPORT_VERSION) {
        return { importedCount, skippedCount, error: "Invalid or incompatible JSON file format." };
      }

      const currentEntriesMap = await this.getAllEntriesMap();
      const entriesToSave: DiaryEntry[] = [];

      for (const entry of exportData.entries) {
        // Basic validation of an imported entry
        if (entry && entry.id && entry.title && entry.contentMarkdown && entry.createdAt && entry.updatedAt) {
          if (currentEntriesMap.has(entry.id)) {
            // Handle duplicates: for now, skip if ID exists. Could offer merge/overwrite.
            const existingEntry = currentEntriesMap.get(entry.id)!;
            if (new Date(entry.updatedAt).getTime() > new Date(existingEntry.updatedAt).getTime()) {
                 // Imported entry is newer, let's plan to update
                 entriesToSave.push(entry); // This will effectively be an update by saveEntry
                 console.log(`[DiaryService] Marking entry for update (newer version imported): ${entry.id}`);
            } else {
                skippedCount++;
                console.log(`[DiaryService] Skipped duplicate entry ID on import: ${entry.id}`);
            }
          } else {
            entriesToSave.push(entry);
          }
        } else {
          skippedCount++;
          console.warn("[DiaryService] Skipped invalid entry during import:", entry);
        }
      }
      
      // Batch save entries if possible, or save one by one
      for (const entry of entriesToSave) {
          // saveEntry will handle if it's a new ID or an update to an existing one.
          await this.saveEntry(entry);
          importedCount++;
      }

      return { importedCount, skippedCount };
    } catch (e: any) {
      console.error("[DiaryService] Error importing entries:", e);
      return { importedCount, skippedCount, error: `Import failed: ${e.message || 'Could not parse JSON file.'}` };
    }
  }
}

export const diaryService = new DiaryService();