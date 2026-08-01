"use client";

import { useEffect, useState } from "react";
import { ChartComponent } from "./chartcomponent";
import { createClient } from "@/lib/supabase";

export default function Analytics() {
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const [{ count: customers }, { data: orders }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);
      setCustomerCount(customers ?? 0);
      setOrderCount(orders?.length ?? 0);
      setTotalRevenue((orders ?? []).reduce((sum, o) => sum + Number(o.total), 0));
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Statistiques</h1>

      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-foreground mb-4">Vue d&apos;ensemble</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <p className="text-foreground">
            Clients inscrits : <span className="font-semibold">{customerCount ?? "…"}</span>
          </p>
          <p className="text-foreground">
            Revenu total :{" "}
            <span className="font-semibold">
              {totalRevenue === null ? "…" : `${totalRevenue.toLocaleString("fr-FR")} CFA`}
            </span>
          </p>
          <p className="text-foreground">
            Commandes : <span className="font-semibold">{orderCount ?? "…"}</span>
          </p>
        </div>

        <ChartComponent />
      </div>
    </div>
  );
}
