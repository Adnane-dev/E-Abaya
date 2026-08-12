"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Shop {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
}

export default function VendorShopPage() {
  const { t } = useTranslation();
  const [shop, setShop] = useState<Shop | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadShop() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

      if (data) {
        setShop(data);
        setName(data.name);
        setDescription(data.description ?? "");
        setLogoUrl(data.logo_url ?? "");
      }
    }
    loadShop();
  }, []);

  async function uploadLogo(file: File) {
    setIsUploading(true);
    const supabase = createClient();
    const path = `logos/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error(t.vendeur.shop.uploadError(error.message));
      setIsUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setLogoUrl(data.publicUrl);
    setIsUploading(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!shop) return;
    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("shops")
      .update({ name, description, logo_url: logoUrl || null })
      .eq("id", shop.id);

    setIsSaving(false);

    if (error) {
      toast.error(t.vendeur.shop.saveError(error.message));
      return;
    }
    toast.success(t.vendeur.shop.updatedToast);
  }

  if (!shop) {
    return <p className="text-muted-foreground">{t.common.loading}</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">{t.vendeur.shop.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.vendeur.shop.logo}</label>
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-16 w-16 rounded-full object-cover bg-muted" />
            )}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted">
              <Upload className="h-4 w-4" />
              {isUploading ? t.vendeur.shop.uploading : t.vendeur.shop.chooseImage}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && uploadLogo(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            {t.vendeur.shop.shopName}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            {t.vendeur.shop.description}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {t.vendeur.shop.publicPage}{" "}
          <a href={`/boutique/${shop.slug}`} className="text-accent underline">
            /boutique/{shop.slug}
          </a>
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 disabled:opacity-60"
        >
          {isSaving ? t.vendeur.shop.saving : t.vendeur.shop.save}
        </button>
      </form>
    </div>
  );
}
