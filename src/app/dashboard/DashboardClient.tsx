"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Receipt, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import StatsCards from "@/components/dashboard/StatsCards";
import DashboardDicaCard from "@/components/dashboard/DashboardDicaCard";
import OccupancyRateCard from "@/components/dashboard/OccupancyRateCard";
import AlertsCarousel from "@/components/dashboard/AlertsCarousel";
import PropertiesPreviewClient from "@/components/dashboard/PropertiesPreviewClient";

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
                        <Button size="lg" className="gap-2 w-full md:w-fit bg-amber-600 hover:bg-amber-500">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Assinar para adicionar mais
                        </Button>
                    </Link>
                ) : (
                    <Link href="/dashboard/imoveis/novo">
                        <Button size="lg" className="gap-2 w-full md:w-fit bg-tertiary hover:bg-tertiary/90">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Novo imóvel
                        </Button>
                    </Link>
                )}
            </div>

            <StatsCards stats={stats} />

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
                    <DashboardDicaCard />
                    
                    <OccupancyRateCard 
                        rate={stats.totalImoveis > 0 ? Math.round((stats.inquilinosAtivos / stats.totalImoveis) * 100) : 0} 
                    />

                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border/50">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-tertiary" />
                                Avisos e Pendências
                            </h3>
                        </div>
                        <div className="p-4">
                            <AlertsCarousel alerts={alerts.map(a => ({
                                id: a.id,
                                tenantName: a.tenantName,
                                propertyName: a.propertyName,
                                dueDate: a.dueDate,
                                type: a.type,
                                amount: a.amount
                            }))} />
                        </div>
                    </div>
                </div>
            </div>

            <PropertiesPreviewClient 
                properties={recentProperties.map(p => ({
                    id: p.id,
                    endereco_rua: p.endereco_rua,
                    endereco_numero: p.endereco_numero,
                    status: p.status,
                    inquilino_nome: p.inquilino_nome || null
                }))} 
            />
        </div>
    );
}
