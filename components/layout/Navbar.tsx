"use client";

import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  User,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <NavLink href="/">
              {/* Logo and name */}
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                <span className="text-gray-900 font-bold text-lg">
                  Islamic Style-Girls
                </span>
              </div>
            </NavLink>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/category/abayas">Abayas</NavLink>
              <NavLink href="/category/hijabs">Hijabs</NavLink>
              <NavLink href="/category/kaftans">Kaftans</NavLink>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <IconButton label="Wishlist">
              <Heart className="h-6 w-6" />
            </IconButton>
            <IconButton label="Cart">
              <ShoppingBag className="h-6 w-6" />
            </IconButton>

            {/* User Authentication Links */}
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-primary text-sm font-medium"
            >
              <IconButton label="Login">
                <User className="h-6 w-6" />
              </IconButton>
            </Link>
            <Link
              href="/auth/RegisterPage"
              className="text-gray-700 hover:text-primary text-sm font-medium"
            >
              <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} />
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className="p-2 text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
      aria-label={label}
    >
      {children}
    </button>
  );
}
