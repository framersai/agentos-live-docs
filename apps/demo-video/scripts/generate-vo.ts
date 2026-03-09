/**
 * Generate voiceover clips via ElevenLabs TTS (Lily voice).
 *
 * Usage:
 *   ELEVENLABS_API_KEY=xi_... npx tsx scripts/generate-vo.ts [scene]
 *
 * Scenes: pain-hook, problem-state, brand-intro, install-setup,
 *         install-chat, screenshot-showcase, proof, final-state, cta
 *
 * Omit [scene] to regenerate ALL clips.
 */

import fs from 'fs';
import path from 'path';

const VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Lily
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve(__dirname, '../public/voiceover');

const SCRIPTS: Record<string, string> = {
  'pain-hook': `You tried the other frameworks.
OpenClaw. AutoGPT. CrewAI.`,

  'problem-state': `Gateway errors. Dependency hell. Runaway API costs.
No personality. No memory. One channel at a time.
There has to be a better way.`,

  'brand-intro': `Meet Wunderland.
The AI assistant that just works.
Twenty-seven messaging channels. Thirteen LLM providers. Zero friction.
Works everywhere. Remembers everything. Stays secure. Can run free of charge with Ollama.`,

  'install-setup': `One command. Choose a preset. Pick your provider.
Skills auto-loaded. Channels configured.
Your Wunderbot — initialized and ready.`,

  'install-chat': `Your Wunderbot thinks, plans, and acts.
Twenty-three autonomous tools.
Web search, GitHub, coding, summarization.
Full tool orchestration with real-time results.`,

  'screenshot-showcase': `Interactive setup wizard. Terminal UI dashboard.
Agent presets with HEXACO personality traits.
Human-in-the-loop approval. Autonomous tool calling.
Thirteen LLM providers. Eighteen curated skills.`,

  'feature-highlights': `HEXACO personality engine. Five-tier security.
Fifty-one extensions. Unlimited memory.`,

  proof: `The numbers speak for themselves.
Twenty-seven channels. Thirteen providers.
Twenty-three tools. Eighteen skills.
Fifty-one extensions. Five security tiers.
An unmatched open-source agent toolkit.`,

  'final-state': `This is what you get.
A complete command center for your AI agent.
Real-time dashboard. API keys verified. Channels live.
Twelve quick actions at your fingertips.
And a human-in-the-loop approval panel — full control, full autonomy. Your choice.`,

  cta: `Start in sixty seconds. Free, open source, no credit card.
wunderland dot s-h. rabbithole dot inc.`,

  // ── Workbench Demo voiceovers ──

  'wb-intro': `The AgentOS Workbench. Let's see what it can really do.`,

  'wb-streaming': `Send a prompt. Watch every token stream in — color-coded by type.
Text deltas in slate. Tool calls in amber. Metadata in cyan.
Full telemetry tracked in the bottom bar.`,

  'wb-agency': `Build multi-agent teams with role-based delegation.
Researcher, analyst, creator — each with their own persona.
Watch them execute in parallel and deliver coordinated results.`,

  'wb-personas': `Browse six personas out of the box. Or create your own with the guided wizard.
Define personality traits, capabilities, and guardrails.`,

  'wb-planning': `Multi-step task decomposition. Each step has a confidence score and estimated token cost.
Pause, resume, or advance — you control the execution.`,

  'wb-evaluation': `Run evaluation suites to track quality over time.
See pass fail per test case with detailed accuracy metrics.`,

  'wb-themes': `Nine color palettes. Three density modes.
Light, dark, and system. Fully customizable.`,

  'wb-cta': `Open source. Free to use. Try the AgentOS Workbench at agentos dot s-h.`,
};

async function generateClip(scene: string, text: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('Error: ELEVENLABS_API_KEY not set');
    process.exit(1);
  }

  console.log(`Generating: ${scene} (${text.length} chars)...`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed for ${scene}: ${res.status} ${err}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUTPUT_DIR, `${scene}.mp3`);

  // Back up existing
  if (fs.existsSync(outPath)) {
    const backupPath = outPath.replace('.mp3', '-backup.mp3');
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(outPath, backupPath);
      console.log(`  Backed up existing → ${path.basename(backupPath)}`);
    }
  }

  fs.writeFileSync(outPath, buffer);
  console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  const target = process.argv[2];

  if (target) {
    if (!SCRIPTS[target]) {
      console.error(`Unknown scene: ${target}`);
      console.error(`Available: ${Object.keys(SCRIPTS).join(', ')}`);
      process.exit(1);
    }
    await generateClip(target, SCRIPTS[target]);
  } else {
    for (const [scene, text] of Object.entries(SCRIPTS)) {
      await generateClip(scene, text);
    }
  }

  console.log('\nDone!');
}

main();
