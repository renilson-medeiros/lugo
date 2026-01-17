"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardDicaCard() {
    const { user } = useAuth();

    const handleShareCatalog = () => {
        if (!user) {
            toast.error("Você precisa estar logado para compartilhar o catálogo.");
            return;
        }
        
        const url = `${window.location.origin}/catalogo/${user.id}`;
        navigator.clipboard.writeText(url);
        toast.success("Link do catálogo copiado!", {
            description: "Compartilhe todos os seus imóveis disponíveis.",
        });
    };

    return (
        <Card className="border-tertiary bg-tertiary">
            <CardContent className="flex flex-col p-6">
                <div className="flex items-start md:items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                        <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-white">Dica: Compartilhe seus imóveis</p>
                        <p className="text-sm text-white/70">
                            Crie links individuais ou compartilhe o catálogo.
                        </p>
                </div>
                </div>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShareCatalog}
                    className="w-full sm:w-auto mt-4 gap-2 border-white/20 text-white bg-white/10 hover:bg-white/20 hover:text-white"
                >
                    <Share2 className="h-4 w-4" />
                    Compartilhar Catálogo
                </Button>
            </CardContent>
        </Card>
    );
}
