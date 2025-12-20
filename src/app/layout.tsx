import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
    title: {
        default: "Lugo - Gestão Inteligente de Imóveis",
        template: "%s | Lugo",
    },
    description: "A plataforma completa para proprietários gerenciarem aluguéis, inquilinos e comprovantes com praticidade, segurança e profissionalismo.",
    keywords: [
        "gestão de imóveis",
        "aluguel de imóveis",
        "gerenciamento de inquilinos",
        "comprovante de aluguel",
        "contrato de locação",
        "proprietário",
        "lugo",
        "sistema imobiliário"
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
        url: "https://lugo.vercel.app",
        siteName: "Lugo",
        title: "Lugo - Gestão Inteligente de Imóveis",
        description: "Simplifique a administração dos seus aluguéis com o Lugo.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Lugo - Preview",
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
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
