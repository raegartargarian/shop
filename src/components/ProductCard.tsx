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
      <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium text-ink-900">{product.name}</h3>
          <span className="text-sm text-ink-700">
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
