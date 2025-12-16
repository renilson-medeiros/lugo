import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  Plus, 
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Building2
} from "lucide-react";
import { useState } from "react";

const mockReceipts = [
  {
    id: "1",
    tenant: "João Silva",
    property: "Apartamento Centro",
    amount: 2500,
    date: "2024-12-10",
    reference: "Dezembro/2024",
    status: "pago"
  },
  {
    id: "2",
    tenant: "Maria Santos",
    property: "Kitnet Zona Sul",
    amount: 1200,
    date: "2024-12-05",
    reference: "Dezembro/2024",
    status: "pago"
  },
  {
    id: "3",
    tenant: "João Silva",
    property: "Apartamento Centro",
    amount: 2500,
    date: "2024-11-10",
    reference: "Novembro/2024",
    status: "pago"
  },
  {
    id: "4",
    tenant: "Maria Santos",
    property: "Kitnet Zona Sul",
    amount: 1200,
    date: "2024-11-05",
    reference: "Novembro/2024",
    status: "pago"
  },
];

export default function ReceiptsList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReceipts = mockReceipts.filter(
    (receipt) =>
      receipt.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Comprovantes</h1>
            <p className="text-muted-foreground">Histórico de comprovantes de pagamento</p>
          </div>
          <Link to="/dashboard/comprovantes/novo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo comprovante
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Buscar comprovante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Buscar comprovante"
          />
        </div>

        {/* Receipts List */}
        {filteredReceipts.length > 0 ? (
          <div className="grid gap-4">
            {filteredReceipts.map((receipt, index) => (
              <Card 
                key={receipt.id} 
                className="transition-all duration-300 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                        <Receipt className="h-6 w-6 text-success" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold">{receipt.reference}</h3>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {receipt.status === "pago" ? "Pago" : "Pendente"}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" aria-hidden="true" />
                            <span>{receipt.tenant}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" aria-hidden="true" />
                            <span>{receipt.property}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            <span>{new Date(receipt.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <p className="font-display text-xl font-bold text-primary">
                        R$ {receipt.amount.toLocaleString('pt-BR')}
                      </p>
                      <div className="flex items-center gap-1">
                        <Link to={`/dashboard/comprovantes/${receipt.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver comprovante">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Baixar comprovante">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Receipt className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Nenhum comprovante encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Tente buscar com outros termos"
                  : "Gere comprovantes de pagamento para seus inquilinos"}
              </p>
              {!searchQuery && (
                <Link to="/dashboard/comprovantes/novo" className="mt-4">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Gerar comprovante
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
