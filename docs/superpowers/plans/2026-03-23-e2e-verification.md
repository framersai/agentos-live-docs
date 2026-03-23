# End-to-End Verification Plan

> Full integration test of wunderland CLI with all configured API keys, memory systems, extensions, and output formats.

**Prerequisites:**

- Node 22 LTS (`nvm use 22`)
- pnpm installed
- wunderland@0.50.0+ installed globally (`pnpm add -g wunderland`)
- `.env` file with API keys copied to test directory

---

## Phase 1: Installation & Setup

### 1.1 Fresh Install

```bash
mkdir ~/wunderland-e2e-test && cd ~/wunderland-e2e-test
pnpm add wunderland@latest
npx wunderland --version  # Should show 0.50.0+
```

### 1.2 Setup Wizard

```bash
npx wunderland setup
# Select: OpenAI provider
# Enter API key from env
# Select preset: researcher
# Verify: agent.config.json created
```

### 1.3 Verify Extension Recommendations

```bash
# Copy .env keys to test dir
cp /path/to/.env .env

npx wunderland start --dry-run 2>&1 | head -30
# EXPECT: "Recommended extensions (credentials detected):"
# - News Search (NewsAPI) — NEWSAPI_API_KEY found
# - Web Search (Serper) — SERPER_API_KEY found
# - Giphy — GIPHY_API_KEY found
# - Voice Synthesis (ElevenLabs) — ELEVENLABS_API_KEY found
# - GitHub — GITHUB_TOKEN found
```

---

## Phase 2: Extension & Marketplace Tests

### 2.1 List Extensions

```bash
npx wunderland extensions list
# EXPECT: 58+ tools, 37 channels, 5 voice, 3 productivity
```

### 2.2 Search Marketplace

```bash
npx wunderland marketplace search "news"
# EXPECT: news-search tool + content-creator skill

npx wunderland marketplace search "memory"
# EXPECT: cognitive-memory tool

npx wunderland marketplace search "web"
# EXPECT: web-search, web-browser, deep-research
```

### 2.3 Extension Info

```bash
npx wunderland extensions info news-search
# EXPECT: Shows package name, required secrets (NEWSAPI_API_KEY), description
```

### 2.4 Marketplace Install (if not already installed)

```bash
npx wunderland marketplace install deep-research
# EXPECT: Auto-installs via detected package manager
# EXPECT: Prompts for any missing API keys
```

---

## Phase 3: Agent Chat — Tool Calling

### 3.1 Web Search (Serper)

```bash
npx wunderland chat
> Search for the latest AI agent frameworks released in 2026
# EXPECT: Agent calls web_search tool
# EXPECT: Returns results from Serper API
# EXPECT: Formatted response with sources
```

### 3.2 News Search (NewsAPI)

```bash
> What are the top AI news stories today?
# EXPECT: Agent calls news_search tool
# EXPECT: Returns articles with titles, sources, dates
```

### 3.3 GitHub Integration

```bash
> Search GitHub for the most starred TypeScript agent frameworks
# EXPECT: Agent calls github_search or similar
# EXPECT: Returns repos with stars, descriptions
```

### 3.4 Image Search

```bash
> Find images of neumorphic dark mode UI design
# EXPECT: Agent calls image_search tool
# EXPECT: Returns image URLs
```

### 3.5 Giphy

```bash
> Find a funny GIF about debugging
# EXPECT: Agent calls giphy tool
# EXPECT: Returns GIF URL
```

---

## Phase 4: Memory System Verification

### 4.1 Working Memory File Created

```bash
ls ~/.wunderland/agents/*/working-memory.md
# EXPECT: File exists with default template
cat ~/.wunderland/agents/*/working-memory.md
# EXPECT: Shows "# Working Memory" with sections
```

### 4.2 Memory Persistence Across Turns

```bash
npx wunderland chat
> My name is Johnny and I prefer dark mode with neumorphic design
# EXPECT: Agent acknowledges

> What's my name and what design style do I prefer?
# EXPECT: Agent recalls "Johnny" and "dark mode / neumorphic"
# This tests the auto-ingest pipeline + retrieval
```

### 4.3 Working Memory Update

```bash
> Update your working memory with my preferences
# EXPECT: Agent calls update_working_memory tool
# EXPECT: working-memory.md file updated

cat ~/.wunderland/agents/*/working-memory.md
# EXPECT: Contains user preferences
```

### 4.4 Memory Survives Restart

```bash
# Exit chat (Ctrl+C), restart
npx wunderland chat
> Do you remember my name?
# EXPECT: Agent retrieves from vector store or working memory
# EXPECT: Says "Johnny" without being told again
```

### 4.5 News Preferences in Memory

```bash
> I'm interested in AI startups and climate tech news
# EXPECT: Auto-ingest extracts this as user_preference

> /exit
npx wunderland chat
> What news topics am I interested in?
# EXPECT: Recalls "AI startups" and "climate tech"
```

---

## Phase 5: Multi-Turn Research with Output

### 5.1 Deep Research Task

```bash
npx wunderland chat
> Research the top 5 AI agent frameworks in 2026. Compare their features,
> pricing, and memory systems. Output as a markdown table.
# EXPECT: Multiple tool calls (web_search, content_extraction)
# EXPECT: Formatted markdown table output
```

### 5.2 News Analysis

```bash
> Search for the latest news about OpenAI and Anthropic.
> Summarize the key developments and create a comparison.
# EXPECT: news_search calls
# EXPECT: Structured comparison output
```

### 5.3 Export to File

```bash
> Save the research above to a file called ai-frameworks-report.md
# EXPECT: Agent uses cli_executor or file write to save
# EXPECT: File created in working directory

cat ai-frameworks-report.md
# EXPECT: Contains the research output
```

---

## Phase 6: Extension Auto-Detection Verification

### 6.1 Credential Detection

```bash
# With all keys in .env:
npx wunderland start 2>&1 | grep -A20 "Recommended extensions"
# EXPECT: Lists all detected credentials and matching extensions
```

### 6.2 Verify Tools Loaded

```bash
npx wunderland chat
> /tools
# or: What tools do you have available?
# EXPECT: Lists loaded tools including:
#   - web_search
#   - news_search
#   - giphy
#   - image_search
#   - cli_executor
#   - update_working_memory
#   - read_working_memory
#   - discover_capabilities
```

---

## Phase 7: Skills System

### 7.1 List Skills

```bash
npx wunderland skills list
# EXPECT: 40+ curated skills
```

### 7.2 Search Skills

```bash
npx wunderland skills search "research"
# EXPECT: web-research, deep-research, fact-checking skills
```

### 7.3 Enable Skill

```bash
npx wunderland skills enable summarize
# EXPECT: Added to agent.config.json
```

---

## Phase 8: Context Window & Memory Stats

### 8.1 Memory Command

```bash
npx wunderland chat
> Tell me a long story about AI agents
> Tell me another story
> /memory
# EXPECT: Shows context window stats
# EXPECT: Token count, compaction status
```

---

## Phase 9: Provider Fallback

### 9.1 OpenRouter Fallback

```bash
# With OPENROUTER_API_KEY set
npx wunderland chat --provider openrouter --model anthropic/claude-sonnet-4-5-20250929
> Hello, what model are you?
# EXPECT: Response from Claude via OpenRouter
```

### 9.2 Ollama Local

```bash
# With OLLAMA_BASE_URL set
npx wunderland chat --provider ollama --model dolphin-llama3:8b
> Hello, what model are you?
# EXPECT: Response from local Ollama
```

---

## Phase 10: Output Verification Checklist

After all tests, verify these artifacts exist:

```bash
# Agent config
cat agent.config.json

# Working memory
cat ~/.wunderland/agents/*/working-memory.md

# SQLite database (auto-ingest memories)
ls ~/.wunderland/agents/*/data/*.sqlite3

# Research output
cat ai-frameworks-report.md

# Conversation history
ls ~/.wunderland/agents/*/conversations/
```

---

## Automated Smoke Test Script

```bash
#!/bin/bash
# smoke-test.sh — Quick verification of wunderland installation
set -e

echo "=== Wunderland E2E Smoke Test ==="
echo ""

# Version
echo "1. Version check..."
VERSION=$(npx wunderland --version 2>/dev/null)
echo "   $VERSION"

# Extensions
echo "2. Extensions list..."
TOOLS=$(npx wunderland extensions list 2>/dev/null | grep -c "✓")
echo "   $TOOLS extensions available"

# Marketplace
echo "3. Marketplace search..."
NEWS=$(npx wunderland marketplace search news 2>/dev/null | grep -c "news")
echo "   $NEWS news-related items found"

# Skills
echo "4. Skills list..."
SKILLS=$(npx wunderland skills list 2>/dev/null | grep -c "✓" || echo "0")
echo "   $SKILLS skills loaded"

# Memory file
echo "5. Working memory..."
WM=$(ls ~/.wunderland/agents/*/working-memory.md 2>/dev/null | head -1)
if [ -n "$WM" ]; then
  echo "   Found: $WM"
else
  echo "   Not yet created (start agent first)"
fi

echo ""
echo "=== All smoke tests passed ==="
```
