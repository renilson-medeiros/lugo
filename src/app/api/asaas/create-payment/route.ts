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
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) throw new Error('Perfil não encontrado');

        if (!profile.cpf) {
            throw new Error('CPF não encontrado no seu perfil. Por favor, atualize seus dados nas configurações.');
        }

        // 2. Busca ou cria cliente no Asaas
        const customer = await getOrCreateCustomer({
            name: profile.nome_completo,
            cpfCnpj: profile.cpf,
            email: profile.email,
            mobilePhone: profile.telefone || undefined
        });

        // 3. Cria pagamento PIX (R$ 29,90)
        // Vencimento em 3 dias para dar tempo do usuário pagar
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);

        const payment = await createPixPayment({
            customer: customer.id,
            billingType: 'PIX',
            value: 29.90,
            dueDate: dueDate.toISOString().split('T')[0],
            description: 'Assinatura Lugo Profissional',
            externalReference: user.id // Importante para o Webhook identificar o usuário
        });

        return NextResponse.json({
            paymentId: payment.id,
            pixCode: payment.pixCode,
            qrCode: payment.qrCode,
            invoiceUrl: payment.invoiceUrl,
            qrCodeError: payment.qrCodeError,
            errorMessage: payment.errorMessage
        });

    } catch (error: any) {
        console.error('Erro ao criar pagamento Asaas:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao processar pagamento' },
            { status: 500 }
        );
    }
}
