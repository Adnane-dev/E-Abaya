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
    searchTerm ? order.status.toLowerCase().includes(searchTerm.toLowerCase()) : true
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
          placeholder="Rechercher par statut..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full sm:w-80 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent"
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
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Montant total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    Aucune commande pour le moment.
                  </td>
                </tr>
              )}
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
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
                    {order.total.toLocaleString("fr-FR")} CFA
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
