import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/format";
import { getAllProducts, getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Not found" };
  }

  const title = product.name;
  const description = product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <article className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-ink-500">
            {product.category}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="text-xl text-ink-700">{formatPrice(product.price)}</p>
        </div>
        <p className="text-ink-700">{product.description}</p>
        <p className="text-sm text-ink-500">
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Currently unavailable"}
        </p>
        <div className="pt-2">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
