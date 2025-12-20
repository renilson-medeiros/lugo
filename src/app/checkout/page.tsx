import Checkout from "@/modules/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout | Alugue Fácil",
    description: "Finalize sua assinatura do Plano Profissional",
};

export default function CheckoutPage() {
    return <Checkout />;
}
