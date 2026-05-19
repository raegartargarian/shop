"use client";

import { cn } from "@/lib/cn";

type Props = {
  categories: string[];
  value: string | null;
  onChange: (next: string | null) => void;
};

export function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill active={value === null} onClick={() => onChange(null)}>
        All
      </Pill>
      {categories.map((c) => (
        <Pill
          key={c}
          active={value === c}
          onClick={() => onChange(c)}
        >
          {c}
        </Pill>
      ))}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm capitalize transition-colors",
        active
          ? "border-accent bg-accent text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:text-ink-900",
      )}
    >
      {children}
    </button>
  );
}
