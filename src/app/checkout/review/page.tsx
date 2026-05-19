import { ReviewSummary } from "@/components/checkout/ReviewSummary";
import { getAllProducts } from "@/lib/products";

export default function ReviewPage() {
  const products = getAllProducts();
  return <ReviewSummary products={products} />;
}
