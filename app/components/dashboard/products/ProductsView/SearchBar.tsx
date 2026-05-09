import React, { useCallback } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-200"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
});
