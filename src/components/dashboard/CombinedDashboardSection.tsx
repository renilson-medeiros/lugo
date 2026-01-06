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
import { Building2, TrendingUp, ChartPie, Info } from "lucide-react";
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
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-premium bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4 space-y-0 flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-display font-semibold tracking-tight">
                        {view === "revenue" ? "Visão Financeira" : "Ocupação dos Imóveis"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                        {view === "revenue" 
                            ? "Receita bruta dos últimos 6 meses" 
                            : `${occupancyData.total} imóveis cadastrados`}
                    </p>
                </div>
                <Select
                    value={view}
                    onValueChange={(v) => setView(v as "revenue" | "occupancy")}
                >
                    <SelectTrigger className="w-[140px] bg-background/50 border-blue-100/20 active:scale-95 transition-transform">
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
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Receita este mês</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold font-display">
                                    R$ {currentMonthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    +12.5%
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
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Taxa de Ocupação</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold font-display text-blue-600 tracking-tighter">
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
                            <div className="h-4 w-full flex rounded-full overflow-hidden bg-accent/50 p-1 gap-1">
                                {occupancyData.alugado > 0 && (
                                    <div 
                                        className="h-full bg-blue-600 rounded-l-full transition-all duration-1000 ease-out"
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
                                        className="h-full bg-slate-200 rounded-r-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(occupancyData.disponivel / occupancyData.total) * 100}%` }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Lista de Alocação conforme Inspiração */}
                        <div className="grid gap-4 pt-4">
                            <StatusItem 
                                label="Alugado" 
                                count={occupancyData.alugado} 
                                total={occupancyData.total}
                                color="bg-blue-600"
                                desc="Contratos ativos e gerando receita"
                                icon={Building2}
                            />
                            <StatusItem 
                                label="Manutenção" 
                                count={occupancyData.manutencao} 
                                total={occupancyData.total}
                                color="bg-orange-400"
                                desc="Imóveis em reforma ou reparos"
                                icon={Info}
                            />
                            <StatusItem 
                                label="Livre" 
                                count={occupancyData.disponivel} 
                                total={occupancyData.total}
                                color="bg-slate-200"
                                desc="Disponível para novos inquilinos"
                                icon={ChartPie}
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
        <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm", color, color === "bg-slate-200" ? "text-slate-600" : "text-white")}>
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
