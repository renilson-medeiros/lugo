// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { validarCPF } from '../lib/validators';

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
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.user) return;

        setUser(data.session.user);
        await loadProfile(data.session.user.id);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        // Só remove o loading após a primeira tentativa de carregar o perfil
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  // LOAD PROFILE OPTIMIZED
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar profile:', error);
        return null;
      }

      if (data) {
        setProfile(data);
        return data;
      }

    } catch (err) {
      console.error('Exceção ao carregar profile:', err);
    }

    return null;
  }, []);

  // MEMOIZED REFRESH
  const refreshProfile = useCallback(async () => {
    if (user) {
      return await loadProfile(user.id);
    }
    return null;
  }, [user, loadProfile]);

  // LOGIN
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
    if (data.user) {
      await loadProfile(data.user.id);
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
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          nome_completo: userData.nome_completo,
          cpf: userData.cpf.replace(/\D/g, ''),
          telefone: userData.telefone.replace(/\D/g, ''),
        },
      },
    });

    if (error) {
      // Se o erro for de confirmação de email, mas o usuário foi criado, não bloquear
      if (error.message.includes('Error sending confirmation email')) {
        console.warn('Usuário criado, mas email de confirmação não foi enviado:', error);
        // Não lançar erro, apenas avisar
        throw new Error('Error sending confirmation email');
      }
      throw error;
    }
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
  }), [user, profile, loading, refreshProfile, signIn, signUp, signOut, resetPassword, updatePassword]);

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
