"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", userData.user.id)
        .maybeSingle();

      setFullName(data?.full_name ?? "");
      setPhone(data?.phone ?? "");
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("id", userData.user.id);

    setIsSaving(false);

    if (error) {
      toast.error("Erreur lors de l'enregistrement : " + error.message);
      return;
    }
    toast.success("Profil mis à jour.");
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Paramètres du compte</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6 shadow-sm">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
              Nom complet
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      )}
    </div>
  );
}
