"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Property {
    id: string;
    endereco_rua: string;
    endereco_numero: string;
    status: string;
    inquilino_nome: string | null;
}

interface PropertiesPreviewClientProps {
    properties: Property[];
}

export default function PropertiesPreviewClient({ properties }: PropertiesPreviewClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    const totalPages = Math.ceil(properties.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProperties = properties.slice(startIndex, startIndex + pageSize);

    if (properties.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="font-display text-lg">Seus imóveis recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent mb-4">
                            <Building2 className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium">Nenhum imóvel cadastrado</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Cadastre seu primeiro imóvel para começar.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex bg-tertiary flex-col h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-display text-white text-lg">Seus imóveis recentes</CardTitle>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer bg-white/10 hover:bg-white/20"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-[10px] text-white font-medium min-w-12 text-center">
                            {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer bg-white/10 hover:bg-white/20"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <ChevronRight className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-2">
                <div className="space-y-4 flex-1">
                    {paginatedProperties.map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-3 border border-primary rounded-lg bg-white hover:bg-white/90 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate max-w-[150px] sm:max-w-[200px]">
                                        {property.endereco_rua}, {property.endereco_numero}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {property.inquilino_nome || "Sem inquilino"}
                                    </p>
                                </div>
                            </div>
                            <span className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase shrink-0",
                                property.status === "alugado" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                            )}>
                                {property.status === "alugado" ? "Ocupado" : "Livre"}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
