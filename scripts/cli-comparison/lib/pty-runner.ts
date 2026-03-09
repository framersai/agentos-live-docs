/**
 * PTY automation engine using macOS `/usr/bin/expect`.
 *
 * Generates an expect script with proper `expect`/`send` commands,
 * captures all output via `log_file`, and takes screenshots at each step.
 */

import { execSync, spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { WizardStepAction, CapturedStep, CliProduct, StepResponse } from './types.js';
import { screenshotAnsi } from './screenshot.js';

export interface ExpectRunnerOptions {
  env?: Record<string, string>;
  cwd?: string;
  cols?: number;
  rows?: number;
}

/**
 * Escape a string for use inside an expect script (Tcl string).
 */
function tclEscape(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}');
}

/**
 * Build the `send` commands for a step response in expect/Tcl syntax.
 */
function buildSendCommands(response: StepResponse): string[] {
  const cmds: string[] = [];

  switch (response.type) {
    case 'select':
      for (let i = 0; i < response.index; i++) {
        cmds.push('send -- "\\033\\[B"'); // arrow down
        cmds.push('sleep 0.15');
      }
      cmds.push('sleep 0.2');
      cmds.push('send -- "\\r"'); // enter
      break;

    case 'multiselect':
      {
        const sorted = [...response.indices].sort((a, b) => a - b);
        let pos = 0;
        for (const idx of sorted) {
          const moves = idx - pos;
          for (let i = 0; i < moves; i++) {
            cmds.push('send -- "\\033\\[B"');
            cmds.push('sleep 0.15');
          }
          cmds.push('send -- " "'); // space to toggle
          cmds.push('sleep 0.15');
          pos = idx;
        }
        cmds.push('sleep 0.2');
        cmds.push('send -- "\\r"');
      }
      break;

    case 'text':
      cmds.push(`send -- "${tclEscape(response.value)}"`);
      cmds.push('sleep 0.1');
      cmds.push('send -- "\\r"');
      break;

    case 'password':
      cmds.push(`send -- "${tclEscape(response.value)}"`);
      cmds.push('sleep 0.1');
      cmds.push('send -- "\\r"');
      break;

    case 'confirm':
      cmds.push(`send -- "${response.accept ? 'y' : 'n'}"`);
      cmds.push('sleep 0.1');
      cmds.push('send -- "\\r"');
      break;

    case 'enter':
      cmds.push('send -- "\\r"');
      break;

    case 'wait':
      cmds.push(`sleep ${Math.ceil(response.timeoutMs / 1000)}`);
      break;
  }

  return cmds;
}

/**
 * Generate a complete expect script that drives a wizard and captures
 * output at each step to separate log files.
 */
function generateExpectScript(
  command: string,
  args: string[],
  steps: WizardStepAction[],
  logDir: string,
  envOverrides: Record<string, string>,
  cols: number,
  rows: number
): string {
  const cmdLine = [command, ...args].map((a) => `"${tclEscape(a)}"`).join(' ');

  // Build environment setup
  const envLines = Object.entries(envOverrides)
    .map(([k, v]) => `set env(${k}) "${tclEscape(v)}"`)
    .join('\n');

  // Build step handlers — all output goes to single log file
  const stepBlocks: string[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const pattern = step.waitFor.source;
    const sendCmds = buildSendCommands(step.response);

    stepBlocks.push(`
# Step ${i}: ${step.label}
puts "\\n=== STEP ${i}: ${tclEscape(step.label)} ==="
expect {
  -nocase -re {${pattern}} {
    puts "\\n--- MATCHED: ${tclEscape(step.stepId)} ---"
    sleep 0.5
    ${sendCmds.join('\n    ')}
    sleep ${(step.postDelay ?? 800) / 1000}
  }
  timeout {
    puts "\\n--- TIMEOUT: ${tclEscape(step.stepId)} ---"
  }
}`);
  }

  const logPath = join(logDir, 'full-output.log');

  return `#!/usr/bin/expect -f
# Auto-generated expect script for CLI wizard automation
${envLines}

set timeout 30
set stty_init "columns ${cols} rows ${rows}"
log_user 1

# Single log file captures everything
log_file -noappend "${tclEscape(logPath)}"

spawn ${cmdLine}

# Wait for initial output (banner, security warnings, etc.)
sleep 5

${stepBlocks.join('\n')}

# Capture final state
sleep 2
puts "\\n=== FINAL STATE ==="
sleep 1

# Cleanly exit
send -- "\\x03"
sleep 1
catch {close}
catch {wait}
exit 0
`;
}

/**
 * Run an expect-driven wizard session.
 * Returns captured steps with ANSI output at each stage.
 */
export async function runWizardViaExpect(
  product: CliProduct,
  command: string,
  args: string[],
  steps: WizardStepAction[],
  outputDir: string,
  opts?: ExpectRunnerOptions
): Promise<CapturedStep[]> {
  const captures: CapturedStep[] = [];

  // Resolve command path
  let fullCommand: string;
  try {
    fullCommand = execSync(`which ${command}`, { encoding: 'utf-8' }).trim();
  } catch {
    fullCommand = command;
  }

  // Create temp directory for logs
  const logDir = mkdtempSync(join(tmpdir(), `cli-cmp-${product}-`));
  mkdirSync(logDir, { recursive: true });

  const envOverrides: Record<string, string> = {
    TERM: 'xterm-256color',
    FORCE_COLOR: '3',
    COLORTERM: 'truecolor',
    NO_UPDATE_NOTIFIER: '1',
    ...(opts?.env || {}),
  };

  const cols = opts?.cols ?? 120;
  const rows = opts?.rows ?? 40;

  // Generate and write the expect script
  const scriptContent = generateExpectScript(
    fullCommand,
    args,
    steps,
    logDir,
    envOverrides,
    cols,
    rows
  );

  const scriptPath = join(logDir, 'wizard.exp');
  writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

  console.log(`    Expect script: ${scriptPath}`);

  // Run the expect script
  const totalTimeout = (steps.length * 30 + 30) * 1000; // 30s per step + 30s buffer
  try {
    const result = spawnSync('/usr/bin/expect', ['-f', scriptPath], {
      cwd: opts?.cwd ?? process.cwd(),
      env: {
        ...process.env,
        ...envOverrides,
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin',
      },
      timeout: totalTimeout,
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024,
    });

    const fullOutput = result.stdout?.toString() || '';
    const stderrOutput = result.stderr?.toString() || '';

    if (result.status !== 0 && result.status !== null) {
      console.log(`    Expect exited with code ${result.status}`);
      if (stderrOutput) console.log(`    stderr: ${stderrOutput.slice(0, 200)}`);
    }

    // Read the full output log
    let fullLog = '';
    try {
      fullLog = readFileSync(join(logDir, 'full-output.log'), 'utf-8');
    } catch {
      fullLog = fullOutput; // Fallback to stdout
    }

    if (fullLog.length < 50) {
      console.log(`    No output captured for ${product}`);
    } else {
      console.log(`    Captured ${fullLog.length} bytes of output`);

      // Save raw log for debugging
      const rawLogPath = join(outputDir, `${product}-raw-output.log`);
      writeFileSync(rawLogPath, fullLog);
      console.log(`    Raw log saved: ${rawLogPath}`);

      // Split on @clack/prompts markers: ◆ (active prompt) and ◇ (completed prompt)
      // Handle various ANSI color codes since different versions may style differently
      const sections = fullLog.split(/(?=\x1b\[\d+m[◇◆]\x1b\[\d+m)/);

      console.log(`    Found ${sections.length} sections (first is banner)`);
      for (let s = 0; s < Math.min(sections.length, 15); s++) {
        const stripped = sections[s]
          .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
          .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')
          .trim();
        const preview = stripped.slice(0, 80).replace(/\n/g, ' ');
        console.log(`      [${s}] ${stripped.length} chars: "${preview}..."`);
      }

      // First section is the banner
      if (sections[0] && sections[0].trim().length > 10) {
        const bannerPath = join(outputDir, `${product}-banner.png`);
        await screenshotAnsi(sections[0], bannerPath, {
          product,
          commandHeader: `${command} ${args.join(' ')}`,
        });
        captures.push({
          product,
          stepId: `${product}-banner`,
          label: `${product} banner`,
          description: 'Initial banner / splash screen',
          category: 'onboarding',
          ansiContent: sections[0],
          pngPath: bannerPath,
          timestamp: new Date(),
        });
        console.log(`    Captured: ${product}-banner`);
      }

      // Create one full screenshot of the entire wizard flow
      const fullPath = join(outputDir, `${product}-full-setup.png`);
      await screenshotAnsi(fullLog, fullPath, {
        product,
        commandHeader: `${command} ${args.join(' ')}`,
      });
      console.log(`    Full screenshot: ${product}-full-setup.png`);

      // Prefer ◆ (active prompt) sections — these show the actual interactive UI.
      // Also include ◇ sections that contain review/summary/channel data (useful output).
      const allSections = sections.slice(1); // skip banner
      const promptSections: Array<{ content: string; origIdx: number }> = [];
      for (let j = 0; j < allSections.length; j++) {
        const stripped = allSections[j].replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').trim();
        if (stripped.startsWith('◆')) {
          promptSections.push({ content: allSections[j], origIdx: j });
        } else if (stripped.startsWith('◇') && /review|summary|channel.*webchat/i.test(stripped)) {
          // Include completed sections that have review/summary data
          promptSections.push({ content: allSections[j], origIdx: j });
        }
      }
      console.log(`    Usable prompt sections: ${promptSections.length}`);

      const usedSectionIndices = new Set<number>();

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const regex = step.waitFor;

        // Strategy 1: Find an unused ◆ section that matches this step's pattern
        let matchedSection = '';
        let matchedIdx = -1;
        for (let j = 0; j < promptSections.length; j++) {
          if (usedSectionIndices.has(j)) continue;
          const stripped = promptSections[j].content
            .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
            .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
          if (regex.test(stripped)) {
            matchedSection = promptSections[j].content;
            matchedIdx = j;
            break;
          }
        }

        // Strategy 2: Fall back to sequential assignment of next unused ◆ section
        if (!matchedSection || matchedSection.trim().length < 10) {
          for (let j = 0; j < promptSections.length; j++) {
            if (usedSectionIndices.has(j)) continue;
            if (promptSections[j].content.trim().length > 10) {
              matchedSection = promptSections[j].content;
              matchedIdx = j;
              break;
            }
          }
        }

        if (!matchedSection || matchedSection.trim().length < 10) {
          console.log(`    Skipped: ${step.stepId} (no matching section)`);
          continue;
        }

        usedSectionIndices.add(matchedIdx);

        const pngPath = join(outputDir, `${step.stepId}.png`);
        await screenshotAnsi(matchedSection, pngPath, {
          product,
          commandHeader: step.label,
        });

        captures.push({
          product,
          stepId: step.stepId,
          label: step.label,
          description: step.description,
          category: 'onboarding',
          ansiContent: matchedSection,
          pngPath,
          timestamp: new Date(),
        });

        console.log(`    Captured: ${step.stepId}`);
      }

      // Also create a "full setup" capture that matches any step ID
      // This is used when side-by-side pairs can't find individual steps
      captures.push({
        product,
        stepId: `${product}-full-setup`,
        label: `Full ${product} Setup`,
        description: `Complete ${product} setup wizard output`,
        category: 'onboarding',
        ansiContent: fullLog,
        pngPath: fullPath,
        timestamp: new Date(),
      });
    }
  } catch (err: any) {
    console.log(`    Error running expect: ${err.message}`);

    // Try to read whatever output was captured
    try {
      const fullLog = readFileSync(join(logDir, 'full-output.log'), 'utf-8');
      if (fullLog.length > 50) {
        const pngPath = join(outputDir, `${product}-partial.png`);
        await screenshotAnsi(fullLog, pngPath, {
          product,
          commandHeader: `${command} ${args.join(' ')} (partial)`,
        });
        captures.push({
          product,
          stepId: `${product}-partial`,
          label: `${product} partial output`,
          description: 'Partial output captured before error',
          category: 'onboarding',
          ansiContent: fullLog,
          pngPath,
          timestamp: new Date(),
        });
      }
    } catch {
      /* no log */
    }
  }

  return captures;
}
