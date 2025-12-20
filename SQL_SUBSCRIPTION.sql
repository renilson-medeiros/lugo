-- =====================================================
-- MIGRATION: ADICIONAR CAMPOS DE ASSINATURA E TRIAL
-- Execute este script no SQL Editor do seu Supabase
-- =====================================================

-- 1. Adicionar colunas à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled')),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- 2. Atualizar a função handle_new_user para setar o trial de 7 dias explicitamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome_completo, cpf, role, subscription_status, expires_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'cpf', '00000000000'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'proprietario'),
    'trial',
    (NOW() + INTERVAL '7 days')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. (OPCIONAL) Atualizar todos os usuários existentes para trial de 7 dias (se desejar)
-- UPDATE public.profiles SET expires_at = (NOW() + INTERVAL '7 days') WHERE expires_at IS NULL;
