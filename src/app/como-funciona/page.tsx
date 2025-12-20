import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, CheckCircle2, FileText, Share2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComoFuncionaPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                        Gerencie <span className="text-blue-600">aluguéis</span> sem dor de cabeça
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Descubra como o Lugo simplifica a vida de proprietários independentes.
                        Do cadastro do imóvel ao recibo no WhatsApp, tudo em um só lugar.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500" asChild>
                            <Link href="/registro">Começar Grátis</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/contato">Falar Conosco</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-24">

                    {/* Step 1 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-primary font-medium text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-primary-foreground text-xs">1</span>
                                Primeiro Passo
                            </div>
                            <h2 className="text-3xl font-bold">Cadastre seus Imóveis</h2>
                            <p className="text-lg text-muted-foreground">
                                Comece organizando seu portfólio. Adicione fotos, valor do aluguel, endereço e detalhes como número de quartos.
                                Tudo fica salvo e organizado por propriedade.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Galeria de fotos automática
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Histórico de valores
                                </li>
                            </ul>
                        </div>
                        <Card className="bg-muted/50 border-dashed aspect-video flex items-center justify-center relative overflow-hidden group">
                            {/* Placeholder for Screenshot */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 transition-all group-hover:scale-105">
                                <Image 
                                    src="/preview_cadastr.png" 
                                    alt="Screenshot"
                                    fill
                                    className="w-full h-full object-top" 
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Step 2 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 md:order-2">
                            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-primary font-medium text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-primary-foreground text-xs">2</span>
                                Divulgação
                            </div>
                            <h2 className="text-3xl font-bold">Divulgue em Segundos</h2>
                            <p className="text-lg text-muted-foreground">
                                Imóvel cadastrado gera um link exclusivo. Compartilhe no WhatsApp, Facebook ou Instagram.
                                Quem clica vê uma página profissional com fotos e informações, sem precisar de app.
                            </p>
                        </div>
                        <Card className="bg-muted/50 border-dashed aspect-video flex items-center justify-center relative overflow-hidden group md:order-1">
                            {/* Placeholder for Screenshot */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 transition-all group-hover:scale-105">
                                <Image 
                                    src="/preview_detalhes.png" 
                                    alt="Screenshot"
                                    fill
                                    className="w-full h-full object-top" 
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Step 3 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-primary font-medium text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-primary-foreground text-xs">3</span>
                                Gestão
                            </div>
                            <h2 className="text-3xl font-bold">Controle e Recibos</h2>
                            <p className="text-lg text-muted-foreground">
                                Adicione o inquilino, anexe o contrato e defina o vencimento.
                                Quando receber, gere um recibo PDF profissional com um clique e envie na hora.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Geração de PDF instantânea
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Status de pagamento visual (Em dia/Atrasado)
                                </li>
                            </ul>
                        </div>
                        <Card className="bg-muted/50 border-dashed aspect-video flex items-center justify-center relative overflow-hidden group">
                            {/* Placeholder for Screenshot */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 transition-all group-hover:scale-105">
                                <Image 
                                    src="/preview_comprovant.png" 
                                    alt="Screenshot"
                                    fill
                                    className="w-full h-full object-top" 
                                />
                            </div>
                        </Card>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-blue-600 text-primary-foreground mt-auto">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold">Pronto para organizar seus aluguéis?</h2>
                    <p className="text-lg opacity-90">
                        Comece hoje mesmo, gratuitamente. Sem cartão de crédito.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="text-blue-600">
                        <Link href="/registro">Criar Conta Grátis</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
