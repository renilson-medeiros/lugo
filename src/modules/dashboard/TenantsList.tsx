"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, memo } from "react";

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
  Eye,
  Loader2,
  AlertCircle,
  UserMinus
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
import { Filter, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

const formatCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return cpf;
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone: string) => {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export default function TenantsList({ initialData = [], initialLoading = true }: TenantsListProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [propertyFilter, setPropertyFilter] = useState("todos");

  useEffect(() => {
    if (user && initialLoading) {
      loadTenants();
    }
  }, [user]);

  const loadTenants = useCallback(async () => {
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
        .eq('imoveis.proprietario_id', user?.id)
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
  }, [user?.id]);

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
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando inquilinos...</p>
        </div>
      </div>
    );
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Inquilinos</h1>
            <p className="text-muted-foreground">
              {tenants.length === 0
                ? 'Nenhum inquilino cadastrado'
                : `${tenants.length} inquilino${tenants.length !== 1 ? 's' : ''} cadastrado${tenants.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>

        <div className="flex bg-blue-500 py-5 px-4 rounded-lg flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar inquilino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
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

            {(statusFilter !== "todos" || propertyFilter !== "todos" || searchQuery !== "") && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  setStatusFilter("todos");
                  setPropertyFilter("todos");
                  setSearchQuery("");
                }}
                className="text-white py-6 bg-red-600 hover:bg-red-500 hover:text-white border border-red-500 w-full lg:w-auto"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {filteredTenants.length > 0 ? (
          <div className="grid gap-4">
            {filteredTenants.map((tenant, index) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                index={index}
                onTerminate={handleTerminateLease}
              />
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nenhum inquilino encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Tente buscar com outros termos"
                  : "Você ainda não tem inquilinos cadastrados."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

interface TenantCardProps {
  tenant: Tenant;
  index: number;
  onTerminate: (tenant: Tenant) => void;
}

const TenantCard = memo(({ tenant, index, onTerminate }: TenantCardProps) => {
  return (
    <Card
      className="transition-all duration-300 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
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
              <p className="text-sm text-muted-foreground">CPF: {formatCPF(tenant.cpf)}</p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>{tenant.imoveis?.titulo || 'Imóvel não encontrado'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Dia {tenant.dia_vencimento}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>{formatPhone(tenant.telefone)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground ">
            <Link href={`/dashboard/comprovantes/novo?inquilino=${tenant.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 border-blue-600 hover:border-blue-500 bg-blue-600 hover:bg-blue-500 text-white hover:text-white">
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
                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
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
