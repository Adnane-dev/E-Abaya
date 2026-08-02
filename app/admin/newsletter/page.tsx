"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubscribers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      setSubscribers((data as Subscriber[]) ?? []);
      setIsLoading(false);
    }
    loadSubscribers();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Newsletter</h1>
      <p className="text-muted-foreground mb-6">{subscribers.length} inscrit(e)s</p>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">E-mail</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground">
            {isLoading && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && subscribers.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                  Aucun inscrit pour le moment.
                </td>
              </tr>
            )}
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4">{sub.email}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
