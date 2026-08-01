import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="max-w-lg w-full lg:max-w-xs">
      <label htmlFor="search" className="sr-only">
        Rechercher
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          id="search"
          name="search"
          aria-label="Rechercher un produit"
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm"
          placeholder="Rechercher un produit..."
          type="search"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
