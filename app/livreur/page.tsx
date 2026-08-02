"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package, CheckCircle2, Truck, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { CartItem } from "@/lib/cart";

interface Order {
  id: number;
  items: CartItem[];
  status: "confirmed" | "picked_up" | "delivered";
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total: number;
  created_at: string;
}

function orderSubtotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default function CourierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  async function loadOrders() {
    setIsLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["confirmed", "picked_up", "delivered"])
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function advanceStatus(order: Order) {
    const nextStatus = order.status === "confirmed" ? "picked_up" : "delivered";
    const { error } = await supabase.from("orders").update({ status: nextStatus }).eq("id", order.id);

    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    toast.success(
      nextStatus === "picked_up" ? "Commande marquée comme récupérée." : "Commande marquée comme livrée."
    );
    loadOrders();
  }

  const toPickUp = orders.filter((o) => o.status === "confirmed");
  const inTransit = orders.filter((o) => o.status === "picked_up");
  const delivered = orders.filter((o) => o.status === "delivered");
  const totalDelivered = delivered.reduce((sum, o) => sum + orderSubtotal(o), 0);

  function OrderCard({ order }: { order: Order }) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <p className="font-medium text-foreground">Commande n° {order.id}</p>
          <span className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </span>
        </div>

        <ul className="text-sm text-muted-foreground space-y-1 mb-3">
          {order.items.map((item, i) => (
            <li key={i}>{item.name} × {item.quantity}</li>
          ))}
        </ul>

        <div className="text-sm text-foreground mb-4">
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-muted-foreground">{order.customer_phone}</p>
          <p className="text-muted-foreground">{order.delivery_address}</p>
        </div>

        {order.status === "delivered" ? (
          <div className="flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-md text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" /> Livrée
          </div>
        ) : (
          <button
            onClick={() => advanceStatus(order)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {order.status === "confirmed" ? (
              <>
                <Package className="h-4 w-4" /> Marquer comme récupérée
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Marquer comme livrée
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Chargement…</p>;
  }

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">À récupérer</p>
            <p className="text-2xl font-bold text-foreground">{toPickUp.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <Truck className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">En cours de livraison</p>
            <p className="text-2xl font-bold text-foreground">{inTransit.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Livrées</p>
            <p className="text-2xl font-bold text-foreground">{delivered.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">À récupérer ({toPickUp.length})</h2>
        {toPickUp.length === 0 ? (
          <p className="text-muted-foreground">Aucune commande à récupérer pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toPickUp.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">En cours de livraison ({inTransit.length})</h2>
        {inTransit.length === 0 ? (
          <p className="text-muted-foreground">Aucune commande en cours de livraison.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inTransit.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-foreground">Historique des livraisons ({delivered.length})</h2>
          {delivered.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Total livré : <span className="text-accent font-semibold">{totalDelivered.toLocaleString("fr-FR")} CFA</span>
            </p>
          )}
        </div>
        {delivered.length === 0 ? (
          <p className="text-muted-foreground">Aucune livraison effectuée pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {delivered.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
