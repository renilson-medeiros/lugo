import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ExplorarClient from './ExplorarClient';

export const metadata: Metadata = {
  title: 'Aluguel de Imóveis | Encontre seu novo lar no Lugo',
  description: 'Explore apartamentos, casas e kitnets disponíveis para aluguel direto com o proprietário. Filtre por localização, preço e tipo de imóvel em nossa plataforma prática.',
  keywords: ['aluguel de imóveis', 'apartamento para alugar', 'casa para alugar', 'aluguel direto com proprietário', 'lugo imóveis'],
  openGraph: {
    title: 'Aluguel de Imóveis | Encontre seu novo lar no Lugo',
    description: 'Explore as melhores opções de locação direta com o proprietário no Lugo.',
    type: 'website',
    url: 'https://lugogestaodeimoveis.com.br/explorar',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lugo - Explorar Imóveis',
      },
    ],
  },
};

export default async function ExplorarPage() {
  const supabase = await createClient();

  // Buscar todos os imóveis disponíveis
  const { data: properties, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('status', 'disponivel')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar explorar:', error);
  }

  // Obter tipos únicos para o filtro (opcional, pode ser fixo)
  const types = Array.from(new Set((properties || []).map(p => p.tipo))).filter(Boolean);
  
  // Obter cidades/estados únicos para o filtro
  const locations = Array.from(new Set((properties || []).map(p => 
    p.endereco_cidade && p.endereco_estado ? `${p.endereco_cidade}, ${p.endereco_estado}` : null
  ))).filter(Boolean);

  return (
    <ExplorarClient 
      initialProperties={properties || []}
      availableTypes={types as string[]}
      availableLocations={locations as string[]}
    />
  );
}
