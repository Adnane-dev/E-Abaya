// ProductList.tsx
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="mt-8">
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-4">
              <div className="flex items-center">
                <Image
                  src={`/images/${product.image}`} // Vérifiez le chemin de l'image dans le bon répertoire
                  alt={product.name}
                  width={64}
                  height={64}
                  className="mr-4 object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm">{product.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
}
