"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface Shop {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminVendorsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  async function loadShops() {
    setIsLoading(true);
    const { data } = await supabase.from("shops").select("*").order("created_at", { ascending: false });
    setShops((data as Shop[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadShops();
  }, []);

  async function toggleApproval(shop: Shop) {
    const { error } = await supabase
      .from("shops")
      .update({ is_approved: !shop.is_approved })
      .eq("id", shop.id);

    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    toast.success(shop.is_approved ? "Boutique désactivée." : "Boutique approuvée.");
    loadShops();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Boutiques vendeurs</h1>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Boutique</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Créée le</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Action</th>
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
            {!isLoading && shops.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Aucune boutique vendeur pour le moment.
                </td>
              </tr>
            )}
            {shops.map((shop) => (
              <tr key={shop.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="font-medium">{shop.name}</div>
                  <div className="text-muted-foreground text-xs">/boutique/{shop.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      shop.is_approved ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}
                  >
                    {shop.is_approved ? "Approuvée" : "En attente"}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(shop.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleApproval(shop)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      shop.is_approved
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {shop.is_approved ? "Désactiver" : "Approuver"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
