# paracosm/swarm

`paracosm/swarm` — focused API surface for the agent-swarm view of a
paracosm run. Pairs with `paracosm/schema` (types) and
root `WorldModel` static helpers; use this module when you only
need swarm inspection without pulling the full WorldModel surface.

## Example

```ts
import { getSwarm, swarmByDepartment, moodHistogram } from 'paracosm/swarm';

const swarm = getSwarm(runArtifact);
if (swarm) {
  console.log(`${swarm.population} agents`);
  console.log(swarmByDepartment(runArtifact));
  console.log(moodHistogram(swarm));
}
```

Every function is a pure projection over the public `RunArtifact`
shape. No I/O, no side effects, no live LLM calls.

## Functions

- [aliveCount](functions/aliveCount.md)
- [deathCount](functions/deathCount.md)
- [departmentHeadcount](functions/departmentHeadcount.md)
- [getSwarm](functions/getSwarm.md)
- [moodHistogram](functions/moodHistogram.md)
- [swarmByDepartment](functions/swarmByDepartment.md)
- [swarmFamilyTree](functions/swarmFamilyTree.md)

## References

### SwarmAgent

Re-exports [SwarmAgent](../schema/type-aliases/SwarmAgent.md)

***

### SwarmSnapshot

Re-exports [SwarmSnapshot](../schema/type-aliases/SwarmSnapshot.md)
