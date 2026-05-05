# Type Alias: CostPreset

> **CostPreset** = `"quality"` \| `"economy"`

Defined in: [apps/paracosm/src/cli/sim-config.ts:412](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/cli/sim-config.ts#L412)

Cost-vs-quality preset for `runSimulation` model routing.

- `'quality'` (default): `DEFAULT_MODELS` — departments on flagship
  (`gpt-5.4` / `claude-sonnet-4-6`) for reliable tool forging, other
  roles on mid/cheap tier. Per-run spend ~$1-3 on OpenAI, ~$3-7 on
  Anthropic at 6 turns × 5 depts × 100 agents.

- `'economy'`: `DEMO_MODELS` — departments on `gpt-4o` (half the
  cost of flagship, adequate for forge shape compliance on most
  scenarios), everything else on `gpt-5.4-nano` / Haiku. Per-run
  spend drops to ~$0.20-0.60 on OpenAI. Use for quick iteration;
  forge approval rate drops ~10-20pp vs quality.

Explicit `models` overrides always win over the preset.
