import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full catalog.",
};

export default function HomePage() {
  const products = getAllProducts();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3 border-b border-ink-200/70 pb-8">
        <span className="text-xs uppercase tracking-[0.18em] text-accent">
          this season
        </span>
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          A small catalog of well-made things.
        </h1>
        <p className="max-w-xl text-sm text-ink-600">
          {products.length} items in stock, picked one at a time. Search by name
          or browse by category.
        </p>
      </section>
      {/* TODO: paginate when catalog grows */}
      <ProductGrid products={products} />
    </div>
  );
}
