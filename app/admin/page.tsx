"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-10 w-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">45,231 MAD</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-10 w-10 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <ShoppingBag className="h-10 w-10 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">789</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <BarChart className="h-10 w-10 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold">573 MAD</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}