"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase";

const ACCENT_PRESETS = [
  { name: "Bordeaux/Terracotta", hsl: "15 55% 40%" },
  { name: "Or/Champagne", hsl: "38 45% 55%" },
  { name: "Émeraude", hsl: "150 40% 30%" },
  { name: "Bleu nuit", hsl: "220 45% 30%" },
  { name: "Prune", hsl: "300 30% 35%" },
];

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accentHsl, setAccentHsl] = useState(ACCENT_PRESETS[0].hsl);

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

      const { data: settings } = await supabase
        .from("site_settings")
        .select("accent_hsl")
        .eq("id", 1)
        .maybeSingle();
      if (settings?.accent_hsl) setAccentHsl(settings.accent_hsl);

      setIsLoading(false);
    }
    loadProfile();
  }, []);

  async function handleAccentChange(hsl: string) {
    const supabase = createClient();
    const { error } = await supabase.from("site_settings").update({ accent_hsl: hsl }).eq("id", 1);
    if (error) {
      toast.error("Erreur : " + error.message);
      return;
    }
    setAccentHsl(hsl);
    toast.success("Couleur d'accent mise à jour. Rechargez la page pour voir l'effet sur tout le site.");
  }

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
        <>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
            <h2 className="font-medium text-foreground mb-1">Apparence du site</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Couleur d&apos;accent utilisée sur tout le site (boutons, prix, liens actifs).
            </p>
            <div className="flex flex-wrap gap-3">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.hsl}
                  type="button"
                  onClick={() => handleAccentChange(preset.hsl)}
                  className="flex flex-col items-center gap-2"
                  aria-label={preset.name}
                >
                  <span
                    className="relative h-10 w-10 rounded-full border-2 border-border flex items-center justify-center"
                    style={{ backgroundColor: `hsl(${preset.hsl})` }}
                  >
                    {accentHsl === preset.hsl && <Check className="h-5 w-5 text-white drop-shadow" />}
                  </span>
                  <span className="text-xs text-muted-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

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
        </>
      )}
    </div>
  );
}
