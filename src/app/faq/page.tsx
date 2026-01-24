import { Metadata } from "next";
import FAQPageClient from "./FAQPageClient";

export const metadata: Metadata = {
    title: "Perguntas Frequentes | Lugo",
    description: "Tire suas dúvidas sobre como gerenciar seus imóveis e inquilinos com o Lugo.",
};

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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FAQPageClient faqs={faqs} />
        </>
    );
}
