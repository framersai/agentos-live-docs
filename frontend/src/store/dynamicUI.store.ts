// File: frontend/src/store/dynamicUI.store.ts
/**
 * @fileoverview Pinia store for managing the state of dynamically rendered UI blocks
 * commanded by AI agents or other backend processes. This store is central to the
 * AI-driven UI composition feature of the Voice Chat Assistant.
 * @module store/dynamicUI
 * @see UiCommand, DynamicBlockManifest from ui.types.ts
 */
import { defineStore } from 'pinia';
import type { UiCommand, DynamicBlockManifest, RenderBlockPayload } from '../types/ui.types';
import { useUiStore } from './ui.store'; // For notifications

/**
 * @interface DynamicBlockState
 * @description Represents the state of a single dynamically rendered UI block.
 * @property {string} blockId - Unique ID of the block instance (from manifest.blockId).
 * @property {string} slotId - The ID of the layout slot where this block is rendered.
 * @property {DynamicBlockManifest} manifest - The manifest defining the block's component, props, and content.
 * @property {any} [componentInstanceRef] - Optional reference to the mounted Vue component instance (advanced use).
 * @property {boolean} [isLoading=false] - True if the block is currently loading or updating its content.
 * @property {string | null} [error=null] - Error message if block rendering/update failed.
 */
export interface DynamicBlockState {
  blockId: string;
  slotId: string;
  manifest: DynamicBlockManifest;
  componentInstanceRef?: any;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * @interface DynamicUiState
 * @description Represents the overall state managed by the dynamic UI store.
 */
export interface DynamicUiState {
  /**
   * A record where keys are targetSlotId strings and values are arrays of DynamicBlockState
   * objects rendered within that slot.
   */
  activeBlocksBySlot: Record<string, DynamicBlockState[]>;
  /**
   * Queue of UI commands received from the backend that are pending processing.
   * This allows for batching or sequential processing if needed.
   * For now, commands are processed immediately upon dispatch.
   */
  // commandQueue: UiCommand[]; // Command queue might be an advanced feature for later
  /** Stores any error message related to processing dynamic UI commands globally. */
  globalProcessingError: string | null;
}

export const useDynamicUiStore = defineStore('dynamicUI', {
  state: (): DynamicUiState => ({
    activeBlocksBySlot: {},
    // commandQueue: [],
    globalProcessingError: null,
  }),

  getters: {
    /**
     * Gets all blocks currently active in a specific layout slot.
     * @param state - The current store state.
     * @returns (slotId: string) => DynamicBlockState[]
     */
    blocksInSlot: (state) => (slotId: string): DynamicBlockState[] => {
      return state.activeBlocksBySlot[slotId] || [];
    },

    /**
     * Gets a specific dynamic block by its unique blockId, searching across all slots.
     * @param state - The current store state.
     * @returns (blockId: string) => DynamicBlockState | undefined
     */
    getBlockById: (state) => (blockId: string): DynamicBlockState | undefined => {
      for (const slotId in state.activeBlocksBySlot) {
        const foundBlock = state.activeBlocksBySlot[slotId].find(b => b.blockId === blockId);
        if (foundBlock) return foundBlock;
      }
      return undefined;
    },

    /**
     * Checks if a specific slot has any active dynamic blocks.
     * @param state - The current store state.
     * @returns (slotId: string) => boolean
     */
    hasBlocksInSlot: (state) => (slotId: string): boolean => {
      return (state.activeBlocksBySlot[slotId]?.length || 0) > 0;
    },
  },

  actions: {
    /**
     * Processes a UI command received from the backend (e.g., from an AI agent).
     * This is the primary entry point for AI-driven UI modifications.
     * @param {UiCommand} command - The UI command to process.
     */
    processUiCommand(command: UiCommand) {
      this.globalProcessingError = null; // Clear previous global error
      const uiStore = useUiStore(); // For notifications
      console.debug(`[DynamicUIStore] Processing UI Command:`, command);

      try {
        if (!command || !command.actionType) {
          throw new Error('Invalid UI command: Missing actionType.');
        }

        switch (command.actionType) {
          case 'RENDER_BLOCK':
            this.renderDynamicBlock(command.payload as RenderBlockPayload, command.targetSlotId, command.securityContext);
            break;
          case 'UPDATE_BLOCK':
            if (!command.blockId) throw new Error('blockId is required for UPDATE_BLOCK action.');
            this.updateDynamicBlock(command.blockId, command.payload as Partial<DynamicBlockManifest>);
            break;
          case 'REMOVE_BLOCK':
            if (!command.blockId) throw new Error('blockId is required for REMOVE_BLOCK action.');
            this.removeDynamicBlock(command.blockId);
            break;
          case 'SHOW_MODAL':
            // Assumes payload is Omit<UiModal, 'id' | 'isOpen'>
            uiStore.openModal(command.payload);
            break;
          case 'DISPLAY_NOTIFICATION':
            // Assumes payload is Omit<UiNotification, 'id'>
            uiStore.addNotification(command.payload);
            break;
          default:
            console.warn('[DynamicUIStore] Unknown UI command actionType received:', command.actionType);
            throw new Error(`Unsupported UI command actionType: ${command.actionType}`);
        }
      } catch (error: any) {
        this.globalProcessingError = error.message || 'Failed to process UI command.';
        console.error('[DynamicUIStore] Error processing UI command:', command, error);
        uiStore.addNotification({ type: 'error', title: 'UI Update Error', message: this.globalProcessingError });
      }
    },

    /**
     * Renders a new dynamic UI block or replaces an existing one with the same blockId in a specified slot.
     * @param {RenderBlockPayload} payload - Contains the manifest for the block.
     * @param {string} [targetSlotId='default-dynamic-slot'] - The ID of the layout slot to render into.
     * @param {UiCommand['securityContext']} securityContext - The security context for rendering (e.g., for HTML fragments).
     */
    renderDynamicBlock(payload: RenderBlockPayload, targetSlotId: string = 'default-dynamic-slot', securityContext?: UiCommand['securityContext']) {
      if (!payload.manifest || !payload.manifest.blockId || !payload.manifest.componentKey) {
        throw new Error('Invalid manifest for RENDER_BLOCK: blockId and componentKey are required.');
      }
      const { manifest } = payload;
      const newBlockState: DynamicBlockState = {
        blockId: manifest.blockId,
        slotId: targetSlotId,
        manifest: { ...manifest, securityContext: securityContext || manifest.securityContext || 'NONE' }, // Prioritize command's context
        isLoading: false,
        error: null,
      };

      if (!this.activeBlocksBySlot[targetSlotId]) {
        this.activeBlocksBySlot[targetSlotId] = [];
      }

      // Check if block with same ID already exists in this slot or any slot, then replace or add
      const existingBlockIndex = this.activeBlocksBySlot[targetSlotId].findIndex(b => b.blockId === manifest.blockId);
      if (existingBlockIndex !== -1) {
        this.activeBlocksBySlot[targetSlotId][existingBlockIndex] = newBlockState;
        console.log(`[DynamicUIStore] Block "${manifest.blockId}" updated in slot "${targetSlotId}".`);
      } else {
        // If it's a new block or replacing one with a different ID but same slot.
        // For true "append" or "prepend", additional logic for ordering would be needed.
        // This implementation effectively adds or replaces by ID.
        this.activeBlocksBySlot[targetSlotId].push(newBlockState);
        console.log(`[DynamicUIStore] Block "${manifest.blockId}" rendered in slot "${targetSlotId}".`);
      }
    },

    /**
     * Updates an existing dynamic block's manifest (e.g., its props or contentString).
     * @param {string} blockIdToUpdate - The ID of the block to update.
     * @param {Partial<DynamicBlockManifest>} newManifestData - The partial new manifest data to merge.
     */
    updateDynamicBlock(blockIdToUpdate: string, newManifestData: Partial<DynamicBlockManifest>) {
      let found = false;
      for (const slotId in this.activeBlocksBySlot) {
        const blockIndex = this.activeBlocksBySlot[slotId].findIndex(b => b.blockId === blockIdToUpdate);
        if (blockIndex !== -1) {
          const existingBlock = this.activeBlocksBySlot[slotId][blockIndex];
          this.activeBlocksBySlot[slotId][blockIndex] = {
            ...existingBlock,
            manifest: {
              ...existingBlock.manifest,
              ...newManifestData, // New data overrides
              props: { // Deep merge props
                ...(existingBlock.manifest.props || {}),
                ...(newManifestData.props || {}),
              },
            },
            isLoading: false, // Reset loading/error on update
            error: null,
          };
          found = true;
          console.log(`[DynamicUIStore] Block "${blockIdToUpdate}" manifest updated in slot "${slotId}".`);
          break;
        }
      }
      if (!found) {
        throw new Error(`Block with ID "${blockIdToUpdate}" not found for update.`);
      }
    },

    /**
     * Removes a dynamic block from rendering, identified by its blockId.
     * @param {string} blockIdToRemove - The ID of the block to remove.
     */
    removeDynamicBlock(blockIdToRemove: string) {
      let foundAndRemoved = false;
      for (const slotId in this.activeBlocksBySlot) {
        const initialLength = this.activeBlocksBySlot[slotId].length;
        this.activeBlocksBySlot[slotId] = this.activeBlocksBySlot[slotId].filter(b => b.blockId !== blockIdToRemove);
        if (this.activeBlocksBySlot[slotId].length < initialLength) {
          foundAndRemoved = true;
          console.log(`[DynamicUIStore] Block "${blockIdToRemove}" removed from slot "${slotId}".`);
          if (this.activeBlocksBySlot[slotId].length === 0) {
            delete this.activeBlocksBySlot[slotId]; // Clean up empty slot entry
          }
          break;
        }
      }
      if (!foundAndRemoved) {
        console.warn(`[DynamicUIStore] Block with ID "${blockIdToRemove}" not found for removal.`);
        // Not throwing an error here as it might be a non-critical race condition
      }
    },

    /**
     * Sets the loading state for a specific dynamic block.
     * @param {string} blockId - The ID of the block.
     * @param {boolean} isLoading - The loading state.
     */
    setBlockLoading(blockId: string, isLoading: boolean) {
      const block = this.getBlockById(blockId);
      if (block) {
        block.isLoading = isLoading;
        if (isLoading) block.error = null; // Clear error when starting to load
      }
    },

    /**
     * Sets an error message for a specific dynamic block.
     * @param {string} blockId - The ID of the block.
     * @param {string | null} errorMessage - The error message, or null to clear.
     */
    setBlockError(blockId: string, errorMessage: string | null) {
      const block = this.getBlockById(blockId);
      if (block) {
        block.error = errorMessage;
        block.isLoading = false; // Stop loading if an error occurs
      }
    },

    /** Clears all dynamic blocks from a specific slot. */
    clearSlot(slotId: string) {
      if (this.activeBlocksBySlot[slotId]) {
        delete this.activeBlocksBySlot[slotId];
        console.log(`[DynamicUIStore] Slot "${slotId}" cleared of all dynamic blocks.`);
      }
    },

    /** Clears all dynamic blocks from all slots. */
    clearAllDynamicBlocks() {
      this.activeBlocksBySlot = {};
      console.log('[DynamicUIStore] All dynamic blocks cleared from all slots.');
    },
  },
});