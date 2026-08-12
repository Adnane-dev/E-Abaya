"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { searchAll, SearchResults } from "@/lib/search";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { SearchResultsPanel } from "./SearchResultsPanel";

const EMPTY_RESULTS: SearchResults = { products: [], shops: [], categories: [] };

export function GlobalSearch() {
  const { t } = useTranslation();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults(EMPTY_RESULTS);
      return;
    }
    const handle = setTimeout(async () => {
      const supabase = createClient();
      setResults(await searchAll(term, supabase));
      setHighlightedIndex(-1);
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flatResults = [
    ...results.products.map((p) => ({ href: `/products/${p.id}` })),
    ...results.shops.map((s) => ({ href: `/boutique/${s.slug}` })),
    ...results.categories.map((c) => ({ href: `/category/${c.slug}` })),
  ];

  function goTo(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = flatResults[highlightedIndex] ?? flatResults[0];
      if (target) goTo(target.href);
      else if (query.trim()) goTo(`/products?search=${encodeURIComponent(query.trim())}`);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <motion.div animate={isOpen ? { width: 260 } : { width: 40 }} className="flex items-center">
        <input
          type="text"
          placeholder={`${t.search.placeholder}...`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`${
            isOpen ? "w-full px-4" : "w-0"
          } h-10 rounded-full bg-muted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent`}
        />
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="absolute right-0 p-2 text-foreground/70 hover:text-accent transition-colors"
          aria-label={t.search.ariaLabel}
        >
          <Search className="h-5 w-5" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-popover/95 backdrop-blur-md rounded-lg shadow-xl border border-border py-2 z-50 max-h-[70vh] overflow-y-auto"
          >
            <SearchResultsPanel
              results={results}
              query={query}
              highlightedHref={flatResults[highlightedIndex]?.href}
              onSelect={goTo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
