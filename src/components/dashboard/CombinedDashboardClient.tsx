"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Building2, TrendingUp, ChartPie, Info, DoorOpen, Wrench, Handshake } from "lucide-react";
import RevenueChart from "./RevenueChart";
import { cn } from "@/lib/utils";

interface RevenueData {
    month: string;
    total: number;
}

interface OccupancyData {
    total: number;
    alugado: number;
    disponivel: number;
    manutencao: number;
    rate: number;
}

interface CombinedDashboardClientProps {
    revenueData: RevenueData[];
    occupancyData: OccupancyData;
}

export default function CombinedDashboardClient({ 
    revenueData, 
    occupancyData 
}: CombinedDashboardClientProps) {
    const [view, setView] = useState<"revenue" | "occupancy">("revenue");

    const currentMonthRevenue = revenueData.length > 0 
        ? revenueData[revenueData.length - 1].total 
        : 0;

    return (
        <Card className="lg:col-span-2 overflow-hidden bg-card backdrop-blur-sm">
            <CardHeader className="pb-4 space-y-0 flex flex-row items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-display font-semibold tracking-tight">
                        {view === "revenue" ? "Visão Financeira" : "Ocupação dos Imóveis"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {view === "revenue" 
                            ? "Receita bruta dos últimos 6 meses" 
                            : `${occupancyData.total} imóveis cadastrados`}
                    </p>
                </div>
                <Select
                    value={view}
                    onValueChange={(v) => setView(v as "revenue" | "occupancy")}
                >
                    <SelectTrigger className="w-[140px] bg-background/50 active:scale-95 transition-transform">
                        <SelectValue placeholder="Selecione a visão" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="revenue">Financeiro</SelectItem>
                        <SelectItem value="occupancy">Ocupação</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="min-h-[420px] flex flex-col justify-between pt-2">
                {view === "revenue" ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Receita este mês</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-bold font-display text-tertiary">
                                    R$ {currentMonthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-2">
                            <RevenueChart data={revenueData} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pt-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Taxa de Ocupação</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-4xl font-bold font-display text-tertiary tracking-tighter">
                                    {occupancyData.rate}%
                                </span>
                                <span className="text-sm text-muted-foreground font-medium">da carteira alugada</span>
                            </div>
                        </div>

                        {/* Barra Segmentada Premium */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
                                <span>Distribuição</span>
                                <span>Total: {occupancyData.total}</span>
                            </div>
                            <div className="h-4 w-full flex rounded-full overflow-hidden bg-primary/5 p-1 gap-0.5">
                                {occupancyData.alugado > 0 && (
                                    <div 
                                        className="h-full bg-tertiary rounded-l-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(occupancyData.alugado / occupancyData.total) * 100}%` }}
                                    />
                                )}
                                {occupancyData.manutencao > 0 && (
                                    <div 
                                        className="h-full bg-orange-400 transition-all duration-1000 ease-out"
                                        style={{ width: `${(occupancyData.manutencao / occupancyData.total) * 100}%` }}
                                    />
                                )}
                                {occupancyData.disponivel > 0 && (
                                    <div 
                                        className="h-full bg-green-600/50 rounded-r-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(occupancyData.disponivel / occupancyData.total) * 100}%` }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Lista de Alocação conforme Inspiração */}
                        <div className="grid gap-4">
                            <StatusItem 
                                label="Alugado" 
                                count={occupancyData.alugado} 
                                total={occupancyData.total}
                                color="bg-primary/10 text-tertiary"
                                desc="Contratos ativos e gerando receita"
                                icon={Handshake}
                            />
                            <StatusItem 
                                label="Manutenção" 
                                count={occupancyData.manutencao} 
                                total={occupancyData.total}
                                color="bg-orange-500/10 text-orange-600 "
                                desc="Imóveis em reforma ou reparos"
                                icon={Wrench}
                            />
                            <StatusItem 
                                label="Livre" 
                                count={occupancyData.disponivel} 
                                total={occupancyData.total}
                                color="bg-green-500/10 text-green-600"
                                desc="Disponível para novos inquilinos"
                                icon={DoorOpen}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function StatusItem({ 
    label, 
    count, 
    total, 
    color, 
    desc,
    icon: Icon 
}: { 
    label: string, 
    count: number, 
    total: number, 
    color: string,
    desc: string,
    icon: any
}) {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{label}</h4>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-foreground">{count}</p>
                <p className="text-xs font-medium text-muted-foreground">{percentage}%</p>
            </div>
        </div>
    );
}
