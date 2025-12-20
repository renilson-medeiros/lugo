import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Info, Users, Receipt, Plus, ArrowRight, TrendingUp, Home, ChevronLeft, ChevronRight as ChevronRightIcon, AlertCircle, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface DashboardStats {
  totalImoveis: number;
  inquilinosAtivos: number;
  comprovantesGerados: number;
}

interface RecentProperty {
  id: string;
  endereco_rua: string;
  endereco_numero: string;
  status: string;
  inquilino_nome?: string;
  created_at: string;
}

interface RevenueData {
  month: string;
  total: number;
}

interface DashboardAlert {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  dueDate: number;
  type: 'overdue' | 'upcoming';
  amount: number;
}

export default function Dashboard() {
  // 🔥 CHAMAR useAuth NO TOPO (antes de qualquer outro código)
  const { profile, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalImoveis: 0,
    inquilinosAtivos: 0,
    comprovantesGerados: 0,
  });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const ITEMS_PER_PAGE = 3;

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardStats();
    loadRevenueData();
    loadProperties(1);
    loadAlerts();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Buscar total de imóveis
      const { count: totalImoveis } = await supabase
        .from('imoveis')
        .select('*', { count: 'exact', head: true });

      // Buscar inquilinos ativos
      const { count: inquilinosAtivos } = await supabase
        .from('inquilinos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

      // Buscar total de comprovantes
      const { count: comprovantesGerados } = await supabase
        .from('comprovantes')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalImoveis: totalImoveis || 0,
        inquilinosAtivos: inquilinosAtivos || 0,
        comprovantesGerados: comprovantesGerados || 0,
      });
      setTotalProperties(totalImoveis || 0);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('comprovantes')
        .select('valor, mes_referencia')
        .eq('tipo', 'pagamento')
        .order('mes_referencia', { ascending: true });

      if (error) throw error;

      // Agrupar por mês
      const months: Record<string, number> = {};
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

      // Inicializar últimos 6 meses com zero
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;
        months[key] = 0;
      }

      data?.forEach((item: any) => {
        const date = new Date(item.mes_referencia);
        const key = `${monthNames[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
        if (months[key] !== undefined) {
          months[key] += Number(item.valor);
        }
      });

      const chartData = Object.entries(months).map(([month, total]) => ({
        month,
        total
      }));

      setRevenueData(chartData);
    } catch (error) {
      console.error('Erro ao carregar dados de receita:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      setLoadingAlerts(true);

      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // 1. Buscar todos os inquilinos ativos
      const { data: activeTenants, error: tenantsError } = await supabase
        .from('inquilinos')
        .select(`
          id,
          nome_completo,
          dia_vencimento,
          valor_aluguel,
          imoveis (
            endereco_rua,
            endereco_numero
          )
        `)
        .eq('status', 'ativo');

      if (tenantsError) throw tenantsError;

      // 2. Buscar comprovantes de pagamento do mês atual
      const { data: currentMonthReceipts, error: receiptsError } = await supabase
        .from('comprovantes')
        .select('inquilino_id')
        .eq('tipo', 'pagamento')
        .gte('mes_referencia', currentMonthStart);

      if (receiptsError) throw receiptsError;

      const receivedInquilinoIds = new Set(currentMonthReceipts?.map((r: any) => r.inquilino_id));

      const dashboardAlerts: DashboardAlert[] = [];
      const today = now.getDate();

      activeTenants?.forEach((tenant: any) => {
        // Se já pagou este mês, ignora
        if (receivedInquilinoIds.has(tenant.id)) return;

        const dueDay = tenant.dia_vencimento;
        const property = Array.isArray(tenant.imoveis) ? tenant.imoveis[0] : tenant.imoveis;
        const propertyName = property ? `${property.endereco_rua}, ${property.endereco_numero}` : 'Imóvel';

        if (dueDay < today) {
          // Atrasado
          dashboardAlerts.push({
            id: `overdue-${tenant.id}`,
            tenantId: tenant.id,
            tenantName: tenant.nome_completo,
            propertyName,
            dueDate: dueDay,
            type: 'overdue',
            amount: tenant.valor_aluguel
          });
        } else if (dueDay <= today + 5) {
          // Vencendo logo
          dashboardAlerts.push({
            id: `upcoming-${tenant.id}`,
            tenantId: tenant.id,
            tenantName: tenant.nome_completo,
            propertyName,
            dueDate: dueDay,
            type: 'upcoming',
            amount: tenant.valor_aluguel
          });
        }
      });

      // Ordenar por tipo (overdue primeiro) e depois por dia
      dashboardAlerts.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'overdue' ? -1 : 1;
        }
        return a.dueDate - b.dueDate;
      });

      setAlerts(dashboardAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const loadProperties = async (page: number) => {
    try {
      setLoadingProperties(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data: imoveisRecentes } = await supabase
        .from('imoveis')
        .select(`
          id,
          endereco_rua,
          endereco_numero,
          status,
          created_at,
          inquilinos(nome_completo)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      const formattedProperties = imoveisRecentes?.map((imovel: any) => ({
        id: imovel.id,
        endereco_rua: imovel.endereco_rua,
        endereco_numero: imovel.endereco_numero,
        status: imovel.status,
        created_at: imovel.created_at,
        inquilino_nome: Array.isArray(imovel.inquilinos) && imovel.inquilinos.length > 0
          ? imovel.inquilinos[0].nome_completo
          : null,
      })) || [];

      setRecentProperties(formattedProperties);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    } finally {
      setLoadingProperties(false);
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Imóveis cadastrados",
      value: stats.totalImoveis.toString(),
      icon: Building2,
      href: "/dashboard/imoveis"
    },
    {
      label: "Inquilinos ativos",
      value: stats.inquilinosAtivos.toString(),
      icon: Users,
      href: "/dashboard/inquilinos"
    },
    {
      label: "Comprovantes gerados",
      value: stats.comprovantesGerados.toString(),
      icon: Receipt,
      href: "/dashboard/comprovantes"
    },
  ];

  // PEGAR O PRIMEIRO NOME
  const firstName = profile?.nome_completo?.split(' ')[0] || 'Usuário';

  // MOSTRAR LOADING ENQUANTO AUTH CARREGA
  if (authLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Painel</h1>
            <p className="text-muted-foreground">
              Olá {firstName}! Aqui está o resumo dos seus imóveis.
            </p>
          </div>
          {profile?.subscription_status === 'trial' && stats.totalImoveis >= 1 ? (
            <Link href="/checkout">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-500 text-white border-none shadow-sm shadow-blue-200">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Assinar para adicionar mais
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/imoveis/novo">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-500">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Novo imóvel
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 rounded bg-accent" />
                    <div className="h-6 w-12 rounded bg-accent" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsData.map((stat, index) => (
              <Link key={stat.label} href={stat.href}>
                <Card
                  className="group transition-all duration-300 hover:border-blue-600/30 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary/10">
                      <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="font-display text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center justify-between">
                Receita Bruta Mensal
                {revenueData.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground bg-accent px-2 py-1 rounded-md">
                    Últimos 6 meses
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                {loading ? (
                  <div className="h-full w-full bg-accent/50 animate-pulse rounded-lg" />
                ) : revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(value) => `R$ ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
                      />
                      <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                        formatter={(value: number) => [
                          value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                          'Receita'
                        ]}
                      />
                      <Bar
                        dataKey="total"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                      >
                        {revenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === revenueData.length - 1 ? "#3b82f6" : "#94a3b8"}
                            className="transition-all duration-300 hover:fill-blue-500"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">Sem dados de pagamento para exibir.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats / Info */}
          <div className="space-y-6">
            <Card className="border-blue-600 bg-blue-600">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                  <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Dica: Compartilhe</p>
                  <p className="text-sm text-white/80">
                    Gere links únicos para cada imóvel e compartilhe.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Taxa de Ocupação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {stats.totalImoveis > 0
                      ? Math.round((stats.inquilinosAtivos / stats.totalImoveis) * 100)
                      : 0}%
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">dos imóveis alugados</span>
                </div>
                <div className="mt-4 h-2 w-full bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalImoveis > 0 ? (stats.inquilinosAtivos / stats.totalImoveis) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Alerts Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Avisos e Pendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAlerts ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-16 w-full animate-pulse bg-accent rounded-lg" />
                    ))}
                  </div>
                ) : alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <Link key={alert.id} href={`/dashboard/inquilinos`}>
                        <div
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                            alert.type === 'overdue'
                              ? "bg-red-50 border-red-100 hover:bg-red-100/50"
                              : "bg-amber-50 border-amber-100 hover:bg-amber-100/50"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            alert.type === 'overdue' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {alert.type === 'overdue' ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className={cn(
                              "text-sm font-semibold truncate",
                              alert.type === 'overdue' ? "text-red-900" : "text-amber-900"
                            )}>
                              {alert.type === 'overdue' ? 'Aluguel Atrasado' : 'Vencendo em breve'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {alert.tenantName} • {alert.propertyName}
                            </p>
                            <p className={cn(
                              "text-[10px] font-medium mt-1 uppercase",
                              alert.type === 'overdue' ? "text-red-700" : "text-amber-700"
                            )}>
                              Vence dia {alert.dueDate} • {alert.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-green-700">Tudo em dia!</p>
                    <p className="text-xs text-muted-foreground px-4 mt-1">
                      Nenhuma pendência ou vencimento próximo no momento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="font-display text-lg">Seus imóveis</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Mostrando {recentProperties.length} de {totalProperties} imóveis
              </p>
            </div>
            {totalProperties > 3 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => loadProperties(currentPage - 1)}
                  disabled={currentPage === 1 || loadingProperties}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-4 text-center">{currentPage}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => loadProperties(currentPage + 1)}
                  disabled={currentPage * ITEMS_PER_PAGE >= totalProperties || loadingProperties}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loadingProperties ? (
              // Loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-accent" />
                        <div className="h-3 w-24 rounded bg-accent" />
                      </div>
                    </div>
                    <div className="h-6 w-20 rounded-full bg-accent" />
                  </div>
                ))}
              </div>
            ) : recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 sm:p-4 bg-card"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <Building2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm sm:text-base">
                          {property.endereco_rua}, {property.endereco_numero}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {property.inquilino_nome || "Sem inquilino"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 px-1">
                      {/* Desktop Badge */}
                      <span
                        className={cn(
                          "hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          property.status === "alugado"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        )}
                      >
                        {property.status === "alugado" ? "Ocupado" : "Disponível"}
                      </span>

                      {/* Mobile Popover Badge with Info Icon */}
                      <div className="sm:hidden">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="p-1 transition-transform active:scale-90"
                              aria-label={property.status === "alugado" ? "Ocupado" : "Disponível"}
                            >
                              <Info
                                className={cn(
                                  "h-4 w-4",
                                  property.status === "alugado"
                                    ? "text-red-500"
                                    : "text-green-500"
                                )}
                              />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent side="left" className="w-auto p-2 bg-popover shadow-lg border-border/50">
                            <p className={cn(
                              "text-[10px] font-bold uppercase tracking-wider",
                              property.status === "alugado" ? "text-red-700" : "text-green-700"
                            )}>
                              {property.status === "alugado" ? "Ocupado" : "Disponível"}
                            </p>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Estado vazio
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <Home className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-medium text-lg">Nenhum imóvel encontrado</h3>
                {stats.totalImoveis === 0 ? (
                  <>
                    <p className="mb-6 text-sm text-muted-foreground max-w-sm">
                      Comece cadastrando seu primeiro imóvel para gerenciar aluguéis e inquilinos.
                    </p>
                    <Link href="/dashboard/imoveis/novo">
                      <Button className="gap-2 bg-blue-600 hover:bg-blue-500">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Cadastrar primeiro imóvel
                      </Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Não há imóveis nesta página.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div >
    </>
  );
}