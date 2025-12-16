import { Link } from "react-router-dom";
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
    title: "Cadastre seus imóveis",
    description: "Registre todos os detalhes: fotos, cômodos, valores, regras e muito mais."
  },
  {
    icon: Share2,
    title: "Compartilhe facilmente",
    description: "Gere links únicos para cada imóvel e compartilhe com potenciais inquilinos."
  },
  {
    icon: Users,
    title: "Gerencie inquilinos",
    description: "Cadastre inquilinos, controle contratos e acompanhe pagamentos."
  },
  {
    icon: Receipt,
    title: "Comprovantes digitais",
    description: "Gere comprovantes de pagamento profissionais para cada aluguel recebido."
  },
  {
    icon: Shield,
    title: "Seguro e confiável",
    description: "Seus dados protegidos com a mais alta tecnologia de segurança."
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    description: "Acesse de qualquer dispositivo: computador, tablet ou celular."
  }
];

const benefits = [
  "Sem intermediários ou taxas sobre aluguéis",
  "Gestão completa dos seus imóveis",
  "Contato direto via WhatsApp",
  "Controle de pagamentos simplificado",
  "Comprovantes profissionais",
  "Suporte dedicado"
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-background py-20 lg:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-in font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Aluguel direto com o{" "}
                <span className="text-primary">proprietário</span>
              </h1>
              <p className="mt-6 animate-fade-in text-lg text-muted-foreground [animation-delay:100ms] sm:text-xl">
                Gerencie seus imóveis, inquilinos e pagamentos em um só lugar. 
                Sem intermediários, sem complicação.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 animate-fade-in [animation-delay:200ms] sm:flex-row">
                <Link to="/registro">
                  <Button size="lg" className="w-full gap-2 text-base sm:w-auto">
                    Começar agora
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full text-base sm:w-auto">
                    Já tenho conta
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground animate-fade-in [animation-delay:300ms]">
                Apenas <span className="font-semibold text-primary">R$ 30,00/mês</span> • Cancele quando quiser
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28" aria-labelledby="features-heading">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="features-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Tudo que você precisa para gerenciar seus aluguéis
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Uma plataforma completa para proprietários que querem simplicidade e controle.
              </p>
            </div>
            
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title} 
                  className="group border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
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
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                  <h2 id="pricing-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Simples e transparente
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Um único plano com tudo incluso. Sem surpresas, sem taxas escondidas.
                  </p>
                  <ul className="mt-8 space-y-3" role="list">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Card className="border-primary/20 bg-card shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Plano mensal</p>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <span className="font-display text-5xl font-bold text-foreground">30</span>
                        <span className="text-muted-foreground">/mês</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Imóveis ilimitados • Inquilinos ilimitados
                      </p>
                      <Link to="/registro" className="mt-6 block">
                        <Button size="lg" className="w-full text-base">
                          Começar agora
                        </Button>
                      </Link>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Cancele quando quiser, sem multa
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
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para simplificar seus aluguéis?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Junte-se a centenas de proprietários que já usam o AlugaFácil.
              </p>
              <Link to="/registro" className="mt-8 inline-block">
                <Button size="lg" className="gap-2 text-base">
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
