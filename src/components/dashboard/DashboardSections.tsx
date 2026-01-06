import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { StatsSkeleton, RevenueSkeleton, AlertsSkeleton, PropertiesSkeleton } from "./DashboardSkeletons";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, AlertCircle, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CombinedDashboardClient from "./CombinedDashboardClient";

// --- Stats Section ---
export async function StatsSection({ userId }: { userId: string }) {
    const supabase = await createClient();
    const [imoveisRes, tenantsRes, receiptsRes] = await Promise.all([
        supabase.from('imoveis').select('*', { count: 'exact', head: true }).eq('proprietario_id', userId),
        supabase.from('inquilinos').select('id, imoveis!inner(proprietario_id)', { count: 'exact', head: true })
            .eq('status', 'ativo')
            .eq('imoveis.proprietario_id', userId),
        supabase.from('comprovantes').select('id, imoveis!inner(proprietario_id)', { count: 'exact', head: true })
            .eq('tipo', 'pagamento')
            .eq('imoveis.proprietario_id', userId)
    ]);

    const stats = {
        totalImoveis: imoveisRes.count || 0,
        inquilinosAtivos: tenantsRes.count || 0,
        comprovantesGerados: receiptsRes.count || 0,
    };

    const statsData = [
        { label: "Imóveis cadastrados", value: stats.totalImoveis.toString(), icon: Building2, href: "/dashboard/imoveis" },
        { label: "Inquilinos ativos", value: stats.inquilinosAtivos.toString(), icon: UsersSectionIcon, href: "/dashboard/inquilinos" },
        { label: "Comprovantes gerados", value: stats.comprovantesGerados.toString(), icon: ReceiptSectionIcon, href: "/dashboard/comprovantes" },
    ];

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {statsData.map((stat) => (
                <Link key={stat.label} href={stat.href}>
                    <Card className="group transition-all duration-300 hover:border-blue-600/30">
                        <CardContent className="flex items-center gap-4 p-4 sm:p-6">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-blue-500/10">
                                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
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
    );
}

// Icons for Stats (Local helpers to avoid importing the whole lucide-react in every sub-component)
import { Users, Receipt } from "lucide-react";
const UsersSectionIcon = Users;
const ReceiptSectionIcon = Receipt;

// --- Combined Revenue & Occupancy Section ---
export async function CombinedRevenueOccupancySection({ userId }: { userId: string }) {
    const [revenueData, occupancyData] = await Promise.all([
        fetchRevenueData(userId),
        fetchOccupancyData(userId)
    ]);

    return (
        <CombinedDashboardClient 
            revenueData={revenueData} 
            occupancyData={occupancyData} 
        />
    );
}

// --- Revenue Section (Original Chart) ---
export async function RevenueSection({ userId }: { userId: string }) {
    const revenueData = await fetchRevenueData(userId);

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    Receita Bruta Mensal
                    {revenueData.length > 0 && (
                        <span className="text-xs font-normal text-muted-foreground bg-accent px-2 py-1 rounded-md w-fit">
                            Últimos 6 meses
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
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
    );
}

// --- Revenue Trend Section (New Light Alternative) ---
import RevenueTrendCard from "./RevenueTrendCard";

export async function RevenueTrendSection({ userId }: { userId: string }) {
    const revenueData = await fetchRevenueData(userId);
    return <RevenueTrendCard data={revenueData} />;
}

// Helper to fetch and format revenue data
async function fetchRevenueData(userId: string) {
    const supabase = await createClient();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const dateStr = sixMonthsAgo.toISOString().split('T')[0];

    const { data } = await supabase
        .from('comprovantes')
        .select('valor, mes_referencia, imoveis!inner(proprietario_id)')
        .eq('tipo', 'pagamento')
        .eq('imoveis.proprietario_id', userId)
        .gte('mes_referencia', dateStr)
        .order('mes_referencia', { ascending: true });

    const months: Record<string, number> = {};
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;
        months[key] = 0;
    }

    data?.forEach((item: any) => {
        const date = new Date(item.mes_referencia);
        if (date >= sixMonthsAgo) {
            const key = `${monthNames[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
            if (months[key] !== undefined) months[key] += Number(item.valor);
        }
    });

    return Object.entries(months).map(([month, total]) => ({ month, total }));
}

async function fetchOccupancyData(userId: string) {
    const supabase = await createClient();
    const { data: imoveis } = await supabase
        .from('imoveis')
        .select('status')
        .eq('proprietario_id', userId);

    const total = imoveis?.length || 0;
    const stats = {
        total,
        alugado: imoveis?.filter(i => i.status === 'alugado').length || 0,
        disponivel: imoveis?.filter(i => i.status === 'disponivel').length || 0,
        manutencao: imoveis?.filter(i => i.status === 'manutencao').length || 0,
        rate: total > 0 ? Math.round((imoveis?.filter(i => i.status === 'alugado').length || 0) / total * 100) : 0
    };

    return stats;
}

// --- Occupancy Rate Section ---
import { ChartPie } from "lucide-react";

export async function OccupancyRateSection({ userId }: { userId: string }) {
    const supabase = await createClient();
    const [imoveisRes, tenantsRes] = await Promise.all([
        supabase.from('imoveis').select('*', { count: 'exact', head: true }).eq('proprietario_id', userId),
        supabase.from('inquilinos').select('id, imoveis!inner(proprietario_id)', { count: 'exact', head: true })
            .eq('status', 'ativo')
            .eq('imoveis.proprietario_id', userId)
    ]);

    const totalImoveis = imoveisRes.count || 0;
    const inquilinosAtivos = tenantsRes.count || 0;
    const occupancyRate = totalImoveis > 0 ? Math.round((inquilinosAtivos / totalImoveis) * 100) : 0;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <ChartPie className="h-4 w-4 text-blue-600" />
                    Taxa de Ocupação
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{occupancyRate}%</span>
                    <span className="text-sm text-muted-foreground mb-1">dos imóveis alugados</span>
                </div>
                <div className="mt-4 h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${occupancyRate}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

// --- Alerts Section ---
import AlertsCarousel from "./AlertsCarousel";
import { Button } from "../ui/button";

export async function AlertsSection({ userId }: { userId: string }) {
    const supabase = await createClient();
    const now = new Date();
    const today = now.getDate();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [tenantsRes, receiptsRes] = await Promise.all([
        supabase
            .from('inquilinos')
            .select('id, nome_completo, dia_vencimento, valor_aluguel, imoveis!inner (endereco_rua, endereco_numero, titulo, proprietario_id)')
            .eq('status', 'ativo')
            .eq('imoveis.proprietario_id', userId),
        supabase
            .from('comprovantes')
            .select('inquilino_id, imoveis!inner(proprietario_id)')
            .eq('tipo', 'pagamento')
            .eq('imoveis.proprietario_id', userId)
            .gte('mes_referencia', currentMonthStart)
    ]);

    const receivedInquilinoIds = new Set(receiptsRes.data?.map((r: any) => r.inquilino_id) || []);
    const alerts: any[] = [];

    tenantsRes.data?.forEach((tenant: any) => {
        if (receivedInquilinoIds.has(tenant.id)) return;
        const dueDay = tenant.dia_vencimento;
        const property = Array.isArray(tenant.imoveis) ? tenant.imoveis[0] : tenant.imoveis;
        const propertyName = property?.titulo || (property ? `${property.endereco_rua}, ${property.endereco_numero}` : 'Imóvel');

        if (dueDay < today) {
            alerts.push({ id: `overdue-${tenant.id}`, tenantName: tenant.nome_completo, propertyName, dueDate: dueDay, type: 'overdue', amount: tenant.valor_aluguel });
        } else if (dueDay <= today + 5) {
            alerts.push({ id: `upcoming-${tenant.id}`, tenantName: tenant.nome_completo, propertyName, dueDate: dueDay, type: 'upcoming', amount: tenant.valor_aluguel });
        }
    });

    return <AlertsCarousel alerts={alerts} />;
}

// --- Properties Preview Section ---
export async function PropertiesPreviewSection({ userId }: { userId: string }) {
    const supabase = await createClient();
    const { data: imoveisRecentes } = await supabase
        .from('imoveis')
        .select('id, endereco_rua, endereco_numero, status, created_at, inquilinos(nome_completo)')
        .eq('proprietario_id', userId)
        .order('created_at', { ascending: false })
        .range(0, 2);

    const formattedProperties = imoveisRecentes?.map((imovel: any) => ({
        id: imovel.id,
        endereco_rua: imovel.endereco_rua,
        endereco_numero: imovel.endereco_numero,
        status: imovel.status,
        inquilino_nome: imovel.inquilinos?.[0]?.nome_completo || null,
    })) || [];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg">Seus imóveis recentes</CardTitle>
            </CardHeader>
            <CardContent>
                {formattedProperties.length > 0 ? (
                    <div className="space-y-4">
                        {formattedProperties.map((property) => (
                            <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-sm">{property.endereco_rua}, {property.endereco_numero}</p>
                                        <p className="text-xs text-muted-foreground">{property.inquilino_nome || "Sem inquilino"}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                                    property.status === "alugado" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                                )}>
                                    {property.status === "alugado" ? "Ocupado" : "Livre"}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent mb-4">
                            <Building2 className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium">Nenhum imóvel cadastrado</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Cadastre seu primeiro imóvel para começar.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
