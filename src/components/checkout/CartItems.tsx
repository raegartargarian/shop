"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
};

export function CartItems({ products }: Props) {
  const { items, setQty, remove } = useCart();

  // Build a quick lookup so we don't loop over `products` per line.
  const byId = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.id, p);
    return m;
  }, [products]);

  const lines = items
    .map((it) => {
      const product = byId.get(it.productId);
      if (!product) return null;
      return { product, qty: it.qty };
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.qty,
    0,
  );

  if (lines.length === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-md border border-ink-200 bg-white p-6 text-sm">
        <p className="text-ink-700">Your cart is empty</p>
        <Link href="/" className="text-accent hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-ink-200 rounded-md border border-ink-200 bg-white">
        {lines.map(({ product, qty }) => {
          const lineTotal = product.price * qty;
          return (
            <li
              key={product.id}
              data-testid="cart-line"
              className="flex items-center gap-4 p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-ink-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-ink-900">
                    {product.name}
                  </span>
                  <span className="text-sm text-ink-700">
                    {formatPrice(lineTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(product.id, qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-ink-200 text-ink-700 hover:bg-ink-50"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm text-ink-900">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(product.id, qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-ink-200 text-ink-700 hover:bg-ink-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="text-xs text-ink-500 hover:text-ink-900"
                  >
                    remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-ink-200 pt-3 text-sm">
        <span className="text-ink-700">Subtotal</span>
        <span className="font-medium text-ink-900">{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}
