// SearchBar.tsx
import { useState } from "react";
import { featuredProducts } from "@/public/featured-products"; // Assurez-vous que le chemin est correct
import { SearchInput } from "./SearchInput"; // Importation du composant SearchInput
import { ProductList } from "./ProductList"; // Importation du composant ProductList

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(featuredProducts);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      // Si la recherche est vide, réinitialiser les produits
      setFilteredProducts(featuredProducts);
    } else {
      // Filtrer les produits selon les critères de nom ou de description
      const filtered = featuredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
      {/* Composant SearchInput */}
      <SearchInput value={searchQuery} onChange={handleSearch} />

      {/* Composant ProductList pour afficher les produits filtrés */}
      {/* <ProductList products={filteredProducts} /> */}
    </div>
  );
}
