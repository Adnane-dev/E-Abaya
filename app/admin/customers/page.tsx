"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  is_admin: boolean;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setCustomers((data as Customer[]) ?? []);
      setIsLoading(false);
    }
    loadCustomers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Clients</h1>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Nom</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Téléphone</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Adresse</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Aucun client inscrit pour le moment.
                </td>
              </tr>
            )}
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">{customer.full_name || "—"}</td>
                <td className="px-6 py-4">{customer.phone || "—"}</td>
                <td className="px-6 py-4">{customer.address || "—"}</td>
                <td className="px-6 py-4">
                  {new Date(customer.created_at).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
