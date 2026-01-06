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
            question: "O Lugo é uma imobiliária?",
            answer: "Não. O Lugo é uma plataforma de tecnologia que fornece ferramentas para locadores diretos gerenciarem seus próprios imóveis e inquilinos, sem a necessidade de intermediários ou taxas de administração imobiliária."
        },
        {
            question: "Como os interessados entram em contato?",
            answer: "Ao compartilhar o link exclusivo do seu imóvel, o interessado terá acesso a todas as informações e ao botão 'Falar com proprietário'. O contato é feito diretamente via WhatsApp, sem intermediários, agilizando a sua negociação."
        },
        {
            question: "Meus dados e os dos meus inquilinos estão seguros?",
            answer: "Segurança é nossa prioridade. Utilizamos infraestrutura de ponta com o Supabase, garantindo que todas as informações sejam criptografadas e protegidas por rigorosas políticas de acesso (RLS). Seus dados são privados e nunca compartilhados com terceiros."
        },
        {
            question: "Como funciona a geração de comprovantes?",
            answer: "Após vincular um inquilino a um imóvel, você pode acessar a seção de Comprovantes. Basta selecionar o inquilino, o mês de referência e os valores. O sistema gera um PDF profissional que você pode baixar ou enviar direto pelo WhatsApp."
        },
        {
            question: "Posso testar antes de assinar?",
            answer: "Sim! Ao criar sua conta, você ganha 7 dias de acesso total e gratuito ao plano Profissional para testar todas as funcionalidades e ver como o Lugo simplifica sua gestão."
        },
        {
            question: "Como funciona o pagamento?",
            answer: "A plataforma funciona com uma assinatura mensal simples de R$ 9,90. Cobramos apenas pelo uso das ferramentas de gestão, sem nenhuma taxa ou comissão sobre o valor do seu aluguel."
        },
        {
            question: "Preciso baixar algum aplicativo?",
            answer: "Não. O Lugo é um Progressive Web App (PWA) que funciona direto no seu navegador, tanto no computador quanto no celular, sem ocupar espaço na memória do seu aparelho."
        }
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="container px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent text-blue-600 mx-auto mb-6">
                                <HelpCircle className="h-8 w-8" />
                            </div>
                            <h1 className="font-display text-4xl font-bold tracking-tight mb-4">Perguntas Frequentes</h1>
                            <p className="text-xl text-muted-foreground">
                                Encontre respostas rápidas e descubra como o Lugo pode simplificar a gestão do seu patrimônio.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-background hover:bg-blue-50/50 transition-colors border border-border hover:border-blue-600 rounded-lg px-6"
                                >
                                    <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-blue-600 py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-100 text-center">
                            <h3 className="font-bold text-primary mb-2">Ainda tem dúvidas?</h3>
                            <p className="text-primary/80 mb-6">Estamos aqui para ajudar você a ter a melhor experiência possível.</p>
                            <a
                                href="/contato"
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
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
