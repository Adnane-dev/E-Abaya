"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Package,
  BarChart,
  LogOut,
  ChevronLeft,
  Search,
  Store,
  Mail,
  Home,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/products", icon: Package },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingBag },
  { label: "Boutiques", href: "/admin/vendors", icon: Store },
  { label: "Clients", href: "/admin/customers", icon: Users },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Statistiques", href: "/admin/analytics", icon: BarChart },
  { label: "Paramètres", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <>
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-md"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 bg-card border-r border-border h-screen transition-all duration-300 flex flex-col w-64 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="font-serif text-xl font-bold text-foreground">Espace Admin</h1>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={isCollapsed ? "Développer le menu" : "Réduire le menu"}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItemLink
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              onNavigate={() => setIsMobileOpen(false)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-1">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center ${isCollapsed ? "justify-center" : ""} p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors`}
          >
            <Home className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Retour à l&apos;accueil</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>
    </>
  );
}

function NavItemLink({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  onNavigate,
}: NavItem & { isActive: boolean; isCollapsed: boolean; onNavigate: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center ${isCollapsed ? "justify-center" : ""} p-2 rounded-lg transition-colors ${
        isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}
