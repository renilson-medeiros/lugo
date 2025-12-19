import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
    Building2,
    MapPin,
    Users,
    Receipt,
    Share2,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="container px-4 py-16 md:py-24 text-center">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Sua gestão de aluguéis, <span className="text-blue-500">simples e direta</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        O Alugue Fácil oferece autonomia total para proprietários, eliminando intermediários e automatizando a gestão do dia a dia.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/registro">
                            <Button size="lg" className="bg-blue-500 hover:bg-blue-400 gap-2 w-full sm:w-auto">
                                Começar agora
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* For Owners */}
                <section className="bg-secondary/30 py-16 md:py-24">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <h2 className="font-display text-3xl font-bold mb-4">A Ferramenta do Proprietário</h2>
                            <p className="text-muted-foreground">Tudo o que você precisa para gerenciar suas locações com autonomia e profissionalismo.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                                <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                                    <Building2 className="h-6 w-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">1. Organize seu Portfólio</h3>
                                <p className="text-muted-foreground">
                                    Cadastre seus imóveis com fotos, regras e valores detalhados. Mantenha todas as informações centralizadas e organizadas em um só lugar.
                                </p>
                            </div>

                            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                                <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                                    <Share2 className="h-6 w-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">2. Divulgação com Autonomia</h3>
                                <p className="text-muted-foreground">
                                    Gere links exclusivos para compartilhar em redes sociais e WhatsApp. Receba o contato de interessados diretamente no seu celular, sem taxas de intermediação.
                                </p>
                            </div>

                            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                                <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                                    <Users className="h-6 w-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">3. Gestão de Locações</h3>
                                <p className="text-muted-foreground">
                                    Vincule inquilinos, monitore vencimentos e emita comprovantes profissionais instantaneamente. Transforme sua gestão em um processo ágil e seguro.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Tenants */}
                <section className="py-16 md:py-24">
                    <div className="container px-4">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h2 className="font-display text-3xl font-bold">Experiência de Locação Premium</h2>
                                <p className="text-lg text-muted-foreground">
                                    Garantimos que o interessado receba uma apresentação impecável do seu imóvel, com transparência e facilidade de contato imediato.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Fotos em alta qualidade com galeria intuitiva",
                                        "Informações detalhadas sobre regras (pets, crianças, etc)",
                                        "Valores claros e detalhados (Aluguel, IPTU, Condomínio)",
                                        "Botão direto para contato via WhatsApp",
                                        "Acesso fácil via dispositivos móveis"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 bg-accent/50 rounded-2xl p-8 border border-border">
                                <div className="bg-background rounded-xl p-6 shadow-xl space-y-4">
                                    <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                                        <MapPin className="h-12 w-12 text-muted-foreground/30" />
                                    </div>
                                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                                    <div className="flex justify-between items-center pt-4">
                                        <div className="h-6 w-24 bg-blue-500/20 rounded"></div>
                                        <div className="h-10 w-32 bg-blue-500 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to action */}
                <section className="container px-4 py-16 md:py-24 text-center">
                    <div className="bg-blue-500 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-6">Pronto para simplificar seus aluguéis?</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                            Junte-se a proprietários que já estão usando o Alugue Fácil para organizar sua gestão.
                        </p>
                        <Link href="/registro">
                            <Button size="lg" variant="secondary" className="text-blue-500">
                                Criar minha conta grátis
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
