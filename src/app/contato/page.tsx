import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contato | Lugo",
    description: "Entre em contato com a equipe do Lugo para suporte, dúvidas ou sugestões.",
};

export default function ContactPage() {
    return <ContactClient />;
}
