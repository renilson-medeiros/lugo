"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Calendar,
  MoreHorizontal,
  Receipt,
  Eye,
  AlertCircle,
  UserMinus,
  Phone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageLoader } from "@/components/dashboard/PageLoader";
import { useFormFormatting } from "@/lib/hooks/useFormFormatting";

interface Tenant {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  email: string | null;
  imovel_id: string;
  dia_vencimento: number;
  data_inicio: string;
  data_fim: string | null;
  status: 'ativo' | 'inativo';
  imoveis: {
    titulo: string;
    endereco_rua: string;
    endereco_numero: string;
  } | null;
}

interface TenantsListProps {
  initialData?: Tenant[];
  initialLoading?: boolean;
}

export default function TenantsList({ initialData = [], initialLoading = true }: TenantsListProps) {
  const { user } = useAuth();
  const { formatarCPF, formatarTelefone } = useFormFormatting();
  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [propertyFilter, setPropertyFilter] = useState("todos");

  const loadTenants = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('inquilinos')
        .select(`
          id,
          nome_completo,
          cpf,
          telefone,
          email,
          imovel_id,
          dia_vencimento,
          data_inicio,
          data_fim,
          status,
          imoveis!inner (
            titulo,
            endereco_rua,
            endereco_numero,
            proprietario_id
          )
        `)
        .eq('imoveis.proprietario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      const transformedData = (data || []).map(item => ({
        ...item,
        imoveis: Array.isArray(item.imoveis)
          ? (item.imoveis.length > 0 ? item.imoveis[0] : null)
          : (item.imoveis || null)
      })) as unknown as Tenant[];

      setTenants(transformedData);
    } catch (err: any) {
      console.error('Erro ao carregar inquilinos:', err);
      setError(err.message || 'Erro ao carregar inquilinos');
      toast.error('Erro ao carregar inquilinos');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && initialLoading) {
      loadTenants();
    }
  }, [user, initialLoading, loadTenants]);

  const handleTerminateLease = useCallback(async (tenant: Tenant) => {
    try {
      setIsLoading(true);

      const { data: comprovantes } = await supabase
        .from('comprovantes')
        .select('pdf_url')
        .eq('inquilino_id', tenant.id);

      if (comprovantes && comprovantes.length > 0) {
        const pdfPaths = comprovantes
          .filter(c => c.pdf_url)
          .map(c => {
            const url = new URL(c.pdf_url!);
            const pathParts = url.pathname.split('/');
            const bucketIndex = pathParts.findIndex(p => p === 'imoveis-fotos');
            return pathParts.slice(bucketIndex + 1).join('/');
          });

        if (pdfPaths.length > 0) {
          await supabase.storage
            .from('imoveis-fotos')
            .remove(pdfPaths);
        }
      }

      await supabase.from('comprovantes').delete().eq('inquilino_id', tenant.id);

      const { error: tenantError } = await supabase
        .from('inquilinos')
        .update({
          status: 'inativo',
          data_fim: new Date().toISOString().split('T')[0]
        })
        .eq('id', tenant.id);

      if (tenantError) throw tenantError;

      const { error: propertyError } = await supabase
        .from('imoveis')
        .update({ status: 'disponivel' })
        .eq('id', tenant.imovel_id);

      if (propertyError) throw propertyError;

      toast.success('Locação finalizada!');
      await loadTenants();
    } catch (error) {
      console.error('Erro ao finalizar locação:', error);
      toast.error('Erro ao finalizar locação');
    } finally {
      setIsLoading(false);
    }
  }, [loadTenants]);

  const filteredTenants = useMemo(() => {
    return tenants.filter(
      (tenant) => {
        const matchesSearch = tenant.nome_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.cpf.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "todos" || tenant.status === statusFilter;

        const matchesProperty = propertyFilter === "todos" || tenant.imoveis?.titulo === propertyFilter;

        return matchesSearch && matchesStatus && matchesProperty;
      }
    );
  }, [tenants, searchQuery, statusFilter, propertyFilter]);

  const propertiesOptions = useMemo(() => {
    const unique = new Set(tenants.map(t => t.imoveis?.titulo).filter(Boolean));
    return Array.from(unique).sort();
  }, [tenants]);

  if (isLoading) {
    return <PageLoader message="Carregando inquilinos..." />;
  }

  if (error) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Erro ao carregar dados</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button onClick={loadTenants} variant="outline" className="mt-4">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardHeader 
          title="Inquilinos" 
          subtitle={
            tenants.length === 0
              ? 'Nenhum inquilino cadastrado'
              : `${tenants.length} inquilino${tenants.length !== 1 ? 's' : ''} cadastrado${tenants.length !== 1 ? 's' : ''}`
          }
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar inquilino..."
          showClear={statusFilter !== "todos" || propertyFilter !== "todos" || searchQuery !== ""}
          onClear={() => {
            setStatusFilter("todos");
            setPropertyFilter("todos");
            setSearchQuery("");
          }}
        >
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Imóvel" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Imóveis</SelectItem>
              {propertiesOptions.map(title => (
                <SelectItem key={title} value={title || ''}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>

        {filteredTenants.length > 0 ? (
          <div className="grid gap-4">
            {filteredTenants.map((tenant, index) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                index={index}
                onTerminate={handleTerminateLease}
                formatarCPF={formatarCPF}
                formatarTelefone={formatarTelefone}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="Nenhum inquilino encontrado"
            description={searchQuery
              ? "Tente buscar com outros termos"
              : "Você ainda não tem inquilinos cadastrados."}
          />
        )}
      </div>
    </>
  );
}

interface TenantCardProps {
  tenant: Tenant;
  index: number;
  onTerminate: (tenant: Tenant) => void;
  formatarCPF: (cpf: string) => string;
  formatarTelefone: (phone: string) => string;
}

const TenantCard = memo(({ tenant, index, onTerminate, formatarCPF, formatarTelefone }: TenantCardProps) => {
  return (
    <Card
      className="transition-all duration-300 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start">

            <div className="flex flex-1 w-full gap-4">
              {/* avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>

              {/* name and status */}
              <div className="flex w-full flex-1 flex-col gap-1">
                <div className="flex  items-center justify-between md:justify-start gap-4">
                  <h3 className="font-display font-semibold">{tenant.nome_completo}</h3>

                  <Badge
                    variant="outline"
                    className={`text-xs font-normal ${tenant.status === "ativo"
                      ? "bg-green-50 text-green-500 border-green-200"
                      : "bg-red-50 text-red-500 border-red-200"
                      }`}
                  >
                    {tenant.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">CPF: {formatarCPF(tenant.cpf)}</p>
              </div>
              
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>{tenant.imoveis?.titulo || 'Imóvel não encontrado'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Pagamento dia {tenant.dia_vencimento}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{formatarTelefone(tenant.telefone)}</span>
                </div>
              </div>

          </div>

          <div className="flex items-center gap-2 text-muted-foreground w-full md:w-auto">
            <Link href={`/dashboard/comprovantes/novo?inquilino=${tenant.id}`} className="w-full md:w-auto">
              <Button variant="outline" size="sm" className="gap-1.5 border-tertiary hover:border-tertiary/90 bg-tertiary hover:bg-tertiary/90 text-white hover:text-white">
                <Receipt className="h-4 w-4" />
                Gerar comprovante
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/inquilinos/${tenant.id}`} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4 text-primary" />
                    Ver detalhes
                  </Link>
                </DropdownMenuItem>
                {tenant.status === 'ativo' && (
                  <DropdownMenuItem
                    className="cursor-pointer text-orange-600 focus:text-orange-600"
                    onClick={() => onTerminate(tenant)}
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    Finalizar Locação
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
