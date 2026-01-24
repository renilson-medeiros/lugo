import { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
    title: "Lugo - Gestão Inteligente de Imóveis para Proprietários",
    description: "Administre seus aluguéis sem pagar taxa de imobiliária. Controle total dos seus imóveis, inquilinos e pagamentos por apenas R$ 9,90/mês.",
    keywords: [
        "gestão de aluguel",
        "proprietário direto",
        "aluguel sem imobiliária",
        "controle de imóveis",
        "lugo imóveis",
        "gestão imobiliária barata"
    ],
};

export default function LandingPage() {
    return <LandingPageClient />;
}
