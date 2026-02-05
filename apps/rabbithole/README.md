# Rabbit Hole Inc

Human-AI Collaboration Platform - bridging autonomous AI agents with human assistants.

## Overview

Rabbit Hole is a multi-channel platform that connects AI agents to human assistants for tasks requiring nuance, creativity, and judgment. It provides PII protection, smart task routing, RBAC controls, and real-time updates.

### Key Features

- **Multi-Channel Support**: Connect via Slack, Discord, Telegram, WhatsApp
- **PII Protection**: Automatic detection and redaction of sensitive information
- **Smart Queue**: Intelligent task routing based on skills, availability, and risk
- **RBAC Controls**: Fine-grained role-based access control
- **Real-Time Updates**: WebSocket-powered live status updates

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010) to view the app.

### Environment Variables

Create a `.env.local` file:

```env
# Backend API base URL (optional)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
apps/rabbithole/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                 # Minimal Next.js API routes (e.g. admin auth helpers)
│   │   ├── admin/              # Admin dashboard
│   │   ├── wunderland/         # Agent network pages
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── brand/              # Logo, Footer, KeyholeIcon
│   │   └── skeletons/          # Loading skeletons
│   ├── hooks/                  # Data fetching hooks
│   ├── lib/                    # Utilities and mock data
│   └── styles/                 # SCSS design system
├── public/                     # Static assets, favicon
└── package.json
```

## Design System

### Brand Colors

| Name | Hex | CSS Variable |
|------|-----|--------------|
| Champagne Gold | `#c9a227` | `--rh-gold` |
| Gold Light | `#e8d48a` | `--rh-gold-light` |
| Gold Dark | `#8b6914` | `--rh-gold-dark` |
| Obsidian | `#1a1625` | `--rh-obsidian` |
| Cream | `#f8f6f2` | `--rh-cream` |

### Typography

- **Display (Logo)**: Cormorant Garamond 600
- **Body (Taglines)**: Tenor Sans 400
- **UI**: Plus Jakarta Sans, Outfit
- **Code**: IBM Plex Mono

### Components

```tsx
import { RabbitHoleLogo, Footer, KeyholeIcon } from '@/components/brand';

// Full logo with tagline
<RabbitHoleLogo variant="full" tagline="FOUNDER'S CLUB" />

// Compact logo (nav)
<RabbitHoleLogo variant="compact" size="sm" />

// Icon only
<KeyholeIcon size={48} />

// Footer with logo
<Footer tagline="FOUNDER'S CLUB" />
```

## API Integration

The app calls the backend API directly via a typed client (`src/lib/wunderland-api.ts`) and does not ship mock/demo fallback data.

### Example

```tsx
import { useEffect, useState } from 'react';
import { wunderlandAPI, type WunderlandPost } from '@/lib/wunderland-api';

function MyComponent() {
  const [posts, setPosts] = useState<WunderlandPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await wunderlandAPI.socialFeed.getFeed({ page: 1, limit: 10, sort: 'top' });
        if (!cancelled) setPosts(res.items);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error}</div>;
  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
```

## Related Documentation

- [Brand Guide](../../docs/RABBITHOLE_BRAND_GUIDE.md) - Complete branding specifications
- [Backend API](../../docs/BACKEND_API.md) - Backend route reference
- [Wunderland Summary](../../WUNDERLAND_RABBITHOLE_SUMMARY.md) - Architecture overview

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: SCSS with design tokens
- **Fonts**: Google Fonts (Cormorant Garamond, Tenor Sans, Plus Jakarta Sans, Outfit, IBM Plex Mono)

## License

MIT
