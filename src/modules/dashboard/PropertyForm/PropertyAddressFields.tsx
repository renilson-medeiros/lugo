"use client";

import { MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCEP } from "@/lib/hooks/useCEP";

interface PropertyAddressFieldsProps {
  formData: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PropertyAddressFields({ formData, onChange }: PropertyAddressFieldsProps) {
  const { fetchAddress, isLoading: isLoadingCep, formatCEP } = useCEP();

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onChange("cep", formatted);

    const cleanCep = formatted.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      const data = await fetchAddress(cleanCep);
      if (data) {
        onChange("street", data.logradouro || formData.street);
        onChange("neighborhood", data.bairro || formData.neighborhood);
        onChange("city", data.localidade || formData.city);
        onChange("state", data.uf || formData.state);
      }
    }
  };

  return (
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
            <div className="relative">
              <Input
                id="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleCepChange}
                maxLength={9}
                disabled={isLoadingCep}
              />
              {isLoadingCep && (
                <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-tertiary" />
              )}
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              placeholder="Nome da rua"
              value={formData.street}
              onChange={(e) => onChange("street", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              placeholder="123"
              value={formData.number}
              onChange={(e) => onChange("number", e.target.value)}
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
              onChange={(e) => onChange("complement", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Centro"
              value={formData.neighborhood}
              onChange={(e) => onChange("neighborhood", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="São Paulo"
              value={formData.city}
              onChange={(e) => onChange("city", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              placeholder="SP"
              value={formData.state}
              onChange={(e) => onChange("state", e.target.value.toUpperCase())}
              maxLength={2}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
