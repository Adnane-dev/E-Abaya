// ChartComponent.js
"use client";
// Analytics.js
import { ChartComponent } from "./chartcomponent";

const Analytics = () => {
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Admin - Analytics
      </h1>

      <div>
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Statistiques Globales
        </h2>
        <p className="text-lg">Nombre total de clients : 1200</p>
        <p className="text-lg">Revenu total : $50000</p>
        <p className="text-lg">Nombre total de commandes : 800</p>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Graphiques</h3>
          <ChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
