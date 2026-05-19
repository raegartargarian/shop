"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MeUser = {
  id: string;
  email: string;
  role: "customer" | "admin";
  name: string;
};

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setUser(data.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.refresh();
  }

  if (loading) {
    return (
      <div data-testid="user-menu" className="text-sm text-ink-400">
        …
      </div>
    );
  }

  if (!user) {
    return (
      <div data-testid="user-menu" className="text-sm">
        <Link href="/login" className="text-ink-700 hover:text-ink-900">
          sign in
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="user-menu" className="relative text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-ink-700 hover:text-ink-900"
      >
        Hi, {user.name} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded border border-ink-100 bg-white shadow-sm">
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-ink-700 hover:bg-ink-50"
          >
            account
          </Link>
          {user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-ink-700 hover:bg-ink-50"
            >
              admin
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="block w-full text-left px-3 py-2 text-ink-700 hover:bg-ink-50"
          >
            sign out
          </button>
        </div>
      )}
    </div>
  );
}
