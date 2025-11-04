# Retention & Privacy Updates

- Agency launch metadata is stored in gency_usage_log with a default retention window of approximately 18 months. Records store user_id, plan_id, workflow_definition_id, seats, and timestamps so billing disputes can be resolved.
- Persona bundles imported through gentos_persona_submissions remain in pending state until an admin approves them. Approved bundles materialise prompts under prompts/_dynamic; rejected bundles retain audit trails but do not ship to runtime.
- Marketplace listings carry explicit visibility (public, unlisted, org, invite) and status fields. Only owners or organisation members can mutate non-public listings.
- Import/export APIs (/api/agents/bundles/*) must be called over authenticated channels. Bundles may include proprietary prompts; encrypt files at rest when storing them outside AgentOS.

> Copy these updates into external terms/privacy collateral before launch.
