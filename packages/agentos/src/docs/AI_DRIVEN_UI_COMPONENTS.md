# 🚀 AI-Driven UI Components in Voice Chat Assistant

## 📋 Overview

The **Voice Chat Assistant** platform empowers its AI assistants (powered by the **AgentOS** framework) to go beyond text and voice responses by dynamically rendering rich UI components directly into the user's interface. This creates a highly contextual, adaptive, and interactive experience where AI can present information, tools, and visualizations in the most effective way possible.

This document outlines the principles, workflow, and development process for creating and integrating new Vue.js components that can be instantiated and managed by AI agents.

---

## 🔄 The Workflow: From AI Intent to Rendered UI

The process involves a coordinated effort between the backend AI agent and the frontend rendering engine:

### 1. 🧠 AI Agent Decides (Backend - AgentOS)
- Based on the conversation, user query, or its own task processing, an AI assistant (GMI) determines the need to display a specific UI element
- It formulates a `GMI_UIIntent`

### 2. 📄 Manifest Generation (Backend - AgentOS)
The core of the `GMI_UIIntent` is a `DynamicUIBlockManifest`. This JSON object describes the component to be rendered:

| Property | Description |
|----------|-------------|
| `blockId` | A unique ID for this instance of the UI block |
| `componentKey` | **String identifier** that maps to a registered frontend Vue component |
| `contentType` | Usually `'vue_component'` for these elements |
| `props` | Object containing properties to pass to the Vue component |
| `containerClasses` | *(Optional)* Tailwind CSS classes for styling the block's wrapper |
| `securityContext` | *(Optional)* Hints for frontend on sandboxing |

### 3. 🎯 Backend Orchestration (`UIActionOrchestratorService`)
- Validates the `GMI_UIIntent`
- Performs necessary security checks
- Transforms it into `FrontendUICommand` objects (typically with `actionType: 'RENDER_BLOCK'`)

### 4. 📡 Command Transmission to Frontend
- The `FrontendUICommand` is sent to the active user's frontend session
- Ideally via **WebSocket connection** for real-time updates
- **Endpoint:** `POST /api/v1/ui/commands`

### 5. 🎛️ Frontend Receives & Processes Command (`DynamicUiStore`)
- The frontend's `DynamicUiStore` (Pinia store) receives the `FrontendUICommand`
- Updates its state, adding the new block's definition to the appropriate layout slot

### 6. 📚 Frontend Component Registration (`componentRegistry.ts`)
- The `componentRegistry.ts` file holds a map where `componentKey` strings are associated with functions that dynamically import Vue component files
- **Example:** `'StockChartDisplay': () => import('@/features/finance/components/StockChartWidget.vue')`

### 7. 🎨 Frontend Dynamic Rendering
- **`DynamicLayoutSlot.vue`** components are placed in layouts and listen to the `DynamicUiStore`
- **`DynamicBlockRenderer.vue`** handles the actual rendering:
  - Uses `componentKey` to look up the async import function
  - Dynamically imports and renders the Vue component
  - Handles Markdown or sandboxed HTML if `contentType` requires it

---

## 🏗️ Designing AI-Instantiable Vue Components

To make a Vue component usable by AI agents through this system, follow these **state-of-the-art principles**:

### ⚙️ Props-Driven Architecture
- **All data, configuration, and major behavioral aspects MUST be controlled via props**
- AI agents interact with your component by providing values for these props
- Define props clearly using TypeScript interfaces for complex objects

### 📖 Clear Prop Schema (for AI Understanding)
While TypeScript defines props for development, the AI (LLM) needs a machine-readable schema provided via the backend's **Component Catalog** (`GET /api/v1/ui/component-catalog`).

**Example prop schema:**
```json
{
  "componentKey": "UserInfoCard",
  "propsSchema": [
    {
      "name": "userId",
      "type": "string",
      "required": true,
      "description": "The ID of the user to display."
    },
    {
      "name": "showAvatar",
      "type": "boolean",
      "default": true,
      "description": "Whether to display the user's avatar."
    },
    {
      "name": "themeVariant",
      "type": "string",
      "enum": ["compact", "full"],
      "default": "full",
      "description": "Visual variant of the card."
    }
  ]
}
```

### 🔒 Self-Contained Architecture
- Components can access global stores like `UiStore` for theme
- Avoid relying on complex, implicit global state that the AI isn't aware of
- Data specific to the component's instance should come via props

### 🎨 Theming
- Style components using CSS Custom Properties defined in `_variables.css`
- Ensure adaptation to theme classes:
  - `.theme-light`
  - `.theme-dark`
  - `.theme-holographic`

### ♿ Accessibility (A11y)
- Use semantic HTML
- Provide appropriate ARIA roles, states, and properties
- Ensure keyboard navigability for interactive elements

### 🎤 Voice Navigability
Add `data-voice-target="unique-sub-id"` attributes to key interactive elements:

**Example:** If AI renders component with `blockId: "user-card-xyz"`, an internal button could be `data-voice-target="user-card-xyz-action-button"`

### 🔌 Slots & Events (Optional)
- **Slots:** Use named slots (`<slot name="actions" />`) for AI to inject nested content
- **Emits:** Define events for actions the system needs to know about (e.g., "form-submitted", "item-selected")

---

## 📝 Registering Your Component (Frontend)

### Step 1: Create Your Vue Component
```
frontend/src/features/custom_widgets/components/MyAICustomWidget.vue
```

### Step 2: Add to Registry
Open `frontend/src/components/dynamic/componentRegistry.ts`:

```typescript
// frontend/src/components/dynamic/componentRegistry.ts
import type { Component, DefineComponent } from 'vue';
type ComponentLoader = () => Promise<DefineComponent<any, any, any> | { default: DefineComponent<any, any, any> }>;

export const componentRegistry: Record<string, ComponentLoader | Component> = {
  // ... existing components ...
  'MyAICustomWidgetKey': () => import('@/features/custom_widgets/components/MyAICustomWidget.vue'),
  // Ensure the key is unique and descriptive for AI use.
};
```

> **Important:** `MyAICustomWidgetKey` is the string the AI agent will use in its `DynamicUIBlockManifest.componentKey`

---

## 🤖 Making the AI Aware: The Backend Component Catalog

For an AI agent (LLM) to effectively use your new component, it needs to know:
- ✅ That the component exists (via its `componentKey`)
- ✅ What props it accepts, their types, requirements, and descriptions
- ✅ What slots it provides (if any)
- ✅ What events it might emit (if any)

This information is exposed by the backend via the **`GET /api/v1/ui/component-catalog`** endpoint.

### Updating the Catalog (Backend Task)

#### Option 1: Manual JSON Manifest *(Recommended for Start)*
Maintain a JSON file on the backend that lists each `componentKey` with detailed schemas.

#### Option 2: Automated Generation *(Advanced)*
Implement a build-time script that:
- Parses frontend Vue components
- Extracts prop definitions from `defineProps`
- Reads JSDoc comments for descriptions and metadata
- Generates the JSON catalog automatically

### Example Component Catalog Entry

```json
[
  {
    "componentKey": "MyAICustomWidgetKey",
    "displayName": "My AI Custom Widget",
    "description": "Displays custom information X and allows action Y.",
    "propsSchema": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "description": "The main title to display on the widget."
      },
      {
        "name": "itemCount",
        "type": "number",
        "required": false,
        "default": 0,
        "description": "Number of items to show."
      },
      {
        "name": "colorScheme",
        "type": "string",
        "enum": ["blue", "green", "purple"],
        "default": "blue",
        "description": "Visual color scheme for the widget."
      }
    ],
    "slots": [
      {
        "name": "actions",
        "description": "Optional slot for action buttons related to the widget."
      }
    ],
    "emits": [
      {
        "name": "widget-action-taken",
        "payloadType": "{ actionId: string, value?: any }",
        "description": "Emitted when an internal action within the widget is performed."
      }
    ]
  }
]
```

---

## 🎯 Agent Logic for Requesting Components

Within your AgentOS GMI/Persona TypeScript code:

```typescript
// Inside a GMI method or tool
const manifest: DynamicUIBlockManifest = {
  blockId: `my-widget-${Date.now()}`, // Generate a unique ID
  componentKey: 'MyAICustomWidgetKey',
  contentType: 'vue_component',
  props: {
    title: "Real-time System Metrics",
    itemCount: 5,
    colorScheme: 'green',
    // other props as defined by MyAICustomWidgetKey
  },
  containerClasses: 'p-4 shadow-lg rounded-lg', // Optional styling
};

const uiIntent: GMI_UIIntent = {
  gmiInstanceId: this.id, // GMI's ID
  personaId: this.persona.id,
  manifest: manifest,
  contentString: '', // Not used if contentType is 'vue_component'
  targetPlacementHint: 'dashboard-slot-1', // Hint for frontend
};

// This intent would then be processed by UIActionOrchestratorService
// and result in a FrontendUICommand sent to the client.
```

---

## 💡 Example: Simple AI-Instantiable Info Card Component

### Vue Component (`SimpleInfoCard.vue`)

```vue
<template>
  <AppCard
    :title="title"
    :variant="cardVariant"
    class="simple-info-card"
    :data-voice-target="voiceTargetId"
    :voice-target-id-prefix="voiceTargetId + '-'"
  >
    <p class="info-content" :data-voice-target="voiceTargetId + '-content'">
      {{ content }}
    </p>
    <div v-if="details" class="info-details" :data-voice-target="voiceTargetId + '-details'">
      <small>{{ details }}</small>
    </div>
    <template #footer v-if="actionLabel">
      <AppButton
        variant="primary"
        size="sm"
        :label="actionLabel"
        @click="handleAction"
        :data-voice-target="voiceTargetId + '-action-button'"
      />
    </template>
  </AppCard>
</template>

<script setup lang="ts">
/**
 * @file SimpleInfoCard.vue
 * @description A simple, AI-instantiable card to display information with optional action.
 * @property {string} blockId - Unique ID for this block instance
 * @property {string} title - The title of the card (Required)
 * @property {string} content - The main content of the card (Required)
 * @property {string} [details] - Optional smaller text details
 * @property {string} [actionLabel] - Label for optional action button
 * @property {'elevated'|'outlined'|'flat'} [cardVariant='elevated'] - Visual variant
 * @emits widget-action - Emitted when action button is clicked
 */
import { computed, PropType } from 'vue';
import AppCard from '../../common/AppCard.vue';
import AppButton from '../../common/AppButton.vue';

const props = defineProps({
  blockId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  details: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  cardVariant: {
    type: String as PropType<'elevated' | 'outlined' | 'flat'>,
    default: 'elevated',
  },
});

const emit = defineEmits<{
  (e: 'widget-action', payload: { blockId: string, action: string, data?: any }): void;
}>();

const voiceTargetId = computed(() => `simple-info-card-${props.blockId}`);

const handleAction = () => {
  emit('widget-action', { blockId: props.blockId, action: 'default_action' });
};
</script>

<style scoped>
.info-content {
  font-size: var(--app-font-size-base);
  color: var(--app-text-color);
  margin-bottom: var(--space-2);
  line-height: 1.6;
}

.info-details {
  font-size: var(--app-font-size-sm);
  color: var(--app-text-muted-color);
  margin-top: var(--space-3);
  border-top: 1px dashed var(--app-border-color-light);
  padding-top: var(--space-3);
}

/* Holographic theme adaptations */
.theme-holographic .info-content { 
  color: var(--holographic-text-primary); 
}

.theme-holographic .info-details {
  color: var(--holographic-text-muted);
  border-top-color: var(--holographic-border-very-subtle);
}
</style>
```

### Component Registry Entry

```typescript
// File: frontend/src/components/dynamic/componentRegistry.ts
export const componentRegistry = {
  // ... existing entries ...
  'SimpleInfoCard': () => import('./common/SimpleInfoCard.vue'),
  // ...
};
```

### Backend Component Catalog Entry

```json
[
  {
    "componentKey": "SimpleInfoCard",
    "displayName": "Simple Information Card",
    "description": "Displays a title, main content, optional details, and an optional action button.",
    "propsSchema": [
      {
        "name": "blockId",
        "type": "string",
        "required": true,
        "description": "Unique ID for this instance (usually provided by system)."
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "description": "The card's title."
      },
      {
        "name": "content",
        "type": "string",
        "required": true,
        "description": "Main textual content."
      },
      {
        "name": "details",
        "type": "string",
        "required": false,
        "description": "Smaller, secondary text."
      },
      {
        "name": "actionLabel",
        "type": "string",
        "required": false,
        "description": "Label for the action button. If provided, button is shown."
      },
      {
        "name": "cardVariant",
        "type": "string",
        "enum": ["elevated", "outlined", "flat"],
        "default": "elevated",
        "description": "Visual style of the card."
      }
    ],
    "emits": [
      {
        "name": "widget-action",
        "payloadType": "{ blockId: string, action: 'default_action' }",
        "description": "Emitted when the action button is clicked."
      }
    ]
  }
]
```

---

## 🔐 Security for Dynamically Rendered Content

| Content Type | Security Level | Implementation |
|--------------|----------------|----------------|
| `vue_component` | **Trusted** | Components from `componentRegistry` are first-party code |
| `markdown_string` | **Sanitize** | Use DOMPurify after `marked.parse()` |
| `html_fragment_string` | **High Risk** | Sandboxed `<iframe>` or aggressive DOMPurify |
| `simple_js_function_string` | **Very High Risk** | Web Workers or specialized JS sandboxing |

### Security Guidelines

- **🔒 Strictest Approach:** Sandboxed `<iframe>` with strong `sandbox` attribute
- **⚠️ DOMPurify Option:** For HTML without scripts, aggressively sanitize
- **🚨 JavaScript Execution:** Use Web Workers for isolation, communicate via `postMessage`
- **✅ Preferred Method:** AI should request pre-defined `vue_components` over raw JS

---

## 🎉 Conclusion

By following these guidelines, you can build a powerful and extensible system where AI assistants actively participate in crafting the user interface, making your **Voice Chat Assistant** truly state-of-the-art.

The combination of:
- 🧠 **Smart AI decision-making**
- 🎨 **Dynamic component rendering**
- 🔒 **Robust security measures**
- ♿ **Accessibility compliance**
- 🎤 **Voice navigation support**

Creates an unprecedented level of adaptive, intelligent user interfaces that respond to context and user needs in real-time.