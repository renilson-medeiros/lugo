"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Download,
  Eye,
  Calendar,
  Building2,
  AlertCircle,
  Filter,
  Plus,
  DownloadCloud
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageLoader } from "@/components/dashboard/PageLoader";
import { useFormFormatting } from "@/lib/hooks/useFormFormatting";

interface ReceiptData {
  id: string;
  inquilino_id: string;
  imovel_id: string;
  tipo: 'pagamento' | 'residencia';
  mes_referencia: string;
  valor: number | null;
  descricao: string | null;
  pdf_url: string | null;
  created_at: string;
  inquilinos: {
    nome_completo: string;
  } | null;
  imoveis: {
    titulo: string;
    proprietario_id: string;
  } | null;
}

interface ReceiptsListProps {
  initialData?: ReceiptData[];
  initialLoading?: boolean;
}

export default function ReceiptsList({ initialData = [], initialLoading = true }: ReceiptsListProps) {
  const { user } = useAuth();
  const { formatarMoeda } = useFormFormatting();
  const [searchQuery, setSearchQuery] = useState("");
  const [receipts, setReceipts] = useState<ReceiptData[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [mesFilter, setMesFilter] = useState("todos");
  const [anoFilter, setAnoFilter] = useState("todos");

  const loadReceipts = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('comprovantes')
        .select(`
          id,
          inquilino_id,
          imovel_id,
          tipo,
          mes_referencia,
          valor,
          descricao,
          pdf_url,
          created_at,
          inquilinos (
            nome_completo
          ),
          imoveis!inner (
            titulo,
            proprietario_id
          )
        `)
        .eq('imoveis.proprietario_id', user.id)
        .order('mes_referencia', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      // Transformar dados para corresponder à interface
      const transformedData: ReceiptData[] = (data || []).map(item => ({
        ...item,
        inquilinos: Array.isArray(item.inquilinos)
          ? (item.inquilinos.length > 0 ? item.inquilinos[0] : null)
          : (item.inquilinos || null),
        imoveis: Array.isArray(item.imoveis)
          ? (item.imoveis.length > 0 ? item.imoveis[0] : null)
          : (item.imoveis || null)
      }));

      setReceipts(transformedData);
    } catch (err: any) {
      console.error('Erro ao carregar comprovantes:', err);
      setError(err.message || 'Erro ao carregar comprovantes');
      toast.error('Erro ao carregar comprovantes');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && initialLoading) {
      loadReceipts();
    }
  }, [user, initialLoading, loadReceipts]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(
      (receipt) => {
        const matchesSearch = (receipt.inquilinos?.nome_completo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (receipt.imoveis?.titulo || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTipo = tipoFilter === "todos" || receipt.tipo === tipoFilter;

        const date = new Date(receipt.mes_referencia);
        const matchesMes = mesFilter === "todos" || (date.getMonth() + 1).toString() === mesFilter;
        const matchesAno = anoFilter === "todos" || date.getFullYear().toString() === anoFilter;

        return matchesSearch && matchesTipo && matchesMes && matchesAno;
      }
    );
  }, [receipts, searchQuery, tipoFilter, mesFilter, anoFilter]);

  const years = useMemo(() => {
    const unique = new Set(receipts.map(r => new Date(r.mes_referencia).getFullYear().toString()));
    return Array.from(unique).sort((a, b) => b.localeCompare(a));
  }, [receipts]);

  const months = [
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julho", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ];

  const handleDownload = useCallback(async (pdfUrl: string | null) => {
    if (!pdfUrl) {
      toast.error('PDF não disponível');
      return;
    }

    try {
      window.open(pdfUrl, '_blank');
    } catch (err) {
      toast.error('Erro ao abrir PDF');
    }
  }, []);

  const formatReferenceMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return <PageLoader message="Carregando comprovantes..." />;
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
          <Button onClick={loadReceipts} variant="outline" className="mt-4">
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
          title="Comprovantes" 
          subtitle={
            receipts.length === 0
              ? 'Nenhum comprovante gerado'
              : `${receipts.length} comprovante${receipts.length !== 1 ? 's' : ''} gerado${receipts.length !== 1 ? 's' : ''}`
          }
          action={{
            label: "Novo comprovante",
            href: "/dashboard/comprovantes/novo"
          }}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Buscar comprovante..."
          showClear={tipoFilter !== "todos" || mesFilter !== "todos" || anoFilter !== "todos" || searchQuery !== ""}
          onClear={() => {
            setTipoFilter("todos");
            setMesFilter("todos");
            setAnoFilter("todos");
            setSearchQuery("");
          }}
        >
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Tipo" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Tipos</SelectItem>
              <SelectItem value="pagamento">Pagamento</SelectItem>
              <SelectItem value="residencia">Residência</SelectItem>
            </SelectContent>
          </Select>

          <Select value={mesFilter} onValueChange={setMesFilter}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Mês" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Meses</SelectItem>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={anoFilter} onValueChange={setAnoFilter}>
            <SelectTrigger className="w-full lg:w-[100px] col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground lg:hidden" />
                <SelectValue placeholder="Ano" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Anos</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>

        {filteredReceipts.length > 0 ? (
          <div className="grid gap-4">
            {filteredReceipts.map((receipt, index) => (
              <Card
                key={receipt.id}
                className="transition-all duration-300 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    
                    <div className="flex items-start gap-4">
                      <div>

                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
                            <Receipt className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <div className="flex w-full flex-1 flex-col gap-1">
                            <div className="flex items-center justify-between md:justify-start gap-4">
                              <h3 className="font-display font-semibold capitalize">
                                {formatReferenceMonth(receipt.mes_referencia)}
                              </h3>

                              <Badge variant="outline" className="bg-success/10 text-success font-normal border-success/20">
                                {receipt.tipo === 'pagamento' ? 'Pagamento' : 'Residência'}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <span>{receipt.inquilinos?.nome_completo || 'Inquilino não encontrado'}</span>
                            </div>

                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span>{receipt.imoveis?.titulo || 'Imóvel não encontrado'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span>{new Date(receipt.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {receipt.valor && (
                        <p className="font-display text-xl font-bold text-success w-full md:w-auto">
                          {formatarMoeda((receipt.valor * 100).toString())}
                        </p>
                      )}
                      <div className="flex items-center gap-1">
                        <Link href={`/dashboard/comprovantes/${receipt.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver comprovante">
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </Link>
                        {receipt.pdf_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Baixar comprovante"
                            onClick={() => handleDownload(receipt.pdf_url)}
                          >
                            <Download className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Receipt className="h-8 w-8 text-muted-foreground" aria-hidden="true" />}
            title="Nenhum comprovante encontrado"
            description={searchQuery
              ? "Tente buscar com outros termos"
              : "Você ainda não gerou nenhum comprovante. Gere comprovantes de pagamento ou residência para seus inquilinos."}
            action={!searchQuery ? {
              label: "Gerar comprovante",
              href: "/dashboard/comprovantes/novo"
            } : undefined}
          />
        )}
      </div>
    </>
  );
}
