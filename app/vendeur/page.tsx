"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface ShopSummary {
  name: string;
  is_approved: boolean;
}

export default function VendorDashboard() {
  const [shop, setShop] = useState<ShopSummary | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: shopData } = await supabase
        .from("shops")
        .select("id, name, is_approved")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

      if (!shopData) return;
      setShop(shopData);

      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shopData.id);
      setProductCount(count ?? 0);
    }
    loadData();
  }, []);

  if (!shop) {
    return <p className="text-muted-foreground">Chargement…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-serif text-2xl font-bold text-foreground">Bienvenue, {shop.name}</h1>

      <div
        className={`flex items-center gap-3 p-4 rounded-lg border ${
          shop.is_approved
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-accent/30 bg-accent/5 text-accent"
        }`}
      >
        {shop.is_approved ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        <span>
          {shop.is_approved
            ? "Votre boutique est validée et visible sur le site."
            : "Votre boutique est en attente de validation par l'équipe. Vous pouvez déjà préparer vos produits."}
        </span>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm text-muted-foreground">Produits en ligne</p>
        <p className="text-2xl font-bold text-foreground">{productCount ?? "…"}</p>
      </div>
    </div>
  );
}
