import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categoryOptions: string[];
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categoryOptions,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-light/50" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-black border-gold/30 focus:border-gold text-gold-light h-10 md:h-11"
        />
      </div>
      <div className="w-full sm:w-64">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-black border-gold/30 focus:border-gold text-gold-light h-10 md:h-11">
            <Filter className="h-4 w-4 mr-2 text-gold" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gold/30">
            {categoryOptions.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="text-gold-light hover:bg-gold/10 focus:bg-gold/10"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
