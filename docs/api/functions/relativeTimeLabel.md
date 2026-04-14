# Function: relativeTimeLabel()

> **relativeTimeLabel**(`timestamp`, `now?`): `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/temporal.ts:72](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/temporal.ts#L72)

Produce a human-friendly label describing how long ago `timestamp` was
relative to `now` (defaults to `Date.now()`).

Examples:
- "just now"       (< 60 s)
- "5 minutes ago"  (< 1 h)
- "2 hours ago"    (< today boundary, but > 1 h)
- "earlier today"  (same calendar day, > 1 h)
- "yesterday"      (previous calendar day)
- "last Tuesday"   (2-6 days ago, uses day name)
- "3 days ago"     (2-6 days ago, alternative when day name would be confusing)
- "last week"      (7-13 days)
- "2 weeks ago"    (14-20 days)
- "3 weeks ago"    (21-27 days)
- "last month"     (28-59 days)
- "2 months ago"   (60-89 days)
- "N months ago"   (90-364 days)
- "last year"      (365-729 days)
- "N years ago"    (730+ days)

Future timestamps return "in the future".

## Parameters

### timestamp

`number`

Unix ms timestamp to describe.

### now?

`number`

Reference timestamp (defaults to Date.now()).

## Returns

`string`

Human-friendly relative time string.
