<div align="center">
  <img src="../../logos/openstrand-logo.svg" alt="OpenStrand Features" width="150">

# OpenStrand Features

**Complete feature guide and documentation**

</div>

---

## 📝 Knowledge Capture

### Universal Import

OpenStrand can import from 20+ sources, preserving structure and metadata.

#### Supported Formats

| Format | Extension | Features Preserved |
|--------|-----------|-------------------|
| Markdown | .md | Links, tags, frontmatter |
| Notion | .html, .csv | Databases, relations, properties |
| Obsidian | Vault folder | Plugins data, graph structure |
| Roam Research | .json | Block refs, queries |
| Org-mode | .org | TODO states, properties |
| OneNote | .one | Sections, notebooks |
| Evernote | .enex | Tags, notebooks, attachments |
| Apple Notes | Via API | Folders, attachments |
| Google Docs | Via API | Comments, suggestions |
| PDF | .pdf | Annotations, bookmarks |
| Word | .docx | Styles, comments |
| Plain Text | .txt | Basic import |
| HTML | .html | Structure, links |
| OPML | .opml | Outline structure |
| JSON | .json | Structured data |
| CSV | .csv | Tabular data |
| Images | .jpg, .png | EXIF data, OCR |
| Audio | .mp3, .m4a | Transcription |
| Video | .mp4, .mov | Transcription, keyframes |
| Web Pages | URL | Clean article extraction |

#### Import Example

```typescript
// Batch import with progress tracking
const importer = openstrand.createImporter();

importer.on('progress', (progress) => {
  console.log(`Importing: ${progress.current}/${progress.total}`);
});

importer.on('error', (error) => {
  console.error(`Import error: ${error.file} - ${error.message}`);
});

const results = await importer.import({
  sources: [
    { path: './obsidian-vault', format: 'obsidian' },
    { path: './notion-export.zip', format: 'notion' },
    { path: './pdfs/*.pdf', format: 'pdf' }
  ],
  options: {
    preserveStructure: true,
    extractImages: true,
    generateEmbeddings: true,
    deduplication: 'content-hash'
  }
});
```

### Smart Capture

#### Quick Capture

```typescript
// Global hotkey: Cmd+Shift+O
const capture = await openstrand.quickCapture({
  content: 'Meeting notes from discussion with team',
  tags: ['meeting', 'team'],
  loom: 'work-notes'
});

// With AI enhancement
const enhanced = await capture.enhance({
  generateSummary: true,
  extractTasks: true,
  suggestLinks: true
});
```

#### Web Clipper

```typescript
// Browser extension API
const clip = await openstrand.clipWeb({
  url: 'https://example.com/article',
  options: {
    fullPage: false,
    simplify: true,
    preserveFormatting: false,
    extractMetadata: true
  }
});
```

#### Voice Notes

```typescript
// Record and transcribe
const voice = await openstrand.recordVoice();

voice.on('transcribing', () => {
  console.log('Transcribing audio...');
});

const strand = await voice.save({
  enhanceTranscription: true,
  generateSummary: true,
  detectSpeakers: true
});
```

## 🔍 Search & Discovery

### Semantic Search

Find information by meaning, not just keywords.

```typescript
// Natural language search
const results = await vault.search('ideas about quantum computing', {
  // Search modes
  mode: 'semantic', // 'keyword', 'hybrid'
  
  // Filtering
  filters: {
    looms: ['physics', 'research'],
    tags: ['quantum'],
    dateRange: { from: '2024-01-01' },
    contentTypes: ['text/markdown', 'application/pdf']
  },
  
  // Options
  includeArchived: false,
  searchContent: true,
  searchTitles: true,
  limit: 20
});

// Results include relevance explanation
results.items.forEach(item => {
  console.log(`${item.title} (${item.score})`);
  console.log(`Relevant because: ${item.explanation}`);
  console.log(`Matching excerpts: ${item.highlights}`);
});
```

### Advanced Queries

```typescript
// Query DSL
const query = vault.query()
  .where('contentType', 'equals', 'text/markdown')
  .and(q => q
    .where('tags', 'contains', 'important')
    .or('title', 'matches', /^Project/)
  )
  .orderBy('modified', 'desc')
  .limit(50);

const results = await query.execute();

// Graph queries
const connected = await vault.graph()
  .from('strand-id')
  .follow('links', { types: ['related', 'references'] })
  .depth(3)
  .where('tags', 'contains', 'quantum')
  .execute();
```

### Smart Suggestions

```typescript
// Real-time suggestions as you type
const suggester = vault.createSuggester();

suggester.on('typing', async (text) => {
  const suggestions = await suggester.suggest(text, {
    links: true,      // Suggest relevant links
    tags: true,       // Suggest tags based on content
    completions: true // AI-powered text completion
  });
  
  return suggestions;
});

// Discover related content
const related = await strand.findRelated({
  method: 'embedding', // 'keywords', 'citations'
  limit: 10,
  threshold: 0.7
});
```

## 🧠 AI Features

### AI Assistant

Context-aware chat that understands your knowledge base.

```typescript
// Chat with your knowledge
const chat = vault.createChat();

const response = await chat.send('Explain the key concepts from my quantum physics notes', {
  // Context selection
  context: {
    looms: ['physics'],
    timeRange: 'last-month',
    includeRelated: true
  },
  
  // Response options
  style: 'academic', // 'casual', 'technical', 'eli5'
  maxTokens: 1000,
  temperature: 0.7
});

// Multi-turn conversation
await chat.send('Can you create a study guide from these concepts?');

// Export conversation
const history = await chat.export('markdown');
```

### Content Generation

```typescript
// AI-powered writing assistance
const writer = strand.createWriter();

// Continue writing
const continuation = await writer.continue({
  length: 'paragraph', // 'sentence', 'section'
  style: 'match', // 'formal', 'casual', 'academic'
  creativity: 0.7
});

// Rewrite selection
const rewritten = await writer.rewrite(selectedText, {
  goal: 'clarify', // 'simplify', 'expand', 'formalize'
  preserveMeaning: true
});

// Generate from template
const generated = await vault.generate({
  template: 'meeting-notes',
  variables: {
    date: '2024-11-15',
    attendees: ['Alice', 'Bob'],
    topics: ['Q4 Planning']
  }
});
```

### Knowledge Synthesis

```typescript
// Synthesize insights across strands
const synthesis = await vault.synthesize({
  question: 'What are the main themes in my research?',
  sources: {
    looms: ['research', 'papers'],
    minScore: 0.6
  },
  output: {
    format: 'report', // 'summary', 'bullets', 'mindmap'
    sections: ['overview', 'key-findings', 'connections', 'gaps']
  }
});

// Generate knowledge graph insights
const insights = await vault.analyzeGraph({
  metrics: ['centrality', 'clusters', 'bridges'],
  visualize: true
});
```

## 📊 Knowledge Graph

### Interactive Visualization

```typescript
// 3D knowledge graph
const graph = vault.createGraph({
  renderer: 'three.js', // 'force-graph', 'd3'
  dimensions: 3,
  
  // Visual customization
  nodeColors: {
    byProperty: 'contentType',
    scheme: 'category10'
  },
  
  nodeSize: {
    byProperty: 'connections',
    scale: 'log'
  },
  
  // Interaction
  physics: {
    charge: -300,
    linkDistance: 50,
    gravity: 0.1
  },
  
  // Filtering
  filters: {
    minConnections: 2,
    looms: ['selected'],
    timeRange: 'last-year'
  }
});

// Graph events
graph.on('nodeClick', (node) => {
  vault.openStrand(node.id);
});

graph.on('nodeHover', (node) => {
  graph.highlightConnections(node);
});
```

### Graph Analysis

```typescript
// Find important nodes
const important = await vault.graph.analyze({
  metrics: {
    pageRank: true,
    betweenness: true,
    clustering: true
  },
  top: 20
});

// Discover communities
const communities = await vault.graph.detectCommunities({
  algorithm: 'louvain', // 'label-propagation'
  minSize: 5
});

// Find shortest path
const path = await vault.graph.shortestPath(
  'strand-id-1',
  'strand-id-2',
  { maxLength: 5 }
);
```

## 🔄 Sync & Collaboration

### Selective Sync

```typescript
// Configure sync rules
await vault.configureSynd({
  // Inclusion rules
  include: {
    looms: ['shared', 'public'],
    tags: ['sync']
  },
  
  // Exclusion rules
  exclude: {
    tags: ['private', 'local-only'],
    contentTypes: ['application/pdf'] // Large files
  },
  
  // Encryption
  encryption: {
    enabled: true,
    method: 'e2e', // End-to-end
    keyDerivation: 'argon2id'
  },
  
  // Conflict resolution
  conflictResolution: 'manual', // 'latest-wins', 'merge'
  
  // Sync interval
  interval: 300 // seconds
});
```

### Real-time Collaboration

```typescript
// Create shared workspace
const workspace = await vault.createWorkspace('Team Research', {
  members: ['alice@example.com', 'bob@example.com'],
  permissions: {
    alice: 'admin',
    bob: 'editor'
  }
});

// Real-time presence
workspace.on('presence', (presence) => {
  console.log(`${presence.user} is editing ${presence.strand}`);
});

// Collaborative editing
const session = await workspace.joinEditSession('strand-id');

session.on('change', (change) => {
  // CRDT-based conflict-free editing
  editor.applyChange(change);
});
```

## 🎨 Customization

### Themes

```typescript
// Apply theme
await openstrand.setTheme({
  name: 'midnight',
  colors: {
    background: '#0a0a0a',
    foreground: '#e0e0e0',
    primary: '#7c3aed',
    secondary: '#10b981'
  },
  fonts: {
    ui: 'Inter',
    editor: 'JetBrains Mono',
    serif: 'Crimson Text'
  }
});

// Custom CSS
await openstrand.injectCSS(`
  .strand-title {
    font-size: 1.5rem;
    font-weight: 600;
  }
`);
```

### Plugins

```typescript
// Install plugin
await openstrand.plugins.install('@community/citation-manager');

// Configure plugin
await openstrand.plugins.configure('citation-manager', {
  style: 'apa',
  autoFormat: true
});

// Create custom plugin
const myPlugin = {
  id: 'my-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',
  
  activate(context) {
    // Register command
    context.registerCommand({
      id: 'my-plugin.hello',
      title: 'Say Hello',
      execute: () => alert('Hello from plugin!')
    });
    
    // Add UI element
    context.ui.statusBar.add({
      text: 'My Plugin',
      tooltip: 'Click for options',
      onClick: () => this.showOptions()
    });
  }
};

await openstrand.plugins.register(myPlugin);
```

### Workflows

```typescript
// Create custom workflow
const workflow = await vault.createWorkflow({
  name: 'Daily Review',
  triggers: {
    schedule: '0 9 * * *', // 9 AM daily
    manual: true
  },
  
  steps: [
    {
      action: 'query',
      params: {
        filter: 'modified:today',
        sort: 'modified:desc'
      }
    },
    {
      action: 'generate',
      params: {
        template: 'daily-summary',
        output: 'daily-notes'
      }
    },
    {
      action: 'notify',
      params: {
        message: 'Daily review ready'
      }
    }
  ]
});
```

## 🔐 Privacy & Security

### Encryption

```typescript
// Local vault encryption
await vault.enableEncryption({
  method: 'xchacha20-poly1305',
  keyDerivation: {
    algorithm: 'argon2id',
    iterations: 3,
    memory: 64 * 1024, // 64MB
    parallelism: 2
  }
});

// Encrypt specific strands
await strand.encrypt({
  password: 'strong-password',
  hint: 'First pet name + birth year'
});

// Secure sharing
const shareLink = await strand.share({
  expiresIn: '7d',
  password: 'share-password',
  permissions: ['read'],
  maxViews: 10
});
```

### Access Control

```typescript
// Fine-grained permissions
await loom.setPermissions({
  public: false,
  users: {
    'alice@example.com': ['read', 'write'],
    'bob@example.com': ['read']
  },
  groups: {
    'research-team': ['read', 'write', 'share']
  }
});

// Audit logging
const auditLog = await vault.getAuditLog({
  actions: ['read', 'write', 'delete', 'share'],
  users: ['alice@example.com'],
  dateRange: { from: '2024-10-01' }
});
```

## 📱 Platform Features

### Cross-Platform Sync

```typescript
// Device registration
await openstrand.registerDevice({
  name: 'MacBook Pro',
  type: 'desktop',
  syncEnabled: true
});

// Selective device sync
await openstrand.configurDeviceSync({
  'iPhone': {
    downloadImages: false, // Save bandwidth
    offlineLooms: ['quick-notes', 'todos']
  },
  'iPad': {
    fullSync: true,
    priority: 'wifi' // 'always', 'manual'
  }
});
```

### Offline Mode

```typescript
// Offline-first operation
const offline = openstrand.offline();

// Queue changes
offline.on('change', (change) => {
  console.log(`Queued change: ${change.type}`);
});

// Sync when online
offline.on('online', async () => {
  const pending = await offline.getPendingChanges();
  await offline.sync();
});

// Conflict resolution
offline.on('conflict', async (conflict) => {
  const resolution = await showConflictUI(conflict);
  await offline.resolve(conflict.id, resolution);
});
```

---

<div align="center">
  <br/>
  <p>
    <a href="https://frame.dev">Frame.dev</a> •
    <a href="https://frame.dev/codex">Frame Codex</a> •
    <a href="https://openstrand.ai">OpenStrand</a>
  </p>
  <p>
    <a href="https://github.com/framersai">GitHub</a> •
    <a href="https://twitter.com/framersai">Twitter</a>
  </p>
  <br/>
  <sub>Every feature designed for knowledge workers</sub>
</div>
