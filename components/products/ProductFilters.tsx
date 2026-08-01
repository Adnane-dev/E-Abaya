"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ActiveFilters, Product } from "@/types/product";

const MAX_PRICE = 100000;

interface ProductFiltersProps {
  products: Product[];
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
}

export function ProductFilters({ products, filters, onChange }: ProductFiltersProps) {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  const colors = Array.from(new Set(products.flatMap((p) => p.colors ?? [])));
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes ?? [])));

  return (
    <Card className="p-6 space-y-6 border-border">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...filters.categories, category]
                    : filters.categories.filter((c) => c !== category);
                  onChange({ ...filters, categories: newCategories });
                }}
              />
              <label htmlFor={`category-${category}`} className="ml-2 text-sm text-muted-foreground">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Budget</h3>
        <Slider
          value={filters.priceRange}
          min={0}
          max={MAX_PRICE}
          step={1000}
          onValueChange={(value) => onChange({ ...filters, priceRange: value as [number, number] })}
        />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>{filters.priceRange[0].toLocaleString("fr-FR")} CFA</span>
          <span>{filters.priceRange[1].toLocaleString("fr-FR")} CFA</span>
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Marques</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => {
                    const newBrands = checked
                      ? [...filters.brands, brand]
                      : filters.brands.filter((b) => b !== brand);
                    onChange({ ...filters, brands: newBrands });
                  }}
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-muted-foreground">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Couleurs</h3>
          <div className="space-y-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={(checked) => {
                    const newColors = checked
                      ? [...filters.colors, color]
                      : filters.colors.filter((c) => c !== color);
                    onChange({ ...filters, colors: newColors });
                  }}
                />
                <label htmlFor={`color-${color}`} className="ml-2 text-sm text-muted-foreground">
                  {color}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Tailles</h3>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={(checked) => {
                    const newSizes = checked
                      ? [...filters.sizes, size]
                      : filters.sizes.filter((s) => s !== size);
                    onChange({ ...filters, sizes: newSizes });
                  }}
                />
                <label htmlFor={`size-${size}`} className="ml-2 text-sm text-muted-foreground">
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
