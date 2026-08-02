"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase";
import { STATUS_LABELS } from "@/lib/orderStatus";
import { markOrdersSeen } from "@/lib/orderNotifications";

interface Order {
  id: number;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  created_at: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadOrders() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      const loaded = (data as Order[]) ?? [];
      setOrders(loaded);
      setIsLoading(false);
      markOrdersSeen(loaded);

      const channel = supabase
        .channel("my-orders-status")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${userData.user.id}` },
          (payload) => {
            const updated = payload.new as Order;
            setOrders((prev) => {
              const next = prev.map((o) => (o.id === updated.id ? updated : o));
              markOrdersSeen(next);
              return next;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    const cleanupPromise = loadOrders();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Mes commandes</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement…</p>
        ) : !isLoggedIn ? (
          <p className="text-muted-foreground">
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Connectez-vous
            </Link>{" "}
            pour voir vos commandes.
          </p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore de commande.</p>
            <Link href="/products" className="text-accent hover:text-accent/80 font-medium">
              Découvrir nos produits →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/commande/${order.id}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">Commande n° {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")} ·{" "}
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} article(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent font-semibold">
                      {Number(order.total).toLocaleString("fr-FR")} CFA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
