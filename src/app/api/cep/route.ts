import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cep = searchParams.get('cep');

    if (!cep) {
        return NextResponse.json({ error: 'CEP is required' }, { status: 400 });
    }

    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
        return NextResponse.json({ error: 'Invalid CEP format' }, { status: 400 });
    }

    // Função para buscar no ViaCEP
    const fetchViaCep = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
                signal: controller.signal,
                headers: { 'User-Agent': 'AlugueFacil/1.0' }
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`ViaCEP error: ${response.status}`);

            const data = await response.json();
            if (data.erro) throw new Error('CEP not found in ViaCEP');

            return {
                logradouro: data.logradouro,
                bairro: data.bairro,
                localidade: data.localidade,
                uf: data.uf,
            };
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };

    // Função para buscar no BrasilAPI
    const fetchBrasilApi = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`, {
                signal: controller.signal,
                headers: { 'User-Agent': 'AlugueFacil/1.0' }
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`BrasilAPI error: ${response.status}`);

            const data = await response.json();

            return {
                logradouro: data.street,
                bairro: data.neighborhood,
                localidade: data.city,
                uf: data.state,
            };
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };

    try {
        // Tenta ViaCEP primeiro
        try {
            const data = await fetchViaCep();
            return NextResponse.json(data);
        } catch (viaCepError) {
            console.warn('ViaCEP failed, trying BrasilAPI...', viaCepError);

            // Fallback para BrasilAPI
            const data = await fetchBrasilApi();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('All CEP services failed:', error);
        return NextResponse.json({ error: 'CEP not found or service unavailable' }, { status: 404 });
    }
}
