import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  ArrowLeft,
  Upload,
  X,
  User,
  Calendar,
  FileText,
  Building2,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface TenantFormData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  rentDay: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  rentValue: string;
}

const initialFormData: TenantFormData = {
  name: "",
  cpf: "",
  phone: "",
  email: "",
  rentDay: "10",
  startDate: undefined,
  endDate: undefined,
  rentValue: "",
};

interface PropertyData {
  id: string;
  titulo: string;
  endereco_rua: string;
  endereco_numero: string;
  valor_aluguel: number;
}

export default function TenantForm() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id || params?.propertyId;
  const [formData, setFormData] = useState<TenantFormData>(initialFormData);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [contractPhotos, setContractPhotos] = useState<File[]>([]);
  const [contractPreviews, setContractPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);

  useEffect(() => {
    if (propertyId) {
      loadPropertyDetails();
    }
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setIsLoadingProperty(true);
      const { data, error } = await supabase
        .from('imoveis')
        .select('id, titulo, endereco_rua, endereco_numero, valor_aluguel')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      if (data) {
        setProperty(data);
        // Pre-preencher o valor do aluguel se estiver disponível com máscara
        setFormData(prev => ({
          ...prev,
          rentValue: formatCurrency((data.valor_aluguel * 100).toString())
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do imóvel:', error);
      toast.error('Erro ao carregar detalhes do imóvel');
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const handleInputChange = (field: keyof TenantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2")
      .slice(0, 15);
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

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setContractPhotos(prev => [...prev, ...newPhotos]);

      newPhotos.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setContractPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeContractPhoto = (index: number) => {
    setContractPhotos(prev => prev.filter((_, i) => i !== index));
    setContractPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) return;

    setIsSubmitting(true);

    try {
      // 1. Inserir o inquilino
      const rentAmount = parseFloat(formData.rentValue.replace(/\D/g, "")) / 100 || 0;

      const { data: tenant, error: tenantError } = await supabase
        .from('inquilinos')
        .insert({
          imovel_id: propertyId,
          nome_completo: formData.name,
          cpf: formData.cpf.replace(/\D/g, ""),
          telefone: formData.phone.replace(/\D/g, ""),
          email: formData.email,
          dia_vencimento: parseInt(formData.rentDay),
          data_inicio: formData.startDate?.toISOString().split('T')[0],
          data_fim: formData.endDate?.toISOString().split('T')[0],
          valor_aluguel: rentAmount,
          status: 'ativo'
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // 2. Atualizar o status do imóvel para 'alugado'
      const { error: propertyError } = await supabase
        .from('imoveis')
        .update({ status: 'alugado' })
        .eq('id', propertyId);

      if (propertyError) throw propertyError;

      toast.success("Inquilino cadastrado com sucesso!", {
        description: "O inquilino foi vinculado ao imóvel.",
      });

      router.push("/dashboard/inquilinos");
    } catch (error: any) {
      console.error('Erro ao cadastrar inquilino:', error);
      toast.error('Erro ao cadastrar inquilino', {
        description: error.message || 'Ocorreu um erro inesperado.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Cadastrar Inquilino</h1>
            <p className="text-muted-foreground">Preencha os dados do inquilino</p>
          </div>
        </div>

        {/* Imóvel Selecionado */}
        <Card className="animate-fade-in border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <CardTitle className="text-lg">Imóvel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProperty ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando dados do imóvel...</span>
              </div>
            ) : property ? (
              <div className="space-y-1">
                <p className="font-medium">{property.titulo || `${property.endereco_rua}, ${property.endereco_numero}`}</p>
                <p className="text-sm text-muted-foreground">{property.endereco_rua}, {property.endereco_numero}</p>
              </div>
            ) : (
              <p className="text-sm text-destructive">Imóvel não encontrado. Certifique-se de que o ID é válido.</p>
            )}
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card className="animate-fade-in" style={{ animationDelay: "50ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <CardTitle>Dados Pessoais</CardTitle>
            </div>
            <CardDescription>Informações do inquilino</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Nome do inquilino"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", formatCPF(e.target.value))}
                  maxLength={14}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                  maxLength={15}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Contrato */}
        <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <CardTitle>Dados do Contrato</CardTitle>
            </div>
            <CardDescription>Período de locação e vencimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="rentValue">Valor do Aluguel</Label>
                <Input
                  id="rentValue"
                  placeholder="R$ 0,00"
                  value={formData.rentValue}
                  onChange={(e) => handleInputChange("rentValue", formatCurrency(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentDay">Dia do pagamento</Label>
                <Select
                  value={formData.rentDay}
                  onValueChange={(value) => handleInputChange("rentDay", value)}
                >
                  <SelectTrigger id="rentDay">
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={parseInt(day).toString()}>
                        Dia {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de entrada</Label>
                <DatePicker
                  date={formData.startDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  placeholder="Selecione a data de entrada"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de saída</Label>
                <DatePicker
                  date={formData.endDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  placeholder="Selecione a data de saída"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contrato */}
        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <CardTitle>Contrato Assinado</CardTitle>
            </div>
            <CardDescription>Upload opcional de fotos do contrato assinado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {contractPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Contrato ${index + 1}`}
                    className="h-32 w-32 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeContractPhoto(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remover foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label
                htmlFor="contract"
                className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Upload className="h-8 w-8" aria-hidden="true" />
                <span className="mt-2 text-xs text-center px-2">Adicionar foto do contrato</span>
                <input
                  id="contract"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleContractUpload}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Este campo é opcional. Você pode adicionar fotos do contrato assinado posteriormente.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/dashboard/imoveis">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 hover:bg-blue-400 sm:w-auto">
            {isSubmitting ? "Salvando..." : "Cadastrar inquilino"}
          </Button>
        </div>
      </form>
    </>
  );
}
