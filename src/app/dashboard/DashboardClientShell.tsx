"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardClientShell() {
    const { profile, loading: authLoading } = useAuth();

    const firstName = profile?.nome_completo?.split(' ')[0] || 'Usuário';

    const isExpired = !!(
        profile?.subscription_status === 'trial' &&
        profile?.expires_at &&
        new Date(profile.expires_at) < new Date()
    );

    if (authLoading) {
        return (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-accent rounded" />
                    <div className="h-4 w-64 bg-accent rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    Olá, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Bem-vindo de volta ao seu painel de controle.
                </p>
            </div>
            {isExpired ? (
                <Link href="/dashboard/configuracoes">
                    <Button size="lg" className="gap-2 w-full md:w-fit bg-amber-600 hover:bg-amber-500">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Assinar para adicionar mais
                    </Button>
                </Link>
            ) : (
                <Link href="/dashboard/imoveis/novo">
                    <Button size="lg" className="gap-2 w-full md:w-fit bg-tertiary hover:bg-tertiary/90">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Novo imóvel
                    </Button>
                </Link>
            )}
        </div>
    );
}
