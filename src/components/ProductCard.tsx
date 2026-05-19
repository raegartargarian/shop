import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      data-testid="product-card"
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-100 ring-1 ring-inset ring-ink-200/60 transition-shadow duration-300 group-hover:shadow-md group-hover:ring-ink-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-600 backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium text-ink-900 group-hover:text-accent">
            {product.name}
          </h3>
          <span className="text-sm font-medium text-ink-800">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-ink-500">
          {product.description}
        </p>
      </div>
    </Link>
  );
}
