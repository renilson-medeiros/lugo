"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Share2,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Trash2,
  UserMinus,
  Settings2,
  Check,
  Plus,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageLoader } from "@/components/dashboard/PageLoader";
import { useFormFormatting } from "@/lib/hooks/useFormFormatting";

interface Property {
  id: string;
  title: string;
  address: string;
  rent: number;
  status: string;
  tenant: string | null;
  image: string;
  neighborhood: string;
  city: string;
}

interface PropertiesListProps {
  initialData?: Property[];
  initialLoading?: boolean;
}

export default function PropertiesList({ initialData = [], initialLoading = true }: PropertiesListProps) {
  const { formatarMoeda } = useFormFormatting();
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("todos");

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('imoveis')
        .select(`
          id,
          titulo,
          endereco_rua,
          endereco_numero,
          endereco_bairro,
          endereco_cidade,
          valor_aluguel,
          status,
          fotos,
          created_at,
          inquilinos(nome_completo, status)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Formatar dados para o formato do componente
      const formattedProperties: Property[] = (data || []).map(imovel => {
        // Pegar primeiro inquilino ativo
        const activeInquilino = imovel.inquilinos?.find((inq: any) => inq.status === 'ativo');

        return {
          id: imovel.id,
          title: imovel.titulo || `${imovel.endereco_rua}, ${imovel.endereco_numero}`,
          address: `${imovel.endereco_rua}, ${imovel.endereco_numero} - ${imovel.endereco_bairro}, ${imovel.endereco_cidade}`,
          rent: imovel.valor_aluguel || 0,
          status: imovel.status === 'alugado' ? 'ocupado' : imovel.status === 'disponivel' ? 'disponível' : 'manutenção',
          tenant: activeInquilino?.nome_completo || null,
          image: (imovel.fotos && imovel.fotos.length > 0)
            ? imovel.fotos[0]
            : "/preview.png",
          neighborhood: imovel.endereco_bairro || '',
          city: imovel.endereco_cidade || ''
        };
      });

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      toast.error('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar imóveis do banco
  useEffect(() => {
    if (initialLoading) {
      loadProperties();
    }
  }, [initialLoading, loadProperties]);

  // Usar useMemo para evitar recalcular filteredProperties em cada render
  const filteredProperties = useMemo(() => {
    return properties.filter(
      (property) => {
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "todos" || property.status === statusFilter;

        const matchesNeighborhood = neighborhoodFilter === "todos" || property.neighborhood === neighborhoodFilter;

        return matchesSearch && matchesStatus && matchesNeighborhood;
      }
    );
  }, [properties, searchQuery, statusFilter, neighborhoodFilter]);

  const neighborhoods = useMemo(() => {
    const unique = new Set(properties.map(p => p.neighborhood).filter(Boolean));
    return Array.from(unique).sort();
  }, [properties]);

  // Usar useCallback para evitar recriar funções em cada render
  const handleShare = useCallback((property: Property) => {
    const url = `${window.location.origin}/imovel/${property.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!", {
      description: "Compartilhe com potenciais inquilinos.",
    });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      // Buscar imóvel para pegar as fotos
      const { data: imovel } = await supabase
        .from('imoveis')
        .select('fotos')
        .eq('id', deleteId)
        .single();

      // Deletar fotos do storage
      if (imovel?.fotos && imovel.fotos.length > 0) {
        const filePaths = imovel.fotos.map((url: string) => {
          const urlParts = url.split('/');
          const userFolder = urlParts[urlParts.length - 2];
          const fileName = urlParts[urlParts.length - 1];
          return `${userFolder}/${fileName}`;
        });

        await supabase.storage
          .from('imoveis-fotos')
          .remove(filePaths);
      }

      // Deletar imóvel do banco
      const { error } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Imóvel excluído com sucesso!');

      // Recarregar lista
      await loadProperties();
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      toast.error('Erro ao excluir imóvel');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }, [deleteId, loadProperties]);

  const handleChangeStatus = useCallback(async (propertyId: string, newStatus: 'disponivel' | 'manutencao') => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('imoveis')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast.success(
        newStatus === 'manutencao' 
          ? 'Imóvel marcado como em manutenção' 
          : 'Imóvel marcado como disponível'
      );

      await loadProperties();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do imóvel');
    } finally {
      setLoading(false);
    }
  }, [loadProperties]);

  const handleTerminateLease = useCallback(async (propertyId: string) => {
    try {
      setLoading(true);

      // 1. Encontrar o inquilino ativo para este imóvel
      const { data: inquilino } = await supabase
        .from('inquilinos')
        .select('id')
        .eq('imovel_id', propertyId)
        .eq('status', 'ativo')
        .single();

      if (inquilino) {
        // 2. Inativar o inquilino
        await supabase
          .from('inquilinos')
          .update({
            status: 'inativo',
            data_fim: new Date().toISOString().split('T')[0]
          })
          .eq('id', inquilino.id);
      }

      // 3. Voltar o imóvel para disponível
      const { error: propertyError } = await supabase
        .from('imoveis')
        .update({ status: 'disponivel' })
        .eq('id', propertyId);

      if (propertyError) throw propertyError;

      toast.success('Locação finalizada!', {
        description: 'O imóvel agora está disponível para novos inquilinos.'
      });

      await loadProperties();
    } catch (error) {
      console.error('Erro ao finalizar locação:', error);
      toast.error('Erro ao finalizar locação');
    } finally {
      setLoading(false);
    }
  }, [loadProperties]);

  if (loading) {
    return <PageLoader message="Carregando imóveis..." />;
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardHeader 
          title="Imóveis" 
          subtitle="Gerencie seus imóveis cadastrados"
          action={{
            label: "Novo imóvel",
            href: "/dashboard/imoveis/novo"
          }}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar imóvel..."
          showClear={statusFilter !== "todos" || neighborhoodFilter !== "todos" || searchQuery !== ""}
          onClear={() => {
            setStatusFilter("todos");
            setNeighborhoodFilter("todos");
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
              <SelectItem value="disponível">Disponível</SelectItem>
              <SelectItem value="ocupado">Ocupado</SelectItem>
              <SelectItem value="manutenção">Manutenção</SelectItem>
            </SelectContent>
          </Select>

          <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Bairro" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Bairros</SelectItem>
              {neighborhoods.map(neighborhood => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>

        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onShare={handleShare}
                onDelete={setDeleteId}
                onTerminate={handleTerminateLease}
                onChangeStatus={handleChangeStatus}
                formatarMoeda={formatarMoeda}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Building2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />}
            title="Nenhum imóvel encontrado"
            description={searchQuery
              ? "Tente buscar com outros termos"
              : "Cadastre seu primeiro imóvel para começar"}
            action={!searchQuery ? {
              label: "Cadastrar imóvel",
              href: "/dashboard/imoveis/novo"
            } : undefined}
          />
        )}
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita e dados relacionados (inquilinos, comprovantes) também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Componente PropertyCard com React.memo para evitar re-renders desnecessários
interface PropertyCardProps {
  property: Property;
  index: number;
  onShare: (property: Property) => void;
  onDelete: (id: string) => void;
  onTerminate: (id: string) => void;
  onChangeStatus: (id: string, status: 'disponivel' | 'manutencao') => void;
  formatarMoeda: (value: string) => string;
}

const PropertyCard = memo(({ property, index, onShare, onDelete, onTerminate, onChangeStatus, formatarMoeda }: PropertyCardProps) => {
  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-sm animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
            property.status === "ocupado"
              ? "bg-red-100 text-red-500"
              : property.status === "manutenção"
              ? "bg-orange-100 text-orange-500"
              : "bg-green-100 text-green-500"
          }`}
        >
          {property.status === "ocupado" 
            ? "Ocupado" 
            : property.status === "manutenção" 
            ? "Manutenção" 
            : "Disponível"}
        </span>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-ellipsis truncate">{property.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          <span className="line-clamp-1">{property.address}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-semibold text-tertiary">
            {formatarMoeda((property.rent * 100).toString())}/mês
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onShare(property)}
              aria-label="Compartilhar imóvel"
            >
              <Share2 className="h-4 w-4 text-primary" />
            </Button>
            <Link href={`/imovel/${property.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver imóvel">
                <Eye className="h-4 w-4 text-primary" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Mais opções">
                  <MoreHorizontal className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/imoveis/${property.id}/editar`} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4 text-primary" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                {property.status === "disponível" && (
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/imoveis/${property.id}/inquilino`} className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4 text-primary" />
                      Cadastrar inquilino
                    </Link>
                  </DropdownMenuItem>
                )}
                {property.status === "ocupado" && (
                  <DropdownMenuItem
                    className="cursor-pointer text-orange-600 focus:text-orange-600"
                    onClick={() => onTerminate(property.id)}
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    Finalizar Locação
                  </DropdownMenuItem>
                )}
                {property.status === "disponível" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onChangeStatus(property.id, 'manutencao')}
                  >
                    <Settings2 className="mr-2 h-4 w-4 text-orange-600" />
                    Manutenção
                  </DropdownMenuItem>
                )}
                {property.status === "manutenção" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onChangeStatus(property.id, 'disponivel')}
                  >
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Marcar como disponível
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => onDelete(property.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {property.tenant ? (
          <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
            Inquilino: {property.tenant}
          </p>
        ) : (
          <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
            Não possui inquilino
          </p>
        )}
      </CardContent>
    </Card>
  );
});
