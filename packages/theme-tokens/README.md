# @framers/theme-tokens

Shared design tokens (CSS custom properties) and a minimal theme helper for all AgentOS apps.

> Private: Internal-only. Do not publish to npm or mirror to public GitHub repos.
> The package.json has `"private": true` to prevent accidental publishes.

## What this gives you

- A small `tokens.css` file that defines a consistent variable contract (backgrounds, text, accent, borders, states, focus ring).
- A framework-agnostic helper (`src/theme.ts`) to set `html[data-theme]`, toggle `html.dark`, and update `color-scheme`.
- Works with:
  - Atomic CSS (Tailwind) via `hsl(var(--token) / <alpha-value>)`
  - SCSS pipelines that write the same variables under `html[data-theme="..."]`

## Install (workspace)

Add dependency in each app:

```json
{
  "dependencies": {
    "@framers/theme-tokens": "workspace:*"
  }
}
```

Then import the CSS once at app entry:

```ts
// Next.js (app/layout.tsx)
import "@framers/theme-tokens/css/tokens.css";

// Vue (src/main.ts)
import "@framers/theme-tokens/css/tokens.css";

// React/Vite (src/main.tsx)
import "@framers/theme-tokens/css/tokens.css";
```

## Theme switching

Use your existing theme definitions per app and call the helper to sync dark mode and color-scheme:

```ts
import { applyThemeAttributes } from "@framers/theme-tokens/src/theme";

applyThemeAttributes("sakura-sunset", { isDark: true });
```

Your CSS/SCSS should provide variables for each theme:

```css
html[data-theme="sakura-sunset"] {
  --bg-primary: hsl(...);
  --text-primary: hsl(...);
  --accent-primary-h: 335;
  --accent-primary-s: 80%;
  --accent-primary-l: 72%;
  /* ... */
}
```

## Tailwind usage (optional preset)

Point Tailwind colors to tokens (example inside app tailwind.config):

```js
extend: {
  colors: {
    accent: {
      DEFAULT: "hsl(var(--accent-primary-h) var(--accent-primary-s) var(--accent-primary-l) / <alpha-value>)"
    },
    base: {
      100: "var(--bg-primary)",
      200: "var(--bg-secondary)",
      300: "var(--bg-tertiary)"
    },
    text: {
      base: "var(--text-primary)",
      muted: "var(--text-muted)"
    },
    border: {
      DEFAULT: "var(--border-primary)",
      subtle: "var(--border-subtle)"
    }
  }
}
```

Keep SCSS-driven themes in the Vue app if preferred—just ensure it outputs the same variable names.

