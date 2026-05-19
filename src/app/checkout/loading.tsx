export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col gap-2">
            <div className="h-2 w-full animate-pulse rounded-full bg-ink-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-ink-100" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-6 w-1/3 animate-pulse rounded bg-ink-100" />
        <div className="h-24 w-full animate-pulse rounded-md bg-ink-100" />
        <div className="h-24 w-full animate-pulse rounded-md bg-ink-100" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-ink-100" />
      </div>
    </div>
  );
}
