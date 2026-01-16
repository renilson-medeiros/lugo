"use client";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, FileText, Share2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
    
const feature1Image = "/lp_imoveis.png";
const feature2Image = "/lp_cadastro.png";
const feature3Image = "/lp_comprovante.png";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function ComoFuncionaPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            {/* Hero Section */}
            <section className="py-20 px-4 md:px-6 lg:px-8 bg-linear-to-b from-primary/5 to-background text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                        Gerencie <span className="text-tertiary">aluguéis</span> sem dor de cabeça
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Descubra como o Lugo simplifica a vida de proprietários independentes.
                        Do cadastro do imóvel ao recibo no WhatsApp, tudo em um só lugar.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Button size="lg" className="bg-tertiary hover:bg-tertiary/90" asChild>
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
                            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-tertiary font-medium text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-primary-foreground text-xs">1</span>
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
                        <Card className="bg-muted/50 border-none aspect-video flex items-center justify-center relative overflow-hidden group p-0">
                            <motion.div 
                                className="relative w-full h-full"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-gray-100 rounded-lg p-2 md:p-4 shadow-inner">
                                <Image 
                                    src={feature2Image} 
                                    alt="Cadastro e Divulgação" 
                                    fill 
                                    className="object-cover object-top rounded-lg shadow-sm"
                                />
                                </div>
                            </motion.div>
                        </Card>
                    </div>

                    {/* Step 2 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 md:order-2">
                            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-tertiary font-medium text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-primary-foreground text-xs">2</span>
                                Divulgação
                            </div>
                            <h2 className="text-3xl font-bold">Divulgue em Segundos</h2>
                            <p className="text-lg text-muted-foreground">
                                Imóvel cadastrado gera um link exclusivo. Compartilhe no WhatsApp, Facebook ou Instagram.
                                Quem clica vê uma página profissional com fotos e informações, sem precisar de app.
                            </p>
                        </div>
                        <Card className="bg-muted/50 border-none aspect-video flex items-center justify-center relative overflow-hidden group md:order-1 p-0">
                             <motion.div 
                                className="relative w-full h-full"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image 
                                    src={feature1Image} 
                                    alt="Divulgação do Imóvel"
                                    fill
                                    className="object-cover object-top rounded-lg shadow-sm" 
                                />
                            </motion.div>
                        </Card>
                    </div>

                    {/* Step 3 */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-tertiary font-medium text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-primary-foreground text-xs">3</span>
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
                        <Card className="bg-muted/50 border-none aspect-video flex items-center justify-center relative overflow-hidden group p-0">
                            <motion.div 
                                className="relative w-full h-full"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image 
                                    src={feature3Image} 
                                    alt="Controle e Recibos"
                                    fill
                                    className="object-cover object-top rounded-lg shadow-sm" 
                                />
                            </motion.div>
                        </Card>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-tertiary text-primary-foreground mt-auto">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold">Pronto para organizar seus aluguéis?</h2>
                    <p className="text-lg opacity-90">
                        Comece hoje mesmo, gratuitamente. Sem cartão de crédito.
                    </p>
                    <Button size="lg" variant="outline" asChild className="text-primary-foreground bg-transparent">
                        <Link href="/registro">Criar Conta Grátis</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
