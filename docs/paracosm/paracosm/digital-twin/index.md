# paracosm/digital-twin

Subpath export: paracosm/digital-twin

Curated entry point for the digital-twin use case. `DigitalTwin` is
an alias for the same `WorldModel` class exported from
`paracosm`; the alias names the use case the user is
modeling rather than the underlying mechanism.

Use this subpath when:
  - You have a specific subject (person, organism, organization, or
    system) you want to simulate under counterfactual interventions.
  - You want the most ergonomic surface for `intervene()`.
  - You want type-only access to `SubjectConfig` and `InterventionConfig`
    without importing the root API.

Use the root `paracosm` export instead when:
  - You are running civilization simulations or policy comparisons
    across scenarios.
  - You need access to the full `WorldModel.batch`, `WorldModel.fork`,
    or `WorldModel.replay` surface (those methods are also available
    here, since `DigitalTwin === WorldModel`, but the subpath
    docstrings focus on the digital-twin case).

Both entry points back-end to the same class. Choosing one is a
positioning decision, not a functional one.

## Example

```ts
import { DigitalTwin, type SubjectConfig, type InterventionConfig } from 'paracosm/digital-twin';

const twin = await DigitalTwin.fromJson(scenarioJson);
const subject: SubjectConfig = { id: 'company', kind: 'organization', attributes: { headcount: 100 } };
const intervention: InterventionConfig = { id: 'rif', kind: 'policy', description: '25% RIF', parameters: { percent: 25 } };
const artifact = await twin.intervene({ subject, intervention, actor: leader, maxTurns: 4 });
```

## References

### DigitalTwin

Renames and re-exports [WorldModel](../classes/WorldModel.md)

***

### InterventionConfig

Re-exports [InterventionConfig](../type-aliases/InterventionConfig.md)

***

### RunArtifact

Re-exports [RunArtifact](../type-aliases/RunArtifact.md)

***

### SubjectConfig

Re-exports [SubjectConfig](../type-aliases/SubjectConfig.md)
