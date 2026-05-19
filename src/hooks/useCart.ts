"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  qty: number;
  addedAt: number;
};

const STORAGE_KEY = "sf_cart_v1";
const CHANGE_EVENT = "sf_cart_change";

// useSyncExternalStore keeps SSR and client snapshots in sync to avoid
// hydration mismatches when cart state lives only in localStorage.
const EMPTY: CartItem[] = [];

function read(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (it): it is CartItem =>
        it &&
        typeof it.productId === "string" &&
        typeof it.qty === "number" &&
        typeof it.addedAt === "number",
    );
  } catch {
    return EMPTY;
  }
}

let cache: CartItem[] = EMPTY;
let cacheInitialized = false;

function getSnapshot(): CartItem[] {
  if (!cacheInitialized) {
    cache = read();
    cacheInitialized = true;
  }
  return cache;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function write(next: CartItem[]) {
  cache = next;
  cacheInitialized = true;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full or disabled — ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => {
    cache = read();
    cb();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function mutate(fn: (items: CartItem[]) => CartItem[]) {
  const current = read();
  const next = fn(current);
  write(next);
}

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  return read();
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = (productId: string, qty: number = 1) => {
    mutate((cur) => {
      const idx = cur.findIndex((it) => it.productId === productId);
      if (idx === -1) {
        return [...cur, { productId, qty, addedAt: Date.now() }];
      }
      const copy = cur.slice();
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
      return copy;
    });
  };

  const remove = (productId: string) => {
    mutate((cur) => cur.filter((it) => it.productId !== productId));
  };

  const setQty = (productId: string, qty: number) => {
    mutate((cur) => {
      if (qty <= 0) return cur.filter((it) => it.productId !== productId);
      const idx = cur.findIndex((it) => it.productId === productId);
      if (idx === -1) return cur;
      const copy = cur.slice();
      copy[idx] = { ...copy[idx], qty };
      return copy;
    });
  };

  const clear = () => {
    write([]);
  };

  const reorder = (from: number, to: number) => {
    mutate((cur) => {
      if (from === to || from < 0 || to < 0 || from >= cur.length || to >= cur.length) {
        return cur;
      }
      const copy = cur.slice();
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  const count = items.reduce((sum, it) => sum + it.qty, 0);

  return { items, add, remove, setQty, clear, reorder, count };
}
