"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  Receipt,
  Edit,
  UserMinus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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

interface TenantData {
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
    endereco_bairro: string;
    endereco_cidade: string;
  } | null;
}

interface Comprovante {
  id: string;
  mes: number;
  ano: number;
  valor_pago: number;
  data_pagamento: string;
  created_at: string;
}

export default function TenantDetails() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [comprovantes, setComprovantes] = useState<Comprovante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

  useEffect(() => {
    if (id) {
      loadTenantData();
    }
  }, [id]);

  const loadTenantData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Carregar dados do inquilino
      const { data: tenantData, error: tenantError } = await supabase
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
          imoveis (
            titulo,
            endereco_rua,
            endereco_numero,
            endereco_bairro,
            endereco_cidade
          )
        `)
        .eq('id', id)
        .single();

      if (tenantError) throw tenantError;

      const transformedData = {
        ...tenantData,
        imoveis: Array.isArray(tenantData.imoveis)
          ? (tenantData.imoveis.length > 0 ? tenantData.imoveis[0] : null)
          : (tenantData.imoveis || null)
      } as TenantData;

      setTenant(transformedData);

      // Carregar comprovantes
      const { data: comprovantesData, error: comprovantesError } = await supabase
        .from('comprovantes')
        .select('id, mes_referencia, valor, created_at')
        .eq('inquilino_id', id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (comprovantesError) {
        console.error('Erro ao carregar comprovantes:', comprovantesError);
        // N\u00e3o lan\u00e7ar erro, apenas deixar vazio
        setComprovantes([]);
      } else {
        // Transformar os dados para o formato esperado
        const transformedComprovantes = (comprovantesData || []).map(comp => {
          let mes = 0;
          let ano = 0;

          if (comp.mes_referencia) {
            if (comp.mes_referencia.includes('/')) {
              const parts = comp.mes_referencia.split('/');
              mes = parseInt(parts[0]);
              ano = parseInt(parts[1]);
            } else if (comp.mes_referencia.includes('-')) {
              // Assume YYYY-MM-DD or YYYY-MM
              const date = new Date(comp.mes_referencia);
              if (!isNaN(date.getTime())) {
                mes = date.getMonth() + 1; // getMonth is 0-indexed
                ano = date.getFullYear();
              } else {
                 // Try explicit split if YYYY-MM
                 const parts = comp.mes_referencia.split('-');
                 if (parts.length >= 2) {
                     ano = parseInt(parts[0]);
                     mes = parseInt(parts[1]);
                 }
              }
            } else {
                // Try parsing as date object directly
                 const date = new Date(comp.mes_referencia);
                 if (!isNaN(date.getTime())) {
                    mes = date.getMonth() + 1;
                    ano = date.getFullYear();
                 }
            }
          }

          return {
            id: comp.id,
            mes: mes || 0,
            ano: ano || 0,
            valor_pago: comp.valor || 0,
            data_pagamento: comp.created_at,
            created_at: comp.created_at
          };
        });
        setComprovantes(transformedComprovantes);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados do inquilino');
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateLease = async () => {
    if (!tenant) return;

    try {
      setIsTerminating(true);

      // Deletar PDFs dos comprovantes
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

      // Deletar comprovantes
      await supabase.from('comprovantes').delete().eq('inquilino_id', tenant.id);

      // Inativar inquilino
      const { error: tenantError } = await supabase
        .from('inquilinos')
        .update({
          status: 'inativo',
          data_fim: new Date().toISOString().split('T')[0]
        })
        .eq('id', tenant.id);

      if (tenantError) throw tenantError;

      // Atualizar imóvel para disponível
      const { error: propertyError } = await supabase
        .from('imoveis')
        .update({ status: 'disponivel' })
        .eq('id', tenant.imovel_id);

      if (propertyError) throw propertyError;

      toast.success('Locação finalizada com sucesso!');
      router.push('/dashboard/inquilinos');
    } catch (error) {
      console.error('Erro ao finalizar locação:', error);
      toast.error('Erro ao finalizar locação');
    } finally {
      setIsTerminating(false);
      setShowTerminateDialog(false);
    }
  };

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-tertiary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Erro ao carregar dados</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error || 'Inquilino não encontrado'}</p>
          <Button onClick={() => router.back()} variant="outline" className="mt-4">
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Detalhes do Inquilino</h1>
            <p className="text-muted-foreground">Informações completas e histórico</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/inquilinos/${tenant.id}/editar`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>
            {tenant.status === 'ativo' && (
              <Button
                variant="outline"
                className="gap-2 text-orange-600 border-orange-600 hover:bg-orange-50"
                onClick={() => setShowTerminateDialog(true)}
              >
                <UserMinus className="h-4 w-4" />
                Finalizar Locação
              </Button>
            )}
          </div>
        </div>

        {/* Informações Principais */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-tertiary" />
                Informações Pessoais
              </CardTitle>
              <Badge
                variant="outline"
                className={`${
                  tenant.status === 'ativo'
                    ? 'bg-green-50 text-green-500 border-green-200'
                    : 'bg-red-50 text-red-500 border-red-200'
                }`}
              >
                {tenant.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-secondary">Nome Completo</p>
                <p className="text-sm text-muted-foreground">{tenant.nome_completo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">CPF</p>
                <p className="text-sm text-muted-foreground">{formatCPF(tenant.cpf)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">Telefone</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-tertiary" />
                  {formatPhone(tenant.telefone)}
                </p>
              </div>
              {tenant.email && (
                <div>
                  <p className="text-sm font-medium text-secondary">E-mail</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-tertiary" />
                    {tenant.email}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-tertiary" />
              Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tenant.imoveis ? (
              <>
                <div>
                  <p className="text-sm font-medium text-secondary">Título</p>
                  <p className="text-sm text-muted-foreground">{tenant.imoveis.titulo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {tenant.imoveis.endereco_rua}, {tenant.imoveis.endereco_numero} - {tenant.imoveis.endereco_bairro}, {tenant.imoveis.endereco_cidade}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Imóvel não encontrado</p>
            )}
          </CardContent>
        </Card>

        {/* Informações da Locação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-tertiary" />
              Informações da Locação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-secondary">Data de Início</p>
                <p className="text-sm text-muted-foreground">{formatDate(tenant.data_inicio)}</p>
              </div>
              {tenant.data_fim && (
                <div>
                  <p className="text-sm font-medium text-secondary">Data de Término</p>
                  <p className="text-sm text-muted-foreground">{formatDate(tenant.data_fim)}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-secondary">Dia de Vencimento</p>
                <p className="text-sm text-muted-foreground">Dia {tenant.dia_vencimento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprovantes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-tertiary" />
                Histórico de Comprovantes
              </CardTitle>
              {tenant.status === 'ativo' && (
                <Link href={`/dashboard/comprovantes/novo?inquilino=${tenant.id}`}>
                  <Button size="sm" className="gap-2 bg-tertiary hover:bg-tertiary/90">
                    <Receipt className="h-4 w-4" />
                    Gerar Comprovante
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {comprovantes.length > 0 ? (
              <div className="space-y-2">
                {comprovantes.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {getMonthName(comp.mes)} de {comp.ano}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pago em {formatDate(comp.data_pagamento)}
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(comp.valor_pago)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum comprovante gerado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação */}
      <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Locação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar a locação de {tenant.nome_completo}? 
              Esta ação irá inativar o inquilino, deletar todos os comprovantes e marcar o imóvel como disponível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTerminating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTerminateLease}
              disabled={isTerminating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isTerminating ? 'Finalizando...' : 'Finalizar Locação'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
