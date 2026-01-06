"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, CreditCard, Calendar, Bell, Loader2, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { validarTelefone, formatarTelefone, formatarCPF } from "@/lib/validators";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface SettingsProps {
  initialProfile?: any;
}

export default function Settings({ initialProfile }: SettingsProps) {
  const { user, profile: contextProfile } = useAuth();
  const profile = contextProfile || initialProfile;
  const [userData, setUserData] = useState({
    nome_completo: "",
    email: "",
    telefone: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setUserData({
        nome_completo: profile.nome_completo || "",
        email: profile.email || "",
        telefone: profile.telefone ? formatarTelefone(profile.telefone) : ""
      });
      setIsLoading(false);
    } else if (user && !initialProfile) {
      // Se não tiver profile mas tiver user, ainda está carregando
      setIsLoading(true);
    } else if (!user && !initialProfile) {
      setIsLoading(false);
      setError("Usuário não autenticado");
    }
  }, [profile, user, initialProfile]);

  const handleSave = async () => {
    if (!user || !profile) {
      toast.error("Você precisa estar logado");
      return;
    }

    // Validações
    if (!userData.nome_completo.trim()) {
      toast.error("Nome completo é obrigatório");
      return;
    }

    if (userData.telefone && !validarTelefone(userData.telefone)) {
      toast.error("Telefone inválido");
      return;
    }

    setIsSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          nome_completo: userData.nome_completo.trim(),
          telefone: userData.telefone.replace(/\D/g, '') || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success("Configurações salvas com sucesso!");
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      toast.error(err.message || 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir conta');
      }

      toast.success("Conta excluída com sucesso");
      // Forçar logout no frontend para limpar estado
      window.location.href = '/login';
    } catch (err: any) {
      console.error('Erro ao excluir conta:', err);
      toast.error(err.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Erro ao carregar dados</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <User className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Dados pessoais
            </CardTitle>
            <CardDescription>
              Informações da sua conta de proprietário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={userData.nome_completo}
                  onChange={(e) => setUserData({ ...userData, nome_completo: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                  title="O email não pode ser alterado"
                />
                <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="inline-flex cursor-pointer items-center">
                        <Info className="h-3.5 w-3.5 text-blue-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-60 mb-2 bg-popover shadow-md rounded-lg p-3 text-xs leading-relaxed">
                      <p>
                        Use seu número de contato principal para
                        que os interessados possam falar com você diretamente.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Input
                  id="phone"
                  value={userData.telefone}
                  onChange={(e) => setUserData({ ...userData, telefone: formatarTelefone(e.target.value) })}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={profile?.cpf ? formatarCPF(profile.cpf) : ""}
                  disabled
                  className="bg-muted cursor-not-allowed"
                  title="O CPF não pode ser alterado"
                />
                <p className="text-xs text-muted-foreground">O CPF não pode ser alterado</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <CreditCard className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Informações da conta
            </CardTitle>
            <CardDescription>
              Detalhes da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Tipo de conta</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.role === 'admin' ? 'Administrador' : 'Proprietário'}
                  </p>
                </div>
                <Badge variant={profile?.role === 'admin' ? 'default' : 'outline'}>
                  {profile?.role === 'admin' ? 'Admin' : 'Proprietário'}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Membro desde</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                      : 'Data não disponível'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Bell className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como deseja receber alertas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembrete de pagamento</p>
                  <p className="text-sm text-muted-foreground">Receba alertas quando o dia do pagamento se aproximar</p>
                </div>
                <Badge variant="outline" className="bg-muted">Em breve</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos contatos</p>
                  <p className="text-sm text-muted-foreground">Seja notificado quando alguém visualizar seu imóvel</p>
                </div>
                <Badge variant="outline" className="bg-muted">Em breve</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/90">
          <CardHeader>
            <CardTitle className="font-display text-red-500">Zona de perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              A exclusão da sua conta apagará permanentemente todos os seus dados, incluindo imóveis, inquilinos e histórico.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-500 hover:bg-red-400">
                  Excluir minha conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                    e removerá todos os seus dados de nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600 focus:ring-red-600"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      'Sim, excluir minha conta'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
