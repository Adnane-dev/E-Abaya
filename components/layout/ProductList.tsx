import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-4">Aucun produit trouvé</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {products.map((product) => (
        <li key={product.id}>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-4 py-3 hover:bg-muted/50 transition-colors rounded-md px-2"
          >
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">{product.name}</h3>
              <p className="text-sm text-accent">{product.price.toLocaleString("fr-FR")} CFA</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
