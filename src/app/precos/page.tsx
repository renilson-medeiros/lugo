import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="container px-4 py-16 md:py-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Invista na sua Gestão
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Escolha o plano que melhor se adapta ao seu portfólio. Comece agora com 7 dias de teste gratuito em qualquer plano.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="flex flex-col p-8 bg-background border border-border rounded-lg shadow-sm relative overflow-hidden">
                            <div className="mb-8">
                                <h3 className="font-display text-2xl font-bold">Essencial</h3>
                                <p className="text-muted-foreground mt-2">Ideal para quem quer começar a gerenciar seus imóveis.</p>
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-bold">Grátis</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "7 dias grátis para testar",
                                    "Gestão ativa de inquilinos",
                                    "Página pública de divulgação",
                                    "Geração de comprovantes (PDF)"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-tertiary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/registro">
                                <Button className="w-full" variant="outline">Começar agora</Button>
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="flex flex-col p-8 bg-tertiary text-white border border-tertiary rounded-lg shadow-xl relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Recomendado
                            </div>

                            <div className="mb-8">
                                <h3 className="font-display text-2xl font-bold">Profissional</h3>
                                <p className="text-blue-100 mt-2">A solução completa para quem busca escala e controle total.</p>
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-bold">R$ 9,90</span>
                                    <span className="ml-2 text-blue-200">/mês</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Imóveis ilimitados",
                                    "Gestão completa de histórico",
                                    "Fotos ilimitadas por imóvel",
                                    "Comprovantes com sua logo",
                                    "Dashboard de rendimentos",
                                    "Suporte prioritário via WhatsApp"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/registro">
                                <Button className="w-full bg-white text-tertiary hover:bg-white/90 font-bold">Experimentar Grátis</Button>
                            </Link>
                        </div>
                    </div>


                </section>
            </main>
            <Footer />
        </div>
    );
}
