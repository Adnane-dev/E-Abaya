"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, Home, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.replace("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_courier")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (!active) return;

      if (!profile?.is_courier) {
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
    }

    checkAccess();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted text-muted-foreground">
        Vérification de l&apos;accès…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <span className="font-serif text-lg font-bold text-foreground hidden sm:inline">Espace Livreur</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
