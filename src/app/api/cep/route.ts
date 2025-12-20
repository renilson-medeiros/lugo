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

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch from ViaCEP' },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (data.erro) {
            return NextResponse.json({ error: 'CEP not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching CEP:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
