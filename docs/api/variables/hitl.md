# Variable: hitl

> `const` **hitl**: `object`

Defined in: [packages/agentos/src/api/hitl.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/hitl.ts#L57)

A collection of factory functions that produce [HitlHandler](../type-aliases/HitlHandler.md) instances
for common approval patterns.

All handlers are composable: you can wrap any factory result in your own
function to add logging, fallback logic, or conditional routing.

## Type Declaration

### autoApprove()

> **autoApprove**(): [`HitlHandler`](../type-aliases/HitlHandler.md)

Returns a handler that approves every request immediately without any
human interaction.

Intended for use in automated tests and CI pipelines where human review
is not required.

#### Returns

[`HitlHandler`](../type-aliases/HitlHandler.md)

A [HitlHandler](../type-aliases/HitlHandler.md) that always resolves `{ approved: true }`.

#### Example

```ts
handler: hitl.autoApprove()
```

### autoReject()

> **autoReject**(`reason?`): [`HitlHandler`](../type-aliases/HitlHandler.md)

Returns a handler that rejects every request immediately without any
human interaction.

Useful for dry-run or read-only execution modes where you want to confirm
which actions would have been triggered without actually permitting any.

#### Parameters

##### reason?

`string`

Optional human-readable rejection reason appended to the
  decision.  Defaults to `"Auto-rejected"`.

#### Returns

[`HitlHandler`](../type-aliases/HitlHandler.md)

A [HitlHandler](../type-aliases/HitlHandler.md) that always resolves `{ approved: false, reason }`.

#### Example

```ts
handler: hitl.autoReject('dry-run mode — no side effects permitted')
```

### cli()

> **cli**(): [`HitlHandler`](../type-aliases/HitlHandler.md)

Returns a handler that pauses execution and prompts the user interactively
via `stdin`/`stdout`.

Displays the approval request summary (description, agent, action, type)
and waits for the user to type `y` (approve) or `n` (reject).

**Important**: This handler reads from `process.stdin`, so it must only be
used in interactive terminal environments (not in CI/CD pipelines or
serverless functions).

#### Returns

[`HitlHandler`](../type-aliases/HitlHandler.md)

A [HitlHandler](../type-aliases/HitlHandler.md) that waits for interactive CLI input.

#### Example

```ts
handler: hitl.cli()
```

### slack()

> **slack**(`opts`): [`HitlHandler`](../type-aliases/HitlHandler.md)

Returns a handler that posts a notification to a Slack channel when an
approval is requested.

**v1 behaviour**: The message is sent to the configured Slack channel, then
the handler immediately auto-approves.  A future version will poll for
emoji reactions (`:white_check_mark:` / `:x:`) on the posted message before
resolving.

#### Parameters

##### opts

###### channel

`string`

Slack channel ID or name (e.g. `"#approvals"` or
  `"C0123456789"`).

###### token

`string`

Slack Bot OAuth token with `chat:write` scope.

#### Returns

[`HitlHandler`](../type-aliases/HitlHandler.md)

A [HitlHandler](../type-aliases/HitlHandler.md) that posts to Slack and auto-approves for v1.

#### Example

```ts
handler: hitl.slack({ channel: '#approvals', token: process.env.SLACK_BOT_TOKEN! })
```

### webhook()

> **webhook**(`url`): [`HitlHandler`](../type-aliases/HitlHandler.md)

Returns a handler that POSTs the [ApprovalRequest](../interfaces/ApprovalRequest.md) as JSON to the
provided URL and expects the server to respond with an [ApprovalDecision](../interfaces/ApprovalDecision.md).

The server must respond with `Content-Type: application/json` containing an
object with at least an `approved: boolean` field.  Non-2xx responses are
treated as a rejection with the HTTP status code as the reason.

#### Parameters

##### url

`string`

The full URL to POST approval requests to.

#### Returns

[`HitlHandler`](../type-aliases/HitlHandler.md)

A [HitlHandler](../type-aliases/HitlHandler.md) that delegates decisions to an HTTP endpoint.

#### Example

```ts
handler: hitl.webhook('https://my-approval-service.example.com/approve')
```
