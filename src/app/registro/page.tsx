"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { Eye, EyeOff, CreditCard, AlertCircle, Check, X, Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schemas";
import { formatarCPF, formatarTelefone } from "@/lib/validators";
import { PLAN_PRICE_FORMATTED, TRIAL_DAYS, LINKS } from "@/lib/constants";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState("");
    const router = useRouter();
    const { signUp } = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            cpf: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false
        },
        mode: "onChange" // Enable realtime validation for password strength feedback
    });

    const password = watch("password");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatarTelefone(e.target.value);
        setValue("phone", formatted, { shouldValidate: true });
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatarCPF(e.target.value);
        setValue("cpf", formatted, { shouldValidate: true });
    };

    const onSubmit = async (data: RegisterFormData) => {
        setAuthError("");

        try {
            const cpfNumeros = data.cpf.replace(/\D/g, "");
            const telefoneNumeros = data.phone.replace(/\D/g, "");

            await signUp(data.email, data.password, {
                nome_completo: data.name,
                cpf: cpfNumeros,
                telefone: telefoneNumeros,
            });

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Erro no cadastro:", err);

            if (err.message.includes("Error sending confirmation email")) {
                setAuthError("Sua conta foi criada, mas houve um problema ao enviar o email de confirmação. Entre em contato com o suporte ou tente fazer login.");
            } else if (err.message.includes("already registered") || err.message.includes("User already registered")) {
                setAuthError("Este email já está cadastrado");
            } else if (err.message.includes("duplicate key value violates unique constraint")) {
                setAuthError("CPF ou email já cadastrado no sistema");
            } else if (err.message.includes("Invalid email")) {
                setAuthError("Email inválido. Verifique o endereço digitado.");
            } else if (err.message.includes("Database error")) {
                setAuthError("Erro no servidor. Tente novamente em alguns instantes.");
            } else {
                setAuthError(err.message || "Erro ao criar conta. Tente novamente.");
            }
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
                        <CardTitle className="font-display text-2xl">Criar conta</CardTitle>
                        <CardDescription>
                            Comece a gerenciar seus imóveis hoje mesmo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Mensagem de Erro Geral */}
                            {authError && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-red-800 font-medium">Erro no cadastro</p>
                                        <p className="text-sm text-red-700 mt-0.5">{authError}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome"
                                    autoComplete="name"
                                    className={`h-11 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={isSubmitting}
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    className={`h-11 ${errors.cpf ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={isSubmitting}
                                    {...register("cpf", {
                                        onChange: handleCPFChange
                                    })}
                                />
                                {errors.cpf && (
                                    <p className="text-xs text-red-500">{errors.cpf.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    autoComplete="email"
                                    className={`h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={isSubmitting}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="phone">WhatsApp</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button type="button" className="inline-flex cursor-pointer items-center text-tertiary">
                                                <Info className="h-3.5 w-3.5" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent side="right" className="w-60 p-3 text-xs leading-relaxed">
                                            <p>
                                                Use seu número de contato principal para
                                                que os interessados possam falar com você diretamente.
                                            </p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                    autoComplete="tel"
                                    className={`h-11 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={isSubmitting}
                                    {...register("phone", {
                                        onChange: handlePhoneChange
                                    })}
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
                                        className={`h-11 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        disabled={isSubmitting}
                                        {...register("password")}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}

                                {/* Password Strength Indicators */}
                                <PasswordStrengthMeter password={password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    className={`h-11 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={isSubmitting}
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="flex items-end space-x-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="terms"
                                        onCheckedChange={(checked) => setValue("acceptTerms", checked === true, { shouldValidate: true })}
                                        disabled={isSubmitting}
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal leading-tight text-muted-foreground">
                                        Aceito os{" "}
                                        <Link href={LINKS.TERMS_OF_USE} className="text-tertiary hover:underline">termos de uso</Link>
                                        {" "}e a{" "}
                                        <Link href={LINKS.PRIVACY_POLICY} className="text-tertiary hover:underline">política de privacidade</Link>
                                    </Label>
                                </div>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
                            )}

                            <div className="rounded-lg bg-accent/50 p-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
                                    <div>
                                        <p className="text-sm font-medium">Plano Profissional: {PLAN_PRICE_FORMATTED}</p>
                                        <p className="text-xs text-muted-foreground">{TRIAL_DAYS} dias de teste grátis • Cancele quando quiser</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full text-base bg-blue-600 hover:bg-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Criando conta...</span>
                                    </div>
                                ) : (
                                    "Criar conta e assinar"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Já tem uma conta? </span>
                            <Link href="/login" className="font-medium text-blue-600 hover:underline">
                                Fazer login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
