"use client";

import { useState, useMemo } from "react";
import { PublicPropertyCard } from "@/components/public/PublicPropertyCard";
import { useFormFormatting } from "@/lib/hooks/useFormFormatting";
import { Search, Building2, Home, SlidersHorizontal, MapPin, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";

interface Property {
  id: string;
  titulo: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  valor_aluguel: number;
  valor_condominio?: number;
  valor_iptu?: number;
  valor_taxa_servico?: number;
  fotos: string[];
  tipo: string;
  quartos?: number;
  banheiros?: number;
  area_m2?: number;
  comodos?: string[];
}

interface ExplorarClientProps {
  initialProperties: any[];
  availableTypes: string[];
  availableLocations: string[];
}

export default function ExplorarClient({ initialProperties, availableTypes, availableLocations }: ExplorarClientProps) {
  const { formatarMoeda, parseMoeda } = useFormFormatting();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [selectedLocation, setSelectedLocation] = useState<string>("todos");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [priceMode, setPriceMode] = useState<"aluguel" | "total">("aluguel");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const properties = useMemo(() => initialProperties.map(p => ({
    id: p.id,
    title: p.titulo || `${p.endereco_rua}, ${p.endereco_numero}`,
    address: `${p.endereco_rua}, ${p.endereco_numero} - ${p.endereco_bairro}, ${p.endereco_cidade}`,
    rent: p.valor_aluguel || 0,
    totalValue: (p.valor_aluguel || 0) + (p.valor_condominio || 0) + (p.valor_iptu || 0) + (p.valor_taxa_servico || 0),
    hasAdditionalCosts: (p.valor_condominio || 0) + (p.valor_iptu || 0) + (p.valor_taxa_servico || 0) > 0,
    image: p.fotos && p.fotos.length > 0 ? p.fotos[0] : "/preview.png",
    bedrooms: p.quartos,
    bathrooms: p.banheiros,
    area: p.area_m2,
    rooms: p.comodos || [],
    type: p.tipo,
    neighborhood: p.endereco_bairro || "",
    cityState: p.endereco_cidade && p.endereco_estado ? `${p.endereco_cidade}, ${p.endereco_estado}` : "",
  })), [initialProperties]);

  const neighborhoodsByLocation = useMemo(() => {
    const map: Record<string, string[]> = {};
    properties.forEach(p => {
      if (p.cityState && p.neighborhood) {
        if (!map[p.cityState]) map[p.cityState] = [];
        if (!map[p.cityState].includes(p.neighborhood)) {
          map[p.cityState].push(p.neighborhood);
        }
      }
    });
    return map;
  }, [properties]);

  const currentAvailableNeighborhoods = useMemo(() => {
    if (selectedLocation === "todos") {
      return Array.from(new Set(properties.map(p => p.neighborhood))).filter(Boolean).sort();
    }
    return (neighborhoodsByLocation[selectedLocation] || []).sort();
  }, [selectedLocation, neighborhoodsByLocation, properties]);

  const filteredProperties = useMemo(() => {
    let result = properties.filter(p => {
      const matchesSearch = !searchQuery || 
                          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesNeighborhoods = selectedNeighborhoods.length === 0 || 
                                 selectedNeighborhoods.includes(p.neighborhood);

      const matchesType = selectedType === "todos" || p.type === selectedType;
      const matchesLocation = selectedLocation === "todos" || p.cityState === selectedLocation;
      
      const parsedPrice = parseMoeda(maxPrice);
      // Trata campo vazio ou valor zero como "sem filtro"
      const isPriceEmpty = !maxPrice || maxPrice.trim() === "" || parsedPrice === 0;
      
      const matchesPrice = isPriceEmpty || (priceMode === "total" ? p.totalValue <= parsedPrice : p.rent <= parsedPrice);

      return matchesSearch && matchesNeighborhoods && matchesType && matchesLocation && matchesPrice;
    });

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.rent - a.rent);
    }

    return result;
  }, [properties, searchQuery, selectedNeighborhoods, selectedType, selectedLocation, maxPrice, parseMoeda, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCurrentPage(1); // Reset page on any change
    
    // Se não houver dígitos ou o valor for efetivamente zero (ex: "0", "00"), limpamos o filtro
    if (!value || parseInt(value) === 0) {
      setMaxPrice("");
      return;
    }
    setMaxPrice(formatarMoeda(value));
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(neighborhood) 
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleFilterChange = (setter: Function, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredProperties.slice(0, 10).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://lugogestaodeimoveis.com.br/imovel/${p.id}`,
      "name": p.title,
      "description": `Aluguel de ${p.type} em ${p.address}. R$ ${p.rent} por mês.`,
    }))
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header minimal={true} />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="bg-tertiary pt-12 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors uppercase tracking-widest text-[10px] md:text-xs">
                Encontre seu novo lar
              </Badge>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Imóveis para Alugar
            </h1>
            
            <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
              Descubra as melhores oportunidades de locação direta com proprietários. 
              Seguro, prático e sem burocracia excessiva.
            </p>
          </div>
        </section>

        {/* Filters and Grid Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-80 lg:shrink-0">
              <div className="bg-white rounded-lg shadow-sm shadow-slate-200/50 p-4 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-tertiary" /> Filtros
                  </h2>
                  {(searchQuery || selectedNeighborhoods.length > 0 || selectedType !== "todos" || selectedLocation !== "todos" || maxPrice) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedNeighborhoods([]);
                        setSelectedType("todos");
                        setSelectedLocation("todos");
                        setMaxPrice("");
                        setPriceMode("aluguel");
                        setCurrentPage(1);
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs font-semibold"
                    >
                      Limpar
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Localização
                    </label>
                    <Select value={selectedLocation} onValueChange={(v) => handleFilterChange(setSelectedLocation, v)}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Todas as cidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as localidades</SelectItem>
                        {availableLocations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Tipo de Imóvel
                    </label>
                    <Select value={selectedType} onValueChange={(v) => handleFilterChange(setSelectedType, v)}>
                      <SelectTrigger className="rounded-lg capitalize">
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os tipos</SelectItem>
                        {availableTypes.map(type => (
                          <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search & Neighborhoods */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Search className="h-4 w-4" /> Bairro ou Nome
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative group">
                          <Input
                            placeholder={selectedNeighborhoods.length > 0 
                              ? `${selectedNeighborhoods.length} selecionado(s)` 
                              : "Buscar bairro..."}
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="rounded-lg pr-10 text-sm"
                          />
                          <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-tertiary transition-colors cursor-pointer" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="p-0 border-slate-200 shadow-xl" 
                        align="start"
                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                      >
                        <div className="p-4 border-b border-slate-100">
                          <h4 className="font-semibold text-sm">Bairros Disponíveis</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {selectedLocation === "todos" 
                              ? "Todas as cidades" 
                              : `Em ${selectedLocation}`}
                          </p>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto p-2">
                          {currentAvailableNeighborhoods.length > 0 ? (
                            <div className="space-y-1">
                              {currentAvailableNeighborhoods.map((neighborhood) => (
                                <div 
                                  key={neighborhood}
                                  className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                                  onClick={() => toggleNeighborhood(neighborhood)}
                                >
                                  <Checkbox 
                                    id={`nb-${neighborhood}`} 
                                    checked={selectedNeighborhoods.includes(neighborhood)}
                                    onCheckedChange={() => toggleNeighborhood(neighborhood)}
                                  />
                                  <label
                                    htmlFor={`nb-${neighborhood}`}
                                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                                  >
                                    {neighborhood}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="p-4 text-xs text-center text-muted-foreground">Nenhum bairro cadastrado</p>
                          )}
                        </div>
                        {selectedNeighborhoods.length > 0 && (
                          <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-[10px] h-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedNeighborhoods([]);
                                setCurrentPage(1);
                              }}
                            >
                              Limpar seleção
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      
                      <div className="flex bg-primary/5 p-1 rounded-lg">
                        <button
                          onClick={() => handleFilterChange(setPriceMode, "aluguel")}
                          className={cn(
                            "flex-1 text-[10px] cursor-pointer sm:text-xs font-bold py-1.5 rounded-md transition-all",
                            priceMode === "aluguel" ? "bg-white text-tertiary shadow-sm" : "text-secondary/60 hover:text-secondary"
                          )}
                        >
                          Apenas Aluguel
                        </button>
                        <button
                          onClick={() => handleFilterChange(setPriceMode, "total")}
                          className={cn(
                            "flex-1 text-[10px] cursor-pointer sm:text-xs font-bold py-1.5 rounded-md transition-all",
                            priceMode === "total" ? "bg-white text-tertiary shadow-sm" : "text-secondary/60 hover:text-secondary"
                          )}
                        >
                          Valor Total
                        </button>
                      </div>

                      <Input
                        type="text"
                        placeholder="Ex: R$ 2.000,00"
                        value={maxPrice}
                        onChange={handlePriceChange}
                        className="rounded-lg"
                      />

                      {priceMode === "aluguel" && (
                        <p className="text-[10px] text-red-500 font-medium px-1">
                          * Nota: Podem haver cobranças adicionais (condo/IPTU).
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 italic text-[11px] text-muted-foreground">
                  Dica: Utilize os filtros para encontrar com precisão o que você procura.
                </div>
              </div>
            </aside>

            {/* Results Section */}
            <div className="flex-1 space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-4 rounded-lg border border-slate-100 gap-4">
                <p className="text-sm text-muted-foreground font-medium">
                  <span className="text-tertiary font-bold">{filteredProperties.length}</span> resultados
                </p>
                
                <div className="flex flex-col w-full md:w-fit md:flex-row items-start md:items-center gap-3">
                  <span className="hidden md:block text-xs font-semibold text-tertiary/80 uppercase tracking-wider">Ordenar por:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px] h-9 text-sm rounded-lg">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        <SelectValue placeholder="Ordernar" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais Recentes</SelectItem>
                      <SelectItem value="price_asc">Menor Preço</SelectItem>
                      <SelectItem value="price_desc">Maior Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid */}
              {paginatedProperties.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProperties.map((property) => (
                    <article key={property.id}>
                      <PublicPropertyCard 
                        property={property} 
                        formatarMoeda={formatarMoeda} 
                      />
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 bg-white rounded-lg border border-dashed border-slate-300">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/5 mb-2">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-display">Nenhum imóvel encontrado</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Tente ajustar os filtros na barra lateral para ver mais opções.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
