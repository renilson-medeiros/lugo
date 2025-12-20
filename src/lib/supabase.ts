// src\lib\supabase.ts
// Este arquivo mantém os tipos e funções auxiliares
// Os clientes Supabase agora estão em:
// - ./supabase/client.ts (para uso no browser)
// - ./supabase/server.ts (para uso no servidor)
// - ./supabase/middleware.ts (para uso no middleware)

import { createClient } from './supabase/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase! Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env');
}

// Cliente para uso no browser (Client Components)
export const supabase = createClient();


// TIPOS DO BANCO DE DADOS
export interface Profile {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string | null;
  email: string;
  role: 'proprietario' | 'admin';
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled';
  expires_at: string | null;
  subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Imovel {
  id: string;
  proprietario_id: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_complemento: string | null;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_cep: string;
  tipo: 'casa' | 'apartamento' | 'comercial' | 'terreno';
  quartos: number | null;
  banheiros: number | null;
  area_m2: number | null;
  valor_aluguel: number;
  valor_condominio: number | null;
  valor_iptu: number | null;
  descricao: string | null;
  fotos: string[] | null;
  status: 'disponivel' | 'alugado' | 'manutencao';
  created_at: string;
  updated_at: string;
}

export interface Inquilino {
  id: string;
  imovel_id: string;
  nome_completo: string;
  cpf: string;
  rg: string | null;
  telefone: string;
  email: string | null;
  data_nascimento: string | null;
  profissao: string | null;
  data_inicio: string;
  data_fim: string | null;
  valor_aluguel: number;
  dia_vencimento: number;
  observacoes: string | null;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface Comprovante {
  id: string;
  inquilino_id: string;
  imovel_id: string;
  tipo: 'pagamento' | 'residencia';
  mes_referencia: string;
  valor: number | null;
  descricao: string | null;
  pdf_url: string | null;
  created_at: string;
}

/* Verifica se o usuário está autenticado */
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/* Obtém o usuário atual */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/* Obtém o perfil do usuário atual */
export const getCurrentProfile = async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }

  return data;
};

/* Verifica se o usuário é admin */
export const isAdmin = async (): Promise<boolean> => {
  const profile = await getCurrentProfile();
  return profile?.role === 'admin';
};

/* Faz logout do usuário */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};