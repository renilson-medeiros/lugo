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
  signInWithOAuth: (provider: 'google') => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<Profile | null>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
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

    // Verificador proativo de sessão (roda a cada 10 minutos)
    // Isso evita que o token expire enquanto o usuário preenche formulários longos
    const sessionCheckInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.debug('[Auth] Sessão validada/renovada proativamente');
      }
    }, 10 * 60 * 1000);

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      clearInterval(sessionCheckInterval);
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

  const signInWithOAuth = async (provider: 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;
    
    // Update local state directly instead of reloading from DB
    if (profile) {
      setProfile({ ...profile, ...data });
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
      throw error;
    }
  };


  // LOGOUT
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no logout do Supabase:', error);
    } finally {
      setUser(null);
      setProfile(null);
      // Opcional: limpar localStorage ou outros estados se houver
    }
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

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    signIn,
    signInWithOAuth,
    updateProfile,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin',
    refreshProfile,
    resetPassword,
    updatePassword,
    resendConfirmationEmail
  }), [user, profile, loading, refreshProfile, signIn, signInWithOAuth, updateProfile, signUp, signOut, resetPassword, updatePassword]);

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
