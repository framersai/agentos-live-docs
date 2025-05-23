/**
 * @fileoverview Implements a basic PersonaLoader that reads persona definitions
 * from JSON files within a specified directory. Each .json file in the directory
 * (and its subdirectories, optionally) is expected to contain a valid IPersonaDefinition.
 * @module backend/agentos/cognitive_substrate/personas/PersonaLoader
 */

import * as fs from 'fs/promises';
import *import { IPersonaDefinition } from './IPersonaDefinition';
import { IPersonaLoader, PersonaLoaderConfig } from './IPersonaLoader';

/**
 * Configuration specific to the FileSystemPersonaLoader.
 * @interface FileSystemPersonaLoaderConfig
 * @extends {PersonaLoaderConfig}
 */
export interface FileSystemPersonaLoaderConfig extends PersonaLoaderConfig {
  /**
   * The file system path to the directory containing persona definition JSON files.
   * This overrides the generic `personaSource` from `PersonaLoaderConfig`.
   * @type {string}
   */
  personaDefinitionPath: string;

  /**
   * If true, recursively search for .json files in subdirectories.
   * @type {boolean}
   * @optional
   * @default false
   */
  recursiveSearch?: boolean;

  /**
   * File extension to look for (e.g., ".persona.json", ".json").
   * @type {string}
   * @optional
   * @default ".json"
   */
  fileExtension?: string;
}

/**
 * Implements IPersonaLoader to load persona definitions from the file system.
 * Assumes persona definitions are stored as individual JSON files.
 * @class PersonaLoader
 * @implements {IPersonaLoader}
 */
export class PersonaLoader implements IPersonaLoader {
  private config!: FileSystemPersonaLoaderConfig;
  private isInitialized: boolean = false;
  private loadedPersonas: Map<string, IPersonaDefinition> = new Map();

  /**
   * Constructs a PersonaLoader.
   * Note: `initialize` must be called before use.
   */
  constructor() {
    // Initialization is deferred to the initialize method.
  }

  /**
   * Ensures that the loader has been initialized.
   * @private
   * @throws {Error} If not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('PersonaLoader has not been initialized. Call initialize() first.');
    }
  }

  /**
   * {@inheritDoc IPersonaLoader.initialize}
   * For this implementation, config must be of type FileSystemPersonaLoaderConfig.
   */
  public async initialize(config: PersonaLoaderConfig): Promise<void> {
    if (!config || !(config as FileSystemPersonaLoaderConfig).personaDefinitionPath) {
      throw new Error(
        'Invalid configuration for FileSystemPersonaLoader: personaDefinitionPath is required.'
      );
    }
    this.config = {
        ...(config as FileSystemPersonaLoaderConfig),
        recursiveSearch: (config as FileSystemPersonaLoaderConfig).recursiveSearch ?? false,
        fileExtension: (config as FileSystemPersonaLoaderConfig).fileExtension ?? '.json',
    };

    try {
      const stats = await fs.stat(this.config.personaDefinitionPath);
      if (!stats.isDirectory()) {
        throw new Error(`Persona definition path '${this.config.personaDefinitionPath}' is not a directory.`);
      }
    } catch (error: any) {
      throw new Error(
        `Persona definition path '${this.config.personaDefinitionPath}' is not accessible or does not exist: ${error.message}`
      );
    }

    this.isInitialized = true;
    // console.log(`PersonaLoader initialized. Source directory: '${this.config.personaDefinitionPath}'.`);
    await this.refreshPersonas(); // Load personas upon initialization
  }

  /**
   * Recursively finds all files with the specified extension in a directory.
   * @private
   * @param {string} dirPath - The directory path to search.
   * @param {string} extension - The file extension to look for (e.g., ".json").
   * @returns {Promise<string[]>} A list of file paths.
   */
  private async findPersonaFiles(dirPath: string, extension: string): Promise<string[]> {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    const files: string[][] = await Promise.all(
      dirents.map(async (dirent) => {
        const res = path.resolve(dirPath, dirent.name);
        if (dirent.isDirectory() && this.config.recursiveSearch) {
          return this.findPersonaFiles(res, extension);
        } else if (dirent.isFile() && path.extname(dirent.name).toLowerCase() === extension.toLowerCase()) {
          return [res];
        }
        return [];
      })
    );
    return files.flat();
  }

  /**
   * {@inheritDoc IPersonaLoader.loadPersonaById}
   */
  public async loadPersonaById(personaId: string): Promise<IPersonaDefinition | undefined> {
    this.ensureInitialized();
    // This basic loader loads all personas at init/refresh.
    // A more advanced loader might fetch on demand.
    const persona = this.loadedPersonas.get(personaId);
    if (!persona) {
        // console.warn(`PersonaLoader: Persona with ID '${personaId}' not found in cache. Attempting direct load as fallback (not typical for this implementation).`);
        // For this simple file loader, if it's not in the cache, it means it wasn't found during scan.
        // A more sophisticated loader might try to load "personaId.json" here.
        return undefined;
    }
    return JSON.parse(JSON.stringify(persona)); // Return a copy
  }

  /**
   * {@inheritDoc IPersonaLoader.loadAllPersonaDefinitions}
   */
  public async loadAllPersonaDefinitions(): Promise<IPersonaDefinition[]> {
    this.ensureInitialized();
    if (this.loadedPersonas.size === 0) {
        // console.warn("PersonaLoader: No personas loaded or cache is empty. Consider calling refreshPersonas() or checking configuration.");
    }
    // Return copies to prevent external modification of the cache
    return Array.from(this.loadedPersonas.values()).map(p => JSON.parse(JSON.stringify(p)));
  }

  /**
   * {@inheritDoc IPersonaLoader.refreshPersonas}
   * Clears the existing cache and reloads all persona definitions from the file system.
   */
  public async refreshPersonas(): Promise<void> {
    this.ensureInitialized();
    this.loadedPersonas.clear();
    // console.log(`PersonaLoader: Refreshing personas from '${this.config.personaDefinitionPath}'...`);

    let personaFilePaths: string[];
    try {
      personaFilePaths = await this.findPersonaFiles(this.config.personaDefinitionPath, this.config.fileExtension!);
    } catch (error: any) {
      console.error(`PersonaLoader: Error scanning persona directory '${this.config.personaDefinitionPath}': ${error.message}`);
      throw new Error(`Failed to scan persona directory: ${error.message}`);
    }

    if (personaFilePaths.length === 0) {
      console.warn(`PersonaLoader: No persona files found in '${this.config.personaDefinitionPath}' with extension '${this.config.fileExtension}'.`);
      return;
    }

    for (const filePath of personaFilePaths) {
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const personaDefinition = JSON.parse(fileContent) as IPersonaDefinition;

        // Basic validation (more comprehensive validation should be done by a dedicated validator)
        if (!personaDefinition.id || !personaDefinition.name || !personaDefinition.baseSystemPrompt) {
          console.warn(`PersonaLoader: Skipping file '${filePath}' due to missing required fields (id, name, baseSystemPrompt).`);
          continue;
        }

        if (this.loadedPersonas.has(personaDefinition.id)) {
          console.warn(`PersonaLoader: Duplicate persona ID '${personaDefinition.id}' found in file '${filePath}'. Overwriting previous definition from unknown path.`);
        }
        this.loadedPersonas.set(personaDefinition.id, personaDefinition);
      } catch (error: any) {
        console.error(`PersonaLoader: Error loading or parsing persona from file '${filePath}': ${error.message}`);
        // Optionally, decide if one bad file should stop the whole process or just skip it.
      }
    }
    // console.log(`PersonaLoader: Successfully loaded/refreshed ${this.loadedPersonas.size} persona definitions.`);
  }
}