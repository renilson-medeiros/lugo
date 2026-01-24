import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';


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

    const firstImage = imovel.fotos?.[0] || 'https://lugogestaodeimoveis.com.br/og-image.png';
    const baseUrl = 'https://lugogestaodeimoveis.com.br';
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
            creator: '@lugo',
        },
    };
}

import { notFound } from 'next/navigation';
import PropertyDetailClient from "./PropertyDetailClient";

async function getPropertyData(id: string) {
    const supabase = await createClient();

    const { data: imovel } = await supabase
        .from('imoveis')
        .select(`
      *,
      profiles(nome_completo, telefone)
    `)
        .eq('id', id)
        .single();

    if (!imovel) return null;

    // Transform data to match client component interface
    return {
        id: imovel.id,
        title: imovel.titulo || `${imovel.endereco_rua}, ${imovel.endereco_numero}`,
        status: imovel.status || 'disponivel',
        images: imovel.fotos && imovel.fotos.length > 0
            ? imovel.fotos
            : ["/preview.png"],
        address: {
            street: imovel.endereco_rua,
            number: imovel.endereco_numero,
            complement: imovel.endereco_complemento,
            neighborhood: imovel.endereco_bairro,
            city: imovel.endereco_cidade,
            state: imovel.endereco_estado,
            zipCode: imovel.endereco_cep || '',
        },
        details: {
            bedrooms: imovel.quartos,
            bathrooms: imovel.banheiros,
            area: imovel.area_m2,
            garage: imovel.tem_garagem || false,
            garageSpots: imovel.tem_garagem ? 1 : 0,
            acceptsPets: imovel.aceita_pets || false,
            maxPeople: imovel.max_pessoas,
            acceptsChildren: imovel.aceita_criancas !== false,
        },
        rooms: imovel.comodos || [],
        pricing: {
            rent: imovel.valor_aluguel || 0,
            condominium: imovel.valor_condominio || 0,
            iptu: imovel.valor_iptu || 0,
            serviceFee: imovel.valor_taxa_servico || 0,
        },
        included: {
            water: imovel.inclui_agua || false,
            electricity: imovel.inclui_luz || false,
            internet: imovel.inclui_internet || false,
            gas: imovel.inclui_gas || false,
        },
        observations: imovel.descricao,
        owner: {
            id: imovel.proprietario_id,
            name: imovel.profiles?.nome_completo || 'Proprietário',
            whatsapp: imovel.profiles?.telefone?.replace(/\D/g, '') || '',
        },
    };
}

export default async function PropertyDetailPage({ params }: Props) {
    const { id } = await params;
    const initialData = await getPropertyData(id);

    if (!initialData) {
        return notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": initialData.title,
        "description": initialData.observations,
        "url": `https://lugogestaodeimoveis.com.br/imovel/${id}`,
        "image": initialData.images[0],
        "datePosted": new Date().toISOString(),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": `${initialData.address.street}, ${initialData.address.number}`,
            "addressLocality": initialData.address.neighborhood,
            "addressRegion": initialData.address.city,
            "addressCountry": "BR"
        },
        "offers": {
            "@type": "Offer",
            "price": initialData.pricing.rent,
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock"
        },
        "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Bedrooms", "value": initialData.details.bedrooms },
            { "@type": "LocationFeatureSpecification", "name": "Bathrooms", "value": initialData.details.bathrooms },
            { "@type": "LocationFeatureSpecification", "name": "Garage", "value": initialData.details.garage }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PropertyDetailClient initialData={initialData} />
        </>
    );
}
