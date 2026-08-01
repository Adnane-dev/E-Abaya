"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, ShoppingBag, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();

      const [{ count: products }, { count: customers }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);

      setProductCount(products ?? 0);
      setCustomerCount(customers ?? 0);
      setOrderCount(orders?.length ?? 0);
      setTotalRevenue((orders ?? []).reduce((sum, o) => sum + Number(o.total), 0));
    }
    loadStats();
  }, []);

  const stats = [
    {
      label: "Revenu total",
      value: totalRevenue === null ? "…" : `${totalRevenue.toLocaleString("fr-FR")} CFA`,
      icon: Wallet,
    },
    { label: "Clients inscrits", value: customerCount ?? "…", icon: Users },
    { label: "Commandes", value: orderCount ?? "…", icon: ShoppingBag },
    { label: "Produits en ligne", value: productCount ?? "…", icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-6 border-border">
            <div className="flex items-center space-x-4">
              <Icon className="h-10 w-10 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
