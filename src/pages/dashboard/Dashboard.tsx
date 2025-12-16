import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Receipt, Plus, ArrowRight, TrendingUp } from "lucide-react";

const stats = [
  { label: "Imóveis cadastrados", value: "3", icon: Building2, href: "/dashboard/imoveis" },
  { label: "Inquilinos ativos", value: "2", icon: Users, href: "/dashboard/inquilinos" },
  { label: "Comprovantes gerados", value: "8", icon: Receipt, href: "/dashboard/comprovantes" },
];

const recentProperties = [
  { id: "1", title: "Apartamento Centro", status: "ocupado", tenant: "João Silva" },
  { id: "2", title: "Casa Jardins", status: "disponível", tenant: null },
  { id: "3", title: "Kitnet Zona Sul", status: "ocupado", tenant: "Maria Santos" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Painel</h1>
            <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo dos seus imóveis.</p>
          </div>
          <Link to="/dashboard/imoveis/novo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo imóvel
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Link key={stat.label} to={stat.href}>
              <Card 
                className="group transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Imóveis recentes</CardTitle>
            <Link to="/dashboard/imoveis">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <Building2 className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.tenant || "Sem inquilino"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      property.status === "ocupado"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {property.status === "ocupado" ? "Ocupado" : "Disponível"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tip */}
        <Card className="border-primary/20 bg-accent/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Dica: Compartilhe seus imóveis</p>
              <p className="text-sm text-muted-foreground">
                Gere links únicos para cada imóvel e compartilhe nas redes sociais para atrair mais inquilinos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
