"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export default function VendorSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!documentFile) {
      toast.error("Merci de joindre une pièce d'identité.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/auth/login");
      return;
    }

    const documentPath = `${userData.user.id}/${Date.now()}-${documentFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("vendor-documents")
      .upload(documentPath, documentFile);

    if (uploadError) {
      toast.error("Échec de l'envoi du document : " + uploadError.message);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("shops").insert({
      owner_id: userData.user.id,
      name,
      slug: `${slugify(name)}-${userData.user.id.slice(0, 6)}`,
      description,
      id_document_url: documentPath,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la création de la boutique : " + error.message);
      return;
    }

    toast.success("Boutique créée ! Elle sera visible une fois votre identité vérifiée et votre boutique validée.");
    router.push("/vendeur");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-sm p-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Créer votre boutique</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Votre boutique sera visible sur le site une fois votre identité vérifiée et votre
          boutique validée par notre équipe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Nom de la boutique
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Pièce d&apos;identité (carte d&apos;identité, passeport...)
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Utilisée uniquement pour vérifier votre identité avant validation. Visible par
              vous et notre équipe uniquement.
            </p>
            <label className="cursor-pointer flex items-center gap-2 px-4 py-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:bg-muted">
              <Upload className="h-4 w-4" />
              {documentFile ? documentFile.name : "Choisir un fichier"}
              <input
                type="file"
                accept="image/*,.pdf"
                required
                className="hidden"
                onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60"
          >
            {isSubmitting ? "Création…" : "Créer ma boutique"}
          </button>
        </form>
      </div>
    </div>
  );
}
