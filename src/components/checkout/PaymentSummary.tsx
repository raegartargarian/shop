"use client";

import { formatPrice } from "@/lib/format";

type Props = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export function PaymentSummary({ subtotal, shipping, tax, total }: Props) {
  return (
    <dl className="flex flex-col gap-1 rounded-md border border-ink-200 bg-white p-4 text-sm">
      <Row label="Subtotal" value={formatPrice(subtotal)} />
      <Row label="Shipping" value={formatPrice(shipping)} />
      <Row label="Tax" value={formatPrice(tax)} />
      <div className="mt-2 border-t border-ink-200 pt-2">
        <Row label="Total" value={formatPrice(total)} emphasis />
      </div>
    </dl>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={emphasis ? "font-medium text-ink-900" : "text-ink-700"}>
        {label}
      </dt>
      <dd className={emphasis ? "font-semibold text-ink-900" : "text-ink-900"}>
        {value}
      </dd>
    </div>
  );
}
