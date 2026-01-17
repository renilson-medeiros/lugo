import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CatalogClient from './CatalogClient';

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome_completo')
    .eq('id', userId)
    .single();

  if (!profile) {
    return {
      title: 'Catálogo não encontrado | Lugo',
      description: 'O catálogo de imóveis solicitado não foi encontrado.',
    };
  }

  // Buscar quantidade de imóveis disponíveis
  const { count } = await supabase
    .from('imoveis')
    .select('*', { count: 'exact', head: true })
    .eq('proprietario_id', userId)
    .eq('status', 'disponivel');

  const propertyCount = count || 0;
  const title = `Imóveis de ${profile.nome_completo} | Lugo`;
  const description = `Confira ${propertyCount} ${propertyCount === 1 ? 'imóvel disponível' : 'imóveis disponíveis'} de ${profile.nome_completo} no Lugo. Aluguel direto com o proprietário.`;
  const ogImageUrl = `/api/og?name=${encodeURIComponent(profile.nome_completo)}&count=${propertyCount}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      url: `https://lugogestaodeimoveis.com.br/catalogo/${userId}`,
      siteName: 'Lugo',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Catálogo de imóveis de ${profile.nome_completo}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CatalogPage({ params }: Props) {
  const { userId } = await params;
  const supabase = await createClient();

  // Buscar perfil do proprietário
  const { data: profile } = await supabase
    .from('profiles')
    .select('nome_completo, telefone')
    .eq('id', userId)
    .single();

  if (!profile) {
    notFound();
  }

  // Buscar imóveis disponíveis
  const { data: properties, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('proprietario_id', userId)
    .eq('status', 'disponivel')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar catálogo:', error);
  }

  return (
    <CatalogClient 
      ownerName={profile.nome_completo} 
      ownerPhone={profile.telefone || ''}
      initialProperties={properties || []} 
    />
  );
}
