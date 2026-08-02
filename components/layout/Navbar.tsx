"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Heart,
  Search,
  Menu,
  X,
  User,
  ShoppingCart,
  ChevronDown,
  Sun,
  Moon,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getCart, onCartUpdate } from "@/lib/cart";
import { createClient } from "@/lib/supabase";
import { getUnseenOrderCount } from "@/lib/orderNotifications";
import { STATUS_LABELS } from "@/lib/orderStatus";

type OrderStatusRow = { id: number; status: string };

type AccountRole = "admin" | "courier" | "vendor" | "customer";
interface AccountState {
  email: string;
  role: AccountRole;
}

const ROLE_LABELS: Record<AccountRole, string> = {
  admin: "Admin",
  courier: "Livreur",
  vendor: "Vendeur",
  customer: "Compte",
};

// Define TypeScript interfaces
interface Subcategory {
  title: string;
  href: string;
}

interface Category {
  title: string;
  href: string;
  subcategories: Subcategory[];
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderNotifCount, setOrderNotifCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [account, setAccount] = useState<AccountState | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const refreshCartCount = () => {
      setCartItems(getCart().reduce((total, item) => total + item.quantity, 0));
    };
    refreshCartCount();
    return onCartUpdate(refreshCartCount);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function refreshWishlistCount() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setWishlistCount(0);
        return;
      }
      const { count } = await supabase
        .from("wishlists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userData.user.id);
      setWishlistCount(count ?? 0);
    }

    refreshWishlistCount();
    window.addEventListener("wishlist-updated", refreshWishlistCount);
    return () => window.removeEventListener("wishlist-updated", refreshWishlistCount);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function watchOrders() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setOrderNotifCount(0);
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("id, status")
        .eq("user_id", userData.user.id);
      const orders = (data as OrderStatusRow[]) ?? [];
      setOrderNotifCount(getUnseenOrderCount(orders));

      channel = supabase
        .channel("navbar-orders-status")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${userData.user.id}` },
          (payload) => {
            const updated = payload.new as OrderStatusRow;
            toast.info(`Votre commande n° ${updated.id} est maintenant : ${STATUS_LABELS[updated.status] ?? updated.status}`);
            setOrderNotifCount((count) => count + 1);
          }
        )
        .subscribe();
    }

    watchOrders();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function loadAccount() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setAccount(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, is_courier")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profile?.is_admin) {
        setAccount({ email: userData.user.email ?? "", role: "admin" });
        return;
      }

      if (profile?.is_courier) {
        setAccount({ email: userData.user.email ?? "", role: "courier" });
        return;
      }

      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", userData.user.id)
        .maybeSingle();

      setAccount({ email: userData.user.email ?? "", role: shop ? "vendor" : "customer" });
    }

    loadAccount();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => loadAccount());
    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAccountMenuOpen(false);
    router.push("/");
  }

  const renderCategories = (categories: Category[]) => {
    return categories.map((category) => (
      <div
        key={category.href}
        className="relative group"
        onMouseEnter={() => setActiveDropdown(category.title)}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <Link
          href={category.href}
          className="flex items-center space-x-1 px-4 py-2 text-foreground/80 hover:text-accent transition-colors"
        >
          <span>{category.title}</span>
          <ChevronDown className="w-4 h-4" />
        </Link>

        <AnimatePresence>
          {activeDropdown === category.title && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-48 bg-popover rounded-lg shadow-xl border border-border py-2 z-50"
            >
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent transition-colors"
                >
                  {sub.title}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

  const navigationCategories: Category[] = [
    {
      title: "Hijab",
      href: "/category/hijab",
      subcategories: [
        { title: "Classique", href: "/category/hijab?style=classique" },
        { title: "Moderne", href: "/category/hijab?style=moderne" },
        { title: "Hijab de sport", href: "/category/hijab-sport" },
      ],
    },
    {
      title: "Jilbab/Abaya",
      href: "/category/abaya",
      subcategories: [
        { title: "Styles", href: "/category/abaya?style=classique" },
        { title: "Abayas longues", href: "/category/abayas-longues" },
      ],
    },
    {
      title: "Kaftans",
      href: "/category/kaftans",
      subcategories: [
        { title: "Cérémonie", href: "/category/kaftans?style=ceremonie" },
        { title: "Quotidien", href: "/category/kaftans?style=quotidien" },
      ],
    },
    {
      title: "Robe",
      href: "/category/robe",
      subcategories: [
        { title: "Formelles", href: "/category/robe?style=formelles" },
        { title: "Occasions", href: "/category/robe?style=occasions" },
      ],
    },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-background"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image src="/logo-icon.png" alt="Islamic Style-Girls" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
            <span className="hidden lg:block font-serif text-foreground font-bold text-xl tracking-tight">
              Islamic Style-Girls
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {renderCategories(navigationCategories)}
            <Link
              href="/collections"
              className="px-4 py-2 text-foreground/80 hover:text-accent transition-colors"
            >
              Toutes les collections
            </Link>
          </div>

          {/* Search and Icons */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              <motion.div
                animate={isSearchOpen ? { width: 260 } : { width: 40 }}
                className="flex items-center"
              >
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className={`${
                    isSearchOpen ? "w-full px-4" : "w-0"
                  } h-10 rounded-full bg-muted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute right-0 p-2 text-foreground/70 hover:text-accent transition-colors"
                  aria-label="Rechercher"
                >
                  <Search className="h-5 w-5" />
                </button>
              </motion.div>
            </div>

            {/* Theme toggle */}
            {isMounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative p-2 text-foreground/70 hover:text-accent transition-colors"
                aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            {/* Order status notifications */}
            {account && (
              <Link
                href="/mes-commandes"
                className="relative p-2 text-foreground/70 hover:text-accent transition-colors"
                aria-label="Notifications de commandes"
              >
                <Bell className="h-5 w-5" />
                {orderNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-accent-foreground bg-accent rounded-full">
                    {orderNotifCount}
                  </span>
                )}
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/liste-de-souhaits" className="relative p-2 text-foreground/70 hover:text-accent transition-colors" aria-label="Favoris">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-accent-foreground bg-accent rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/checkout" className="relative p-2 text-foreground/70 hover:text-accent transition-colors" aria-label="Panier">
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-accent-foreground bg-accent rounded-full">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Auth / Account */}
            <div className="hidden sm:flex items-center">
              {account ? (
                <div className="relative">
                  <button
                    onClick={() => setIsAccountMenuOpen((open) => !open)}
                    className="flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{ROLE_LABELS[account.role]}</span>
                  </button>
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-popover rounded-lg shadow-xl border border-border py-2 z-50"
                      >
                        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border truncate">
                          {account.email}
                        </div>
                        {account.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                          >
                            Tableau de bord admin
                          </Link>
                        )}
                        {account.role === "courier" && (
                          <Link
                            href="/livreur"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                          >
                            Mes livraisons
                          </Link>
                        )}
                        {account.role === "vendor" && (
                          <Link
                            href="/vendeur"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                          >
                            Mon espace vendeur
                          </Link>
                        )}
                        {account.role === "customer" && (
                          <>
                            <Link
                              href="/vendeur"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                            >
                              Devenir vendeur
                            </Link>
                            <Link
                              href="/devenir-livreur"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                            >
                              Devenir livreur
                            </Link>
                          </>
                        )}
                        <Link
                          href="/mon-compte"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                        >
                          Mon compte
                        </Link>
                        <Link
                          href="/mes-commandes"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent"
                        >
                          Mes commandes
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
                        >
                          Se déconnecter
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login">
                    <button className="text-foreground/70 hover:text-accent transition-colors" aria-label="Se connecter">
                      <User className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/auth/RegisterPage">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm font-medium shadow-md hover:shadow-lg">
                      S&apos;inscrire
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground/70 hover:text-accent transition-colors"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-4 py-2 space-y-1">
              {navigationCategories.map((category) => (
                <div key={category.href} className="py-2">
                  <Link
                    href={category.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block font-medium text-foreground py-2"
                  >
                    {category.title}
                  </Link>
                  <div className="pl-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-foreground/70 hover:text-accent py-1 text-sm"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border sm:hidden">
                {account ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {ROLE_LABELS[account.role]} — {account.email}
                    </p>
                    {account.role === "admin" && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block text-accent py-1 font-medium">
                        Tableau de bord admin
                      </Link>
                    )}
                    {account.role === "courier" && (
                      <Link href="/livreur" onClick={() => setIsMenuOpen(false)} className="block text-accent py-1 font-medium">
                        Mes livraisons
                      </Link>
                    )}
                    {(account.role === "vendor" || account.role === "customer") && (
                      <Link href="/vendeur" onClick={() => setIsMenuOpen(false)} className="block text-accent py-1 font-medium">
                        {account.role === "vendor" ? "Mon espace vendeur" : "Devenir vendeur"}
                      </Link>
                    )}
                    {account.role === "customer" && (
                      <Link href="/devenir-livreur" onClick={() => setIsMenuOpen(false)} className="block text-accent py-1 font-medium">
                        Devenir livreur
                      </Link>
                    )}
                    <Link href="/mon-compte" onClick={() => setIsMenuOpen(false)} className="block text-foreground/80 py-1">
                      Mon compte
                    </Link>
                    <Link href="/mes-commandes" onClick={() => setIsMenuOpen(false)} className="block text-foreground/80 py-1">
                      Mes commandes
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-destructive py-1"
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 py-2">
                      Se connecter
                    </Link>
                    <Link href="/auth/RegisterPage" onClick={() => setIsMenuOpen(false)} className="text-accent py-2 font-medium">
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
