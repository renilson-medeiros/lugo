import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Upload,
  X,
  User,
  Calendar,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface TenantFormData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  rentDay: string;
  startDate: string;
  endDate: string;
}

const initialFormData: TenantFormData = {
  name: "",
  cpf: "",
  phone: "",
  email: "",
  rentDay: "",
  startDate: "",
  endDate: "",
};

export default function TenantForm() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [formData, setFormData] = useState<TenantFormData>(initialFormData);
  const [contractPhotos, setContractPhotos] = useState<File[]>([]);
  const [contractPreviews, setContractPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Inquilino cadastrado com sucesso!", {
      description: "O inquilino foi vinculado ao imóvel.",
    });
    
    navigate("/dashboard/inquilinos");
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard/imoveis">
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Cadastrar Inquilino</h1>
            <p className="text-muted-foreground">Preencha os dados do inquilino</p>
          </div>
        </div>

        {/* Dados Pessoais */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
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
              <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Dados do Contrato</CardTitle>
            </div>
            <CardDescription>Período de locação e vencimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rentDay">Dia do pagamento</Label>
                <Input
                  id="rentDay"
                  type="number"
                  placeholder="10"
                  min="1"
                  max="31"
                  value={formData.rentDay}
                  onChange={(e) => handleInputChange("rentDay", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Dia do mês para pagamento do aluguel</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de entrada</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de saída</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Pode ser alterada em caso de renovação</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contrato */}
        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
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
          <Link to="/dashboard/imoveis">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Salvando..." : "Cadastrar inquilino"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
