import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // Carregar dados iniciais em paralelo no servidor
    const [statsRes, revenueRes, alertsRes, propertiesRes] = await Promise.all([
        fetchDashboardStats(supabase),
        fetchRevenueData(supabase),
        fetchAlerts(supabase),
        fetchInitialProperties(supabase)
    ]);

    return (
        <DashboardClient
            initialStats={statsRes.stats}
            initialProperties={propertiesRes.properties}
            totalPropertiesCount={statsRes.totalProperties}
            initialRevenue={revenueRes}
            initialAlerts={alertsRes}
        />
    );
}

// Funções auxiliares de busca de dados no servidor

async function fetchDashboardStats(supabase: any) {
    try {
        const [imoveisRes, tenantsRes, receiptsRes] = await Promise.all([
            supabase.from('imoveis').select('*', { count: 'exact', head: true }),
            supabase.from('inquilinos').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
            supabase.from('comprovantes').select('*', { count: 'exact', head: true }).eq('tipo', 'pagamento')
        ]);

        return {
            stats: {
                totalImoveis: imoveisRes.count || 0,
                inquilinosAtivos: tenantsRes.count || 0,
                comprovantesGerados: receiptsRes.count || 0,
            },
            totalProperties: imoveisRes.count || 0
        };
    } catch (error) {
        console.error('Erro ao carregar estatísticas no servidor:', error);
        return {
            stats: { totalImoveis: 0, inquilinosAtivos: 0, comprovantesGerados: 0 },
            totalProperties: 0
        };
    }
}

async function fetchRevenueData(supabase: any) {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const dateStr = sixMonthsAgo.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('comprovantes')
            .select('valor, mes_referencia')
            .eq('tipo', 'pagamento')
            .gte('mes_referencia', dateStr)
            .order('mes_referencia', { ascending: true });

        if (error) throw error;

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
                if (months[key] !== undefined) {
                    months[key] += Number(item.valor);
                }
            }
        });

        return Object.entries(months).map(([month, total]) => ({
            month,
            total
        }));
    } catch (error) {
        console.error('Erro ao carregar dados de receita no servidor:', error);
        return [];
    }
}

async function fetchAlerts(supabase: any) {
    try {
        const now = new Date();
        const today = now.getDate();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const [tenantsRes, receiptsRes] = await Promise.all([
            supabase
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
                .eq('status', 'ativo'),
            supabase
                .from('comprovantes')
                .select('inquilino_id')
                .eq('tipo', 'pagamento')
                .gte('mes_referencia', currentMonthStart)
        ]);

        if (tenantsRes.error) throw tenantsRes.error;
        if (receiptsRes.error) throw receiptsRes.error;

        const activeTenants = tenantsRes.data;
        const currentMonthReceipts = receiptsRes.data;
        const receivedInquilinoIds = new Set(currentMonthReceipts?.map((r: any) => r.inquilino_id));

        const dashboardAlerts: any[] = [];

        activeTenants?.forEach((tenant: any) => {
            if (receivedInquilinoIds.has(tenant.id)) return;

            const dueDay = tenant.dia_vencimento;
            const property = Array.isArray(tenant.imoveis) ? tenant.imoveis[0] : tenant.imoveis;
            const propertyName = property ? `${property.endereco_rua}, ${property.endereco_numero}` : 'Imóvel';

            if (dueDay < today) {
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

        dashboardAlerts.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'overdue' ? -1 : 1;
            return a.dueDate - b.dueDate;
        });

        return dashboardAlerts;
    } catch (error) {
        console.error('Erro ao carregar alertas no servidor:', error);
        return [];
    }
}

async function fetchInitialProperties(supabase: any) {
    try {
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
            .range(0, 2); // ITEMS_PER_PAGE = 3

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

        return { properties: formattedProperties };
    } catch (error) {
        console.error('Erro ao carregar imóveis no servidor:', error);
        return { properties: [] };
    }
}
