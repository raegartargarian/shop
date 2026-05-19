import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/session";
import { getAllProducts } from "@/lib/products";

export default async function AdminPage() {
  const claims = await getSessionFromCookies();
  if (!claims || claims.role !== "admin") redirect("/login");

  const products = getAllProducts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink-900 mb-6">
        admin / inventory
      </h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-500 border-b border-ink-100">
            <th className="py-2 font-medium">name</th>
            <th className="py-2 font-medium text-right">stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-ink-100/60">
              <td className="py-2 text-ink-900">{p.name}</td>
              <td className="py-2 text-right tabular-nums text-ink-700">
                {p.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
