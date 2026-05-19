import Link from "next/link";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
        Order placed
      </h2>
      {id ? (
        <p className="text-sm text-ink-700">
          Your order id is{" "}
          <span className="font-mono text-ink-900">{id}</span>.
        </p>
      ) : (
        <p className="text-sm text-ink-700">Your order has been placed.</p>
      )}
      <div>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-ink-200 px-4 py-2 text-sm text-ink-900 hover:bg-ink-50"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
