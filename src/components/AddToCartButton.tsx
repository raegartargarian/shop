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
      className="inline-flex items-center rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
    >
      {added ? "added" : "Add to cart"}
    </button>
  );
}
