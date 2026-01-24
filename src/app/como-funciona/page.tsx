import { Metadata } from "next";
import ComoFuncionaClient from "./ComoFuncionaClient";

export const metadata: Metadata = {
    title: "Como Funciona | Lugo",
    description: "Saiba como o Lugo ajuda proprietários a gerenciarem seus aluguéis de forma simples e profissional.",
};

export default function ComoFuncionaPage() {
    return <ComoFuncionaClient />;
}
