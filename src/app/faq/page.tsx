"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
    const faqs = [
        {
            question: "O Aluga Fácil é uma imobiliária?",
            answer: "Não. O Aluga Fácil é uma plataforma de tecnologia que fornece ferramentas para locadores diretos gerenciarem seus próprios imóveis e inquilinos, sem a necessidade de intermediários ou taxas de administração imobiliária."
        },
        {
            question: "Como os inquilinos entram em contato comigo?",
            answer: "Ao compartilhar o link público do seu imóvel, o interessado verá um botão 'Falar com proprietário'. Ao clicar, ele será redirecionado diretamente para o seu WhatsApp com uma mensagem pré-preenchida sobre o imóvel."
        },
        {
            question: "É seguro cadastrar meus dados e de meus inquilinos?",
            answer: "Sim. Utilizamos o Supabase como infraestrutura de banco de dados, que segue padrões rigorosos de segurança e criptografia. Seus dados e os de seus inquilinos são privados e protegidos por políticas de acesso (RLS)."
        },
        {
            question: "Como funciona a geração de comprovantes?",
            answer: "Após vincular um inquilino a um imóvel, você pode acessar a seção de Comprovantes. Basta selecionar o inquilino, o mês de referência e os valores. O sistema gera um PDF profissional que você pode baixar ou enviar direto pelo WhatsApp."
        },
        {
            question: "Posso cadastrar quantos imóveis eu quiser?",
            answer: "No momento, durante nossa fase beta, o cadastro de imóveis é ilimitado para que você possa testar todas as funcionalidades da plataforma livremente."
        },
        {
            question: "O Aluga Fácil cobra alguma taxa sobre o aluguel?",
            answer: "Não cobramos nenhuma porcentagem sobre o valor do seu aluguel. A plataforma funciona através de uma assinatura simples (atualmente gratuita no beta), sem comissões sobre suas locações."
        },
        {
            question: "Preciso baixar algum aplicativo?",
            answer: "Não. O Aluga Fácil é um Progressive Web App (PWA) que funciona direto no seu navegador, tanto no computador quanto no celular, sem ocupar espaço na memória do seu aparelho."
        }
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="container px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-blue-500 mx-auto mb-6">
                                <HelpCircle className="h-8 w-8" />
                            </div>
                            <h1 className="font-display text-4xl font-bold tracking-tight mb-4">Perguntas Frequentes</h1>
                            <p className="text-xl text-muted-foreground">
                                Tire suas dúvidas sobre como usar o Aluga Fácil para gerenciar seus imóveis.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-background hover:bg-blue-50/50 transition-colors border border-border hover:border-blue-500 rounded-xl px-6"
                                >
                                    <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-blue-500 py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="mt-16 p-8 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                            <h3 className="font-bold text-primary mb-2">Ainda tem dúvidas?</h3>
                            <p className="text-primary/80 mb-6">Estamos aqui para ajudar você a ter a melhor experiência possível.</p>
                            <a
                                href="/contato"
                                className="inline-flex items-center justify-center rounded-md bg-blue-500 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                            >
                                Fale Conosco
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
