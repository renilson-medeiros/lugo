import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Home,
  MapPin,
  DollarSign,
  Settings2,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface PropertyFormData {
  // Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Informações do imóvel
  title: string;
  type: string;
  rooms: string[];
  maxPeople: string;
  acceptsPets: boolean;
  hasGarage: boolean;
  acceptsChildren: boolean;
  
  // Valores
  rentValue: string;
  condoValue: string;
  iptuValue: string;
  serviceValue: string;
  
  // Inclusões
  includesWater: boolean;
  includesElectricity: boolean;
  includesInternet: boolean;
  includesGas: boolean;
  
  // Observações
  observations: string;
}

const initialFormData: PropertyFormData = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  title: "",
  type: "apartamento",
  rooms: ["Sala", "Cozinha", "Banheiro", "Quarto"],
  maxPeople: "",
  acceptsPets: false,
  hasGarage: false,
  acceptsChildren: true,
  rentValue: "",
  condoValue: "",
  iptuValue: "",
  serviceValue: "",
  includesWater: false,
  includesElectricity: false,
  includesInternet: false,
  includesGas: false,
  observations: "",
};

const propertyTypes = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "kitnet", label: "Kitnet" },
  { value: "studio", label: "Studio" },
  { value: "cobertura", label: "Cobertura" },
  { value: "comercial", label: "Comercial" },
];

export default function PropertyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [newRoom, setNewRoom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos(prev => [...prev, ...newPhotos]);
      
      newPhotos.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotosPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addRoom = () => {
    if (newRoom.trim() && !formData.rooms.includes(newRoom.trim())) {
      handleInputChange("rooms", [...formData.rooms, newRoom.trim()]);
      setNewRoom("");
    }
  };

  const removeRoom = (room: string) => {
    handleInputChange("rooms", formData.rooms.filter(r => r !== room));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Imóvel cadastrado com sucesso!", {
      description: "Você pode compartilhar o link do imóvel.",
    });
    
    navigate("/dashboard/imoveis");
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const formatted = (parseInt(numbers) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return numbers ? formatted : "";
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
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Novo Imóvel</h1>
            <p className="text-muted-foreground">Preencha as informações do imóvel</p>
          </div>
        </div>

        {/* Endereço */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Endereço</CardTitle>
            </div>
            <CardDescription>Localização completa do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  maxLength={9}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  placeholder="Nome da rua"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  placeholder="123"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Apto 101"
                  value={formData.complement}
                  onChange={(e) => handleInputChange("complement", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Centro"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="São Paulo"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  maxLength={2}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Imóvel */}
        <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Informações do Imóvel</CardTitle>
            </div>
            <CardDescription>Detalhes e características</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="title">Título do anúncio</Label>
                <Input
                  id="title"
                  placeholder="Ex: Apartamento Centro"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo do imóvel</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPeople">Máximo de pessoas</Label>
                <Input
                  id="maxPeople"
                  type="number"
                  placeholder="4"
                  min="1"
                  value={formData.maxPeople}
                  onChange={(e) => handleInputChange("maxPeople", e.target.value)}
                />
              </div>
            </div>

            {/* Fotos */}
            <div className="space-y-3">
              <Label>Fotos do imóvel</Label>
              <div className="flex flex-wrap gap-3">
                {photosPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Foto ${index + 1}`}
                      className="h-24 w-24 rounded-lg object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="photos"
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Upload className="h-6 w-6" aria-hidden="true" />
                  <span className="mt-1 text-xs">Adicionar</span>
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Cômodos */}
            <div className="space-y-3">
              <Label>Cômodos</Label>
              <div className="flex flex-wrap gap-2">
                {formData.rooms.map((room) => (
                  <span
                    key={room}
                    className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm"
                  >
                    {room}
                    <button
                      type="button"
                      onClick={() => removeRoom(room)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remover ${room}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar cômodo"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRoom())}
                  className="max-w-xs"
                />
                <Button type="button" variant="outline" size="icon" onClick={addRoom} aria-label="Adicionar cômodo">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Regras */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <Label htmlFor="acceptsPets" className="cursor-pointer">Aceita animais</Label>
                <Switch
                  id="acceptsPets"
                  checked={formData.acceptsPets}
                  onCheckedChange={(checked) => handleInputChange("acceptsPets", checked)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <Label htmlFor="hasGarage" className="cursor-pointer">Possui garagem</Label>
                <Switch
                  id="hasGarage"
                  checked={formData.hasGarage}
                  onCheckedChange={(checked) => handleInputChange("hasGarage", checked)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <Label htmlFor="acceptsChildren" className="cursor-pointer">Aceita crianças</Label>
                <Switch
                  id="acceptsChildren"
                  checked={formData.acceptsChildren}
                  onCheckedChange={(checked) => handleInputChange("acceptsChildren", checked)}
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
            <CardDescription>Custos mensais do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <Label htmlFor="serviceValue">Taxa de serviço</Label>
                <Input
                  id="serviceValue"
                  placeholder="R$ 0,00"
                  value={formData.serviceValue}
                  onChange={(e) => handleInputChange("serviceValue", formatCurrency(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            {/* Inclusões */}
            <div>
              <Label className="mb-3 block">Incluso no valor</Label>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="includesWater" className="cursor-pointer">Água</Label>
                  <Switch
                    id="includesWater"
                    checked={formData.includesWater}
                    onCheckedChange={(checked) => handleInputChange("includesWater", checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="includesElectricity" className="cursor-pointer">Luz</Label>
                  <Switch
                    id="includesElectricity"
                    checked={formData.includesElectricity}
                    onCheckedChange={(checked) => handleInputChange("includesElectricity", checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="includesInternet" className="cursor-pointer">Internet</Label>
                  <Switch
                    id="includesInternet"
                    checked={formData.includesInternet}
                    onCheckedChange={(checked) => handleInputChange("includesInternet", checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <Label htmlFor="includesGas" className="cursor-pointer">Gás</Label>
                  <Switch
                    id="includesGas"
                    checked={formData.includesGas}
                    onCheckedChange={(checked) => handleInputChange("includesGas", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              <CardTitle>Observações</CardTitle>
            </div>
            <CardDescription>Informações adicionais que deseja compartilhar</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="observations"
              placeholder="Ex: Condomínio possui academia, piscina e salão de festas. Portaria 24h."
              value={formData.observations}
              onChange={(e) => handleInputChange("observations", e.target.value)}
              rows={4}
            />
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
            {isSubmitting ? "Salvando..." : "Cadastrar imóvel"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
