import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateCustomer, createPixPayment } from '@/lib/asaas';

export async function POST() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        // 1. Busca perfil do usuário
        console.log('[CreatePayment] Buscando perfil para user:', user.id);
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error('[CreatePayment] Erro ao buscar perfil:', profileError);
            return NextResponse.json({ error: 'Perfil de usuário não encontrado no banco de dados.' }, { status: 404 });
        }

        if (!profile.cpf) {
            return NextResponse.json({ error: 'CPF não cadastrado. Vá em Configurações e preencha seu CPF.' }, { status: 400 });
        }

        // 2. Busca ou cria cliente no Asaas
        console.log('[CreatePayment] Buscando/Criando cliente Asaas para:', profile.email);
        let customer;
        try {
            customer = await getOrCreateCustomer({
                name: profile.nome_completo,
                cpfCnpj: profile.cpf,
                email: profile.email,
                mobilePhone: profile.telefone || undefined
            });
        } catch (asaasError: any) {
            console.error('[CreatePayment] Erro no Asaas (Customer):', asaasError);
            return NextResponse.json({ error: `Erro na API do Asaas (Cliente): ${asaasError.message}` }, { status: 502 });
        }

        // 3. Cria pagamento PIX (R$ 9,90)
        console.log('[CreatePayment] Criando cobrança PIX para customer:', customer.id);
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);

        let payment;
        try {
            payment = await createPixPayment({
                customer: customer.id,
                billingType: 'PIX',
                value: 9.90,
                dueDate: dueDate.toISOString().split('T')[0],
                description: 'Assinatura Lugo Profissional',
                externalReference: user.id
            });
        } catch (paymentError: any) {
            console.error('[CreatePayment] Erro no Asaas (Payment):', paymentError);
            return NextResponse.json({ error: `Erro na API do Asaas (Pagamento): ${paymentError.message}` }, { status: 502 });
        }

        console.log('[CreatePayment] Sucesso! PaymentId:', payment.id);
        return NextResponse.json({
            paymentId: payment.id,
            pixCode: payment.pixCode,
            qrCode: payment.qrCode,
            invoiceUrl: payment.invoiceUrl,
            qrCodeError: payment.qrCodeError,
            errorMessage: payment.errorMessage
        });

    } catch (error: any) {
        console.error('[CreatePayment] Erro inesperado:', error);
        return NextResponse.json(
            { error: 'Ocorreu um erro inesperado ao processar seu pagamento.' },
            { status: 500 }
        );
    }
}
