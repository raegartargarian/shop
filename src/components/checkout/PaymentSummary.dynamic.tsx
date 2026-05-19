"use client";

import dynamic from "next/dynamic";

export const PaymentSummary = dynamic(
  () => import("./PaymentSummary").then((m) => ({ default: m.PaymentSummary })),
  {
    ssr: false,
    loading: () => <div className="h-24 animate-pulse rounded bg-ink-100" />,
  },
);
