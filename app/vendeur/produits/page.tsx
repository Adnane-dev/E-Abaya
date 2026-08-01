"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ProductManager } from "@/components/admin/ProductManager";

export default function VendorProductsPage() {
  const [shopId, setShopId] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    async function loadShop() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

      setShopId(shop?.id ?? null);
    }
    loadShop();
  }, []);

  if (shopId === undefined) {
    return <p className="text-muted-foreground">Chargement…</p>;
  }
  if (shopId === null) {
    return <p className="text-muted-foreground">Boutique introuvable.</p>;
  }

  return <ProductManager shopId={shopId} />;
}
