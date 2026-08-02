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
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div
      className={`bg-card border-r border-border h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="font-serif text-xl font-bold text-foreground">Espace Admin</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
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
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <NavItemLink key={item.href} {...item} isActive={pathname === item.href} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-1">
        <Link
          href="/"
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
  );
}

function NavItemLink({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
}: NavItem & { isActive: boolean; isCollapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center ${isCollapsed ? "justify-center" : ""} p-2 rounded-lg transition-colors ${
        isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}
