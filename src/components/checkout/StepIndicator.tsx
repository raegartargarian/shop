"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const STEPS = ["cart", "address", "payment", "review"] as const;
type Step = (typeof STEPS)[number];

const LABELS: Record<Step, string> = {
  cart: "Cart",
  address: "Address",
  payment: "Payment",
  review: "Review",
};

function currentStep(pathname: string): Step | null {
  for (const s of STEPS) {
    if (pathname.startsWith(`/checkout/${s}`)) return s;
  }
  return null;
}

export function StepIndicator() {
  const pathname = usePathname() ?? "";
  const active = currentStep(pathname);
  const activeIdx = active ? STEPS.indexOf(active) : -1;

  return (
    <ol
      data-testid="step-indicator"
      className="flex items-center gap-2 text-sm"
    >
      {STEPS.map((step, i) => {
        let status: "upcoming" | "current" | "done" = "upcoming";
        if (activeIdx > -1) {
          if (i < activeIdx) status = "done";
          else if (i === activeIdx) status = "current";
        }
        return (
          <li
            key={step}
            data-testid={`step-${step}`}
            data-step={step}
            data-status={status}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                status === "current" &&
                  "border-accent bg-accent text-white",
                status === "done" && "border-ink-700 bg-ink-700 text-white",
                status === "upcoming" && "border-ink-200 text-ink-400",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                status === "current" && "text-ink-900 font-medium",
                status === "done" && "text-ink-700",
                status === "upcoming" && "text-ink-400",
              )}
            >
              {LABELS[step]}
            </span>
            {i < STEPS.length - 1 ? (
              <span className="mx-1 h-px w-6 bg-ink-200" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
