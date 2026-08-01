"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Search,
  Menu,
  X,
  User,
  ShoppingCart,
  Home,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getCart, onCartUpdate } from "@/lib/cart";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      title: "Hijabs",
      href: "/category/hijabs",
      subcategories: [
        { title: "Classique", href: "/category/hijabs?style=classique" },
        { title: "Moderne", href: "/category/hijabs?style=moderne" },
        { title: "Imprimé", href: "/category/hijabs?style=imprime" },
      ],
    },
    {
      title: "Abayas",
      href: "/category/abayas",
      subcategories: [
        { title: "Styles", href: "/category/abayas?style=classique" },
        { title: "Couleurs vives", href: "/category/abayas?style=couleurs" },
        { title: "Tissus premium", href: "/category/abayas?style=tissus" },
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
      title: "Robes",
      href: "/category/dresses",
      subcategories: [
        { title: "Formelles", href: "/category/dresses?style=formelles" },
        { title: "Occasions", href: "/category/dresses?style=occasions" },
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
            <Home className="h-7 w-7 text-accent" />
            <span className="hidden lg:block font-serif text-foreground font-bold text-xl tracking-tight">
              Islamic Style-Girls
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {renderCategories(navigationCategories)}
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

            {/* Wishlist */}
            <button className="relative p-2 text-foreground/70 hover:text-accent transition-colors" aria-label="Favoris">
              <Heart className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button className="relative p-2 text-foreground/70 hover:text-accent transition-colors" aria-label="Panier">
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-accent-foreground bg-accent rounded-full">
                  {cartItems}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-4">
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
              <div className="flex items-center space-x-4 pt-3 border-t border-border sm:hidden">
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 py-2">
                  Se connecter
                </Link>
                <Link href="/auth/RegisterPage" onClick={() => setIsMenuOpen(false)} className="text-accent py-2 font-medium">
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
