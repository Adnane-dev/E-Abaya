"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase";
import { CartItem, getCart, getCartTotal, updateQuantity, removeFromCart, clearCart, onCartUpdate } from "@/lib/cart";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { enqueue } from "@/lib/offlineQueue";

type PaymentMethod = "cod" | "mobile_money";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentReference, setPaymentReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCart(getCart());
    return onCartUpdate(() => setCart(getCart()));
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
      setIsCheckingAuth(false);
    }
    checkAuth();
  }, []);

  const total = getCartTotal(cart);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error(t.checkout.errors.emptyCart);
      return;
    }
    if (paymentMethod === "mobile_money" && !paymentReference.trim()) {
      toast.error(t.checkout.errors.missingReference);
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/auth/login");
      return;
    }

    const orderPayload = {
      user_id: userData.user.id,
      items: cart,
      total,
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      payment_reference: paymentMethod === "mobile_money" ? paymentReference : null,
    } as const;

    const wasOffline = !navigator.onLine;
    const { data: order, error } = await supabase.from("orders").insert(orderPayload).select("id").single();

    // Network failures (offline, or the fetch itself failing mid-request
    // on a flaky connection) get queued for automatic retry instead of
    // shown as a hard error — a real validation/DB error still surfaces
    // normally. There's no order.id yet since nothing was inserted, so
    // we can't route to /commande/[id] like the success path does.
    const looksLikeNetworkError = wasOffline || (error && /fetch|network/i.test(error.message));
    if ((error || !order) && looksLikeNetworkError) {
      enqueue({ type: "checkout_order", payload: orderPayload });
      setIsSubmitting(false);
      clearCart();
      toast.success(t.offline.checkoutQueued);
      router.push("/mes-commandes");
      return;
    }

    if (error || !order) {
      setIsSubmitting(false);
      toast.error(t.checkout.errors.orderFailed(error?.message ?? "inconnue"));
      return;
    }

    // Keep the profile in sync with the latest known contact/delivery
    // info so the admin customers list isn't empty just because nobody
    // separately visited "Mon compte".
    await supabase
      .from("profiles")
      .update({ full_name: customerName, phone: customerPhone, address: deliveryAddress })
      .eq("id", userData.user.id);

    setIsSubmitting(false);
    clearCart();
    toast.success(t.checkout.successToast);
    router.push(`/commande/${order.id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">{t.checkout.pageTitle}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{t.checkout.emptyCart}</p>
            <Link href="/products" className="text-accent hover:text-accent/80 font-medium">
              {t.checkout.discoverProducts}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-accent">{item.price.toLocaleString("fr-FR")} CFA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 border border-border rounded-md hover:bg-muted"
                      aria-label={t.checkout.decreaseQtyAria}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 border border-border rounded-md hover:bg-muted"
                      aria-label={t.checkout.increaseQtyAria}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                    aria-label={t.checkout.removeAria}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout form */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <div className="flex justify-between text-lg font-semibold text-foreground mb-6">
                <span>{t.checkout.total}</span>
                <span className="text-accent">{total.toLocaleString("fr-FR")} CFA</span>
              </div>

              {isCheckingAuth ? (
                <p className="text-muted-foreground text-sm">{t.common.loading}</p>
              ) : !isLoggedIn ? (
                <div className="text-sm text-muted-foreground">
                  <p className="mb-3">{t.checkout.loginPrompt}</p>
                  <Link
                    href="/auth/login"
                    className="block text-center w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    {t.nav.login}
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-foreground">
                      {t.checkout.fullName}
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium text-foreground">
                      {t.checkout.phone}
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-foreground">
                      {t.checkout.deliveryAddress}
                    </label>
                    <textarea
                      id="deliveryAddress"
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.checkout.paymentMethod}</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                        />
                        {t.checkout.cod}
                      </label>
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "mobile_money"}
                          onChange={() => setPaymentMethod("mobile_money")}
                        />
                        {t.checkout.mobileMoney}
                      </label>
                    </div>
                  </div>

                  {paymentMethod === "mobile_money" && (
                    <div>
                      <label htmlFor="paymentReference" className="block text-sm font-medium text-foreground">
                        {t.checkout.transactionReference}
                      </label>
                      <input
                        id="paymentReference"
                        type="text"
                        required
                        placeholder={t.checkout.transactionReferencePlaceholder}
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.checkout.transactionReferenceNote}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60"
                  >
                    {isSubmitting ? t.checkout.submitting : t.checkout.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
