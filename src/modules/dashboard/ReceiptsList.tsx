"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  Plus,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Building2,
  Loader2,
  AlertCircle,
  Filter,
  XCircle
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
  const [searchQuery, setSearchQuery] = useState("");
  const [receipts, setReceipts] = useState<ReceiptData[]>(initialData);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [mesFilter, setMesFilter] = useState("todos");
  const [anoFilter, setAnoFilter] = useState("todos");

  useEffect(() => {
    if (user && initialLoading) {
      loadReceipts();
    }
  }, [user]);

  const loadReceipts = useCallback(async () => {
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
        .eq('imoveis.proprietario_id', user?.id)
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
  }, [user?.id]);

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
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-tertiary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando comprovantes...</p>
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
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Comprovantes</h1>
            <p className="text-muted-foreground">
              {receipts.length === 0
                ? 'Nenhum comprovante gerado'
                : `${receipts.length} comprovante${receipts.length !== 1 ? 's' : ''} gerado${receipts.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Link href="/dashboard/comprovantes/novo">
            <Button className="gap-2 w-full md:w-fit bg-tertiary hover:bg-tertiary/90">
              <Plus className="h-4 w-4 " aria-hidden="true" />
              Novo comprovante
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex bg-tertiary py-5 px-4 rounded-lg flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Buscar comprovante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Buscar comprovante"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
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

            {(tipoFilter !== "todos" || mesFilter !== "todos" || anoFilter !== "todos" || searchQuery !== "") && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  setTipoFilter("todos");
                  setMesFilter("todos");
                  setAnoFilter("todos");
                  setSearchQuery("");
                }}
                className="text-white py-6 bg-red-600 hover:bg-red-500 hover:text-white border border-red-500 w-full lg:w-auto col-span-1 lg:col-span-1"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Receipts List */}
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
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
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
                          R$ {receipt.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Receipt className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nenhum comprovante encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Tente buscar com outros termos"
                  : "Você ainda não gerou nenhum comprovante. Gere comprovantes de pagamento ou residência para seus inquilinos."}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/comprovantes/novo" className="mt-4">
                  <Button className="gap-2 bg-tertiary hover:bg-tertiary/90">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Gerar comprovante
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
