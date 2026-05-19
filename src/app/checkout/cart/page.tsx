import Link from "next/link";
import { CartItems } from "@/components/checkout/CartItems";
import { getAllProducts } from "@/lib/products";

export default function CartPage() {
  const products = getAllProducts();

  return (
    <div className="flex flex-col gap-6">
      <CartItems products={products} />
      <div className="flex justify-end">
        <Link
          href="/checkout/address"
          className="inline-flex items-center rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
        >
          Continue to address
        </Link>
      </div>
    </div>
  );
}
