import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, CreditCard, Calendar, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [userData, setUserData] = useState({
    name: "Carlos Proprietário",
    email: "carlos@email.com",
    phone: "(11) 99999-9999"
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <User className="h-5 w-5" aria-hidden="true" />
              Dados pessoais
            </CardTitle>
            <CardDescription>
              Informações da sua conta de proprietário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleSave}>Salvar alterações</Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              Assinatura
            </CardTitle>
            <CardDescription>
              Detalhes do seu plano atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Plano Mensal</span>
                  <Badge className="bg-success text-success-foreground">Ativo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  R$ 30,00/mês • Próxima cobrança em 15/01/2025
                </p>
              </div>
              <Button variant="outline">Gerenciar assinatura</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Bell className="h-5 w-5" aria-hidden="true" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como deseja receber alertas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembrete de pagamento</p>
                  <p className="text-sm text-muted-foreground">Receba alertas quando o dia do pagamento se aproximar</p>
                </div>
                <Button variant="outline" size="sm">Ativado</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novos contatos</p>
                  <p className="text-sm text-muted-foreground">Seja notificado quando alguém visualizar seu imóvel</p>
                </div>
                <Button variant="outline" size="sm">Desativado</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="font-display text-destructive">Zona de perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Cancelar assinatura</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
