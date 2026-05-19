"use client";

import { useSyncExternalStore } from "react";

export type Address = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type PaymentLite = {
  cardholder: string;
  last4: string;
  expiry: string;
};

export type CheckoutDraft = {
  address?: Address;
  payment?: PaymentLite;
};

const STORAGE_KEY = "sf_checkout_draft_v1";
const CHANGE_EVENT = "sf_checkout_draft_change";

const EMPTY: CheckoutDraft = {};

function read(): CheckoutDraft {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY;
    return parsed as CheckoutDraft;
  } catch {
    return EMPTY;
  }
}

let cache: CheckoutDraft = EMPTY;
let cacheInitialized = false;

function getSnapshot(): CheckoutDraft {
  if (!cacheInitialized) {
    cache = read();
    cacheInitialized = true;
  }
  return cache;
}

function getServerSnapshot(): CheckoutDraft {
  return EMPTY;
}

function write(next: CheckoutDraft) {
  cache = next;
  cacheInitialized = true;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
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

export function useCheckoutDraft() {
  const draft = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setAddress = (address: Address) => {
    write({ ...read(), address });
  };

  const setPayment = (payment: PaymentLite) => {
    write({ ...read(), payment });
  };

  const clear = () => {
    write({});
  };

  return { draft, setAddress, setPayment, clear };
}
