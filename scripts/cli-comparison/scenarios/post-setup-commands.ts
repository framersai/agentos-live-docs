/**
 * Non-interactive CLI commands to run and screenshot on both CLIs.
 */

import type { CommandSpec } from '../lib/types.js';

export const COMMANDS: CommandSpec[] = [
  {
    label: 'Help',
    openclaw: 'openclaw --help',
    wunderland: 'wunderland --help',
    differenceNotes: [
      'Wunderland has 17+ commands vs OpenClaw ~12',
      'Wunderland adds: seal, list-presets, skills, models, plugins, export, import',
    ],
  },
  {
    label: 'Version',
    openclaw: 'openclaw --version',
    wunderland: 'wunderland version',
    differenceNotes: [
      'Different versioning: OpenClaw uses calendar (2026.x.x), Wunderland uses semver (0.x.x)',
    ],
  },
  {
    label: 'Doctor-Health-Check',
    openclaw: 'openclaw doctor',
    wunderland: 'wunderland doctor',
    differenceNotes: [
      'Both check system health',
      'Wunderland checks HEXACO personality config, security tier, and extension health',
    ],
  },
  {
    label: 'Status',
    openclaw: 'openclaw status',
    wunderland: 'wunderland status',
    differenceNotes: ['Wunderland shows security tier, personality preset, active channels'],
  },
  {
    label: 'Models',
    openclaw: 'openclaw models',
    wunderland: 'wunderland models',
    differenceNotes: [
      'Wunderland supports 13 LLM providers vs OpenClaw ~4',
      'Wunderland includes SmallModelResolver for cost optimization',
    ],
  },
  {
    label: 'Skills',
    openclaw: 'openclaw skills',
    wunderland: 'wunderland skills list',
    differenceNotes: [
      'Wunderland has 18 curated skills with SKILL.md descriptors',
      'OpenClaw uses community skill repository',
    ],
  },
  {
    label: 'Agent Presets',
    openclaw: null,
    wunderland: 'wunderland list-presets',
    differenceNotes: [
      'Wunderland-only: 8 agent presets (research, support, creative, code-review, data, security, devops, personal)',
      'Each preset includes HEXACO traits, security tier, skill suggestions, persona document',
    ],
  },
  {
    label: 'Channels',
    openclaw: 'openclaw channels',
    wunderland: 'wunderland channels',
    differenceNotes: [
      'Wunderland: 29 channel platforms',
      'OpenClaw: ~8 channel platforms',
      'Wunderland adds: Signal, iMessage, Zalo, Nostr, Twitch, Line, Feishu, Mattermost, NextcloudTalk, Tlon',
    ],
  },
];
