"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/useTranslation";

export type SortOption = "newest" | "price-low" | "price-high";

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  const { t } = useTranslation();

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t.products.sort.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">{t.products.sort.newest}</SelectItem>
        <SelectItem value="price-low">{t.products.sort.priceLow}</SelectItem>
        <SelectItem value="price-high">{t.products.sort.priceHigh}</SelectItem>
      </SelectContent>
    </Select>
  );
}
