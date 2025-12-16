import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Phone,
  Mail,
  Building2,
  Calendar,
  MoreHorizontal,
  Receipt,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const mockTenants = [
  {
    id: "1",
    name: "João Silva",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    email: "joao@email.com",
    property: "Apartamento Centro",
    propertyId: "1",
    rentDay: 10,
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    status: "ativo"
  },
  {
    id: "2",
    name: "Maria Santos",
    cpf: "987.654.321-00",
    phone: "(11) 98888-8888",
    email: "maria@email.com",
    property: "Kitnet Zona Sul",
    propertyId: "3",
    rentDay: 5,
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    status: "ativo"
  },
];

export default function TenantsList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.cpf.includes(searchQuery) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Inquilinos</h1>
            <p className="text-muted-foreground">Gerencie seus inquilinos ativos</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Buscar inquilino..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Buscar inquilino"
          />
        </div>

        {/* Tenants List */}
        {filteredTenants.length > 0 ? (
          <div className="grid gap-4">
            {filteredTenants.map((tenant, index) => (
              <Card 
                key={tenant.id} 
                className="transition-all duration-300 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                        <Users className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold">{tenant.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {tenant.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">CPF: {tenant.cpf}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Building2 className="h-4 w-4" aria-hidden="true" />
                            <span>{tenant.property}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            <span>Dia {tenant.rentDay}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-4 w-4" aria-hidden="true" />
                            <span>{tenant.phone}</span>
                          </div>
                        </div>
                        
                        <p className="mt-2 text-xs text-muted-foreground">
                          Contrato: {new Date(tenant.startDate).toLocaleDateString('pt-BR')} até {new Date(tenant.endDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/comprovantes/novo?inquilino=${tenant.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Receipt className="h-4 w-4" aria-hidden="true" />
                          Gerar comprovante
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
                            <Link to={`/dashboard/inquilinos/${tenant.id}`} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Users className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nenhum inquilino encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Tente buscar com outros termos"
                  : "Cadastre um inquilino em um dos seus imóveis"}
              </p>
              {!searchQuery && (
                <Link to="/dashboard/imoveis" className="mt-4">
                  <Button variant="outline">
                    Ver imóveis
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
