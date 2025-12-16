import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Plus, 
  Search, 
  Share2, 
  Eye, 
  Edit, 
  MoreHorizontal,
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

const mockProperties = [
  {
    id: "1",
    title: "Apartamento Centro",
    address: "Rua das Flores, 123 - Centro, São Paulo",
    rent: 2500,
    status: "ocupado",
    tenant: "João Silva",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    title: "Casa Jardins",
    address: "Av. Brasil, 456 - Jardins, São Paulo",
    rent: 4500,
    status: "disponível",
    tenant: null,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    title: "Kitnet Zona Sul",
    address: "Rua Augusta, 789 - Consolação, São Paulo",
    rent: 1200,
    status: "ocupado",
    tenant: "Maria Santos",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
  },
];

export default function PropertiesList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = mockProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (property: typeof mockProperties[0]) => {
    const url = `${window.location.origin}/imovel/${property.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!", {
      description: "Compartilhe com potenciais inquilinos.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Imóveis</h1>
            <p className="text-muted-foreground">Gerencie seus imóveis cadastrados</p>
          </div>
          <Link to="/dashboard/imoveis/novo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo imóvel
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Buscar imóvel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Buscar imóvel"
          />
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <Card 
                key={property.id} 
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                      property.status === "ocupado"
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground"
                    }`}
                  >
                    {property.status === "ocupado" ? "Ocupado" : "Disponível"}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold">{property.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-semibold text-primary">
                      R$ {property.rent.toLocaleString('pt-BR')}/mês
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleShare(property)}
                        aria-label="Compartilhar imóvel"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Link to={`/imovel/${property.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver imóvel">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Mais opções">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/imoveis/${property.id}/editar`} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          {property.status === "disponível" && (
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/imoveis/${property.id}/inquilino`} className="cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" />
                                Cadastrar inquilino
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {property.tenant && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Inquilino: {property.tenant}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Building2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nenhum imóvel encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Tente buscar com outros termos"
                  : "Cadastre seu primeiro imóvel para começar"}
              </p>
              {!searchQuery && (
                <Link to="/dashboard/imoveis/novo" className="mt-4">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Cadastrar imóvel
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
