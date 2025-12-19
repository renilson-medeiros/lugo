import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Building2,
  Users,
  Receipt,
  Share2,
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Organize seu Portfólio",
    description: "Registre fotos, cômodos, valores e regras. Mantenha seus imóveis centralizados e profissionais."
  },
  {
    icon: Share2,
    title: "Divulgação com Autonomia",
    description: "Gere links exclusivos para compartilhar em redes sociais e receba contatos direto no WhatsApp."
  },
  {
    icon: Users,
    title: "Gestão de Locações",
    description: "Monitore inquilinos, contratos e o histórico de pagamentos de forma simples e segura."
  },
  {
    icon: Receipt,
    title: "Comprovantes Digitais",
    description: "Emita documentos profissionais em PDF em segundos para cada aluguel recebido."
  },
  {
    icon: Shield,
    title: "Segurança de Dados",
    description: "Suas informações protegidas com infraestrutura de ponta e políticas rigorosas de acesso."
  },
  {
    icon: Smartphone,
    title: "Acesso de Qualquer Lugar",
    description: "Interface otimizada para computadores e dispositivos móveis, sem precisar baixar nada."
  }
];

const benefits = [
  "Sem comissões ou taxas intermediárias",
  "Autonomia total na gestão do patrimônio",
  "Teste gratuito por 7 dias",
  "Histórico de pagamentos organizado",
  "Emissão de comprovantes em segundos",
  "Suporte prioritário"
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 ">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-blue-50/25 py-20 lg:py-32">
          <div className="container px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-in font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Sua gestão de aluguéis, <span className="text-blue-500">simples e direta</span>
              </h1>
              <p className="mt-6 animate-fade-in text-lg text-muted-foreground [animation-delay:100ms] sm:text-xl">
                O Alugue Fácil oferece autonomia total para proprietários, eliminando intermediários e automatizando a rotina de gestão.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 animate-fade-in [animation-delay:200ms] sm:flex-row">
                <Link href="/registro">
                  <Button size="lg" className="w-full gap-2 text-base sm:w-auto bg-blue-500 hover:bg-blue-400">
                    Começar 7 dias grátis
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full text-base sm:w-auto">
                    Entrar na plataforma
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground animate-fade-in [animation-delay:300ms]">
                Plano Profissional • <span className="font-semibold text-primary">R$ 29,90/mês</span>
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28" aria-labelledby="features-heading">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="features-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Simplicidade e controle para o seu patrimônio
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tudo o que você precisa para transformar a gestão manual em um processo profissional e eficiente.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="group border-border/50 bg-card/50 transition-all duration-300 hover:border-blue-100 hover:shadow-lg hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-primary/10">
                      <feature.icon className="h-6 w-6 text-blue-500 " aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-secondary/30 py-20 lg:py-28" aria-labelledby="pricing-heading">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                  <h2 id="pricing-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Invista na sua Gestão
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Escolha a autonomia. Experimente o plano profissional gratuitamente por uma semana.
                  </p>
                  <ul className="mt-8 space-y-3" role="list">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-500" aria-hidden="true" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="border-blue-500/20 bg-gradient-to-t from-blue-500 to-blue-500/90 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted/80 uppercase tracking-wider">Acesso Profissional</p>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="text-sm text-muted/80">R$</span>
                        <span className="font-display text-5xl font-bold text-background">29,90</span>
                        <span className="text-muted/80">/mês</span>
                      </div>
                      <p className="mt-4 text-sm text-muted/80">
                        7 Dias de Teste Grátis • Cancele quando quiser
                      </p>
                      <Link href="/registro" className="mt-6 block">
                        <Button size="lg" className="w-full text-blue-500 bg-background hover:bg-blue-50">
                          Assinar com 7 dias grátis
                        </Button>
                      </Link>
                      <p className="mt-3 text-xs text-muted/60">
                        Imóveis e Quartos Ilimitados
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para profissionalizar seus aluguéis?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Junte-se a proprietários que já estão transformando sua rotina com o Alugue Fácil.
              </p>
              <Link href="/registro" className="mt-8 inline-block">
                <Button size="lg" className="gap-2 text-base bg-blue-500 hover:bg-blue-400">
                  Criar minha conta
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
