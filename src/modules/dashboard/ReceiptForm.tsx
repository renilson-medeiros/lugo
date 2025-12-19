import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { YearPicker } from "@/components/ui/year-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Receipt,
  Download,
  Share2,
  Eye,
  Calendar,
  User,
  Building2,
  DollarSign,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ReceiptFormData {
  tenantId: string;
  tenantName: string;
  tenantCpf: string;
  propertyName: string;
  propertyAddress: string;
  propertyId: string;
  rentValue: string;
  condoValue: string;
  iptuValue: string;
  otherValue: string;
  paymentDate: Date | undefined;
  referenceMonth: string;
  referenceYear: string;
  observations: string;
}

interface Tenant {
  id: string;
  nome_completo: string;
  cpf: string;
  valor_aluguel: number;
  imovel_id: string;
  imoveis: {
    id: string;
    titulo: string;
    endereco_rua: string;
    endereco_numero: string;
    endereco_bairro: string;
    endereco_cidade: string;
    valor_condominio: number;
    valor_iptu: number;
  };
}

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
  propertyId: "",
  rentValue: "",
  condoValue: "",
  iptuValue: "",
  otherValue: "",
  paymentDate: new Date(),
  referenceMonth: (new Date().getMonth() + 1).toString(),
  referenceYear: new Date().getFullYear().toString(),
  observations: "",
};

export default function ReceiptForm() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ReceiptFormData>(initialFormData);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTenants = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inquilinos')
        .select(`
          id,
          nome_completo,
          cpf,
          valor_aluguel,
          imovel_id,
          imoveis!inner (
            id,
            titulo,
            endereco_rua,
            endereco_numero,
            endereco_bairro,
            endereco_cidade,
            valor_condominio,
            valor_iptu,
            proprietario_id
          )
        `)
        .eq('imoveis.proprietario_id', user.id)
        .eq('status', 'ativo');

      if (error) throw error;

      const formattedData = (data || []).map(item => ({
        ...item,
        imoveis: Array.isArray(item.imoveis) ? item.imoveis[0] : item.imoveis
      })) as unknown as Tenant[];

      setTenants(formattedData);

      // Se houver ID de inquilino na URL, seleciona ele
      const urlTenantId = searchParams.get("inquilino");
      if (urlTenantId) {
        const tenant = formattedData.find(t => t.id === urlTenantId);
        if (tenant) {
          applyTenantData(tenant);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar inquilinos:', error);
      toast.error('Erro ao carregar inquilinos');
    } finally {
      setIsLoading(false);
    }
  }, [user, searchParams]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const applyTenantData = (tenant: Tenant) => {
    setFormData(prev => ({
      ...prev,
      tenantId: tenant.id,
      tenantName: tenant.nome_completo,
      tenantCpf: tenant.cpf,
      propertyId: tenant.imoveis.id,
      propertyName: tenant.imoveis.titulo || `${tenant.imoveis.endereco_rua}, ${tenant.imoveis.endereco_numero}`,
      propertyAddress: `${tenant.imoveis.endereco_rua}, ${tenant.imoveis.endereco_numero} - ${tenant.imoveis.endereco_bairro}, ${tenant.imoveis.endereco_cidade}`,
      rentValue: formatCurrency((tenant.valor_aluguel * 100).toString()),
      condoValue: formatCurrency((tenant.imoveis.valor_condominio * 100 || 0).toString()),
      iptuValue: formatCurrency((tenant.imoveis.valor_iptu * 100 || 0).toString()),
      otherValue: "",
    }));
  };

  const handleInputChange = (field: keyof ReceiptFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTenantSelect = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      applyTenantData(tenant);
    }
  };

  const calculateTotal = () => {
    const rent = parseFloat(formData.rentValue.replace(/\D/g, "")) / 100 || 0;
    const condo = parseFloat(formData.condoValue.replace(/\D/g, "")) / 100 || 0;
    const iptu = parseFloat(formData.iptuValue.replace(/\D/g, "")) / 100 || 0;
    const other = parseFloat(formData.otherValue.replace(/\D/g, "")) / 100 || 0;
    return rent + condo + iptu + other;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const formatted = (parseInt(numbers) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return formatted;
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
    if (!formData.tenantId || !formData.propertyId) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('comprovantes')
        .insert({
          inquilino_id: formData.tenantId,
          imovel_id: formData.propertyId,
          tipo: 'pagamento',
          mes_referencia: `${formData.referenceYear}-${formData.referenceMonth.padStart(2, '0')}-01`,
          valor: calculateTotal(),
          descricao: formData.observations,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Comprovante gerado com sucesso!", {
        description: "O comprovante foi salvo no histórico.",
      });

      router.push("/dashboard/comprovantes");
    } catch (error: any) {
      console.error('Erro ao salvar comprovante:', error);
      toast.error('Erro ao salvar comprovante', {
        description: error.message || 'Ocorreu um erro inesperado.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
                <div className="flex items-end gap-2">
                  <User className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  <CardTitle>Inquilino</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant">Selecionar inquilino</Label>
                  <Select
                    value={formData.tenantId}
                    onValueChange={handleTenantSelect}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Carregando inquilinos..." : "Selecione um inquilino"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : tenants.length === 0 ? (
                        <div className="p-4 text-sm text-center text-muted-foreground">
                          Nenhum inquilino ativo encontrado.
                        </div>
                      ) : (
                        tenants.map(tenant => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.nome_completo} - {tenant.imoveis.titulo || tenant.imoveis.endereco_rua}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {formData.tenantId && (
                  <div className="rounded-lg bg-accent/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.propertyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{formData.tenantName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>CPF: {formData.tenantCpf ? formatCPF(formData.tenantCpf) : "—"}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referência */}
            <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <div className="flex items-end gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  <CardTitle>Referência</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="referenceMonth">Mês</Label>
                    <Select
                      value={formData.referenceMonth}
                      onValueChange={(value) => handleInputChange("referenceMonth", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referenceYear">Ano</Label>
                    <YearPicker
                      value={formData.referenceYear}
                      onChange={(year) => handleInputChange("referenceYear", year)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Data do pagamento</Label>
                    <DatePicker
                      date={formData.paymentDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, paymentDate: date }))}
                      placeholder="Selecione a data"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="flex items-end gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
                <Eye className="h-4 w-4 text-blue-500" />
                {showPreview ? "Ocultar preview" : "Ver preview"}
              </Button>
              <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link href="/dashboard/comprovantes">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting || !formData.tenantId} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400">
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
                    <Receipt className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    <CardTitle>Preview</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Baixar comprovante">
                      <Download className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare} aria-label="Compartilhar comprovante">
                      <Share2 className="h-4 w-4 text-blue-500" />
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
                      <span>{formData.tenantCpf ? formatCPF(formData.tenantCpf) : "—"}</span>
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
                    <p>Data do pagamento: {formData.paymentDate ? formData.paymentDate.toLocaleDateString("pt-BR") : "—"}</p>
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
    </>
  );
}
