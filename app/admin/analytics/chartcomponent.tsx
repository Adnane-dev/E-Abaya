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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function ChartComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenu Mensuel ($)",
        data: [1200, 1500, 1300, 1700, 1800, 1600],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Clients Actifs", "Clients Inactifs"],
    datasets: [
      {
        label: "Statut des Clients",
        data: [60, 40],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-600">Revenu Mensuel</h4>
        <Bar
          style={{ height: "300px", width: "100%" }}
          data={barChartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Revenu des 6 derniers mois",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-600">
          Répartition des Clients
        </h4>
        <Pie
          style={{ height: "300px", width: "100%" }}
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Répartition des Clients Actifs et Inactifs",
              },
              legend: {
                position: "top",
              },
            },
          }}
        />
      </div>
    </>
  );
}
