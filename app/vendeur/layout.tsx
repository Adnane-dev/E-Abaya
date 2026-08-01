"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, Package, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/vendeur", icon: Store },
  { label: "Mes produits", href: "/vendeur/produits", icon: Package },
  { label: "Ma boutique", href: "/vendeur/boutique", icon: Store },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "ready">("checking");

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
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="font-serif text-xl font-bold text-foreground">Espace Vendeur</h1>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                pathname === href ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
