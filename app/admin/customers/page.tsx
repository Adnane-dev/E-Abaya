"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface Customer {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  is_admin: boolean;
  is_courier: boolean;
  courier_requested: boolean;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  async function loadCustomers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    const rows = (data as Customer[]) ?? [];
    // Pending courier applications float to the top so admins spot them.
    rows.sort((a, b) => Number(b.courier_requested && !b.is_courier) - Number(a.courier_requested && !a.is_courier));
    setCustomers(rows);
    setIsLoading(false);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function toggleCourier(customer: Customer) {
    const { error } = await supabase
      .from("profiles")
      .update({ is_courier: !customer.is_courier })
      .eq("id", customer.id);

    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    toast.success(customer.is_courier ? "Statut livreur retiré." : "Compte activé comme livreur.");
    loadCustomers();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Clients</h1>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Téléphone</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Adresse</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Inscrit le</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Livreur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm text-foreground">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading && customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {customer.courier_requested && !customer.is_courier && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent whitespace-nowrap">
                          Candidature
                        </span>
                      )}
                      <button
                        onClick={() => toggleCourier(customer)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                          customer.is_courier
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {customer.is_courier ? "Retirer" : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
