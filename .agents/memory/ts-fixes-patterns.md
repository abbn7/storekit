---
name: TypeScript Fixes — Key Patterns
description: Recurring TS errors and their fixes in this monorepo
---

## Stale lib declarations
When `@workspace/db` or other libs show "has no exported member" errors, run:
```
pnpm run typecheck:libs
```
This rebuilds composite lib declarations. The exports ARE in the source; the error is stale `.d.ts` files.

**Why:** lib packages use `tsc --build` with declaration emit. After schema changes, the old `.d.ts` is used until rebuild.

## Express 5 params typing
`req.params.x` is typed as `string | string[]` in Express 5. Fix:
```typescript
const filename = String(req.params.filename);
```

## objectStorage.ts response JSON
`response.json()` returns `unknown` in strict mode. Fix:
```typescript
const data = (await response.json()) as { signed_url: string };
return data.signed_url;
```

## useListProducts — missing queryKey
Hook requires queryKey in options. Pattern:
```typescript
{ query: { enabled: !!condition, queryKey: getListProductsQueryKey(params) } }
```

## Product type — no `collections` field
Product has `collectionIds: string[]` (UUIDs), NOT `collections: { slug }[]`.
For related products, fetch without collection filter or implement a separate collection lookup.
