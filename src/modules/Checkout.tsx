"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    CheckCircle2,
    QrCode,
    Copy,
    ShieldCheck,
    ArrowLeft,
    Loader2,
    Lock,
    Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Checkout() {
    const router = useRouter();
    const { user, profile, loading: authLoading, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [copying, setCopying] = useState(false);
    const [paymentData, setPaymentData] = useState<{
        pixCode: string;
        qrCode: string;
        invoiceUrl: string;
    } | null>(null);
    const hasRequestedPayment = useRef(false);

    // 1. Redirecionamento instantâneo se já for ativo
    useEffect(() => {
        if (!authLoading && profile?.subscription_status === 'active' && !success) {
            console.log('✅ Usuário já é ativo, liberando acesso...');
            setSuccess(true);
            setTimeout(() => {
                if (window.location.pathname === '/checkout') {
                    router.push('/dashboard');
                }
            }, 2000);
        }
    }, [profile, authLoading, success, router]);

    // 2. Aciona o redirecionamento quando o sucesso é atingido manualmente
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => router.push('/dashboard'), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    // 3. Supabase Realtime: Escuta mudanças no perfil em tempo real
    useEffect(() => {
        if (!user) return;

        console.log('📡 Ativando Realtime para perfil:', user.id);

        const channel = supabase
            .channel(`profile_changes_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload) => {
                    console.log('⚡ Mudança detectada via Realtime:', payload);
                    const newStatus = payload.new.subscription_status;
                    if (newStatus === 'active') {
                        toast.success("Pagamento confirmado instantaneamente!");
                        setSuccess(true);
                        // Atualiza o contexto global para garantir que o resto do app saiba
                        refreshProfile();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, refreshProfile]);

    // 4. Carrega o pagamento apenas se necessário
    useEffect(() => {
        const prepareCheckout = async () => {
            // ESSENCIAL: Esperar o Auth carregar o perfil real
            if (authLoading || !user || !profile) return;

            // Se já for ativo, não faz nada (o useEffect acima cuida)
            if (profile.subscription_status === 'active') return;

            // Só gera se for trial e ainda não tivermos pedido nesta sessão do componente
            if (!hasRequestedPayment.current && !paymentData) {
                console.log('💎 Iniciando preparação de checkout...');
                hasRequestedPayment.current = true;
                await generateRealPayment();
            }
        };

        prepareCheckout();
    }, [user, profile, authLoading, paymentData]);

    const generateRealPayment = async () => {
        try {
            setGenerating(true);
            console.log('📡 Chamando API para gerar PIX...');
            const response = await fetch('/api/asaas/create-payment', {
                method: 'POST',
            });
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            console.log('✅ PIX Gerado:', data.paymentId);
            setPaymentData(data);
        } catch (error: any) {
            console.error('❌ Erro Asaas:', error);
            toast.error("Erro ao gerar pagamento. Tente recarregar a página.");
            hasRequestedPayment.current = false;
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyPix = () => {
        if (!paymentData?.pixCode) return;
        setCopying(true);
        navigator.clipboard.writeText(paymentData.pixCode);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopying(false), 2000);
    };

    const checkPaymentStatus = async () => {
        if (loading) return;

        setLoading(true);
        const toastId = toast.loading("Verificando pagamento agora...");

        try {
            // Busca direta no banco (muito rápido)
            const { data, error } = await supabase
                .from('profiles')
                .select('subscription_status')
                .eq('id', user?.id)
                .single();

            if (error) throw error;

            if (data.subscription_status === 'active') {
                toast.success("Confirmado! Seu acesso foi liberado.", { id: toastId });
                setSuccess(true);
                await refreshProfile();
            } else {
                toast.warning("Ainda não recebemos o aviso do Asaas. Aguarde uns instantes.", { id: toastId });
            }
        } catch (error) {
            console.error('Erro na verificação rápida:', error);
            toast.error("Erro ao verificar. Tente atualizar a página.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // Tela de carregamento bloqueante
    if (authLoading && !success) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-accent/5">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">Verificando pagamento...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4 bg-accent/5">
                    <Card className="max-w-md w-full text-center p-8 animate-in zoom-in duration-300">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Assinatura Ativa!</h1>
                        <p className="text-muted-foreground mb-8">
                            Parabéns! Sua conta <strong>Alugue Fácil Profissional</strong> foi ativada.
                            Você já pode cadastrar imóveis ilimitados e gerenciar seu patrimônio.
                        </p>
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-sm font-medium text-blue-500">Redirecionando para o Dashboard...</p>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-accent/5 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Top Bar */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Checkout</h1>
                            <p className="text-sm text-muted-foreground">Finalize sua assinatura profissional</p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Left Col: Order Summary */}
                        <div className="space-y-6">
                            <Card className="border-blue-500/20 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-blue-500" />
                                        Plano Profissional
                                    </CardTitle>
                                    <CardDescription>Acesso total e ilimitado</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Assinatura Mensal</span>
                                        <span className="font-semibold text-lg">R$ 29,90</span>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            "Imóveis Ilimitados",
                                            "Gestão de Inquilinos",
                                            "Comprovantes em PDF ilimitados",
                                            "Suporte Prioritário",
                                            "Dados na Nuvem com Segurança"
                                        ].map(item => (
                                            <div key={item} className="flex items-center gap-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 flex items-center justify-between text-xl font-bold text-blue-500">
                                        <span>Total</span>
                                        <span>R$ 29,90</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                                <ShieldCheck className="h-6 w-6 text-blue-500" />
                                <div className="text-xs text-blue-400">
                                    <p className="font-bold text-blue-500">Pagamento Seguro via Asaas</p>
                                    <p>Seus dados estão protegidos por criptografia de ponta a ponta.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: PIX Area */}
                        <div className="space-y-6">
                            <Card className="border-green-500/20 shadow-md relative overflow-hidden">
                                {/* Visual feedback shadow */}
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <QrCode size={120} />
                                </div>

                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-green-100 p-1.5 rounded-lg">
                                            <Zap className="h-5 w-5 text-green-600 fill-green-600" />
                                        </div>
                                        Pagamento via PIX
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col items-center justify-center p-6 bg-accent/30 rounded-xl border-2 border-dashed border-border/60 min-h-[300px]">
                                        {/* QR Code Real */}
                                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                                            <div className="w-48 h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                                {generating ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                                        <span className="text-[10px] text-muted-foreground">Gerando PIX...</span>
                                                    </div>
                                                ) : paymentData?.qrCode ? (
                                                    <img
                                                        src={`data:image/png;base64,${paymentData.qrCode}`}
                                                        alt="QR Code PIX"
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <QrCode size={160} className="text-muted-foreground opacity-20" />
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground px-4">
                                            {generating ? "Aguarde enquanto geramos seu código..." : "Aponte a câmera do seu celular para o QR Code acima para pagar."}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ou copie o código:</Label>
                                        <div className="flex gap-2 mt-2">
                                            <div className="relative bg-accent/50 p-3 rounded-lg flex-1 font-mono text-[10px] break-all border border-border/50 line-clamp-2 min-h-[44px]">
                                                {generating ? (
                                                    <div className="h-4 w-3/4 bg-border/50 animate-pulse rounded" />
                                                ) : (
                                                    <span className="relative inline-block w-[calc(100%-40px)]">
                                                        {paymentData?.pixCode || "Erro ao carregar código"}
                                                    </span>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="shrink-0 h-10 w-10 absolute top-1/2 right-2 -translate-y-1/2"
                                                    onClick={handleCopyPix}
                                                    disabled={copying || generating}
                                                >
                                                    {copying ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-bold gap-2 shadow-lg shadow-green-200"
                                            onClick={checkPaymentStatus}
                                            disabled={loading || generating}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Verificando pagamento...
                                                </>
                                            ) : (
                                                "Já realizei o pagamento"
                                            )}
                                        </Button>
                                        <p className="mt-4 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
                                            <Lock size={10} />
                                            Pagamento processado em ambiente seguro Sandbox (Asaas)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
