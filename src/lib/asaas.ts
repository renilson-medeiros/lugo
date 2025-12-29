const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function asaasRequest(endpoint: string, options: RequestInit = {}) {
    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY não configurada');
    }

    const url = `${ASAAS_API_URL}${endpoint}`;

    // Log apenas em desenvolvimento para evitar vazar chaves em logs de prod se não houver cuidado
    // Mas aqui vamos logar o endpoint para depurar
    console.log(`[Asaas] Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(`[Asaas] Erro no endpoint ${endpoint}:`, data);
        throw new Error(data.errors?.[0]?.description || 'Erro na requisição ao Asaas');
    }

    return data;
}

export async function getOrCreateCustomer(customerData: {
    name: string,
    cpfCnpj: string,
    email?: string,
    mobilePhone?: string
}) {
    // Tenta buscar cliente pelo CPF/CNPJ primeiro para evitar duplicidade
    const customers = await asaasRequest(`/customers?cpfCnpj=${customerData.cpfCnpj}`);

    if (customers.data && customers.data.length > 0) {
        return customers.data[0];
    }

    // Se não existir, cria
    return await asaasRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
    });
}

export async function createPixPayment(paymentData: {
    customer: string,
    billingType: 'PIX',
    value: number,
    dueDate: string,
    description: string,
    externalReference?: string
}) {
    // 1. Cria a transação de pagamento
    const payment = await asaasRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    });

    // 2. Busca o QR Code e o código "Copia e Cola" do PIX
    // Adicionado try-catch para não quebrar todo o fluxo se apenas o QR Code falhar
    try {
        const qrCodeData = await asaasRequest(`/payments/${payment.id}/pixQrCode`);
        return {
            ...payment,
            pixCode: qrCodeData.payload,
            qrCode: qrCodeData.encodedImage,
        };
    } catch (qrError: any) {
        console.error(`[Asaas] Falha ao gerar QR Code para pagamento ${payment.id}:`, qrError.message);

        // Em caso de erro no QR Code, retornamos o pagamento básico.
        // O frontend deve lidar com pixCode/qrCode nulos mostrando o link da fatura (invoiceUrl)
        return {
            ...payment,
            pixCode: null,
            qrCode: null,
            qrCodeError: true,
            errorMessage: qrError.message
        };
    }
}
