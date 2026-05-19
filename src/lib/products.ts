import { cache } from "react";
import data from "@/data/products.json";
import type { Product } from "@/lib/types";

const products = data as Product[];

export const getAllProducts = cache((): Product[] => products);

export const getProductBySlug = cache(
  (slug: string): Product | undefined =>
    products.find((p) => p.slug === slug),
);

export function listCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}
