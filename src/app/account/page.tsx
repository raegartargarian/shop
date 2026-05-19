import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/session";
import SignOutButton from "./SignOutButton";

export default async function AccountPage() {
  const claims = await getSessionFromCookies();
  if (!claims) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink-900 mb-6">account</h1>

      <section className="rounded border border-ink-100 p-4 mb-8">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-ink-500">email</dt>
          <dd className="text-ink-900">{claims.email}</dd>
          <dt className="text-ink-500">role</dt>
          <dd className="text-ink-900">{claims.role}</dd>
        </dl>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-ink-700 mb-2">recent orders</h2>
        {/* TODO: wire up real orders once B3 ships the orders API */}
        <p className="text-sm text-ink-400">No orders yet.</p>
      </section>
    </main>
  );
}
