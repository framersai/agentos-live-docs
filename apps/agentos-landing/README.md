# AgentOS Landing (agentos.sh)

Next.js + Tailwind marketing surface for the AgentOS runtime. This site is designed to live at `agentos.sh` and mirrors the Frame.dev aesthetic with light/dark theming, motion highlights, and roadmap callouts.

## Features

- App Router (Next 14) with server components + streaming-ready sections  
- Tailwind design system with utility helpers, glassmorphism treatment, and dark mode (`next-themes`)  
- Framer Motion animations on hero content  
- Lucide iconography and responsive layout tuned for product storytelling  
- Ready-to-link CTAs into GitHub, documentation, and marketing pipelines

## Commands

```bash
pnpm dev      # start Next dev server
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # Next lint rules
pnpm typecheck
```

## Structure

- `app/page.tsx` – primary landing experience  
- `components/` – client-side helpers like the theme toggle provider  
- `tailwind.config.ts` – shared tokens (brand palette, glass shadow, etc.)

The landing site is intentionally decoupled from the proprietary Voice Chat Assistant frontend so it can be published or deployed independently.
