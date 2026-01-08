"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/schemas";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState("");
    const router = useRouter();
    const { signIn } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setAuthError("");

        try {
            await signIn(data.email, data.password);
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Erro no login:", err);

            if (err.message.includes("Invalid login credentials")) {
                setAuthError("Email ou senha incorretos");
            } else if (err.message.includes("Email not confirmed")) {
                setAuthError("Por favor, confirme seu email antes de fazer login");
            } else {
                setAuthError(err.message || "Erro ao fazer login. Tente novamente.");
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-foreground">
            {/* Left Side - Image/Creative Area */}
            <div className="hidden lg:flex w-1/2 relative bg-tertiary flex-col items-start justify-end p-16 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-10" />
                {/* Image placeholder with project context */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                
                <div className="relative z-20 max-w-lg space-y-6">
                    <h2 className="font-display text-4xl font-semibold leading-tight text-white">
                        Simplifique a gestão dos seus imóveis com inteligência.
                    </h2>
                    <p className="text-zinc-200 text-lg">
                        Junte-se a milhares de proprietários que estão transformando a forma de alugar.
                    </p>
                    <div className="pt-4">
                        <cite className="not-italic text-sm text-zinc-300 font-medium">— Plataforma Lugo</cite>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-background p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para home
                        </Link>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                            Entrar na sua conta
                        </h1>
                        <p className="text-muted-foreground">
                            Bem-vindo de volta! Por favor, insira seus dados.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {authError && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
                                    {...register("email")}
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-foreground">Senha</Label>
                                    <Link
                                        href="/esqueci-senha"
                                        className="text-xs text-muted-foreground hover:text-tertiary transition-colors"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 pr-10"
                                        {...register("password")}
                                        disabled={isSubmitting}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isSubmitting}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-tertiary text-white hover:bg-tertiary/90 transition-colors font-medium text-base rounded-lg shadow-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            Não tem uma conta?{" "}
                            <Link href="/registro" className="text-tertiary hover:underline font-medium">
                                Criar conta
                            </Link>
                        </div>
                    </form>
                    
                    <div className="pt-8 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground">
                            Ao continuar, você concorda com nossos{" "}
                            <Link href="/termos" className="underline hover:text-foreground">Termos de Serviço</Link>{" "}
                            e{" "}
                            <Link href="/privacidade" className="underline hover:text-foreground">Política de Privacidade</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
