// src/pages/Register.tsx
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { Eye, EyeOff, CreditCard, Building2, AlertCircle, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { validarSenha } from "@/lib/validators";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Limpar erro ao digitar
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    updateField("phone", formatted);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    updateField("cpf", formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validações
      if (!formData.name || !formData.cpf || !formData.phone ||
        !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("Preencha todos os campos");
      }

      if (formData.name.split(" ").length < 2) {
        throw new Error("Digite seu nome completo");
      }

      const cpfNumeros = formData.cpf.replace(/\D/g, "");
      if (cpfNumeros.length !== 11) {
        throw new Error("CPF inválido - deve conter 11 dígitos");
      }

      const telefoneNumeros = formData.phone.replace(/\D/g, "");
      if (telefoneNumeros.length < 10) {
        throw new Error("Telefone inválido");
      }

      if (!formData.email.includes("@")) {
        throw new Error("Email inválido");
      }

      // Validar força da senha
      const senhaValidacao = validarSenha(formData.password);
      if (!senhaValidacao.valida) {
        throw new Error(senhaValidacao.mensagem);
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      if (!formData.acceptTerms) {
        throw new Error("Você precisa aceitar os termos de uso");
      }

      // Criar conta no Supabase
      await signUp(formData.email, formData.password, {
        nome_completo: formData.name,
        cpf: cpfNumeros,
        telefone: telefoneNumeros,
      });

      // Redirecionar para dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro no cadastro:", err);

      // Mensagens de erro personalizadas
      if (err.message.includes("already registered") || err.message.includes("User already registered")) {
        setError("Este email já está cadastrado");
      } else if (err.message.includes("Password should be")) {
        setError("A senha deve ter pelo menos 6 caracteres");
      } else if (err.message.includes("duplicate key value violates unique constraint")) {
        setError("CPF ou email já cadastrado no sistema");
      } else {
        setError(err.message || "Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-accent/30 to-background">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md animate-fade-in border-border/50 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <Building2 className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl">Criar conta</CardTitle>
            <CardDescription>
              Comece a gerenciar seus imóveis hoje mesmo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mensagem de Erro */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">Erro no cadastro</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  autoComplete="name"
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  required
                  maxLength={14}
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  maxLength={15}
                  autoComplete="tel"
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-11 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      {formData.password.length >= 8 ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={formData.password.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/[A-Z]/.test(formData.password) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}>
                        Uma letra maiúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/[a-z]/.test(formData.password) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}>
                        Uma letra minúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/[0-9]/.test(formData.password) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={/[0-9]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}>
                        Um número
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="flex items-end space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => updateField("acceptTerms", checked as boolean)}
                  required
                  className="mt-0.5"
                  disabled={loading}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-tight text-muted-foreground">
                  Aceito os{" "}
                  <Link href="#" className="text-blue-500 hover:underline">termos de uso</Link>
                  {" "}e a{" "}
                  <Link href="#" className="text-blue-500 hover:underline">política de privacidade</Link>
                </Label>
              </div>

              <div className="rounded-lg bg-accent/50 p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">Plano mensal: R$ 30,00</p>
                    <p className="text-xs text-muted-foreground">Cobrança recorrente • Cancele quando quiser</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full text-base bg-blue-500 hover:bg-blue-400"
                disabled={loading}
              >
                {loading ? (
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
              <Link href="/login" className="font-medium text-blue-500 hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}