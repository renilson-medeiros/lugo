// src/pages/dashboard/PropertyForm.tsx
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Home,
  MapPin,
  DollarSign,
  Settings2,
  FileText,
  HousePlusIcon,
  Check,
  Minus,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

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
  rooms: [],
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
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newRoom, setNewRoom] = useState("");
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Carregar dados se estiver editando
  useEffect(() => {
    if (isEditing) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        cep: data.endereco_cep || "",
        street: data.endereco_rua || "",
        number: data.endereco_numero || "",
        complement: data.endereco_complemento || "",
        neighborhood: data.endereco_bairro || "",
        city: data.endereco_cidade || "",
        state: data.endereco_estado || "",
        title: data.titulo || "",
        type: data.tipo || "apartamento",
        rooms: data.comodos || [],
        maxPeople: data.max_pessoas?.toString() || "",
        acceptsPets: data.aceita_pets || false,
        hasGarage: data.tem_garagem || false,
        acceptsChildren: data.aceita_criancas !== false,
        rentValue: data.valor_aluguel ? formatCurrency(data.valor_aluguel.toString()) : "",
        condoValue: data.valor_condominio ? formatCurrency(data.valor_condominio.toString()) : "",
        iptuValue: data.valor_iptu ? formatCurrency(data.valor_iptu.toString()) : "",
        serviceValue: data.valor_taxa_servico ? formatCurrency(data.valor_taxa_servico.toString()) : "",
        includesWater: data.inclui_agua || false,
        includesElectricity: data.inclui_luz || false,
        includesInternet: data.inclui_internet || false,
        includesGas: data.inclui_gas || false,
        observations: data.descricao || "",
      });

      if (data.fotos && data.fotos.length > 0) {
        setExistingPhotos(data.fotos);
      }
    } catch (error) {
      console.error('Erro ao carregar imóvel:', error);
      toast.error('Erro ao carregar dados do imóvel');
      router.push('/dashboard/imoveis');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar endereço por CEP
  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));

      toast.success('Endereço encontrado!');
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);

      // Limitar a 8 fotos
      const totalPhotos = photos.length + newPhotos.length + existingPhotos.length;
      if (totalPhotos > 8) {
        toast.error('Máximo de 8 fotos permitidas');
        return;
      }

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

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addRoom = () => {
    if (newRoom.trim()) {
      const roomText = roomQuantity > 1 ? `${roomQuantity} ${newRoom.trim()}` : newRoom.trim();
      if (!formData.rooms.includes(roomText)) {
        handleInputChange("rooms", [...formData.rooms, roomText]);
        setNewRoom("");
        setRoomQuantity(1);
      }
    }
  };

  const removeRoom = (room: string) => {
    handleInputChange("rooms", formData.rooms.filter(r => r !== room));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload de novas fotos
      const uploadedPhotosUrls: string[] = [];

      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('imoveis-fotos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('imoveis-fotos')
          .getPublicUrl(fileName);

        uploadedPhotosUrls.push(publicUrl);
      }

      // Combinar fotos existentes com as novas
      const allPhotos = [...existingPhotos, ...uploadedPhotosUrls];

      // Validar quantidade de fotos
      if (allPhotos.length < 3) {
        toast.error('Mínimo de 3 fotos necessárias');
        setIsSubmitting(false);
        return;
      }

      if (allPhotos.length > 8) {
        toast.error('Máximo de 8 fotos permitidas');
        setIsSubmitting(false);
        return;
      }

      // Preparar dados para salvar
      const propertyData = {
        proprietario_id: user.id,
        // Endereço
        endereco_cep: formData.cep,
        endereco_rua: formData.street,
        endereco_numero: formData.number,
        endereco_complemento: formData.complement || null,
        endereco_bairro: formData.neighborhood,
        endereco_cidade: formData.city,
        endereco_estado: formData.state,
        // Informações
        titulo: formData.title,
        tipo: formData.type as 'casa' | 'apartamento' | 'comercial' | 'terreno',
        comodos: formData.rooms,
        max_pessoas: formData.maxPeople ? parseInt(formData.maxPeople) : null,
        aceita_pets: formData.acceptsPets,
        tem_garagem: formData.hasGarage,
        aceita_criancas: formData.acceptsChildren,
        // Valores
        valor_aluguel: parseCurrencyToNumber(formData.rentValue),
        valor_condominio: formData.condoValue ? parseCurrencyToNumber(formData.condoValue) : null,
        valor_iptu: formData.iptuValue ? parseCurrencyToNumber(formData.iptuValue) : null,
        valor_taxa_servico: formData.serviceValue ? parseCurrencyToNumber(formData.serviceValue) : null,
        // Inclusões
        inclui_agua: formData.includesWater,
        inclui_luz: formData.includesElectricity,
        inclui_internet: formData.includesInternet,
        inclui_gas: formData.includesGas,
        // Observações
        descricao: formData.observations || null,
        // Fotos
        fotos: allPhotos.length > 0 ? allPhotos : null,
        status: 'disponivel' as 'disponivel' | 'alugado' | 'manutencao',
        // Campos default (pode ajustar depois)
        quartos: null,
        banheiros: null,
        area_m2: null,
      };

      if (isEditing) {
        // Atualizar imóvel existente
        const { error } = await supabase
          .from('imoveis')
          .update(propertyData)
          .eq('id', id);

        if (error) throw error;

        toast.success("Imóvel atualizado com sucesso!");
      } else {
        // Criar novo imóvel
        const { error } = await supabase
          .from('imoveis')
          .insert([propertyData]);

        if (error) throw error;

        toast.success("Imóvel cadastrado com sucesso!", {
          description: "Você pode compartilhar o link do imóvel.",
        });
      }

      router.push("/dashboard/imoveis");
    } catch (error: any) {
      console.error('Erro ao salvar imóvel:', error);
      toast.error(error.message || 'Erro ao salvar imóvel');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funções de formatação (máscaras)
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const formatted = (parseInt(numbers) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return numbers ? formatted : "";
  };

  const parseCurrencyToNumber = (value: string): number => {
    const numbers = value.replace(/[^\d]/g, "");
    return parseInt(numbers) / 100;
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </>
    );
  }

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
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
            <p className="text-muted-foreground">Preencha as informações do imóvel</p>
          </div>
        </div>

        {/* Endereço */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-end gap-2">
              <MapPin className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <CardTitle>Endereço</CardTitle>
            </div>
            <CardDescription>Localização completa do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => {
                      const formatted = formatCep(e.target.value);
                      handleInputChange("cep", formatted);
                      if (formatted.replace(/\D/g, '').length === 8) {
                        fetchAddressByCep(formatted);
                      }
                    }}
                    maxLength={9}
                    disabled={isLoadingCep}
                  />
                  {isLoadingCep && (
                    <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-blue-500" />
                  )}
                </div>
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
                  onChange={(e) => handleInputChange("state", e.target.value.toUpperCase())}
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
            <div className="flex items-end gap-2">
              <Home className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="flex items-center justify-between">
                <Label>
                  Fotos do imóvel
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({existingPhotos.length + photos.length}/8 fotos)
                  </span>
                </Label>
                {(existingPhotos.length + photos.length) < 3 && (
                  <span className="text-xs text-red-500">
                    Mínimo 3 fotos necessárias
                  </span>
                )}
                {(existingPhotos.length + photos.length) >= 3 && (existingPhotos.length + photos.length) <= 8 && (
                  <div className="text-xs text-green-600 flex gap-1 items-center">
                    <Check className="h-4 w-4" />
                    <span>Quantidade válida</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Fotos existentes */}
                {existingPhotos.map((photo, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto existente ${index + 1}`}
                      className="h-24 w-24 rounded-lg object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(index)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Novas fotos */}
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
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Botão upload */}
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
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm"
                  >
                    {room}
                    <button
                      type="button"
                      onClick={() => removeRoom(room)}
                      className="ml-1 rounded-full p-0.5"
                      aria-label={`Remover ${room}`}
                    >
                      <X className="h-3 w-3 hover:text-red-400" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                {/* Contador de quantidade */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={() => setRoomQuantity(Math.max(1, roomQuantity - 1))}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex h-10 w-12 items-center justify-center border-x text-sm font-medium">
                      {roomQuantity}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={() => setRoomQuantity(Math.min(99, roomQuantity + 1))}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Input de texto */}
                  <Input
                    placeholder="Ex: Quartos, Salas..."
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRoom())}
                    className="max-w-xs"
                  />
                </div>

                <Button type="button" className="w-full md:w-fit px-4 bg-blue-500 hover:bg-blue-400" variant="default" size="icon" onClick={addRoom} aria-label="Adicionar cômodo">
                  {/* <HousePlusIcon className="h-4 w-4" /> */}
                  <span>Adicionar</span>
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
            <div className="flex items-end gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
            <div className="flex items-end gap-2">
              <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
          <Link href="/dashboard/imoveis">
            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Salvando...' : 'Cadastrando...'}
              </>
            ) : (
              isEditing ? 'Salvar alterações' : 'Cadastrar imóvel'
            )}
          </Button>
        </div>
      </form>
    </>
  );
}