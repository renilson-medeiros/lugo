"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Paywall() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-500">
            <Card className="max-w-2xl w-full border-blue-600/30 shadow-2xl shadow-blue-100/50 overflow-hidden">
                <div className="bg-blue-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 -translate-y-4 translate-x-4">
                        <Zap size={150} />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-display">Seu período de teste expirou</h2>
                            <p className="text-blue-100 text-sm">Esperamos que tenha gostado da experiência com o Lugo!</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Continue gerenciando seus imóveis por apenas R$ 9,90/mês</h3>
                            <ul className="space-y-3">
                                {[
                                    "Imóveis Ilimitados",
                                    "Gestão completa de inquilinos",
                                    "Geração de comprovantes ilimitados",
                                    "Suporte prioritário via WhatsApp",
                                    "Dados 100% seguros na nuvem"
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Zap className="h-4 w-4 text-blue-600 fill-blue-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Link href="/checkout" className="w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-lg font-bold gap-2 shadow-lg shadow-blue-200">
                                    Assinar agora
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-accent/50 py-3 rounded-lg border border-border/50">
                                <ShieldCheck className="h-4 w-4 text-blue-600" />
                                <span>Ambiente seguro via Asaas</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border/50 text-center">
                        <p className="text-sm text-muted-foreground">
                            Precisa de ajuda com sua conta?{" "}
                            <a href="#" className="text-blue-600 font-semibold hover:underline">Fale com o suporte</a>
                        </p>
                    </div>
                </CardContent>
            </Card>

            <p className="mt-8 text-xs text-muted-foreground">
                Lugo &copy; {new Date().getFullYear()} - Simplificando a gestão de aluguéis.
            </p>
        </div>
    );
}
