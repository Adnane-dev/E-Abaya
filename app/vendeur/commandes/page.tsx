"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { CartItem } from "@/lib/cart";

interface Order {
  id: number;
  items: CartItem[];
  status: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopId, setShopId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

      if (!shop) {
        setIsLoading(false);
        return;
      }
      setShopId(shop.id);

      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setIsLoading(false);
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Commandes de mes produits</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">Aucune commande contenant vos produits pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const myItems = order.items.filter((item) => item.shop_id === shopId);
            if (myItems.length === 0) return null;
            const mySubtotal = myItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

            return (
              <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-foreground">Commande n° {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                <ul className="text-sm text-foreground space-y-1 mb-3">
                  {myItems.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString("fr-FR")} CFA</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between font-semibold text-accent mb-3">
                  <span>Sous-total (vos produits)</span>
                  <span>{mySubtotal.toLocaleString("fr-FR")} CFA</span>
                </div>

                <div className="pt-3 border-t border-border text-sm text-muted-foreground">
                  <p>Client : {order.customer_name} — {order.customer_phone}</p>
                  <p>Livraison : {order.delivery_address}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
