// src\contexts\AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<Profile | null>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

interface SignUpData {
  nome_completo: string;
  cpf: string;
  telefone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);


  // INIT + AUTH LISTENER
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session?.user) {
        setLoading(false);
        return;
      }

      setUser(data.session.user);
      // Busca o perfil sem esperar o retry longo para o primeiro carregamento
      loadProfileWithRetry(data.session.user.id, 2);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(session.user);
        if (session.user) {
          loadProfileWithRetry(session.user.id, 2);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  // LOAD PROFILE WITH RETRY
  const loadProfileWithRetry = useCallback(async (userId: string, retries = 5) => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
        return data;
      }

      if (error) {
        console.error('Erro ao buscar profile:', error);
        break;
      }

      // Reduzido o delay para 200ms para ser mais responsivo
      await new Promise((res) => setTimeout(res, 200));
    }

    setProfile(null);
    return null;
  }, []);

  // MEMOIZED REFRESH
  const refreshProfile = useCallback(async () => {
    if (user) {
      return await loadProfileWithRetry(user.id, 2);
    }
    return null;
  }, [user]);

  // LOGIN
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
    if (data.user) {
      await loadProfileWithRetry(data.user.id);
    }
  };


  // SIGNUP (trigger cuida do profile)
  const signUp = async (email: string, password: string, userData: SignUpData) => {
    if (!validarCPF(userData.cpf)) {
      throw new Error('CPF inválido');
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome_completo: userData.nome_completo,
          cpf: userData.cpf.replace(/\D/g, ''),
          telefone: userData.telefone.replace(/\D/g, ''),
        },
      },
    });

    if (error) throw error;
  };


  // LOGOUT
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setProfile(null);
  };

  // PASSWORD RESET
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin',
    refreshProfile,
    resetPassword,
    updatePassword
  }), [user, profile, loading, refreshProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider');
  return context;
};


// CPF VALIDATION
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[10])) return false;

  return true;
}
