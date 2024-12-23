import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="max-w-lg w-full lg:max-w-xs">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search"
          name="search"
          aria-label="Search products"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search products..."
          type="search"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
