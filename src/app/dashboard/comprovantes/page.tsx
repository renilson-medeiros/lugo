import { createClient } from "@/lib/supabase/server";
import ReceiptsList from "@/modules/dashboard/ReceiptsList";
import { redirect } from "next/navigation";

export default async function ReceiptsListPage() {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // Carregar dados iniciais no servidor
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
        .eq('imoveis.proprietario_id', session.user.id)
        .order('mes_referencia', { ascending: false })
        .limit(50);

    if (fetchError) {
        console.error('Erro ao carregar comprovantes no servidor:', fetchError);
    }

    // Transformar dados para corresponder à interface
    const transformedData = (data || []).map((item: any) => ({
        ...item,
        inquilinos: Array.isArray(item.inquilinos)
            ? (item.inquilinos.length > 0 ? item.inquilinos[0] : null)
            : (item.inquilinos || null),
        imoveis: Array.isArray(item.imoveis)
            ? (item.imoveis.length > 0 ? item.imoveis[0] : null)
            : (item.imoveis || null)
    }));

    return <ReceiptsList initialData={transformedData} initialLoading={false} />;
}
