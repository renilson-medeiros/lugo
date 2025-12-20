// src/pages/dashboard/PropertiesList.tsx
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback, memo } from "react";

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
  MapPin,
  Trash2,
  UserMinus
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
import { Filter, XCircle } from "lucide-react";
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

export default function PropertiesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("todos");

  // Carregar imóveis do banco
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
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
  };

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
  }, [deleteId]);

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
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Imóveis</h1>
            <p className="text-muted-foreground">Gerencie seus imóveis cadastrados</p>
          </div>
          <Link href="/dashboard/imoveis/novo">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-500">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo imóvel
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
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

            {(statusFilter !== "todos" || neighborhoodFilter !== "todos" || searchQuery !== "") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("todos");
                  setNeighborhoodFilter("todos");
                  setSearchQuery("");
                }}
                className="text-muted-foreground hover:text-red-500 w-full lg:w-auto col-span-1 sm:col-span-2 lg:col-span-1"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Properties Grid - Loading */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-accent" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-accent rounded w-3/4" />
                  <div className="h-3 bg-accent rounded w-full" />
                  <div className="h-4 bg-accent rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onShare={handleShare}
                onDelete={setDeleteId}
                onTerminate={handleTerminateLease}
              />
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
                <Link href="/dashboard/imoveis/novo" className="mt-4">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-500">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Cadastrar imóvel
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
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
}

const PropertyCard = memo(({ property, index, onShare, onDelete, onTerminate }: PropertyCardProps) => {
  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in"
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
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${property.status === "ocupado"
            ? "bg-red-100 text-red-500"
            : "bg-green-100 text-green-500"
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
            R$ {property.rent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onShare(property)}
              aria-label="Compartilhar imóvel"
            >
              <Share2 className="h-4 w-4 text-blue-600" />
            </Button>
            <Link href={`/imovel/${property.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver imóvel">
                <Eye className="h-4 w-4 text-blue-600" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Mais opções">
                  <MoreHorizontal className="h-4 w-4 text-blue-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/imoveis/${property.id}/editar`} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4 text-blue-600" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                {property.status === "disponível" && (
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/imoveis/${property.id}/inquilino`} className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4 text-blue-600" />
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
        {property.tenant && (
          <p className="mt-2 text-sm text-muted-foreground">
            Inquilino: {property.tenant}
          </p>
        )}
      </CardContent>
    </Card>
  );
});