// backend/services/ui_action_orchestration/UIActionOrchestratorService.ts
import {
  IUIActionOrchestratorService,
  GMI_UIIntent,
  FrontendUICommand,
  DynamicUIBlockManifest,
} from './IUIActionOrchestratorService.js';
import { v4 as uuidv4 } from 'uuid';
// For sanitization, you would use libraries like DOMPurify (if HTML is allowed directly)
// or specialized parsers/validators for JS/Vue component options.
// import DOMPurify from 'dompurify'; (Example, setup would be needed for Node.js env)

export class UIActionOrchestratorService implements IUIActionOrchestratorService {
  // In the future, this might take UtilityLLMService for parsing natural language UI requests
  constructor() {
    // console.log("UIActionOrchestratorService initialized.");
  }

  /**
   * @inheritdoc
   */
  async processGMI_UIIntent(intent: GMI_UIIntent, userId: string): Promise<FrontendUICommand[]> {
    if (!intent || !intent.manifest || !intent.contentString) {
      throw new Error('Invalid GMI_UIIntent: manifest and contentString are required.');
    }

    const { manifest, contentString } = intent;

    // Basic structural validation of the manifest
    if (!manifest.blockId || !manifest.contentType) {
      throw new Error('Invalid DynamicUIBlockManifest: blockId and contentType are required.');
    }

    // **Conceptual Sanitization & Validation Step**
    // This is where more advanced checks would go based on contentType.
    // For 'html_fragment': DOMPurify.sanitize(contentString);
    // For 'vue_component_options_string': Attempt to parse as JS object, validate structure.
    // For 'simple_js_function_string': Use a JS parser (like Esprima/Acorn) to validate syntax,
    //                                 and potentially static analysis for unsafe patterns.
    // For now, we assume the content is passed through but flagged for sandboxing.
    let sanitizedContentString = contentString; // Placeholder for actual sanitization
    let securityContext: FrontendUICommand['securityContext'] = 'SANDBOXED_IFRAME'; // Default to strictest

    switch (manifest.contentType) {
      case 'markdown_string':
        // Markdown is relatively safe to render if the frontend uses a good parser
        // that sanitizes HTML output (e.g., 'marked' with sanitize option).
        securityContext = 'NONE'; // Assuming frontend markdown renderer is safe
        break;
      case 'html_fragment':
        // Potentially dangerous. Frontend must use DOMPurify or iframe.
        // sanitizedContentString = DOMPurify.sanitize(contentString); // Example
        securityContext = 'SANDBOXED_IFRAME'; // Safer default
        break;
      case 'vue_component_options_string':
      case 'simple_js_function_string':
        // These definitely need sandboxing.
        // Further validation could check for known unsafe JS patterns if not using a full sandbox.
        securityContext = 'SANDBOXED_IFRAME'; // Or a more sophisticated WebComponent sandbox
        break;
      default:
        throw new Error(`Unsupported contentType in manifest: ${manifest.contentType}`);
    }

    // Transform into a FrontendUICommand
    // For now, we only handle RENDER_DYNAMIC_BLOCK from a GMI_UIIntent
    const command: FrontendUICommand = {
      commandId: uuidv4(),
      actionType: 'RENDER_DYNAMIC_BLOCK',
      payload: {
        manifest: manifest, // The GMI-provided manifest
        content: sanitizedContentString, // The (conceptually) sanitized content
      },
      securityContext: securityContext,
      targetElementId: intent.targetPlacementHint || 'default_dynamic_ui_slot', // Frontend needs to define these slots
      timestamp: new Date().toISOString(),
    };

    return [command]; // For now, one intent leads to one render command. Could be multiple.
  }
}