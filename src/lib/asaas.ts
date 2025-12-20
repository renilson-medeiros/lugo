const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function asaasRequest(endpoint: string, options: RequestInit = {}) {
    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY não configurada');
    }

    const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Erro Asaas:', data);
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
    const payment = await asaasRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    });

    // Busca o QR Code e o código "Copia e Cola" do PIX
    const qrCodeData = await asaasRequest(`/payments/${payment.id}/pixQrCode`);

    return {
        ...payment,
        pixCode: qrCodeData.payload,
        qrCode: qrCodeData.encodedImage,
    };
}
