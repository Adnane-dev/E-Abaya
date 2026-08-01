"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "newest" | "price-low" | "price-high";

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Nouveautés</SelectItem>
        <SelectItem value="price-low">Prix croissant</SelectItem>
        <SelectItem value="price-high">Prix décroissant</SelectItem>
      </SelectContent>
    </Select>
  );
}
