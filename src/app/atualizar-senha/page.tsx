"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/ui/Logo";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { validarSenha } from "@/lib/validators";

export default function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { updatePassword } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (password !== confirmPassword) {
                throw new Error("As senhas não coincidem");
            }

            const validacao = validarSenha(password);
            if (!validacao.valida) {
                throw new Error(validacao.mensagem);
            }

            await updatePassword(password);
            setSuccess(true);

            // Redirecionar após 3 segundos
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);

        } catch (err: any) {
            console.error("Erro ao atualizar senha:", err);
            setError(err.message || "Erro ao atualizar senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-linear-to-b from-accent/30 to-background">
            <Header />

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md animate-fade-in border-border/50 shadow-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex items-center justify-center">
                            <Logo iconOnly size="lg" />
                        </div>
                        <CardTitle className="font-display text-2xl">Definir Nova Senha</CardTitle>
                        <CardDescription>
                            Digite sua nova senha segura abaixo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="text-center space-y-6 animate-fade-in">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg text-foreground">Senha atualizada!</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Sua senha foi alterada com sucesso. Você será redirecionado para o dashboard em instantes...
                                    </p>
                                </div>
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-500">
                                    <Link href="/dashboard">Ir para o Dashboard</Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-red-800 font-medium">Erro ao atualizar</p>
                                            <p className="text-sm text-red-700 mt-0.5">{error}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="password">Nova Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Mínimo 8 caracteres"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 pr-10 h-11"
                                            disabled={loading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-11 w-11 text-muted-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirme a senha"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="pl-10 h-11"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full text-base bg-blue-600 hover:bg-blue-500"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Atualizando...</span>
                                        </div>
                                    ) : (
                                        "Atualizar Senha"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
