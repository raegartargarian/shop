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
    <main className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold text-ink-900 mb-6">sign in</h1>
      <form
        data-testid="login-form"
        onSubmit={onSubmit}
        className="flex flex-col gap-3"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-600">email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="rounded border border-ink-200 px-3 py-2 bg-white focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-600">password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="rounded border border-ink-200 px-3 py-2 bg-white focus:outline-none"
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
          className="mt-2 rounded bg-ink-900 text-white py-2 text-sm font-medium hover:bg-ink-800 disabled:opacity-60"
        >
          {submitting ? "signing in…" : "sign in"}
        </button>
      </form>
      <p className="mt-6 text-xs text-ink-400">
        demo: customer@demo.local / customerpass — admin@demo.local / adminpass
      </p>
    </main>
  );
}
