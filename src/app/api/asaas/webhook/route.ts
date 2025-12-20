import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const event = body.event;
        const payment = body.payment;

        console.log(`Webhook Asaas recebido: ${event}`, payment);

        // Verificamos se o pagamento foi confirmado
        if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
            const userId = payment.externalReference;

            if (!userId) {
                console.error('Webhook sem externalReference (userId)');
                return NextResponse.json({ error: 'Missing externalReference' }, { status: 400 });
            }

            console.log(`Processando ativação para usuário: ${userId}`);
            const supabaseAdmin = createAdminClient();

            // Ativa a assinatura por 30 dias
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            const { data, error, count } = await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_status: 'active',
                    expires_at: expiresAt.toISOString(),
                    subscription_id: payment.id
                })
                .eq('id', userId)
                .select(); // Adicionado select para debug

            if (error) {
                console.error('Erro detalhado Supabase Webhook:', error);
                throw error;
            }

            console.log(`Resultado do update: ${data?.length} linha(s) afetada(s)`);

            if (!data || data.length === 0) {
                console.warn(`AVISO: Nenhum perfil encontrado com o ID ${userId}`);
            } else {
                console.log(`Assinatura ativada com SUCESSO para o usuário ${userId}`);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Erro no Webhook Asaas:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
