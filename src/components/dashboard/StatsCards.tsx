"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import {
    Users,
    Home,
    FileText,
    Building2,
    Receipt
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

interface StatsCardsProps {
    stats: {
        totalImoveis: number;
        inquilinosAtivos: number;
        comprovantesGerados: number;
    }
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const statsData = [
        { 
            label: "Imóveis cadastrados", 
            value: stats.totalImoveis.toString(), 
            icon: Building2, 
            href: "/dashboard/imoveis" 
        },
        { 
            label: "Inquilinos ativos", 
            value: stats.inquilinosAtivos.toString(), 
            icon: Users, 
            href: "/dashboard/inquilinos" 
        },
        { 
            label: "Comprovantes gerados", 
            value: stats.comprovantesGerados.toString(), 
            icon: Receipt, 
            href: "/dashboard/comprovantes" 
        },
    ];

    const [api, setApi] = React.useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(true);

    React.useEffect(() => {
        if (!api) return;

        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());

        api.on("select", () => {
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        });
    }, [api]);

    return (
        <>
            {/* Desktop View: Grid Layout */}
            <div className="hidden md:grid gap-4 w-full grid-cols-3">
                {statsData.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <Card className="group transition-all duration-300 hover:border-tertiary/30 h-full">
                            <CardContent className="flex flex-col items-start gap-4 p-4 sm:p-6">
                                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-tertiary/10">
                                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="font-display text-xl sm:text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Mobile View: Carousel Layout */}
            <div className="md:hidden relative w-full">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {statsData.map((stat) => (
                            <CarouselItem key={stat.label} className="pl-4 basis-[85%]">
                                <Link href={stat.href} className="h-full block">
                                    <Card className="group transition-all duration-300 hover:border-tertiary/30 h-full">
                                        <CardContent className="flex flex-col items-start gap-4 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-tertiary/10">
                                                <stat.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                                <p className="font-display text-xl font-bold">{stat.value}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Mobile Gradient Masks */}
                <div 
                    className={cn(
                        "absolute top-0 left-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 bg-linear-to-r from-card to-transparent",
                        !canScrollNext && canScrollPrev ? "opacity-100" : "opacity-0"
                    )} 
                />
                <div 
                    className={cn(
                        "absolute top-0 right-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 bg-linear-to-l from-card to-transparent",
                        canScrollNext ? "opacity-100" : "opacity-0"
                    )} 
                />
            </div>
        </>
    );
}
