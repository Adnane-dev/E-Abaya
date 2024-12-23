"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Package,
  BarChart,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
} from "lucide-react";

// Définition du type pour les éléments de navigation
type NavItem = {
  label: string;
  href: string;
  icon: any;
  badge?: number;
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const pathname = usePathname();

  // Simule le chargement des notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => Math.max(0, prev - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package, badge: 12 },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: 5 },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    // Ajoutez ici la logique de déconnexion
    console.log("Logging out...");
  };

  return (
    <div
      className={`bg-white border-r h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AdminPanel
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Notifications */}
      {!isCollapsed && notifications > 0 && (
        <div className="p-4 border-t">
          <div className="flex items-center bg-blue-50 text-blue-600 p-3 rounded-lg">
            <Bell className="h-5 w-5 mr-3" />
            <span>{notifications} new notifications</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-full p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${
            isCollapsed ? "px-2" : "px-4"
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  badge,
  isActive,
  isCollapsed,
}: NavItem & { isActive: boolean; isCollapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "justify-between"
      } p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5" />
        {!isCollapsed && <span className="ml-3">{label}</span>}
      </div>
      {!isCollapsed && badge && (
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-blue-100 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
