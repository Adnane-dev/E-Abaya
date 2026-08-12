import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase-server";
import { getStatusLabel } from "@/lib/orderStatus";
import { getServerDictionary } from "@/lib/i18n/getServerDictionary";
import { CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  const { locale, t } = await getServerDictionary();

  if (!order) {
    notFound();
  }

  const items = order.items as { name: string; price: number; quantity: number }[];
  const oc = t.account.orderConfirmation;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <CheckCircle2 className="h-8 w-8" />
          <h1 className="font-serif text-2xl font-bold text-foreground">{oc.title}</h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{oc.orderNumber}</span>
            <span className="text-foreground font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{oc.status}</span>
            <span className="text-accent font-medium">{getStatusLabel(order.status, locale)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{oc.paymentMethod}</span>
            <span className="text-foreground">{oc.paymentLabels[order.payment_method as "cod" | "mobile_money"] ?? order.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{oc.delivery}</span>
            <span className="text-foreground text-right">{order.delivery_address}</span>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-2">{oc.items}</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString("fr-FR")} CFA</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-border flex justify-between text-lg font-semibold">
            <span className="text-foreground">{oc.total}</span>
            <span className="text-accent">{Number(order.total).toLocaleString("fr-FR")} CFA</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {oc.contactNote(order.customer_phone)}
        </p>
      </div>

      <Footer />
    </div>
  );
}
