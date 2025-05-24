// File: frontend/src/services/uiInteractionService.ts
/**
 * @fileoverview UIInteractionService - Enables programmatic discovery and interaction with UI elements.
 * This service is critical for voice navigation, AI-driven UI manipulation, and automated testing.
 * It identifies elements using `data-voice-target` attributes, ARIA roles, and labels,
 * and can perform actions like click, focus, type, toggle, scroll, and zoom.
 * @module services/uiInteractionService
 */
import { ref, nextTick } from 'vue';
import type { InteractableElement } from '../types/ui.types'; // Assuming this type is well-defined
import { useUiStore } from '../store/ui.store'; // For global state like scroll lock

/**
 * @interface IUiInteractionService
 * @description Defines the contract for the UI Interaction Service.
 */
export interface IUiInteractionService {
  /**
   * Discovers all currently interactable elements within a given scope.
   * Filters by visibility and specific attributes.
   * @param {HTMLElement} [scopeElement=document.body] - The DOM element to search within.
   * @returns {InteractableElement[]} An array of discovered interactable elements.
   */
  discoverInteractableElements(scopeElement?: HTMLElement): InteractableElement[];

  /**
   * Retrieves a specific HTMLElement based on its `data-voice-target` ID.
   * @param {string} targetId - The `data-voice-target` ID of the element.
   * @returns {HTMLElement | null} The found HTML element, or null if not found.
   */
  getElementByTargetId(targetId: string): HTMLElement | null;

  /**
   * Triggers a click event on the specified UI element.
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @returns {Promise<boolean>} True if the action was successfully attempted, false otherwise.
   */
  clickElement(target: string | HTMLElement): Promise<boolean>;

  /**
   * Sets focus on the specified UI element and provides visual feedback.
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @returns {Promise<boolean>} True if focusing was successfully attempted.
   */
  focusElement(target: string | HTMLElement): Promise<boolean>;

  /**
   * Types text into an input-like element (input, textarea).
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @param {string} textToType - The text to type.
   * @param {boolean} [append=false] - If true, appends text; otherwise, replaces existing content.
   * @param {boolean} [submitForm=false] - If true, attempts to submit the parent form after typing.
   * @returns {Promise<boolean>} True if typing was successfully attempted.
   */
  typeIntoElement(target: string | HTMLElement, textToType: string, append?: boolean, submitForm?: boolean): Promise<boolean>;

  /**
   * Toggles the state of a toggleable element (checkbox, switch, ARIA-pressed button).
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @param {boolean} [explicitState] - Optional: if provided, sets the toggle to this state (true for checked/on, false for unchecked/off).
   * @returns {Promise<boolean>} True if toggling was successfully attempted.
   */
  toggleElementState(target: string | HTMLElement, explicitState?: boolean): Promise<boolean>;

  /**
   * Selects an option in a <select> element by its value or text content.
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLSelectElement itself.
   * @param {string} optionMatcher - The value or text content of the option to select.
   * @param {'value' | 'text'} [matchBy='value'] - How to match the option.
   * @returns {Promise<boolean>} True if selection was successful.
   */
  selectOption(target: string | HTMLElement, optionMatcher: string, matchBy?: 'value' | 'text'): Promise<boolean>;

  /**
   * Scrolls the page or a scrollable element.
   * @param {object} options - Scroll options.
   * @param {'up' | 'down' | 'left' | 'right' | 'top' | 'bottom' | 'element'} options.directionOrTarget - Direction or 'element' to scroll a specific element into view.
   * @param {string} [options.scrollableContainerId] - ID of a specific scrollable container. Defaults to window/document.
   * @param {string} [options.targetElementId] - ID of the element to scroll into view if directionOrTarget is 'element'.
   * @param {'smooth' | 'auto'} [options.behavior='smooth'] - Scroll behavior.
   * @param {'start' | 'center' | 'end' | 'nearest'} [options.block='center'] - Vertical alignment for scrollIntoView.
   * @param {'start' | 'center' | 'end' | 'nearest'} [options.inline='nearest'] - Horizontal alignment for scrollIntoView.
   * @returns {Promise<boolean>} True if scrolling was attempted.
   */
  scroll(options: {
    directionOrTarget: 'up' | 'down' | 'left' | 'right' | 'top' | 'bottom' | 'element';
    scrollableContainerId?: string;
    targetElementId?: string;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }): Promise<boolean>;

  /**
   * Applies a zoom transformation to a target element.
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @param {'in' | 'out' | 'reset' | number} zoomLevelOrDirection - Zoom direction, 'reset', or a specific scale factor.
   * @param {number} [step=0.1] - The increment/decrement step for 'in'/'out'.
   * @param {string} [transformOrigin='center center'] - The CSS transform-origin.
   * @returns {Promise<boolean>} True if zoom was applied.
   */
  zoomElement(target: string | HTMLElement, zoomLevelOrDirection: 'in' | 'out' | 'reset' | number, step?: number, transformOrigin?: string): Promise<boolean>;

  /**
   * Gets the current value or state of an interactable element.
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @returns {Promise<string | number | boolean | string[] | null>} The element's value/state or null.
   */
  getElementState(target: string | HTMLElement): Promise<string | number | boolean | string[] | null>;

  /**
   * Highlights an element visually for a short duration.
   * @param {string | HTMLElement} target - The `data-voice-target` ID or the HTMLElement itself.
   * @param {number} [durationMs=1500] - Duration of the highlight.
   * @param {string} [highlightClass='voice-target-highlight'] - CSS class for highlighting.
   */
  highlightElement(target: string | HTMLElement, durationMs?: number, highlightClass?: string): void;
}

/**
 * @class UiInteractionService
 * @implements {IUiInteractionService}
 * @description Provides methods to discover and interact with UI elements programmatically.
 */
class UiInteractionService implements IUiInteractionService {
  private readonly FOCUS_HIGHLIGHT_CLASS = 'voice-focused-element';
  private readonly INTERACTION_HIGHLIGHT_CLASS = 'voice-interacted-element';

  /**
   * @inheritdoc
   */
  public getElementByTargetId(targetId: string): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    return document.querySelector<HTMLElement>(`[data-voice-target="${targetId}"]`);
  }

  /**
   * @inheritdoc
   */
  public discoverInteractableElements(scopeElement: HTMLElement = document.body): InteractableElement[] {
    if (typeof document === 'undefined') return [];
    const elements: InteractableElement[] = [];
    // More comprehensive selector for common interactable elements + our custom attribute
    const selector = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])', '[role="button"]', '[role="link"]',
      '[role="checkbox"]', '[role="radio"]', '[role="switch"]', '[role="menuitem"]',
      '[data-voice-target]',
    ].join(', ');

    scopeElement.querySelectorAll(selector).forEach((el) => {
      const htmlEl = el as HTMLElement;
      // Basic visibility check: an element is considered not visible if it or its ancestors have display: none,
      // or if its offsetParent is null (common for hidden elements).
      // More robust check might involve getBoundingClientRect and intersection observer for true viewport visibility.
      if (htmlEl.offsetParent === null && htmlEl.tagName !== 'AREA' || getComputedStyle(htmlEl).display === 'none' || getComputedStyle(htmlEl).visibility === 'hidden') {
        return;
      }

      const voiceTargetId = htmlEl.dataset.voiceTarget;
      const ariaLabel = htmlEl.getAttribute('aria-label') || htmlEl.getAttribute('aria-labelledby'); // Consider aria-labelledby target text
      let textContent = (htmlEl.textContent || htmlEl.innerText || (htmlEl as HTMLInputElement).value || '').trim().replace(/\s+/g, ' ');

      let label = ariaLabel || textContent;
      if (!label && htmlEl.title) label = htmlEl.title;
      if (!label && voiceTargetId) label = voiceTargetId.replace(/-/g, ' '); // Fallback to a readable version of ID

      const id = voiceTargetId || `generated-${htmlEl.tagName.toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`;

      if (label) { // Only add elements that are meaningfully identifiable
        elements.push({
          id,
          label,
          role: htmlEl.getAttribute('role') || htmlEl.tagName.toLowerCase(),
          type: this._getElementTypeHint(htmlEl),
          elementRef: htmlEl, // Keep ref for direct manipulation
          actions: this._getPossibleActions(htmlEl),
          currentValue: this._getElementCurrentValue(htmlEl),
          isVisible: true, // Placeholder, true visibility check is harder
        });
      }
    });
    return elements;
  }

  private _getElementTypeHint(el: HTMLElement): InteractableElement['type'] {
    const tagName = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    if (role === 'button' || tagName === 'button') return 'button';
    if (role === 'link' || tagName === 'a') return 'link';
    if (tagName === 'input') {
      const inputType = (el as HTMLInputElement).type;
      if (['checkbox', 'radio', 'switch'].includes(inputType) || ['switch', 'checkbox', 'radio'].includes(role || '')) return 'toggle';
      return 'input';
    }
    if (tagName === 'textarea') return 'input'; // Treat textarea as input for typing
    if (tagName === 'select') return 'select';
    return tagName; // Fallback to tag name
  }

  private _getPossibleActions(el: HTMLElement): string[] {
    const actions: string[] = ['focus'];
    if (typeof (el as any).click === 'function') actions.push('click');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') actions.push('type');
    if ((el as HTMLInputElement).type === 'checkbox' || (el as HTMLInputElement).type === 'radio' || el.getAttribute('role') === 'switch' || el.getAttribute('aria-pressed')) actions.push('toggle');
    if (el.tagName === 'SELECT') actions.push('select_option');
    // Add 'zoom' if element has 'data-zoomable-content' or is an image/diagram container
    if (el.hasAttribute('data-zoomable-content') || ['IMG', 'SVG'].includes(el.tagName) || el.querySelector('svg')) {
      actions.push('zoom');
    }
    return actions;
  }

  private _getElementCurrentValue(el: HTMLElement): string | number | boolean | string[] | null {
    const inputEl = el as HTMLInputElement;
    const selectEl = el as HTMLSelectElement;
    if (inputEl.type === 'checkbox' || inputEl.type === 'radio') return inputEl.checked;
    if (el.getAttribute('aria-pressed')) return el.getAttribute('aria-pressed') === 'true';
    if (el.hasAttribute('aria-selected')) return el.getAttribute('aria-selected') === 'true';
    if (selectEl.options && typeof selectEl.selectedIndex !== 'undefined') {
      if(selectEl.multiple) {
        return Array.from(selectEl.selectedOptions).map(opt => opt.value);
      }
      return selectEl.value;
    }
    return inputEl.value || el.textContent?.trim() || null;
  }

  public async clickElement(target: string | HTMLElement): Promise<boolean> {
    const element = typeof target === 'string' ? this.getElementByTargetId(target) : target;
    if (element && typeof element.click === 'function') {
      this.highlightElement(element, 500, this.INTERACTION_HIGHLIGHT_CLASS);
      element.click();
      console.debug(`[UiInteractionService] Clicked:`, element);
      return true;
    }
    console.warn(`[UiInteractionService] Could not click target:`, target);
    return false;
  }

  public async focusElement(target: string | HTMLElement): Promise<boolean> {
    const element = typeof target === 'string' ? this.getElementByTargetId(target) : target;
    if (element && typeof element.focus === 'function') {
      element.focus();
      // Add a temporary visual focus indicator (can be a CSS class)
      this.highlightElement(element, 1500, this.FOCUS_HIGHLIGHT_CLASS);
      console.debug(`[UiInteractionService] Focused:`, element);
      return true;
    }
    console.warn(`[UiInteractionService] Could not focus target:`, target);
    return false;
  }

  public async typeIntoElement(target: string | HTMLElement, textToType: string, append: boolean = false, submitForm: boolean = false): Promise<boolean> {
    const element = (typeof target === 'string' ? this.getElementByTargetId(target) : target) as HTMLInputElement | HTMLTextAreaElement | null;
    if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
      await this.focusElement(element); // Ensure focus before typing
      await nextTick(); // Wait for focus to settle

      if (append) element.value += textToType;
      else element.value = textToType;

      element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      this.highlightElement(element, 700, this.INTERACTION_HIGHLIGHT_CLASS);
      console.debug(`[UiInteractionService] Typed "${textToType}" into:`, element);

      if (submitForm) {
        const form = element.closest('form');
        if (form && typeof form.requestSubmit === 'function') {
            form.requestSubmit();
        } else if (form && typeof form.submit === 'function') {
            form.submit();
        }
      }
      return true;
    }
    console.warn(`[UiInteractionService] Could not type into target:`, target);
    return false;
  }

  public async toggleElementState(target: string | HTMLElement, explicitState?: boolean): Promise<boolean> {
    const element = (typeof target === 'string' ? this.getElementByTargetId(target) : target) as HTMLInputElement | HTMLElement | null;
    if (!element) {
      console.warn(`[UiInteractionService] Could not find toggle target:`, target);
      return false;
    }
    this.highlightElement(element, 500, this.INTERACTION_HIGHLIGHT_CLASS);

    let changed = false;
    const currentChecked = (element as HTMLInputElement).checked;
    const currentPressed = element.getAttribute('aria-pressed');

    if (typeof (element as HTMLInputElement).checked === 'boolean') { // Standard checkbox/radio
      const newState = explicitState === undefined ? !currentChecked : explicitState;
      if (currentChecked !== newState) {
        (element as HTMLInputElement).checked = newState;
        changed = true;
      }
    } else if (currentPressed !== null) { // ARIA pressed
      const newState = explicitState === undefined ? !(currentPressed === 'true') : explicitState;
      if ((currentPressed === 'true') !== newState) {
        element.setAttribute('aria-pressed', newState.toString());
        changed = true;
      }
    }

    if (changed) {
      // Simulate a click as well, as many Vue components rely on @change or @click from the input itself
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      if (typeof (element as any).click === 'function') element.click();
      console.debug(`[UiInteractionService] Toggled state of:`, element);
      return true;
    }
    console.debug(`[UiInteractionService] State of target already as requested or not toggleable:`, element);
    return false; // No change made or not a known toggle type
  }

  public async selectOption(target: string | HTMLElement, optionMatcher: string, matchBy: 'value' | 'text' = 'value'): Promise<boolean> {
    const element = (typeof target === 'string' ? this.getElementByTargetId(target) : target) as HTMLSelectElement | null;
    if (!element || element.tagName !== 'SELECT') {
      console.warn(`[UiInteractionService] Target is not a select element:`, target);
      return false;
    }
    await this.focusElement(element);

    const options = Array.from(element.options);
    const optionToSelect = options.find(opt =>
      matchBy === 'value' ? opt.value === optionMatcher : (opt.textContent || '').trim() === optionMatcher
    );

    if (optionToSelect) {
      optionToSelect.selected = true;
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      this.highlightElement(element, 700, this.INTERACTION_HIGHLIGHT_CLASS);
      console.debug(`[UiInteractionService] Selected option "${optionMatcher}" in:`, element);
      return true;
    }
    console.warn(`[UiInteractionService] Option "${optionMatcher}" not found in select:`, target);
    return false;
  }

  public async scroll(options: {
    directionOrTarget: 'up' | 'down' | 'left' | 'right' | 'top' | 'bottom' | 'element';
    scrollableContainerId?: string;
    targetElementId?: string;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const { directionOrTarget, scrollableContainerId, targetElementId, behavior = 'smooth', block = 'center', inline = 'nearest' } = options;

    let scrollableElement: HTMLElement | Window = window;
    if (scrollableContainerId) {
      const el = this.getElementByTargetId(scrollableContainerId);
      if (el) scrollableElement = el;
      else console.warn(`[UiInteractionService] Scrollable container ID "${scrollableContainerId}" not found.`);
    }

    const viewportHeight = (scrollableElement === window) ? window.innerHeight : (scrollableElement as HTMLElement).clientHeight;
    const viewportWidth = (scrollableElement === window) ? window.innerWidth : (scrollableElement as HTMLElement).clientWidth;

    switch (directionOrTarget) {
      case 'up': scrollableElement.scrollBy({ top: -viewportHeight * 0.7, behavior }); break;
      case 'down': scrollableElement.scrollBy({ top: viewportHeight * 0.7, behavior }); break;
      case 'left': scrollableElement.scrollBy({ left: -viewportWidth * 0.7, behavior }); break;
      case 'right': scrollableElement.scrollBy({ left: viewportWidth * 0.7, behavior }); break;
      case 'top': scrollableElement.scrollTo({ top: 0, behavior }); break;
      case 'bottom':
        const scrollHeight = (scrollableElement === window) ? document.body.scrollHeight : (scrollableElement as HTMLElement).scrollHeight;
        scrollableElement.scrollTo({ top: scrollHeight, behavior });
        break;
      case 'element':
        if (targetElementId) {
          const targetEl = this.getElementByTargetId(targetElementId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior, block, inline });
            this.highlightElement(targetEl, 1000);
          } else {
            console.warn(`[UiInteractionService] Scroll target element ID "${targetElementId}" not found.`);
            return false;
          }
        } else {
          console.warn(`[UiInteractionService] 'targetElementId' required for 'element' scroll direction.`);
          return false;
        }
        break;
      default: return false;
    }
    console.debug(`[UiInteractionService] Scrolled:`, options);
    return true;
  }

  public async zoomElement(
    target: string | HTMLElement,
    zoomLevelOrDirection: 'in' | 'out' | 'reset' | number,
    step: number = 0.1,
    transformOrigin: string = 'center center'
  ): Promise<boolean> {
    const element = typeof target === 'string' ? this.getElementByTargetId(target) : target;
    if (!element) {
      console.warn(`[UiInteractionService] Zoom target not found:`, target);
      return false;
    }

    // Ensure element can be zoomed (e.g., has data-zoomable-content or is an image/SVG container)
    if (!element.hasAttribute('data-zoomable-content') && !['IMG', 'SVG'].includes(element.tagName) && !element.querySelector('svg')) {
        // If we want to allow zooming any element, remove this check.
        // For now, let's assume specific elements are marked as zoomable.
        // console.warn(`[UiInteractionService] Target element is not marked as zoomable:`, element);
        // return false;
    }


    let currentScale = parseFloat(element.dataset.currentZoom || '1');
    let newScale: number;

    if (typeof zoomLevelOrDirection === 'number') {
      newScale = Math.max(0.2, Math.min(5, zoomLevelOrDirection)); // Clamp between 20% and 500%
    } else {
      switch (zoomLevelOrDirection) {
        case 'in': newScale = Math.min(5, currentScale + step); break;
        case 'out': newScale = Math.max(0.2, currentScale - step); break;
        case 'reset': newScale = 1; break;
        default: return false;
      }
    }

    element.style.transformOrigin = transformOrigin;
    element.style.transform = `scale(${newScale})`;
    element.style.transition = 'transform 0.2s ease-out'; // Add transition for smoothness
    element.dataset.currentZoom = newScale.toString();

    this.highlightElement(element, 700);
    console.debug(`[UiInteractionService] Zoomed element to ${newScale}:`, element);
    return true;
  }

  public async getElementState(target: string | HTMLElement): Promise<string | number | boolean | string[] | null> {
    const element = typeof target === 'string' ? this.getElementByTargetId(target) : target;
    if (!element) return null;
    return this._getElementCurrentValue(element);
  }

  public highlightElement(
    target: string | HTMLElement,
    durationMs: number = 1500,
    highlightClass: string = 'voice-interaction-highlight'
  ): void {
    const element = typeof target === 'string' ? this.getElementByTargetId(target) : target;
    if (element) {
      element.classList.add(highlightClass);
      setTimeout(() => {
        element.classList.remove(highlightClass);
      }, durationMs);
    }
  }
}

/**
 * Singleton instance of the UiInteractionService.
 */
export const uiInteractionService: IUiInteractionService = new UiInteractionService();

// Add global CSS for highlight classes (e.g., in main.css or a global styles file)
/*
.voice-focused-element {
  outline: 3px solid var(--app-voice-focus-outline-color, var(--app-accent-color)) !important;
  box-shadow: 0 0 10px var(--app-voice-focus-shadow-color, rgba(var(--app-accent-rgb), 0.5)) !important;
  transition: outline 0.1s ease-out, box-shadow 0.1s ease-out;
}
.voice-interacted-element {
  outline: 3px solid var(--app-voice-interact-outline-color, var(--app-success-color)) !important;
  box-shadow: 0 0 8px var(--app-voice-interact-shadow-color, rgba(var(--app-success-rgb), 0.4)) !important;
  transition: outline 0.1s ease-out, box-shadow 0.1s ease-out;
}
.voice-interaction-highlight { // More generic highlight
  outline: 3px solid var(--app-highlight-color, var(--app-primary-color)) !important;
  outline-offset: 2px;
  box-shadow: 0 0 8px var(--app-highlight-shadow-color, rgba(var(--app-primary-rgb), 0.4)) !important;
  transition: outline 0.1s ease-out, box-shadow 0.1s ease-out;
}
*/