async function testAsaas() {
    const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
    const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

    console.log('--- TESTE ASAAS ---');
    console.log('ASAAS_API_KEY presente:', !!ASAAS_API_KEY);

    if (!ASAAS_API_KEY) {
        console.log('CHAVE NÃO ENCONTRADA. Certifique-se de que o .env está carregado.');
        return;
    }

    try {
        const res = await fetch(`${ASAAS_API_URL}/customers?limit=1`, {
            headers: { 'access_token': ASAAS_API_KEY }
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Resposta:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Falha na requisição:', err.message);
    }
}

testAsaas();
