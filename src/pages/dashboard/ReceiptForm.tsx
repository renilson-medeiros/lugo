import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Receipt,
  Download,
  Share2,
  Eye,
  Calendar,
  User,
  Building2,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface ReceiptFormData {
  tenantId: string;
  tenantName: string;
  tenantCpf: string;
  propertyName: string;
  propertyAddress: string;
  rentValue: string;
  condoValue: string;
  iptuValue: string;
  otherValue: string;
  paymentDate: string;
  referenceMonth: string;
  referenceYear: string;
  observations: string;
}

const mockTenants = [
  {
    id: "1",
    name: "João Silva",
    cpf: "123.456.789-00",
    property: "Apartamento Centro",
    propertyAddress: "Rua das Flores, 123 - Centro, São Paulo",
    rentValue: "2500"
  },
  {
    id: "2",
    name: "Maria Santos",
    cpf: "987.654.321-00",
    property: "Kitnet Zona Sul",
    propertyAddress: "Rua Augusta, 789 - Consolação, São Paulo",
    rentValue: "1200"
  },
];

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const initialFormData: ReceiptFormData = {
  tenantId: "",
  tenantName: "",
  tenantCpf: "",
  propertyName: "",
  propertyAddress: "",
  rentValue: "",
  condoValue: "",
  iptuValue: "",
  otherValue: "",
  paymentDate: new Date().toISOString().split('T')[0],
  referenceMonth: (new Date().getMonth() + 1).toString(),
  referenceYear: new Date().getFullYear().toString(),
  observations: "",
};

export default function ReceiptForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ReceiptFormData>(() => {
    const tenantId = searchParams.get("inquilino");
    if (tenantId) {
      const tenant = mockTenants.find(t => t.id === tenantId);
      if (tenant) {
        return {
          ...initialFormData,
          tenantId: tenant.id,
          tenantName: tenant.name,
          tenantCpf: tenant.cpf,
          propertyName: tenant.property,
          propertyAddress: tenant.propertyAddress,
          rentValue: tenant.rentValue,
        };
      }
    }
    return initialFormData;
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ReceiptFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTenantSelect = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (tenant) {
      setFormData(prev => ({
        ...prev,
        tenantId: tenant.id,
        tenantName: tenant.name,
        tenantCpf: tenant.cpf,
        propertyName: tenant.property,
        propertyAddress: tenant.propertyAddress,
        rentValue: tenant.rentValue,
      }));
    }
  };

  const calculateTotal = () => {
    const rent = parseFloat(formData.rentValue.replace(/\D/g, "")) / 100 || 0;
    const condo = parseFloat(formData.condoValue.replace(/\D/g, "")) / 100 || 0;
    const iptu = parseFloat(formData.iptuValue.replace(/\D/g, "")) / 100 || 0;
    const other = parseFloat(formData.otherValue.replace(/\D/g, "")) / 100 || 0;
    return rent + condo + iptu + other;
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const formatted = (parseInt(numbers) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return numbers ? formatted : "";
  };

  const handleDownload = () => {
    toast.success("Comprovante baixado!", {
      description: "O PDF foi salvo no seu dispositivo.",
    });
  };

  const handleShare = () => {
    const text = `Comprovante de Pagamento - ${months[parseInt(formData.referenceMonth) - 1]}/${formData.referenceYear}\nInquilino: ${formData.tenantName}\nValor: R$ ${calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Comprovante de Pagamento",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Texto copiado!", {
        description: "Cole onde desejar para compartilhar.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Comprovante gerado com sucesso!", {
      description: "O comprovante foi salvo no histórico.",
    });
    
    navigate("/dashboard/comprovantes");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard/comprovantes">
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Gerar Comprovante</h1>
            <p className="text-muted-foreground">Crie um comprovante de pagamento</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Inquilino */}
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>Inquilino</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant">Selecionar inquilino</Label>
                  <select
                    id="tenant"
                    value={formData.tenantId}
                    onChange={(e) => handleTenantSelect(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Selecione um inquilino</option>
                    {mockTenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} - {tenant.property}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.tenantId && (
                  <div className="rounded-lg bg-accent/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.tenantName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>CPF: {formData.tenantCpf}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.propertyName}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referência */}
            <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>Referência</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="referenceMonth">Mês</Label>
                    <select
                      id="referenceMonth"
                      value={formData.referenceMonth}
                      onChange={(e) => handleInputChange("referenceMonth", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referenceYear">Ano</Label>
                    <Input
                      id="referenceYear"
                      type="number"
                      value={formData.referenceYear}
                      onChange={(e) => handleInputChange("referenceYear", e.target.value)}
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Data do pagamento</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>Valores</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rentValue">Aluguel</Label>
                    <Input
                      id="rentValue"
                      placeholder="R$ 0,00"
                      value={formData.rentValue}
                      onChange={(e) => handleInputChange("rentValue", formatCurrency(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condoValue">Condomínio</Label>
                    <Input
                      id="condoValue"
                      placeholder="R$ 0,00"
                      value={formData.condoValue}
                      onChange={(e) => handleInputChange("condoValue", formatCurrency(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iptuValue">IPTU</Label>
                    <Input
                      id="iptuValue"
                      placeholder="R$ 0,00"
                      value={formData.iptuValue}
                      onChange={(e) => handleInputChange("iptuValue", formatCurrency(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherValue">Outros</Label>
                    <Input
                      id="otherValue"
                      placeholder="R$ 0,00"
                      value={formData.otherValue}
                      onChange={(e) => handleInputChange("otherValue", formatCurrency(e.target.value))}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-xl font-bold text-primary">
                    R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Ocultar preview" : "Ver preview"}
              </Button>
              <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link to="/dashboard/comprovantes">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting || !formData.tenantId} className="w-full sm:w-auto">
                  {isSubmitting ? "Salvando..." : "Gerar comprovante"}
                </Button>
              </div>
            </div>
          </form>

          {/* Preview */}
          <div className={`${showPreview ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-6 animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" aria-hidden="true" />
                    <CardTitle>Preview</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Baixar comprovante">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare} aria-label="Compartilhar comprovante">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={receiptRef}
                  className="rounded-lg border border-border bg-card p-6 space-y-6"
                >
                  {/* Receipt Header */}
                  <div className="text-center border-b border-border pb-4">
                    <h3 className="font-display text-lg font-bold">COMPROVANTE DE PAGAMENTO</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Referente a {months[parseInt(formData.referenceMonth) - 1]}/{formData.referenceYear}
                    </p>
                  </div>

                  {/* Tenant Info */}
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Inquilino: </span>
                      <span className="font-medium">{formData.tenantName || "—"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">CPF: </span>
                      <span>{formData.tenantCpf || "—"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Imóvel: </span>
                      <span>{formData.propertyName || "—"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Endereço: </span>
                      <span>{formData.propertyAddress || "—"}</span>
                    </p>
                  </div>

                  <Separator />

                  {/* Values */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Aluguel</span>
                      <span>{formData.rentValue || "R$ 0,00"}</span>
                    </div>
                    {formData.condoValue && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Condomínio</span>
                        <span>{formData.condoValue}</span>
                      </div>
                    )}
                    {formData.iptuValue && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">IPTU</span>
                        <span>{formData.iptuValue}</span>
                      </div>
                    )}
                    {formData.otherValue && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Outros</span>
                        <span>{formData.otherValue}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-primary">
                        R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Date */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Data do pagamento: {formData.paymentDate ? new Date(formData.paymentDate + 'T00:00:00').toLocaleDateString("pt-BR") : "—"}</p>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-dashed border-border pt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Comprovante gerado em {new Date().toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
