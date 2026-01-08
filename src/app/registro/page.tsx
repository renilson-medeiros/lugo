"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, Info, ArrowLeft } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
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
        mode: "onChange"
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
        <div className="flex min-h-screen w-full bg-background text-foreground">
            {/* Left Side - Image/Creative Area */}
            <div className="hidden lg:flex w-1/2 relative bg-tertiary flex-col items-start justify-end p-16 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                
                <div className="relative z-20 max-w-lg space-y-6">
                    <h2 className="font-display text-4xl font-semibold leading-tight text-white">
                        Construa seu império imobiliário com a Lugo.
                    </h2>
                    <p className="text-zinc-200 text-lg">
                        Comece a gerenciar seus imóveis hoje com a plataforma mais completa do mercado.
                    </p>
                    <div className="pt-4">
                        <cite className="not-italic text-sm text-zinc-300 font-medium">— Plataforma Lugo</cite>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-background p-8 sm:p-12 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-sm space-y-8 py-8">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para home
                        </Link>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                            Criar nova conta
                        </h1>
                        <p className="text-muted-foreground">
                            Preencha seus dados para começar gratuitamente.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {authError && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">Nome completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome"
                                    autoComplete="name"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
                                    {...register("name")}
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf" className="text-foreground">CPF</Label>
                                    <Input
                                        id="cpf"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
                                        {...register("cpf", { onChange: handleCPFChange })}
                                        disabled={isSubmitting}
                                    />
                                    {errors.cpf && (
                                        <p className="text-xs text-destructive">{errors.cpf.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <Label htmlFor="phone" className="text-foreground">WhatsApp</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button type="button" className="inline-flex cursor-pointer items-center text-primary hover:text-foreground">
                                                    <Info className="h-3.5 w-3.5" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent side="top" className="w-60 p-3 text-xs leading-relaxed">
                                                <p>Use seu número principal para contato.</p>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
                                        {...register("phone", { onChange: handlePhoneChange })}
                                        disabled={isSubmitting}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-destructive">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    autoComplete="email"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
                                    {...register("email")}
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
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
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                                <PasswordStrengthMeter password={password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
                                    {...register("confirmPassword")}
                                    disabled={isSubmitting}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start md:items-center space-x-2 pt-2">
                            <Checkbox
                                id="terms"
                                className="mt-1"
                                onCheckedChange={(checked) => setValue("acceptTerms", checked === true, { shouldValidate: true })}
                                disabled={isSubmitting}
                            />
                            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-tight cursor-pointer">
                                Aceito os{" "}
                                <Link href={LINKS.TERMS_OF_USE} className="text-tertiary hover:underline">termos de uso</Link>
                                {" "}e a{" "}
                                <Link href={LINKS.PRIVACY_POLICY} className="text-tertiary hover:underline">política de privacidade</Link>
                            </Label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
                        )}
                        
                        <div className="rounded-lg bg-muted/50 border border-green-600 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Plano Profissional</p>
                                    <p className="text-xs text-green-600">{PLAN_PRICE_FORMATTED}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 rounded bg-green-600/10 text-green-600 text-xs font-medium">
                                        {TRIAL_DAYS} dias grátis
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-tertiary text-white hover:bg-tertiary/90 transition-colors font-medium text-base rounded-lg shadow-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Criando conta..." : "Criar conta e assinar"}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="text-tertiary hover:underline font-medium">
                                Fazer login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
