/**
 * OpenClaw onboarding wizard step definitions.
 *
 * OpenClaw v2026.3.x QuickStart flow (discovered iteratively):
 * 0. Security acknowledgment
 * 1. Onboarding mode (QuickStart vs Manual)
 * 2. Model/auth provider (OpenAI, Anthropic, ~30 options)
 * 3. Auth method (Codex OAuth vs API key vs Back)
 * 4. API key provision method (Paste / env var)
 * 5. Confirm using existing env key
 * 6+ Continue with model, channels, etc.
 */

import type { WizardStepAction } from '../lib/types.js';

export function getOpenclawSetupSteps(_apiKey: string): WizardStepAction[] {
  return [
    {
      stepId: 'oc-00-security-ack',
      label: 'Security Acknowledgment',
      description: 'OpenClaw requires acknowledging the security warning before setup',
      waitFor: /personal-by-default|lock-down|continue/i,
      response: { type: 'select', index: 1 }, // Arrow down to "Yes"
      postDelay: 2000,
    },
    {
      stepId: 'oc-01-onboard-mode',
      label: 'Onboarding Mode',
      description: 'OpenClaw offers QuickStart vs Manual onboarding mode',
      waitFor: /onboarding.*mode/i,
      response: { type: 'select', index: 0 }, // QuickStart (first option)
      postDelay: 1500,
    },
    {
      stepId: 'oc-02-provider',
      label: 'LLM Provider',
      description: 'Select model/auth provider (~30 options)',
      waitFor: /model.*auth.*provider/i,
      response: { type: 'select', index: 0 }, // OpenAI (first option)
      postDelay: 1000,
    },
    {
      stepId: 'oc-03-auth-method',
      label: 'Auth Method',
      description: 'OpenAI auth method: Codex OAuth or API key',
      waitFor: /auth.*method/i,
      response: { type: 'select', index: 1 }, // "OpenAI API key" (second option)
      postDelay: 1500,
    },
    {
      stepId: 'oc-04-key-provision',
      label: 'API Key Provision',
      description: 'How to provide the API key (paste now, env var, etc.)',
      waitFor: /how.*provide|paste.*key.*now/i,
      response: { type: 'select', index: 0 }, // "Paste API key now"
      postDelay: 1000,
    },
    {
      stepId: 'oc-05-use-env-key',
      label: 'Use Existing Key',
      description: 'Confirm using the OPENAI_API_KEY from environment',
      waitFor: /use.*existing|OPENAI_API_KEY.*env/i,
      response: { type: 'select', index: 0 }, // Yes (first option)
      postDelay: 2000,
    },
    {
      stepId: 'oc-06-model',
      label: 'Model Selection',
      description: 'Select LLM model',
      waitFor: /model|gpt/i,
      response: { type: 'select', index: 0 },
    },
    {
      stepId: 'oc-07-channels',
      label: 'Channel Selection',
      description: 'Select messaging channels',
      waitFor: /channel|messaging/i,
      response: { type: 'multiselect', indices: [0] },
    },
    {
      stepId: 'oc-08-workspace',
      label: 'Workspace',
      description: 'Workspace name or directory',
      waitFor: /workspace|directory|project/i,
      response: { type: 'enter' },
    },
    {
      stepId: 'oc-09-daemon',
      label: 'Daemon Mode',
      description: 'Install as background daemon',
      waitFor: /daemon|background|launchagent|systemd/i,
      response: { type: 'confirm', accept: false },
    },
    {
      stepId: 'oc-10-skills',
      label: 'Skills Selection',
      description: 'Select skills to install',
      waitFor: /skill|plugin|extension/i,
      response: { type: 'enter' },
    },
    {
      stepId: 'oc-11-confirm',
      label: 'Setup Complete',
      description: 'Review and confirm setup',
      waitFor: /review|complete|done|success|finish|summary/i,
      response: { type: 'enter' },
      postDelay: 2000,
    },
  ];
}
