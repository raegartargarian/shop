"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCheckoutDraft } from "@/hooks/useCheckoutDraft";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { PaymentSummary } from "./PaymentSummary.dynamic";

type Props = {
  products: Product[];
};

const SHIPPING_FLAT = 7.5;
const TAX_RATE = 0.0725;

export function ReviewSummary({ products }: Props) {
  const router = useRouter();
  const { items, clear: clearCart } = useCart();
  const { draft, clear: clearDraft } = useCheckoutDraft();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  const byId = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.id, p);
    return m;
  }, [products]);

  const lines = useMemo(
    () =>
      items
        .map((it) => {
          const product = byId.get(it.productId);
          return product ? { product, qty: it.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => x !== null),
    [items, byId],
  );

  const totals = useMemo(() => {
    const subtotal = lines.reduce(
      (sum, l) => sum + l.product.price * l.qty,
      0,
    );
    const shipping = lines.length > 0 ? SHIPPING_FLAT : 0;
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const total = +(subtotal + shipping + tax).toFixed(2);
    return { subtotal, shipping, tax, total };
  }, [lines]);

  const placeOrder = useCallback(async () => {
    setError(null);
    setNeedsLogin(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items,
          address: draft.address,
          payment: draft.payment,
          totals,
        }),
      });
      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }
      if (res.status !== 201) {
        setError("could not place order, try again");
        return;
      }
      const body = (await res.json()) as { id: string };
      clearCart();
      clearDraft();
      router.push(`/checkout/confirmation?id=${body.id}`);
    } catch {
      setError("network error, try again");
    } finally {
      setSubmitting(false);
    }
  }, [items, draft, totals, clearCart, clearDraft, router]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2 rounded-md border border-ink-200 bg-white p-4 text-sm">
        <h2 className="text-sm font-medium text-ink-900">Shipping to</h2>
        {draft.address ? (
          <address className="not-italic text-ink-700">
            <div>{draft.address.fullName}</div>
            <div>{draft.address.line1}</div>
            {draft.address.line2 ? <div>{draft.address.line2}</div> : null}
            <div>
              {draft.address.city}, {draft.address.state}{" "}
              {draft.address.postalCode}
            </div>
            <div>{draft.address.country}</div>
          </address>
        ) : (
          <p className="text-ink-500">
            No address yet —{" "}
            <Link
              href="/checkout/address"
              className="text-accent hover:underline"
            >
              add one
            </Link>
            .
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2 rounded-md border border-ink-200 bg-white p-4 text-sm">
        <h2 className="text-sm font-medium text-ink-900">Payment</h2>
        {draft.payment ? (
          <p className="text-ink-700">
            {draft.payment.cardholder} — card ending in {draft.payment.last4}
          </p>
        ) : (
          <p className="text-ink-500">
            No payment yet —{" "}
            <Link
              href="/checkout/payment"
              className="text-accent hover:underline"
            >
              add one
            </Link>
            .
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-md border border-ink-200 bg-white p-4 text-sm">
        <h2 className="text-sm font-medium text-ink-900">Items</h2>
        {lines.length === 0 ? (
          <p className="text-ink-500">Your cart is empty.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-ink-200">
            {lines.map(({ product, qty }) => (
              <li
                key={product.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-ink-900">
                  {product.name}{" "}
                  <span className="text-ink-500">x {qty}</span>
                </span>
                <span className="text-ink-700">
                  {formatPrice(product.price * qty)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PaymentSummary
        subtotal={totals.subtotal}
        shipping={totals.shipping}
        tax={totals.tax}
        total={totals.total}
      />

      {needsLogin ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          please sign in to place an order —{" "}
          <Link
            href="/login?next=/checkout/review"
            className="underline"
          >
            sign in
          </Link>
        </div>
      ) : null}
      {error ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={placeOrder}
          disabled={submitting || lines.length === 0}
          className="inline-flex items-center rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-400"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </div>
    </div>
  );
}
