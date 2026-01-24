"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Mail,
    MessageCircle,
    Send,
    Building2,
    Clock
} from "lucide-react";

export default function ContactClient() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="container px-4 py-16 md:py-24">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
                        {/* Info Section */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <h1 className="font-display text-4xl font-bold tracking-tight mb-4">Central de Contato</h1>
                                <p className="text-xl text-muted-foreground">
                                    Nossa equipe está à disposição para ajudar você a ter a melhor experiência de gestão. Seja para dúvidas, sugestões ou feedbacks.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5 text-tertiary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">E-mail</h3>
                                        <p className="text-muted-foreground">suporte@lugo.com.br</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                        <MessageCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">WhatsApp</h3>
                                        <p className="text-muted-foreground">(31) 99129-2952</p>
                                        <p className="text-xs text-muted-foreground mt-1">Segunda a Sexta, das 9h às 18h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <Clock className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Tempo de Resposta</h3>
                                        <p className="text-muted-foreground">Priorizamos sua agilidade. Geralmente respondemos em até 24 horas úteis.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-accent/50 rounded-lg border border-border">
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <span className="font-bold">Sede Virtual</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    O Lugo é uma plataforma 100% digital, focada em eficiência e comodidade para proprietários de todo o Brasil.
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="flex-1">
                            <div className="bg-background border border-border rounded-lg p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6">Mande uma mensagem</h2>
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input id="name" placeholder="Como deseja ser chamado?" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail</Label>
                                        <Input id="email" type="email" placeholder="seu@email.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Assunto</Label>
                                        <Input id="subject" placeholder="Em que podemos ajudar?" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensagem</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Descreva aqui sua dúvida ou sugestão..."
                                            className="min-h-[150px] resize-none"
                                        />
                                    </div>

                                    <Button className="w-full bg-tertiary hover:bg-tertiary/90 gap-2 h-12 text-base">
                                        Enviar Mensagem
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
