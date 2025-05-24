// File: frontend/src/types/ui.types.ts (Ensure these additions/updates)

/**
 * Defines the available themes for the application.
 * These correspond to CSS classes or sets of CSS custom properties.
 * @enum {string} AppTheme
 */
export enum AppTheme {
  LIGHT = 'theme-light',
  DARK = 'theme-dark',
  HOLOGRAPHIC = 'theme-holographic',
}

/**
 * Represents the properties for a modal to be displayed via the UiStore.
 * @interface UiModal
 */
export interface UiModal<P = Record<string, any>> {
  /** A unique identifier for this modal instance. */
  id: string;
  /** The Vue component to be rendered as the modal's content. */
  component: any; // Use `DefineComponent` or `Component` from 'vue' for stricter typing
  /** Props to be passed to the modal content component. */
  props?: P;
  /** Indicates if the modal is currently open. Typically managed by the store. */
  isOpen: boolean;
  /** Optional: Title for the modal header. */
  title?: string;
  /** Optional: Configuration for modal appearance and behavior. */
  options?: {
    /** Prevents closing the modal by clicking the overlay or pressing Escape. */
    persistent?: boolean;
    /** Custom CSS class for the modal dialog. */
    dialogClass?: string;
    /** Maximum width of the modal. */
    maxWidth?: string; // e.g., '500px', '80vw'
  };
}

/**
 * Defines the types of notifications (toasts).
 * @enum {string} AppNotificationType
 */
export enum AppNotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * Represents the properties for a notification (toast) message.
 * @interface UiNotification
 */
export interface UiNotification {
  /** A unique identifier for this notification instance. */
  id: number;
  /** The main message content of the notification. */
  message: string;
  /** Optional: A title for the notification. */
  title?: string;
  /** The type of notification, influencing its appearance. */
  type: AppNotificationType;
  /**
   * Duration in milliseconds for how long the notification should be visible.
   * Set to 0 or undefined for a persistent notification that requires manual dismissal.
   */
  duration?: number;
  /** Optional: Icon component or name to display. */
  icon?: string | any; // `string` for icon name, `any` for Vue component
  /** Optional: Actions the user can take within the notification. */
  actions?: Array<{ label: string; onClick: () => void }>;
}

// Dynamic UI types (from previous turn, ensure they are here or imported)
/**
 * Represents the structure of a UI command received from the backend.
 */
export interface UiCommand {
  commandId: string;
  actionType: 'RENDER_BLOCK' | 'UPDATE_BLOCK' | 'REMOVE_BLOCK' | 'SHOW_MODAL' | 'NOTIFICATION';
  targetSlotId?: string;
  blockId?: string;
  payload: any;
  securityContext?: 'SANDBOXED_IFRAME' | 'TRUSTED_WEB_COMPONENT' | 'NONE';
  timestamp: string;
}

/**
 * Manifest for a dynamically renderable UI block.
 */
export interface DynamicBlockManifest {
  blockId: string;
  componentKey: string;
  name?: string;
  description?: string;
  props?: Record<string, any>;
  contentType?: 'vue_component' | 'html_fragment_string' | 'markdown_string' | 'simple_js_function_string';
  contentString?: string;
  containerClasses?: string;
  interface?: {
    props?: Array<{ name: string, type: string }>;
    emits?: Array<{ name: string, payloadType?: string }>;
  };
  // Add a securityContext field here if it should be part of the manifest itself
  // rather than only on the UiCommand. This depends on whether the backend or agent dictates it.
  // For now, assuming UiCommand carries the definitive securityContext for rendering.
}

/**
 * Payload for the 'RENDER_BLOCK' UiCommand.
 */
export interface RenderBlockPayload {
  manifest: DynamicBlockManifest;
}

/**
 * Describes an interactable UI element for voice navigation or AI interaction.
 */
export interface InteractableElement {
  id: string; // `data-voice-target` value
  label: string; // `aria-label` or text content
  role?: string; // ARIA role
  type?: 'button' | 'link' | 'input' | 'toggle' | 'select' | 'custom' | string; // Element type hint
  elementRef?: HTMLElement; // Optional direct reference
  actions?: string[]; // e.g., ['click', 'focus', 'type']
  currentValue?: string | boolean | number; // For inputs or toggles
  isVisible?: boolean; // Whether the element is currently visible and interactable
  options?: Array<{label: string, value: string}>; // For select elements
}