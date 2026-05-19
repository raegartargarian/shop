import type { Metadata } from "next";
import { StepIndicator } from "@/components/checkout/StepIndicator";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-ink-900">
        checkout
      </h1>
      <div className="mb-8">
        <StepIndicator />
      </div>
      {children}
    </div>
  );
}
