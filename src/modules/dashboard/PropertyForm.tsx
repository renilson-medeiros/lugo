"use client";

// src/modules/dashboard/PropertyForm.tsx
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import imageCompression from 'browser-image-compression';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { createPropertyAction, updatePropertyAction, generateSignedUploadUrlAction } from "@/app/dashboard/imoveis/actions";
import { formatarMoeda, parseMoeda } from "@/lib/validators";

// Modular Components
import { PropertyAddressFields } from "./PropertyForm/PropertyAddressFields";
import { PropertyBasicInfoFields } from "./PropertyForm/PropertyBasicInfoFields";
import { PropertyFinancialFields } from "./PropertyForm/PropertyFinancialFields";
import { PropertyPhotoManager } from "./PropertyForm/PropertyPhotoManager";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'optimizing' | 'preparing' | 'storing' | 'finalizing' | 'error'>('idle');
  const [progressValue, setProgressValue] = useState(0);

  // Carregar dados se estiver editando ou verificar trava de trial se for novo
  useEffect(() => {
    if (isEditing) {
      loadProperty();
    } else if (user) {
      checkTrialLimit();
    }
  }, [id, user]);

  const checkTrialLimit = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (profile?.subscription_status === 'trial') {
        const { count } = await supabase
          .from('imoveis')
          .select('*', { count: 'exact', head: true });

        if (count && count >= 1) {
          toast.info("Você atingiu o limite de 1 imóvel do período de teste.");
          router.push('/checkout');
        }
      }
    } catch (error) {
      // Falha silenciosa
    }
  };

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
        rentValue: data.valor_aluguel ? formatarMoeda(Math.round(data.valor_aluguel * 100).toString()) : "",
        condoValue: data.valor_condominio ? formatarMoeda(Math.round(data.valor_condominio * 100).toString()) : "",
        iptuValue: data.valor_iptu ? formatarMoeda(Math.round(data.valor_iptu * 100).toString()) : "",
        serviceValue: data.valor_taxa_servico ? formatarMoeda(Math.round(data.valor_taxa_servico * 100).toString()) : "",
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setIsSubmitting(true);
    setUploadStatus('optimizing');
    setProgressValue(10);
    let hasError = false;

    try {
      const currentUser = user;
      if (!currentUser) {
        throw new Error('SESSION_EXPIRED');
      }

      const saveAction = async () => {
        let propertyId = id;

        // 2. Otimização de Imagens
        const optimizedPhotos: File[] = [];
        if (photos.length > 0) {
          for (let i = 0; i < photos.length; i++) {
            setUploadStatus('optimizing');
            setProgressValue(10 + Math.round((i / photos.length) * 30));

            try {
              const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
              };
              const compressedFile = await imageCompression(photos[i], options);
              optimizedPhotos.push(new File([compressedFile], photos[i].name, { type: photos[i].type }));
            } catch (err) {
              optimizedPhotos.push(photos[i]);
            }
          }
        }

        setUploadStatus('preparing');
        setProgressValue(45);

        if (!isEditing) {
          let rentVal = parseMoeda(formData.rentValue);
          let condoVal = formData.condoValue ? parseMoeda(formData.condoValue) : null;
          let iptuVal = formData.iptuValue ? parseMoeda(formData.iptuValue) : null;
          let serviceVal = formData.serviceValue ? parseMoeda(formData.serviceValue) : null;

          // Sanitizar NaNs
          if (isNaN(rentVal)) rentVal = 0;
          if (condoVal !== null && isNaN(condoVal)) condoVal = 0;
          if (iptuVal !== null && isNaN(iptuVal)) iptuVal = 0;
          if (serviceVal !== null && isNaN(serviceVal)) serviceVal = 0;

          const initialPropertyData = {
            proprietario_id: currentUser.id,
            endereco_cep: formData.cep,
            endereco_rua: formData.street,
            endereco_numero: formData.number,
            endereco_complemento: formData.complement || null,
            endereco_bairro: formData.neighborhood,
            endereco_cidade: formData.city,
            endereco_estado: formData.state,
            titulo: formData.title,
            tipo: formData.type as any,
            comodos: formData.rooms || [],
            max_pessoas: formData.maxPeople ? parseInt(formData.maxPeople) : null,
            aceita_pets: formData.acceptsPets,
            tem_garagem: formData.hasGarage,
            aceita_criancas: formData.acceptsChildren,
            valor_aluguel: rentVal,
            valor_condominio: condoVal,
            valor_iptu: iptuVal,
            valor_taxa_servico: serviceVal,
            inclui_agua: formData.includesWater,
            inclui_luz: formData.includesElectricity,
            inclui_internet: formData.includesInternet,
            inclui_gas: formData.includesGas,
            descricao: formData.observations || null,
            status: 'disponivel',
            fotos: [],
          };

          const result = await createPropertyAction(initialPropertyData);

          if (!result.success) {
            throw new Error(result.error);
          }

          propertyId = result.data.id;
        }

        setUploadStatus('storing');
        setProgressValue(60);

        const uploadedPhotosUrls: string[] = [];
        for (let i = 0; i < optimizedPhotos.length; i++) {
          const photo = optimizedPhotos[i];
          const fileExt = photo.name.split('.').pop();
          const fileName = `${currentUser.id}/${propertyId}/photos/${Date.now()}-${Math.random()}.${fileExt}`;

          try {
            const signedResult = await generateSignedUploadUrlAction(fileName);
            
            if (!signedResult.success || !signedResult.signedUrl) {
              throw new Error(signedResult.error);
            }

            const uploadResponse = await fetch(signedResult.signedUrl, {
              method: 'PUT',
              body: photo,
              headers: {
                'Content-Type': photo.type,
              },
            });

            if (!uploadResponse.ok) {
              throw new Error(`Erro no upload da foto ${i + 1}`);
            }

            const { data: { publicUrl } } = supabase.storage
              .from('imoveis-fotos')
              .getPublicUrl(fileName);

            uploadedPhotosUrls.push(publicUrl);
            setProgressValue(60 + Math.round(((i + 1) / optimizedPhotos.length) * 30));
          } catch (err: any) {
            throw err;
          }
        }

        setUploadStatus('finalizing');
        setProgressValue(95);

        const allPhotos = [...existingPhotos, ...uploadedPhotosUrls];
        if (allPhotos.length < 3) throw new Error('MIN_PHOTOS_REQUIRED');

        const finalPropertyData = {
          proprietario_id: currentUser.id,
          endereco_cep: formData.cep,
          endereco_rua: formData.street,
          endereco_numero: formData.number,
          endereco_complemento: formData.complement || null,
          endereco_bairro: formData.neighborhood,
          endereco_cidade: formData.city,
          endereco_estado: formData.state,
          titulo: formData.title,
          tipo: formData.type as any,
          comodos: formData.rooms,
          max_pessoas: formData.maxPeople ? parseInt(formData.maxPeople) : null,
          aceita_pets: formData.acceptsPets,
          tem_garagem: formData.hasGarage,
          aceita_criancas: formData.acceptsChildren,
          valor_aluguel: parseMoeda(formData.rentValue),
          valor_condominio: formData.condoValue ? parseMoeda(formData.condoValue) : null,
          valor_iptu: formData.iptuValue ? parseMoeda(formData.iptuValue) : null,
          valor_taxa_servico: formData.serviceValue ? parseMoeda(formData.serviceValue) : null,
          inclui_agua: formData.includesWater,
          inclui_luz: formData.includesElectricity,
          inclui_internet: formData.includesInternet,
          inclui_gas: formData.includesGas,
          descricao: formData.observations || null,
          fotos: allPhotos,
        };

        if (!propertyId) throw new Error('ID do imóvel não encontrado para atualização');
        
        const updateResult = await updatePropertyAction(propertyId, finalPropertyData);

        if (!updateResult.success) {
          throw new Error(updateResult.error);
        }
        
        setProgressValue(100);
      };

      let timeoutId: any;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('TIMEOUT_EXCEEDED'));
        }, 90000);
      });

      await Promise.race([saveAction(), timeoutPromise]);
      clearTimeout(timeoutId);

      toast.success(isEditing ? "Imóvel atualizado!" : "Imóvel cadastrado com sucesso!");
      router.push("/dashboard/imoveis");
    } catch (error: any) {
      hasError = true;
      setUploadStatus('error');
      console.error('Erro ao salvar imóvel:', error);

      if (error.message === 'TIMEOUT_EXCEEDED') {
        toast.error('A conexão está lenta. Tente novamente mais tarde.');
      } else if (error.message === 'SESSION_EXPIRED') {
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      } else if (error.message === 'MIN_PHOTOS_REQUIRED') {
        toast.error('São necessárias pelo menos 3 fotos.');
      } else {
        toast.error('Ocorreu um erro inesperado. Verifique os dados e tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
      if (!hasError) {
        setTimeout(() => setUploadStatus('idle'), 500);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-tertiary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal de Progresso Amigável */}
      <Dialog open={uploadStatus !== 'idle'} onOpenChange={() => {
        if (uploadStatus === 'error') setUploadStatus('idle');
      }}>
        <DialogContent className="sm:max-w-md border-none shadow-2xl">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-xl font-display text-center">
              {uploadStatus === 'error' ? 'Ops! Algo deu errado' : 'Quase lá...'}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {uploadStatus === 'optimizing' && "Otimizando suas fotos..."}
              {uploadStatus === 'preparing' && "Organizando as informações do imóvel..."}
              {uploadStatus === 'storing' && "Guardando suas fotos com segurança..."}
              {uploadStatus === 'finalizing' && "Finalizando os detalhes finais..."}
              {uploadStatus === 'error' && "Houve um problema ao salvar. Verifique sua conexão e tente novamente."}
            </DialogDescription>
          </DialogHeader>

          {uploadStatus !== 'error' && (
            <div className="space-y-6 py-4">
              <Progress value={progressValue} className="h-2.5" />
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex justify-center pt-2">
              <Button onClick={() => setUploadStatus('idle')} className="bg-tertiary">
                Tentar novamente
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

        <PropertyAddressFields 
          formData={formData} 
          onChange={handleInputChange} 
        />

        <PropertyBasicInfoFields 
          formData={formData} 
          onChange={handleInputChange} 
        />
        
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fotos do Imóvel</CardTitle>
              <CardDescription>Carregue pelo menos 3 fotos</CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyPhotoManager
                photos={photos}
                photosPreviews={photosPreviews}
                existingPhotos={existingPhotos}
                onPhotosChange={setPhotos}
                onPreviewsChange={setPhotosPreviews}
                onExistingPhotosChange={setExistingPhotos}
              />
            </CardContent>
          </Card>
        </div>

        <PropertyFinancialFields 
          formData={formData} 
          onChange={handleInputChange} 
        />

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
          <Link href="/dashboard/imoveis">
            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isSubmitting}>
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-tertiary hover:bg-tertiary/90"
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
