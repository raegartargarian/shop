"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
};

export function CartItems({ products }: Props) {
  const { items, setQty, remove, reorder } = useCart();

  // Build a quick lookup so we don't loop over `products` per line.
  const byId = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.id, p);
    return m;
  }, [products]);

  const lines = items
    .map((it) => {
      const product = byId.get(it.productId);
      if (!product) return null;
      return { product, qty: it.qty };
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.qty,
    0,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = useMemo(() => items.map((it) => it.productId), [items]);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;
      const from = ids.indexOf(String(active.id));
      const to = ids.indexOf(String(over.id));
      if (from !== -1 && to !== -1) reorder(from, to);
    },
    [ids, reorder],
  );

  if (lines.length === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-md border border-ink-200 bg-white p-6 text-sm">
        <p className="text-ink-700">Your cart is empty</p>
        <Link href="/" className="text-accent hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ink-500">
        Drag the handle to reorder. Keyboard: tab to a handle, space to pick up,
        arrow keys to move.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ul
            data-testid="cart-lines"
            className="flex flex-col divide-y divide-ink-200 overflow-hidden rounded-md border border-ink-200 bg-white"
          >
            {lines.map(({ product, qty }) => (
              <SortableCartLine
                key={product.id}
                product={product}
                qty={qty}
                onDecrease={() => setQty(product.id, qty - 1)}
                onIncrease={() => setQty(product.id, qty + 1)}
                onRemove={() => remove(product.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex items-center justify-between border-t border-ink-200 pt-3 text-sm">
        <span className="text-ink-700">Subtotal</span>
        <span className="font-medium text-ink-900">{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}

type LineProps = {
  product: Product;
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

function SortableCartLine({
  product,
  qty,
  onDecrease,
  onIncrease,
  onRemove,
}: LineProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    boxShadow: isDragging ? "0 8px 20px rgb(20 20 15 / 0.12)" : undefined,
    background: isDragging ? "white" : undefined,
  };

  const lineTotal = product.price * qty;

  return (
    <li
      ref={setNodeRef}
      style={style}
      data-testid="cart-line"
      className="flex items-center gap-3 p-4"
    >
      <button
        type="button"
        aria-label={`Reorder ${product.name}`}
        className="cursor-grab touch-none rounded p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <DragHandle />
      </button>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-ink-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-ink-900">
            {product.name}
          </span>
          <span className="text-sm text-ink-700">{formatPrice(lineTotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={onDecrease}
              className="flex h-7 w-7 items-center justify-center rounded border border-ink-200 text-ink-700 hover:bg-ink-50"
            >
              -
            </button>
            <span className="w-6 text-center text-sm text-ink-900">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={onIncrease}
              className="flex h-7 w-7 items-center justify-center rounded border border-ink-200 text-ink-700 hover:bg-ink-50"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-ink-500 hover:text-ink-900"
          >
            remove
          </button>
        </div>
      </div>
    </li>
  );
}

function DragHandle() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 10 16"
      aria-hidden
      className="fill-current"
    >
      <circle cx="2" cy="2" r="1.4" />
      <circle cx="8" cy="2" r="1.4" />
      <circle cx="2" cy="8" r="1.4" />
      <circle cx="8" cy="8" r="1.4" />
      <circle cx="2" cy="14" r="1.4" />
      <circle cx="8" cy="14" r="1.4" />
    </svg>
  );
}
