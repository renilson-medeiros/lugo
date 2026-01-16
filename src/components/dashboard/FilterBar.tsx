"use client";

import { Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  onClear: () => void;
  showClear: boolean;
}

export function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  searchPlaceholder = "Buscar...", 
  children, 
  onClear, 
  showClear 
}: FilterBarProps) {
  return (
    <div className="flex bg-tertiary py-5 px-4 rounded-lg flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
        {children}

        {showClear && (
          <Button
            variant="ghost"
            size="default"
            onClick={onClear}
            className="text-white py-6 bg-red-600 hover:bg-red-500 hover:text-white border border-red-500 w-full lg:w-auto"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
