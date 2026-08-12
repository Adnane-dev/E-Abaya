"use client";

import { Package, Store, Tag } from "lucide-react";
import { SearchResults } from "@/lib/search";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface SearchResultsPanelProps {
  results: SearchResults;
  query: string;
  highlightedHref?: string;
  onSelect: (href: string) => void;
}

export function SearchResultsPanel({ results, query, highlightedHref, onSelect }: SearchResultsPanelProps) {
  const { t } = useTranslation();
  const hasResults = results.products.length > 0 || results.shops.length > 0 || results.categories.length > 0;

  function rowClass(href: string) {
    return `flex w-full items-center gap-3 px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
      highlightedHref === href ? "bg-muted text-accent" : "text-foreground/80"
    }`;
  }

  if (!hasResults) {
    return <p className="px-4 py-3 text-sm text-muted-foreground">{t.search.noResults}</p>;
  }

  return (
    <div>
      {results.products.length > 0 && (
        <div className="pb-2">
          <p className="px-4 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.search.productsHeading}
          </p>
          {results.products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(`/products/${product.id}`)}
              className={rowClass(`/products/${product.id}`)}
            >
              <Package className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{product.name}</span>
            </button>
          ))}
        </div>
      )}

      {results.shops.length > 0 && (
        <div className="pb-2 border-t border-border pt-2">
          <p className="px-4 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.search.shopsHeading}
          </p>
          {results.shops.map((shop) => (
            <button
              key={shop.id}
              type="button"
              onClick={() => onSelect(`/boutique/${shop.slug}`)}
              className={rowClass(`/boutique/${shop.slug}`)}
            >
              <Store className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{shop.name}</span>
            </button>
          ))}
        </div>
      )}

      {results.categories.length > 0 && (
        <div className="pb-2 border-t border-border pt-2">
          <p className="px-4 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.search.categoriesHeading}
          </p>
          {results.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(`/category/${category.slug}`)}
              className={rowClass(`/category/${category.slug}`)}
            >
              <Tag className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{category.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-2 mt-1">
        <button
          type="button"
          onClick={() => onSelect(`/products?search=${encodeURIComponent(query.trim())}`)}
          className="block w-full text-left px-4 py-2 text-sm text-accent hover:underline"
        >
          {t.search.seeAllResults(query.trim())}
        </button>
      </div>
    </div>
  );
}
