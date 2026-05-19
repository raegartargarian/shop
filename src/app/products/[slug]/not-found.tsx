import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Product not found
      </h1>
      <p className="text-ink-500">
        That item is no longer in the catalog, or the link is wrong.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-accent hover:underline"
      >
        Back to the shop
      </Link>
    </div>
  );
}
