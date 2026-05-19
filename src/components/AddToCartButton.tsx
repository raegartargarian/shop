"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";

type Props = {
  productId: string;
};

export function AddToCartButton({ productId }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onClick = () => {
    add(productId);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAdded(false);
      timerRef.current = null;
    }, 1200);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="add-to-cart"
      aria-live="polite"
      className="inline-flex min-w-[140px] items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--color-accent-dark)] active:scale-[0.98]"
    >
      {added ? "added" : "Add to cart"}
    </button>
  );
}
