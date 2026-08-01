"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Order {
  id: number;
  user_id: string | null;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  payment_reference: string | null;
  created_at: string;
}

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "À la livraison",
  mobile_money: "Mobile Money",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const supabase = createClient();

  async function loadOrders() {
    setIsLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: sortDirection === "asc" });
    setOrders((data as Order[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, [sortDirection]);

  const filteredOrders = orders.filter((order) =>
    searchTerm
      ? order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm)
      : true
  );

  async function handleStatusChange(orderId: number, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast.error("Erreur lors de la mise à jour : " + error.message);
      return;
    }
    toast.success("Statut mis à jour.");
    loadOrders();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">Gestion des commandes</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par client, téléphone ou statut..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full sm:w-96 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
                  >
                    <span>Date</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Aucune commande pour le moment.
                  </td>
                </tr>
              )}
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 align-top">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="font-medium">{order.customer_name || "—"}</div>
                    <div className="text-muted-foreground text-xs">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                    {order.delivery_address}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div>{PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</div>
                    {order.payment_reference && (
                      <div className="text-muted-foreground text-xs">Réf : {order.payment_reference}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground border-none focus:ring-2 focus:ring-accent"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {Number(order.total).toLocaleString("fr-FR")} CFA
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
