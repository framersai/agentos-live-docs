/**
 * Generate voiceover clips via ElevenLabs TTS (Lily voice).
 *
 * Usage:
 *   ELEVENLABS_API_KEY=xi_... npx tsx scripts/generate-vo.ts [scene]
 *
 * Scenes: brand-intro, install-phase1, install-phase2, install-phase3,
 *         screenshots, features, stats, ecosystem, cta
 *
 * Omit [scene] to regenerate ALL clips.
 */

import fs from 'fs';
import path from 'path';

const VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Lily
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.resolve(__dirname, '../public/voiceover');

const SCRIPTS: Record<string, string> = {
  'brand-intro': `Meet Wunderland — the last AI virtual assistant you will ever need.
Built on OpenClaw with HEXACO personality modeling, graph-based RAG, and more.
Five-tier security, fifty-one plus extensions, thirteen LLM providers.
Free, open source, and fully self-hostable.
Fully offline compatible with Ollama — zero cost.`,

  'install-phase1': `One command to install — fully automated setup.
Eight curated presets — choose your agent's personality.
Thirteen LLM providers — OpenAI, Anthropic, Ollama, Groq, and more, with streamlined Ollama setup.`,

  'install-phase2': `Start chatting instantly — your agent is ready.
Twenty-three plus autonomous tools — web search, GitHub, coding, and more.
Real-time results — agents that think, plan, and act.`,

  'install-phase3': `Built-in diagnostics — API keys, LLMs, channels, all verified.
Twenty-seven plus channels, thirteen providers — everything checked at a glance.`,

  screenshots: `Setup wizard to TUI dashboard to full CLI toolkit.
Eight agent presets plus a human-in-the-loop approval panel.
Real-time tool approval — review and control every action.`,

  features: `HEXACO six-factor personality — drives mood, style, and decisions.
Five-tier security — pre-LLM filters, dual audit, HMAC, cost guards.
Fifty-one plus extensions — channels, tools, voice, browser, and more.
Unlimited graph-based knowledge — semantic memory, dynamic time-based mood decay.`,

  stats: `The numbers speak for themselves — an unmatched open-source agent toolkit.
Tools, skills, channels, providers — everything your Wunderbot needs, built in.
A massive, growing ecosystem — updated every single week.`,

  ecosystem: `OpenAI, Anthropic, Ollama, Groq, Gemini, Mistral, and more.
Telegram, Discord, Slack, Signal, Matrix, and twenty plus more.
Fully offline with Ollama — your data stays local.`,

  cta: `Start building Wunderbots — free and open source.
Any LLM provider — including uncensored models and Ollama fully offline.
wunderland dot s-h. rabbithole dot inc.`,
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
