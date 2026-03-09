#!/usr/bin/env npx tsx
/**
 * OpenClaw vs Wunderland CLI Comparison Tool
 *
 * Usage:
 *   npx tsx run.ts                  # Full comparison (commands + setup screenshots)
 *   npx tsx run.ts --commands-only  # Only non-interactive command screenshots
 *   npx tsx run.ts --setup-only    # Only setup wizard screenshots
 *   npx tsx run.ts --all           # Commands + setup + chat
 */

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { screenshotAnsi } from './lib/screenshot.js';
import { renderComparisonPng } from './lib/comparison.js';
import { runWizardViaExpect } from './lib/pty-runner.js';
import { COMMANDS } from './scenarios/post-setup-commands.js';
import { getOpenclawSetupSteps } from './scenarios/openclaw-setup.js';
import {
  getWunderlandQuickStartSteps,
  getWunderlandAdvancedSteps,
} from './scenarios/wunderland-setup.js';
import type { CapturedStep, ComparisonPair, CliProduct, WizardStepAction } from './lib/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, 'output');
const OPENCLAW_DIR = join(OUTPUT, 'openclaw');
const WUNDERLAND_DIR = join(OUTPUT, 'wunderland');
const COMPARISONS_DIR = join(OUTPUT, 'comparisons');
const REPORT_DIR = join(OUTPUT, 'report');

// Ensure output dirs
for (const dir of [OPENCLAW_DIR, WUNDERLAND_DIR, COMPARISONS_DIR, REPORT_DIR]) {
  mkdirSync(dir, { recursive: true });
}

// Parse args
const args = process.argv.slice(2);
const commandsOnly = args.includes('--commands-only');
const setupOnly = args.includes('--setup-only');
const runAll = args.includes('--all');

// Get API key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required. Set it in your environment or .env file.');
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`  ${msg}`);
}

function logSection(title: string) {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'━'.repeat(60)}\n`);
}

/**
 * Run a non-interactive CLI command and capture ANSI output.
 */
function runCommand(cmd: string, timeoutMs = 15000): string {
  try {
    const output = execSync(cmd, {
      timeout: timeoutMs,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        FORCE_COLOR: '3',
        NO_UPDATE_NOTIFIER: '1',
      },
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output;
  } catch (err: any) {
    // Some commands exit non-zero but still produce useful output
    return err.stdout || err.stderr || `Error: ${err.message}`;
  }
}

/**
 * Run a wizard scenario via expect, capturing screenshots at each step.
 */
async function runWizard(
  product: CliProduct,
  command: string,
  cmdArgs: string[],
  steps: WizardStepAction[],
  outputDir: string
): Promise<CapturedStep[]> {
  const homeDir = join('/tmp', `cli-comparison-${product}`);
  mkdirSync(homeDir, { recursive: true });

  const env: Record<string, string> = {
    OPENAI_API_KEY,
    ...(product === 'openclaw' ? { OPENCLAW_HOME: homeDir } : { WUNDERLAND_HOME: homeDir }),
  };

  log(`Running wizard: ${command} ${cmdArgs.join(' ')}`);

  return runWizardViaExpect(product, command, cmdArgs, steps, outputDir, {
    env,
    cwd: homeDir,
  });
}

// ─── Phase: Non-interactive Commands ─────────────────────────────────────────

async function runCommandComparisons(): Promise<ComparisonPair[]> {
  logSection('Phase: Non-Interactive Command Screenshots');
  const pairs: ComparisonPair[] = [];

  for (const spec of COMMANDS) {
    log(`Comparing: ${spec.label}`);

    let ocCapture: CapturedStep | null = null;
    let wlCapture: CapturedStep | null = null;

    if (spec.openclaw) {
      log(`  Running: ${spec.openclaw}`);
      const ansi = runCommand(spec.openclaw);
      const pngPath = join(
        OPENCLAW_DIR,
        `cmd-${spec.label.toLowerCase().replace(/\s+/g, '-')}.png`
      );
      await screenshotAnsi(ansi, pngPath, {
        product: 'openclaw',
        commandHeader: spec.openclaw,
      });
      ocCapture = {
        product: 'openclaw',
        stepId: `cmd-${spec.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: spec.openclaw,
        description: spec.label,
        category: 'command',
        ansiContent: ansi,
        pngPath,
        timestamp: new Date(),
      };
      log(`  OK: openclaw`);
    }

    if (spec.wunderland) {
      log(`  Running: ${spec.wunderland}`);
      const ansi = runCommand(spec.wunderland);
      const pngPath = join(
        WUNDERLAND_DIR,
        `cmd-${spec.label.toLowerCase().replace(/\s+/g, '-')}.png`
      );
      await screenshotAnsi(ansi, pngPath, {
        product: 'wunderland',
        commandHeader: spec.wunderland,
      });
      wlCapture = {
        product: 'wunderland',
        stepId: `cmd-${spec.label.toLowerCase().replace(/\s+/g, '-')}`,
        label: spec.wunderland,
        description: spec.label,
        category: 'command',
        ansiContent: ansi,
        pngPath,
        timestamp: new Date(),
      };
      log(`  OK: wunderland`);
    }

    const pair: ComparisonPair = {
      pairId: `cmd-${spec.label.toLowerCase().replace(/\s+/g, '-')}`,
      label: spec.label,
      description: `Command: ${spec.label}`,
      category: 'command',
      openclaw: ocCapture,
      wunderland: wlCapture,
      differenceNotes: spec.differenceNotes,
    };

    // Render side-by-side
    const compPath = join(COMPARISONS_DIR, `${pair.pairId}.png`);
    await renderComparisonPng(pair, compPath);
    log(`  Side-by-side: ${compPath}`);

    pairs.push(pair);
  }

  return pairs;
}

// ─── Phase: Setup Wizards ────────────────────────────────────────────────────

async function runSetupComparisons(): Promise<ComparisonPair[]> {
  logSection('Phase: Setup Wizard Screenshots');

  log('Running OpenClaw onboarding...');
  const ocSteps = getOpenclawSetupSteps(OPENAI_API_KEY);
  const ocCaptures = await runWizard('openclaw', 'openclaw', ['onboard'], ocSteps, OPENCLAW_DIR);

  log('Running Wunderland QuickStart setup...');
  const wlSteps = getWunderlandQuickStartSteps(OPENAI_API_KEY);
  const wlCaptures = await runWizard(
    'wunderland',
    'wunderland',
    ['setup'],
    wlSteps,
    WUNDERLAND_DIR
  );

  // Build comparison pairs by matching step IDs
  const PAIR_MAP: Array<{
    pairId: string;
    label: string;
    ocStep: string | null;
    wlStep: string | null;
    notes: string[];
  }> = [
    {
      pairId: 'setup-security-ack',
      label: 'Security Acknowledgment',
      ocStep: 'oc-00-security-ack',
      wlStep: null,
      notes: ['OpenClaw-only: requires security acknowledgment before setup begins'],
    },
    {
      pairId: 'setup-mode',
      label: 'Setup Mode Selection',
      ocStep: 'oc-01-onboard-mode',
      wlStep: 'wl-01-mode',
      notes: ['Both offer QuickStart vs Advanced; OpenClaw calls it "Onboarding mode"'],
    },
    {
      pairId: 'setup-name',
      label: 'Agent / Workspace Name',
      ocStep: 'oc-08-workspace',
      wlStep: 'wl-02-name',
      notes: ['OpenClaw: "workspace directory", Wunderland: "agent name"'],
    },
    {
      pairId: 'setup-observability',
      label: 'Observability Config',
      ocStep: null,
      wlStep: 'wl-03-observability',
      notes: ['Wunderland-only: OpenTelemetry configuration (off/traces+metrics/full)'],
    },
    {
      pairId: 'setup-provider',
      label: 'LLM Provider',
      ocStep: 'oc-02-provider',
      wlStep: 'wl-05-provider',
      notes: [
        'OpenClaw: ~30 providers (model/auth provider), Wunderland: 13 providers multi-select',
      ],
    },
    {
      pairId: 'setup-auth-method',
      label: 'Auth Method',
      ocStep: 'oc-03-auth-method',
      wlStep: null,
      notes: ['OpenClaw-only: OAuth (Codex) vs API key auth; Wunderland uses direct API key only'],
    },
    {
      pairId: 'setup-key-provision',
      label: 'API Key Provision',
      ocStep: 'oc-04-key-provision',
      wlStep: null,
      notes: ['OpenClaw-only: choose how to provide API key (paste, env var, etc.)'],
    },
    {
      pairId: 'setup-use-env-key',
      label: 'Use Existing Key',
      ocStep: 'oc-05-use-env-key',
      wlStep: null,
      notes: ['OpenClaw auto-detects OPENAI_API_KEY from environment'],
    },
    {
      pairId: 'setup-api-key',
      label: 'API Key Input',
      ocStep: null,
      wlStep: null, // Wunderland auto-detects API key from env
      notes: ['Both require API key; Wunderland also offers .env paste import'],
    },
    {
      pairId: 'setup-model',
      label: 'Model Selection',
      ocStep: 'oc-06-model', // After QuickStart, model selection may appear
      wlStep: 'wl-06-model',
      notes: [
        'Similar model selection; Wunderland includes SmallModelResolver for cost optimization',
      ],
    },
    {
      pairId: 'setup-channels',
      label: 'Channel Selection',
      ocStep: 'oc-07-channels',
      wlStep: 'wl-07-channels',
      notes: ['OpenClaw: ~20 channels, Wunderland: ~30 platforms with emoji icons'],
    },
    {
      pairId: 'setup-daemon',
      label: 'Daemon / Background Mode',
      ocStep: 'oc-09-daemon',
      wlStep: null,
      notes: ['OpenClaw-only: built-in daemon mode (LaunchAgent/systemd)'],
    },
    {
      pairId: 'setup-skills',
      label: 'Skills Selection',
      ocStep: 'oc-10-skills',
      wlStep: null,
      notes: ['Both have skills; Wunderland skills appear in Advanced mode with paginated catalog'],
    },
    {
      pairId: 'setup-review',
      label: 'Review & Confirm',
      ocStep: 'oc-11-confirm',
      wlStep: 'wl-08-review',
      notes: ['Both show review/summary before finalizing'],
    },
  ];

  const pairs: ComparisonPair[] = [];

  for (const mapping of PAIR_MAP) {
    const ocCapture = mapping.ocStep
      ? ocCaptures.find((c) => c.stepId === mapping.ocStep) || null
      : null;
    const wlCapture = mapping.wlStep
      ? wlCaptures.find((c) => c.stepId === mapping.wlStep) || null
      : null;

    const pair: ComparisonPair = {
      pairId: mapping.pairId,
      label: mapping.label,
      description: `Setup: ${mapping.label}`,
      category: 'onboarding',
      openclaw: ocCapture,
      wunderland: wlCapture,
      differenceNotes: mapping.notes,
    };

    const compPath = join(COMPARISONS_DIR, `${pair.pairId}.png`);
    await renderComparisonPng(pair, compPath);
    log(`  Side-by-side: ${mapping.label}`);

    pairs.push(pair);
  }

  return pairs;
}

// ─── Report Generation ───────────────────────────────────────────────────────

function generateReport(allPairs: ComparisonPair[]): void {
  logSection('Generating Report');

  // Get versions
  let ocVersion = 'unknown';
  let wlVersion = 'unknown';
  try {
    ocVersion = execSync('openclaw --version', { encoding: 'utf-8' }).trim();
  } catch {}
  try {
    wlVersion = execSync('wunderland version', { encoding: 'utf-8' }).trim();
  } catch {}

  const cmdPairs = allPairs.filter((p) => p.category === 'command');
  const setupPairs = allPairs.filter((p) => p.category === 'onboarding');

  const md = `# OpenClaw vs Wunderland: Feature Comparison Report

Generated: ${new Date().toISOString()}
OpenClaw version: ${ocVersion}
Wunderland version: ${wlVersion}

## Executive Summary

| Category | OpenClaw | Wunderland |
|----------|----------|------------|
| Onboarding steps | ~9 | 9 (QuickStart) / 19 (Advanced) |
| LLM providers | ~4 | 13 |
| Channel platforms | ~8 | 29 |
| Security features | Binary (enable/disable) | 5-tier pipeline (Pre-LLM + Dual-LLM + Signing) |
| Personality system | None | HEXACO 6-factor, 5 presets + custom |
| Voice (TTS/STT) | None | 3 TTS + 3 STT providers |
| Observability | Basic logs | OpenTelemetry (3 presets) |
| Extension catalog | ~10 | 23+ tools, 18 skills |
| Agent presets | None | 8 presets + 3 deployment templates |
| Export/Import | None | wunderland export/import + seal/verify-seal |
| Dashboard | Built-in web UI | Separate (AgentOS Workbench) |
| Daemon mode | Built-in | Not included |

---

## Command Comparisons

${cmdPairs
  .map(
    (p) => `### ${p.label}

![${p.pairId}](../comparisons/${p.pairId}.png)

${p.differenceNotes.map((n) => `- ${n}`).join('\n')}
`
  )
  .join('\n')}

## Setup Wizard Comparisons

${setupPairs
  .map(
    (p) => `### ${p.label}

![${p.pairId}](../comparisons/${p.pairId}.png)

${p.differenceNotes.map((n) => `- ${n}`).join('\n')}
`
  )
  .join('\n')}

## Wunderland-Only Features

1. **Security Pipeline** — 5 named tiers (dangerous/permissive/balanced/strict/paranoid) with Pre-LLM classifier, Dual-LLM auditor, output signing
2. **HEXACO Personality** — 6-factor personality model with 5 presets (Helpful, Creative, Analytical, Empathetic, Decisive) + custom sliders
3. **Voice Integration** — TTS (OpenAI/ElevenLabs/Piper) + STT (Whisper/Deepgram/SpeechRecognition)
4. **OpenTelemetry Observability** — Traces, metrics, logs with 3 configuration presets
5. **Agent Export/Import** — Portable agent manifests via \`wunderland export/import\`
6. **Output Signing** — Cryptographic seal verification via \`wunderland seal/verify-seal\`
7. **Extended Channels** — 29 platforms vs ~8 (adds Signal, iMessage, Zalo, Nostr, Twitch, Line, Feishu, etc.)
8. **18 Curated Skills** — SKILL.md-based skill descriptors with auto-loading via PresetSkillResolver
9. **8 Agent Presets** — Pre-configured personas with HEXACO traits, security, skills, channels
10. **Style Adaptation** — Learns user communication preferences (formality, verbosity, technicality)
11. **Capability Discovery** — Semantic tool discovery via embeddings + graph reranking

## OpenClaw-Only Features

1. **Built-in Dashboard** — \`openclaw dashboard\` opens web UI for browser-based chat
2. **Daemon Mode** — Background process management (LaunchAgent on macOS, systemd on Linux)
3. **Health Check in Onboarding** — Connectivity verification as part of setup wizard
4. **Gateway Architecture** — WebSocket gateway for multi-client connections

## Recommendations for Feature Parity

### Wunderland should add:
- Built-in web dashboard (or integrate AgentOS Workbench as default)
- Daemon/background mode for always-on agents
- Health check step in setup wizard

### OpenClaw could benefit from:
- Security tiers beyond binary enable/disable
- HEXACO personality for consistent agent behavior
- OpenTelemetry observability
- Agent preset system
- Larger channel ecosystem
`;

  writeFileSync(join(REPORT_DIR, 'comparison-report.md'), md);
  log(`Report: ${join(REPORT_DIR, 'comparison-report.md')}`);

  // JSON data
  const jsonData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      openclawVersion: ocVersion,
      wunderlandVersion: wlVersion,
    },
    pairs: allPairs.map((p) => ({
      pairId: p.pairId,
      label: p.label,
      category: p.category,
      hasOpenclaw: !!p.openclaw,
      hasWunderland: !!p.wunderland,
      differenceNotes: p.differenceNotes,
    })),
  };
  writeFileSync(join(REPORT_DIR, 'comparison-data.json'), JSON.stringify(jsonData, null, 2));
  log(`Data: ${join(REPORT_DIR, 'comparison-data.json')}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('\n  OpenClaw vs Wunderland CLI Comparison\n');

  const allPairs: ComparisonPair[] = [];

  if (!setupOnly) {
    const cmdPairs = await runCommandComparisons();
    allPairs.push(...cmdPairs);
  }

  if (!commandsOnly) {
    const setupPairs = await runSetupComparisons();
    allPairs.push(...setupPairs);
  }

  generateReport(allPairs);

  logSection('Done!');
  log(`Output: ${OUTPUT}`);
  log(`Comparisons: ${COMPARISONS_DIR} (${allPairs.length} pairs)`);
  log(`Report: ${join(REPORT_DIR, 'comparison-report.md')}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
