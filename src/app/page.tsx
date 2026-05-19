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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
        <p className="text-sm text-ink-500">
          {products.length} items, picked one at a time.
        </p>
      </div>
      {/* TODO: paginate when catalog grows */}
      <ProductGrid products={products} />
    </div>
  );
}
