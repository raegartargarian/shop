"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export function CartIcon() {
  const { count } = useCart();
  return (
    <Link
      href="/checkout/cart"
      data-testid="cart-icon"
      className="relative inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
    >
      <span>cart</span>
      {count > 0 ? (
        <span
          aria-label={`${count} items in cart`}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-white"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
