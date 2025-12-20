import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PropertyDetail from "@/modules/PropertyDetail";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: imovel } = await supabase
        .from('imoveis')
        .select(`
      *,
      profiles(nome_completo)
    `)
        .eq('id', id)
        .single();

    if (!imovel) {
        return {
            title: {
                absolute: 'Lugo | Imóvel não encontrado'
            },
            description: 'O imóvel solicitado não foi encontrado.',
        };
    }

    const title = imovel.titulo || `${imovel.endereco_rua}, ${imovel.endereco_numero} - ${imovel.endereco_bairro}`;
    const price = imovel.valor_aluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const description = `🏠 ${imovel.tipo === 'apartamento' ? 'Apartamento' : 'Casa'} incrível em ${imovel.endereco_cidade}. Com ${imovel.quartos || 'vários'} quartos, por apenas ${price}/mês. Confira fotos e agende uma visita no Lugo!`;

    const firstImage = imovel.fotos?.[0] || 'https://aluguefacil.vercel.app/og-image.png';
    const baseUrl = 'https://aluguefacil.vercel.app';
    const canonicalUrl = `${baseUrl}/imovel/${id}`;

    return {
        title: {
            absolute: `${title} | Lugo`
        },
        description,
        keywords: [
            imovel.tipo,
            `aluguel em ${imovel.endereco_cidade}`,
            `imóvel em ${imovel.endereco_bairro}`,
            imovel.endereco_cidade,
            'lugo',
            'aluguel direto com proprietário'
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${title} | Lugo`,
            description,
            url: canonicalUrl,
            siteName: 'Lugo',
            locale: 'pt_BR',
            type: 'website',
            images: [
                {
                    url: firstImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Lugo`,
            description,
            images: [firstImage],
            creator: '@aluguefacil',
        },
    };
}

export default function PropertyDetailPage() {
    return <PropertyDetail />;
}
