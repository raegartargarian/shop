"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "login failed");
        setSubmitting(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm py-8">
      <div className="rounded-xl border border-ink-200/70 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-ink-900">Sign in</h1>
        <p className="mb-6 text-sm text-ink-500">
          Use one of the demo accounts below.
        </p>
        <form
          data-testid="login-form"
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ink-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-900 focus:border-accent focus:outline-none"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-accent py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--color-accent-dark)] disabled:opacity-60"
          >
            {submitting ? "signing in…" : "Sign in"}
          </button>
        </form>
      </div>
      <div className="mt-4 rounded-md bg-white/60 px-4 py-3 text-xs text-ink-500 ring-1 ring-ink-200/60">
        <p className="mb-1 font-medium text-ink-700">Demo accounts</p>
        <p>customer@demo.local / customerpass</p>
        <p>admin@demo.local / adminpass</p>
      </div>
    </div>
  );
}
