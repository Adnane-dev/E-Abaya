"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, Package, ShoppingBag, LogOut, Home, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/vendeur", icon: Store },
  { label: "Mes produits", href: "/vendeur/produits", icon: Package },
  { label: "Commandes", href: "/vendeur/commandes", icon: ShoppingBag },
  { label: "Ma boutique", href: "/vendeur/boutique", icon: Store },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "ready">("checking");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.replace("/auth/login");
        return;
      }

      if (pathname === "/vendeur/inscription") {
        if (active) setStatus("ready");
        return;
      }

      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

      if (!active) return;

      if (!shop) {
        router.replace("/vendeur/inscription");
        return;
      }

      setStatus("ready");
    }

    checkAccess();
    return () => {
      active = false;
    };
  }, [router, pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  if (status === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-muted text-muted-foreground">
        Vérification de l&apos;accès…
      </div>
    );
  }

  if (pathname === "/vendeur/inscription") {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-muted">
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
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-foreground">Espace Vendeur</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                pathname === href ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4 space-y-1">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="ml-3">Retour à l&apos;accueil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-8">{children}</main>
    </div>
  );
}
