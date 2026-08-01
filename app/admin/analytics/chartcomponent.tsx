"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { createClient } from "@/lib/supabase";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export function ChartComponent() {
  const [mounted, setMounted] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(Array(12).fill(0));
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);

    async function loadData() {
      const supabase = createClient();
      const { data: orders } = await supabase.from("orders").select("total, status, created_at");

      const revenue = Array(12).fill(0);
      const statuses: Record<string, number> = {};

      (orders ?? []).forEach((order) => {
        const month = new Date(order.created_at).getMonth();
        revenue[month] += Number(order.total);
        statuses[order.status] = (statuses[order.status] ?? 0) + 1;
      });

      setMonthlyRevenue(revenue);
      setStatusCounts(statuses);
    }
    loadData();
  }, []);

  if (!mounted) return null;

  const barChartData = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: "Revenu mensuel (CFA)",
        data: monthlyRevenue,
        backgroundColor: "hsl(15 55% 40% / 0.2)",
        borderColor: "hsl(15 55% 40%)",
        borderWidth: 1,
      },
    ],
  };

  const statusEntries = Object.entries(statusCounts);
  const pieChartData = {
    labels: statusEntries.map(([status]) => STATUS_LABELS[status] ?? status),
    datasets: [
      {
        label: "Commandes par statut",
        data: statusEntries.map(([, count]) => count),
        backgroundColor: ["#8a3b2b", "#c9a227", "#4a6b52", "#3a5a8c", "#888888"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <div className="mb-8">
        <h4 className="text-md font-semibold text-muted-foreground mb-2">Revenu mensuel</h4>
        <Bar
          style={{ height: "300px", width: "100%" }}
          data={barChartData}
          options={{
            responsive: true,
            plugins: { title: { display: true, text: "Revenu de l'année en cours" } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>

      {statusEntries.length > 0 ? (
        <div>
          <h4 className="text-md font-semibold text-muted-foreground mb-2">Commandes par statut</h4>
          <Pie
            style={{ height: "300px", width: "100%" }}
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: "Répartition des commandes" },
                legend: { position: "top" },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          Pas encore de commande pour générer ce graphique.
        </p>
      )}
    </>
  );
}
