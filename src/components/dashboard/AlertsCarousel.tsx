"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface DashboardAlert {
    id: string;
    tenantName: string;
    propertyName: string;
    dueDate: number;
    type: 'upcoming' | 'overdue';
    amount: number;
}

interface AlertsCarouselProps {
    alerts: DashboardAlert[];
}

export default function AlertsCarousel({ alerts }: AlertsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (alerts.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-tertiary" />
                        Avisos e Pendências
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center mb-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700">Tudo em dia!</p>
                        <p className="text-xs text-muted-foreground px-4 mt-1">
                            Nenhuma pendência ou vencimento próximo no momento.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-tertiary" />
                    Avisos e Pendências
                </CardTitle>
                {alerts.length > 1 && (
                    <div className="flex gap-1">
                        <button
                            onClick={scrollPrev}
                            className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                            aria-label="Aviso anterior"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                            aria-label="Próximo aviso"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex-[0_0_100%] min-w-0 px-1">
                                <Link href="/dashboard/inquilinos">
                                    <div
                                        className={cn(
                                            "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                                            alert.type === 'overdue'
                                                ? "bg-red-50 border-red-100 hover:bg-red-100/50"
                                                : "bg-amber-50 border-amber-100 hover:bg-amber-100/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                            alert.type === 'overdue' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                                        )}>
                                            {alert.type === 'overdue' ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={cn(
                                                "text-sm font-semibold truncate",
                                                alert.type === 'overdue' ? "text-red-900" : "text-amber-900"
                                            )}>
                                                {alert.type === 'overdue' ? 'Aluguel Atrasado' : 'Vencendo em breve'}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {alert.tenantName} • {alert.propertyName}
                                            </p>
                                            <p className={cn(
                                                "text-[10px] font-medium mt-1 uppercase",
                                                alert.type === 'overdue' ? "text-red-700" : "text-amber-700"
                                            )}>
                                                Vence dia {alert.dueDate} • {alert.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {alerts.length > 1 && (
                        <div className="flex justify-center gap-1.5 mt-3">
                            {alerts.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-300",
                                        index === selectedIndex
                                            ? "w-4 bg-tertiary"
                                            : "w-1 bg-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
