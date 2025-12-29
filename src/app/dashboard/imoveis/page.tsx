import { createClient } from "@/lib/supabase/server";
import PropertiesList from "@/modules/dashboard/PropertiesList";
import { redirect } from "next/navigation";

export default async function PropertiesListPage() {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // Carregar dados iniciais no servidor
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

    if (error) {
        console.error('Erro ao carregar imóveis no servidor:', error);
    }

    // Formatar dados exatamente como o componente espera
    const formattedProperties = (data || []).map((imovel: any) => {
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

    return <PropertiesList initialData={formattedProperties} initialLoading={false} />;
}
