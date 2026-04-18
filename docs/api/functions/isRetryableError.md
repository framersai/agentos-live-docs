# Function: isRetryableError()

> **isRetryableError**(`error`): `boolean`

Defined in: [packages/agentos/src/api/generateText.ts:607](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L607)

**`Internal`**

HTTP status codes and network error patterns that indicate a transient or
provider-level failure worth retrying with a different provider.

Matched status codes:
- `401` / `403` — authentication / authorization failure (key expired or wrong provider).
- `402` — payment required (quota exhausted).
- `429` — rate limit exceeded.
- `500` / `502` / `503` / `504` — server-side errors.

Matched network errors:
- `fetch failed` — generic fetch rejection (DNS, TLS, etc.).
- `ECONNREFUSED` / `ETIMEDOUT` / `ENOTFOUND` — socket-level failures.

## Parameters

### error

`unknown`

The error to inspect.

## Returns

`boolean`

`true` when the error is likely transient and a different provider
  might succeed; `false` for deterministic user-input errors.
