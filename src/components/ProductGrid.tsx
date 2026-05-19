"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const items = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, deferredQuery, category]);

  return (
    <div data-testid="product-grid" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400"
        />
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
        />
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-500">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
