"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const categories = ["Hijabs", "Abayas", "Kaftans"];
const brands = ["Moroccan Elegance", "Dubai Designs", "Saudi Couture"];
const colors = ["Black", "Navy", "Burgundy", "Cream", "White"];
const sizes = ["XS", "S", "M", "L", "XL"];

interface ProductFiltersProps {
  filters: {
    categories: string[];
    brands: string[];
    colors: string[];
    sizes: string[];
    priceRange: number[];
  };
  onChange: (filters: any) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
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
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-sm text-gray-600"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
        <Slider
          value={filters.priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={(value) => onChange({ ...filters, priceRange: value })}
        />
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>{filters.priceRange[0]} MAD</span>
          <span>{filters.priceRange[1]} MAD</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Brands</h3>
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
              <label
                htmlFor={`brand-${brand}`}
                className="ml-2 text-sm text-gray-600"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
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
              <label
                htmlFor={`color-${color}`}
                className="ml-2 text-sm text-gray-600"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
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
              <label
                htmlFor={`size-${size}`}
                className="ml-2 text-sm text-gray-600"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}