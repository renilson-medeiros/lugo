"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from "lucide-react";
import { cn } from "@/lib/utils";

interface OccupancyRateCardProps {
    rate: number;
    className?: string;
}

export default function OccupancyRateCard({ rate, className }: OccupancyRateCardProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <ChartPie className="h-4 w-4 text-tertiary" />
                    Taxa de Ocupação
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{rate}%</span>
                    <span className="text-sm text-muted-foreground mb-1">dos imóveis alugados</span>
                </div>
                <div className="mt-4 h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div
                        className="h-full bg-tertiary rounded-full transition-all duration-500"
                        style={{ width: `${rate}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
