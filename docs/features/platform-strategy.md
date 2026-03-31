---
title: "Platform Strategy"
sidebar_position: 8
---

## Executive Summary

**Recommendation:** Use **graceful degradation** with platform-specific optimizations and automatic adapter selection.

```typescript
// Single API for all platforms
import { createDatabase } from '@framers/sql-storage-adapter';

const db = await createDatabase({ 
  priority: ['indexeddb', 'sqljs'],  // Auto-detects best adapter
});
```

---

## Platform Matrix: Pros & Cons

### 🌐 Web (Browser)

| Adapter | Pros | Cons | Best For |
|---------|------|------|----------|
| **IndexedDB** (NEW) | ✅ Native browser storage API<br>✅ Async, non-blocking<br>✅ 50MB-1GB+ quota<br>✅ sql.js wrapper (full SQL support)<br>✅ Persistent across sessions | ❌ Uses sql.js WASM (500KB load)<br>❌ IndexedDB quotas vary by browser<br>❌ Not a separate SQL engine (sql.js + IDB persistence) | **Primary choice** for web<br>Offline PWAs<br>Privacy-first apps |
| **sql.js** | ✅ Full SQLite in WASM<br>✅ In-memory fast reads<br>✅ Optional IDB persistence<br>✅ Zero dependencies | ❌ 500KB WASM load<br>❌ Slow writes to IDB<br>❌ Single-threaded | Fallback for web<br>Edge functions |
| **LocalStorage** | ✅ 5-10MB simple API | ❌ Synchronous (blocks UI)<br>❌ String-only<br>❌ No transactions | ❌ **NOT RECOMMENDED** |

**Winner:** **IndexedDB adapter** (sql.js + IndexedDB persistence wrapper)
- sql.js provides SQL execution (WASM SQLite)
- IndexedDB provides browser-native persistence (stores SQLite file as blob)
- Auto-save batching minimizes IDB overhead
- Works offline, respects privacy
- **Note:** This is sql.js with IndexedDB persistence, not a separate SQL engine

---

### 🖥️ Electron (Desktop)

| Adapter | Pros | Cons | Best For |
|---------|------|------|----------|
| **better-sqlite3** | ✅ **FASTEST** (native C++)<br>✅ Full SQLite features<br>✅ WAL mode for concurrency<br>✅ Synchronous API (no async overhead)<br>✅ Mature, battle-tested | ❌ Requires native compilation<br>❌ Must rebuild for Electron ABI<br>❌ Large binary (~5MB) | **Primary choice** for Electron<br>Production desktop apps |
| **sql.js** | ✅ No rebuild needed<br>✅ Cross-platform WASM | ❌ 3-5x slower than native<br>❌ Async overhead | Quick prototyping<br>CI/CD without build tools |
| **IndexedDB** | ✅ Available in Electron renderer | ❌ Slower than better-sqlite3<br>❌ Unnecessary abstraction | ❌ Use better-sqlite3 instead |

**Winner:** **better-sqlite3**
- Native performance is unbeatable for desktop
- Electron already handles native modules
- Fallback to sql.js if build fails

---

### 📱 Mobile (Capacitor: iOS/Android)

| Adapter | Pros | Cons | Best For |
|---------|------|------|----------|
| **@capacitor-community/sqlite** | ✅ **BEST** native SQLite on mobile<br>✅ iOS: Core Data integration<br>✅ Android: Native SQLite<br>✅ Encryption support<br>✅ Multi-threaded | ❌ Capacitor-specific<br>❌ Requires native plugins | **Primary choice** for mobile<br>Capacitor apps only |
| **IndexedDB** | ✅ Available in WebView<br>✅ Works without Capacitor | ❌ Slower than native<br>❌ Limited mobile quota<br>❌ Browser quirks on mobile | PWA-style mobile apps<br>Ionic without Capacitor |
| **sql.js** | ✅ Universal fallback | ❌ WASM overhead on mobile<br>❌ Battery drain | Emergency fallback only |

**Winner:** **@capacitor-community/sqlite** for Capacitor apps, **IndexedDB** for web-based mobile

---

### ☁️ Cloud (Node.js, Serverless)

| Adapter | Pros | Cons | Best For |
|---------|------|------|----------|
| **PostgreSQL** | ✅ **BEST** for multi-user<br>✅ Connection pooling<br>✅ JSONB, full-text search<br>✅ Horizontal scaling<br>✅ Cloud-native (RDS, Supabase, Neon) | ❌ Requires hosted DB<br>❌ Network latency<br>❌ Cost at scale | **Primary choice** for cloud<br>Multi-tenant SaaS<br>Real-time sync |
| **better-sqlite3** | ✅ Fast for single-user<br>✅ No external DB needed<br>✅ Simple deployment | ❌ File-based (hard to scale)<br>❌ No network access<br>❌ Single-writer limitation | Personal cloud instances<br>Dev/staging |
| **sql.js (ephemeral)** | ✅ Serverless edge (Cloudflare Workers)<br>✅ No cold start for DB | ❌ In-memory only<br>❌ State lost on restart | Stateless functions<br>Cache layer |

**Winner:** **PostgreSQL** for production, **better-sqlite3** for dev/staging

---

## Graceful Degradation Strategy

### Priority Cascade by Platform

```typescript
const PLATFORM_PRIORITIES: Record<Platform, AdapterKind[]> = {
  web: ['indexeddb', 'sqljs'],                    // NEW: IndexedDB first
  electron: ['better-sqlite3', 'sqljs'],          // Native first
  capacitor: ['capacitor', 'indexeddb', 'sqljs'], // Native mobile > WebView IDB
  node: ['better-sqlite3', 'postgres', 'sqljs'],  // Native > Cloud > WASM
  cloud: ['postgres', 'better-sqlite3', 'sqljs'], // Cloud-first
};
```

### Automatic Detection

```typescript
function detectPlatform(): Platform {
  if (typeof window !== 'undefined') {
    if (window.Capacitor?.isNativePlatform?.()) return 'capacitor';
    if (window.indexedDB) return 'web';
  }
  if (typeof process !== 'undefined') {
    if (process.versions?.electron) return 'electron';
    if (process.env.DATABASE_URL) return 'cloud';
    return 'node';
  }
  return 'unknown';
}
```

---

## Usage Examples

### Web Application
```typescript
import { IndexedDbAdapter } from '@framers/sql-storage-adapter';

const db = new IndexedDbAdapter({
  dbName: 'my-app-db',
  autoSave: true,
  saveIntervalMs: 5000,
});

await db.open();
await db.run('CREATE TABLE sessions (id TEXT PRIMARY KEY, data TEXT)');
```

### Desktop Application (Electron)
```typescript
import { createDatabase } from '@framers/sql-storage-adapter';
import path from 'path';

const db = await createDatabase({
  filePath: path.join(app.getPath('userData'), 'app.db'),
});

await db.open();
```

### Mobile Application (Capacitor)
```typescript
import { createDatabase } from '@framers/sql-storage-adapter';

const db = await createDatabase({
  priority: ['capacitor', 'indexeddb'],
});
```

### Cloud Application (Node.js)
```typescript
import { createDatabase } from '@framers/sql-storage-adapter';

const db = await createDatabase({
  postgres: { connectionString: process.env.DATABASE_URL },
});
```

---

## Summary Table

| Platform | Primary | Fallback | Notes |
|----------|---------|----------|-------|
| **Web** | IndexedDB | sql.js | Browser-native persistence |
| **Electron** | better-sqlite3 | sql.js | Native performance |
| **Capacitor** | capacitor | IndexedDB | Native mobile > WebView |
| **Node** | better-sqlite3 | Postgres | Local-first, cloud optional |
| **Cloud** | Postgres | better-sqlite3 | Multi-tenant requires Postgres |

**TL;DR:** Use IndexedDB for web, better-sqlite3 for desktop, capacitor for mobile, Postgres for cloud. The adapter automatically selects the best option based on your runtime environment.

