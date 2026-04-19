# Class: GraphValidator

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/compiler/Validator.ts#L59)

Static validator for compiled execution graphs.

Runs a suite of structural checks against a `CompiledExecutionGraph`:

1. **Cycle detection** — rejects cyclic graphs when `requireAcyclic` is not `false`.
2. **Unreachable nodes** — warns when one or more nodes cannot be reached from `__START__`.
3. **Edge reference integrity** — errors when an edge's source/target names a non-existent node
   (ignoring the sentinel values `__START__` and `__END__`).
4. **Entry point** — errors when no edge originates from `__START__`.
5. **Exit point** — errors when no edge terminates at `__END__`.

## Example

```ts
const result = GraphValidator.validate(graph, { requireAcyclic: true });
if (!result.valid) {
  throw new Error(result.errors.join('\n'));
}
```

## Constructors

### Constructor

> **new GraphValidator**(): `GraphValidator`

#### Returns

`GraphValidator`

## Methods

### validate()

> `static` **validate**(`graph`, `options?`): [`ValidationResult`](../interfaces/ValidationResult.md)

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:69](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/compiler/Validator.ts#L69)

Validates a compiled execution graph.

#### Parameters

##### graph

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

The `CompiledExecutionGraph` produced by a compiler pass.

##### options?

Optional validation flags.

###### requireAcyclic?

`boolean`

When `true` (the default) any cycle is treated as an error.
  Pass `false` to allow cyclic graphs (e.g. iterative agent loops).

#### Returns

[`ValidationResult`](../interfaces/ValidationResult.md)

A `ValidationResult` describing errors and warnings found.
