# Function: toDotPath()

> **toDotPath**(`_path`): `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:218

Format a ZodError as a human-readable string in the following form.

From

```ts
ZodError {
  issues: [
    {
      expected: 'string',
      code: 'invalid_type',
      path: [ 'username' ],
      message: 'Invalid input: expected string'
    },
    {
      expected: 'number',
      code: 'invalid_type',
      path: [ 'favoriteNumbers', 1 ],
      message: 'Invalid input: expected number'
    }
  ];
}
```

to

```
username
  ✖ Expected number, received string at "username
favoriteNumbers[0]
  ✖ Invalid input: expected number
```

## Parameters

### \_path

readonly (`string` \| `number` \| `symbol` \| `PathSegment`)[]

## Returns

`string`
