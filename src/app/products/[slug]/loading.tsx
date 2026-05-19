export default function Loading() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-lg bg-ink-100" />
      <div className="flex flex-col gap-4">
        <div className="h-8 w-2/3 animate-pulse rounded bg-ink-100" />
        <div className="h-5 w-24 animate-pulse rounded bg-ink-100" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
          <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
        </div>
        <div className="mt-4 h-10 w-40 animate-pulse rounded-md bg-ink-100" />
      </div>
    </div>
  );
}
