import CheckoutClient from "./CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout | Lugo",
    description: "Finalize sua assinatura do Plano Profissional",
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}
