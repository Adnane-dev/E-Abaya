"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Product } from "@/types/product";
import { SearchInput } from "./SearchInput";
import { ProductList } from "./ProductList";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*");
      setAllProducts((data as Product[]) ?? []);
    }
    loadProducts();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts([]);
    } else {
      setFilteredProducts(
        allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-2 lg:ml-6">
      <SearchInput value={searchQuery} onChange={handleSearch} />

      {searchQuery.trim() !== "" && (
        <div className="mt-3 w-full max-w-lg rounded-lg border border-border bg-card shadow-sm p-2">
          <ProductList products={filteredProducts} />
        </div>
      )}
    </div>
  );
}
