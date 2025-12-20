const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
// Tenta carregar do .env manualmente se necessário
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

async function testAsaas() {
    console.log('Testando conexão com Asaas Sandbox...');
    console.log('API KEY presente:', !!ASAAS_API_KEY);

    if (!ASAAS_API_KEY) {
        console.error('ERRO: ASAAS_API_KEY não encontrada no .env');
        return;
    }

    try {
        const response = await fetch(`${ASAAS_API_URL}/customers`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            console.log('SUCESSO: Conectado ao Asaas!');
            console.log('Clientes encontrados:', data.totalCount);
        } else {
            console.error('ERRO na API do Asaas:', data);
        }
    } catch (error) {
        console.error('ERRO na requisição:', error.message);
    }
}

testAsaas();
