export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-40 animate-pulse rounded bg-ink-100" />
        <div className="h-4 w-56 animate-pulse rounded bg-ink-100" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-9 w-full animate-pulse rounded-md bg-ink-100" />
        <div className="flex gap-2">
          <div className="h-7 w-14 animate-pulse rounded-full bg-ink-100" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-ink-100" />
          <div className="h-7 w-16 animate-pulse rounded-full bg-ink-100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square animate-pulse rounded-lg bg-ink-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
