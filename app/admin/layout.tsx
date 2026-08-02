"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sidebar } from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !userData.user) {
        toast.error("Session introuvable : " + (userError?.message ?? "non connecté") + " — reconnexion nécessaire.");
        router.replace("/auth/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (!active) return;

      if (profileError) {
        toast.error("Erreur de lecture du profil : " + profileError.message);
        router.replace("/");
        return;
      }

      if (!profile?.is_admin) {
        toast.error("Ce compte (" + userData.user.email + ") n'a pas les droits administrateur.");
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

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted text-muted-foreground">
        Vérification de l&apos;accès…
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-20 md:p-8">{children}</main>
    </div>
  );
}
