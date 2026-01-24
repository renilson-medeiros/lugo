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

interface FAQ {
    question: string;
    answer: string;
}

export default function FAQPageClient({ faqs }: { faqs: FAQ[] }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="container px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent text-tertiary mx-auto mb-6">
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
                                    className="bg-background hover:bg-tertiary/5 transition-colors border border-border hover:border-tertiary rounded-lg px-6"
                                >
                                    <AccordionTrigger className="text-left cursor-pointer font-semibold hover:no-underline hover:text-tertiary py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="mt-16 p-8 bg-primary/5 rounded-lg border border-primary text-center">
                            <h3 className="font-bold text-primary mb-2">Ainda tem dúvidas?</h3>
                            <p className="text-primary/80 mb-6">Estamos aqui para ajudar você a ter a melhor experiência possível.</p>
                            <a
                                href="/contato"
                                className="inline-flex items-center justify-center rounded-md bg-tertiary px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-tertiary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tertiary"
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
