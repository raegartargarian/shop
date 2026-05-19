# shopfront

A small Next.js storefront built as a take-home — product catalog, JWT-based sign-in, and a multi-step checkout, all in one repo.

## install

```bash
npm install
```

## dev

```bash
npm run dev
```

Then open http://localhost:3000.

## env

Copy `.env.example` to `.env.local` and fill it in. There's only one variable for now (`JWT_SECRET`); change it to something random before going anywhere near production.

## demo accounts

Hardcoded for the take-home — see `src/lib/auth/users.ts` for the available users and their passwords. There is no signup flow.

## tests

```bash
npm test
```

Jest with jsdom; React Testing Library for component-level tests.

## optimizations

Product images use `next/image` with explicit `sizes="(min-width: 768px) 33vw, 50vw"` and `priority` on the first three cards in the grid so the LCP image isn't lazy-loaded. Catalog reads run through `cache()` so the same render pass shares one fetch, and `generateStaticParams` lets product detail pages prerender at build time. The payment summary on the review step is pulled in with `next/dynamic` (`ssr: false`) since it's only meaningful client-side and shouldn't bloat the initial bundle. App Router `loading.tsx` files on the catalog, product detail, and checkout segments give a streamed skeleton while server work resolves.

## things i'd do next

- Replace the JSON product file with a real database (Postgres + a thin query layer would be enough).
- Paginate the catalog. Twenty items is fine to scroll; two thousand is not.
- Move the cart to optimistic updates so the UI doesn't wait on the round-trip.
- Swap the fake checkout for a real provider (Stripe Payment Element is the obvious one).
