import type { Metadata } from "next";

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://lugogestaodeimoveis.com.br"),
    title: {
        default: "Lugo - Gestão Inteligente de Imóveis",
        template: "%s | Lugo",
    },
    description: "Lugo é a plataforma completa para proprietários gerenciarem aluguéis, inquilinos e comprovantes com praticidade, segurança e profissionalismo. Controle total sobre seus imóveis, pagamentos e contratos em um só lugar.",
    keywords: [
        "gestão de imóveis",
        "aluguel de imóveis",
        "gerenciamento de inquilinos",
        "comprovante de aluguel",
        "contrato de locação",
        "proprietário",
        "lugo",
        "sistema imobiliário",
        "administração de imóveis",
        "controle de aluguéis",
        "recibo de aluguel",
        "gestão de locação",
        "software para proprietários",
        "plataforma de imóveis",
        "gerenciar imóveis online",
        "controle financeiro imóveis",
        "cadastro de inquilinos",
        "relatórios de aluguel",
        "organização de imóveis",
        "sistema de locação",
    ],
    authors: [{ name: "Renilson Medeiros" }],
    creator: "Renilson Medeiros",
    publisher: "Lugo",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://lugogestaodeimoveis.com.br",
        siteName: "Lugo",
        title: "Lugo - Gestão Inteligente de Imóveis",
        description: "Simplifique a administração dos seus aluguéis com o Lugo.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Lugo - Gestão Inteligente de Imóveis",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lugo - Gestão Inteligente de Imóveis",
        description: "Simplifique a administração dos seus aluguéis com o Lugo.",
        creator: "@renilson",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
<body className={`${plusJakartaSans.variable} font-sans antialiased`}>
                <GoogleAnalytics />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

