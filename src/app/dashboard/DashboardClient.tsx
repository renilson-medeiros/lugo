"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Info, Users, Receipt, Plus, TrendingUp, Home, ChevronLeft, ChevronRight as ChevronRightIcon, AlertCircle, Clock, ChartPie } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";

const RevenueChart = dynamic(() => import("@/components/dashboard/RevenueChart"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-accent/20 animate-pulse rounded-lg mt-4" />
});

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

interface DashboardClientProps {
    initialStats: DashboardStats;
    initialProperties: RecentProperty[];
    initialRevenue: RevenueData[];
    initialAlerts: DashboardAlert[];
    totalPropertiesCount: number;
}

export default function DashboardClient({
    initialStats,
    initialProperties,
    initialRevenue,
    initialAlerts,
    totalPropertiesCount
}: DashboardClientProps) {
    const { profile, loading: authLoading } = useAuth();

    const [stats] = useState<DashboardStats>(initialStats);
    const [recentProperties, setRecentProperties] = useState<RecentProperty[]>(initialProperties);
    const [revenueData] = useState<RevenueData[]>(initialRevenue);
    const [alerts] = useState<DashboardAlert[]>(initialAlerts);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProperties] = useState(totalPropertiesCount);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const ITEMS_PER_PAGE = 3;

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
        }
    };

    const statsData = useMemo(() => [
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
    ], [stats]);

    const firstName = profile?.nome_completo?.split(' ')[0] || 'Usuário';

    const isExpired = !!(
        profile?.subscription_status === 'trial' &&
        profile?.expires_at &&
        new Date(profile.expires_at) < new Date()
    );

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        Olá, {firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Bem-vindo de volta ao seu painel de controle.
                    </p>
                </div>
                {isExpired ? (
                    <Link href="/dashboard/configuracoes">
                        <Button className="gap-2 bg-amber-600 hover:bg-amber-500">
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

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {statsData.map((stat, index) => (
                    <Link key={stat.label} href={stat.href}>
                        <Card
                            className="group transition-all duration-300 hover:border-blue-600/30"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardContent className="flex items-center gap-4 p-4 sm:p-6">
                                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-primary/10">
                                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="font-display text-xl sm:text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-display text-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            Receita Bruta Mensal
                            {revenueData.length > 0 && (
                                <span className="text-xs font-normal text-muted-foreground bg-accent px-2 py-1 rounded-md w-fit">
                                    Últimos 6 meses
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {revenueData.length > 0 ? (
                            <RevenueChart data={revenueData} />
                        ) : (
                            <div className="flex h-[300px] flex-col items-center justify-center text-center mt-4">
                                <TrendingUp className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-sm text-muted-foreground">Sem dados de pagamento para exibir.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <ChartPie className="h-4 w-4 text-blue-600" />
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

                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                Avisos e Pendências
                            </CardTitle>
                            {alerts.length > 1 && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={scrollPrev}
                                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                        aria-label="Aviso anterior"
                                    >
                                        <ChevronLeft className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={scrollNext}
                                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                        aria-label="Próximo aviso"
                                    >
                                        <ChevronRightIcon className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {alerts.length > 0 ? (
                                <div className="overflow-hidden" ref={emblaRef}>
                                    <div className="flex">
                                        {alerts.map((alert) => (
                                            <div key={alert.id} className="flex-[0_0_100%] min-w-0 px-1">
                                                <Link href={`/dashboard/inquilinos`}>
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
                                            </div>
                                        ))}
                                    </div>
                                    {alerts.length > 1 && (
                                        <div className="flex justify-center gap-1.5 mt-3">
                                            {alerts.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        "h-1 rounded-full transition-all duration-300",
                                                        index === (emblaApi?.selectedScrollSnap() || 0)
                                                            ? "w-4 bg-blue-600"
                                                            : "w-1 bg-gray-300"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    )}
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
        </div>
    );
}
