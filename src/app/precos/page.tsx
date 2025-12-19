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
                            Planos e Preços
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Escolha o plano ideal para a sua necessidade. Estamos em fase beta e oferecemos condições especiais.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="flex flex-col p-8 bg-background border border-border rounded-2xl shadow-sm relative overflow-hidden">
                            <div className="mb-8">
                                <h3 className="font-display text-2xl font-bold">Plano Inicial</h3>
                                <p className="text-muted-foreground mt-2">Para quem tem poucos imóveis.</p>
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-bold">Grátis</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Até 3 imóveis cadastrados",
                                    "Gestão de inquilinos ativa",
                                    "Página pública de divulgação",
                                    "Geração de comprovantes (PDF)",
                                    "Suporte via e-mail"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Check className="h-4 w-4 text-blue-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/registro">
                                <Button className="w-full" variant="outline">Começar agora</Button>
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="flex flex-col p-8 bg-blue-600 text-white border border-blue-500 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Recomendado
                            </div>

                            <div className="mb-8">
                                <h3 className="font-display text-2xl font-bold">Plano Pro</h3>
                                <p className="text-blue-100 mt-2">Gestão completa e profissional.</p>
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-bold">R$ 29,90</span>
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
                                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold">Experimentar Grátis</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Beta Notice */}
                    <div className="mt-16 max-w-2xl mx-auto bg-accent/50 p-6 rounded-2xl flex gap-4 items-start border border-border/50">
                        <Info className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold mb-1">Estamos em Fase Beta!</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Durante este período, todas as funcionalidades do Plano Pro estão liberadas gratuitamente para novos usuários.
                                Aproveite para organizar sua gestão sem custos extras.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
