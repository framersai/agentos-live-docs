/**
 * Wunderland setup wizard step definitions.
 * Based on packages/wunderland/src/cli/wizards/setup-wizard.ts
 */

import type { WizardStepAction } from '../lib/types.js';

export function getWunderlandQuickStartSteps(apiKey: string): WizardStepAction[] {
  return [
    {
      stepId: 'wl-01-mode',
      label: 'Setup Mode',
      description: 'Choose between QuickStart (3 steps) or Advanced (7+ steps)',
      waitFor: /quickstart|advanced|mode|how.*set.*up/i,
      response: { type: 'select', index: 0 }, // QuickStart
    },
    {
      stepId: 'wl-02-name',
      label: 'Agent Name',
      description: 'Name your AI assistant',
      waitFor: /name|agent.*name|display.*name|what.*call/i,
      response: { type: 'text', value: 'TestAgent' },
    },
    {
      stepId: 'wl-03-observability',
      label: 'Observability',
      description: 'OpenTelemetry configuration',
      waitFor: /observability|telemetry|otel|traces|metrics/i,
      response: { type: 'select', index: 0 }, // Off
    },
    {
      stepId: 'wl-04-env-paste',
      label: 'Import .env',
      description: 'Option to paste existing .env file',
      waitFor: /\.env|paste|import.*env|existing.*key/i,
      response: { type: 'confirm', accept: false }, // No, enter manually
    },
    {
      stepId: 'wl-05-provider',
      label: 'LLM Provider',
      description: 'Select LLM providers (multi-select)',
      waitFor: /provider|llm|openai|anthropic|select.*provider/i,
      response: { type: 'multiselect', indices: [0] }, // OpenAI
      // Note: If OPENAI_API_KEY is in env, Wunderland auto-detects it (no API key prompt)
    },
    {
      stepId: 'wl-06-model',
      label: 'Default Model',
      description: 'Select default LLM model',
      waitFor: /model|default.*model|gpt/i,
      response: { type: 'select', index: 0 }, // First model
    },
    {
      stepId: 'wl-07-channels',
      label: 'Channel Selection',
      description: 'Select messaging channels',
      waitFor: /channel|messaging|connect/i,
      response: { type: 'multiselect', indices: [4] }, // webchat (approx index)
    },
    {
      stepId: 'wl-08-review',
      label: 'Review & Confirm',
      description: 'Review configuration and confirm',
      waitFor: /review|confirm|look.*good|proceed|save/i,
      response: { type: 'confirm', accept: true },
      postDelay: 2000,
    },
  ];
}

export function getWunderlandAdvancedSteps(
  apiKey: string,
  toolKeys?: { serper?: string; newsapi?: string; giphy?: string }
): WizardStepAction[] {
  return [
    {
      stepId: 'wl-adv-01-mode',
      label: 'Setup Mode (Advanced)',
      description: 'Choose Advanced setup for full configuration',
      waitFor: /quickstart|advanced|mode|how.*set.*up/i,
      response: { type: 'select', index: 1 }, // Advanced
    },
    {
      stepId: 'wl-adv-02-name',
      label: 'Agent Name',
      description: 'Name your AI assistant',
      waitFor: /name|agent.*name|display.*name|what.*call/i,
      response: { type: 'text', value: 'TestAgent' },
    },
    {
      stepId: 'wl-adv-03-observability',
      label: 'Observability',
      description: 'OpenTelemetry: traces + metrics',
      waitFor: /observability|telemetry|otel|traces|metrics/i,
      response: { type: 'select', index: 1 }, // Traces + metrics
    },
    {
      stepId: 'wl-adv-04-env-paste',
      label: 'Import .env',
      description: 'Option to paste existing .env file',
      waitFor: /\.env|paste|import.*env|existing.*key/i,
      response: { type: 'confirm', accept: false },
    },
    {
      stepId: 'wl-adv-05-provider',
      label: 'LLM Provider',
      description: 'Select LLM providers',
      waitFor: /provider|llm|openai|anthropic|select.*provider/i,
      response: { type: 'multiselect', indices: [0] }, // OpenAI
    },
    {
      stepId: 'wl-adv-06-api-key',
      label: 'API Key',
      description: 'Enter OpenAI API key',
      waitFor: /api.?key|openai.*key|enter.*key/i,
      response: { type: 'password', value: apiKey },
    },
    {
      stepId: 'wl-adv-07-model',
      label: 'Default Model',
      description: 'Select default LLM model',
      waitFor: /model|default.*model|gpt/i,
      response: { type: 'select', index: 0 },
    },
    {
      stepId: 'wl-adv-08-personality',
      label: 'Personality Preset',
      description:
        'HEXACO personality preset (Helpful, Creative, Analytical, Empathetic, Decisive)',
      waitFor: /personality|hexaco|preset|persona/i,
      response: { type: 'select', index: 0 }, // Helpful Assistant
    },
    {
      stepId: 'wl-adv-09-channels',
      label: 'Channel Selection',
      description: 'Select messaging channels from 29 platforms',
      waitFor: /channel|platform|telegram|discord|webchat/i,
      response: { type: 'multiselect', indices: [0, 1, 4] }, // telegram, discord, webchat (approx indices)
    },
    {
      stepId: 'wl-adv-10-extensions',
      label: 'Extensions & Skills',
      description: 'Select tools and skills from catalog',
      waitFor: /extension|skill|tool|catalog/i,
      response: { type: 'enter' }, // Accept defaults
    },
    {
      stepId: 'wl-adv-11-tool-keys',
      label: 'Tool API Keys',
      description: 'Enter API keys for web search, news, giphy etc.',
      waitFor: /tool.*key|serper|search.*key|web.*search/i,
      response: { type: 'enter' }, // Skip for now
    },
    {
      stepId: 'wl-adv-12-security',
      label: 'Security Features',
      description: 'Pre-LLM classifier, dual-LLM auditor, output signing',
      waitFor: /security|pre.?llm|classifier|audit|signing/i,
      response: { type: 'enter' }, // Accept all 3 defaults
    },
    {
      stepId: 'wl-adv-13-risk',
      label: 'Risk Threshold',
      description: 'Set risk threshold (default 0.7)',
      waitFor: /risk|threshold|0\.7/i,
      response: { type: 'enter' }, // Accept default 0.7
    },
    {
      stepId: 'wl-adv-14-voice',
      label: 'Voice Setup',
      description: 'TTS and STT configuration',
      waitFor: /voice|tts|speech|elevenlabs/i,
      response: { type: 'confirm', accept: false }, // Skip voice for comparison speed
    },
    {
      stepId: 'wl-adv-15-review',
      label: 'Review & Confirm',
      description: 'Review full advanced configuration',
      waitFor: /review|confirm|look.*good|proceed|save/i,
      response: { type: 'confirm', accept: true },
      postDelay: 2000,
    },
  ];
}
