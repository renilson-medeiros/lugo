"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CurrencyInput } from "@/components/dashboard/CurrencyInput";

interface PropertyFinancialFieldsProps {
  formData: {
    rentValue: string;
    condoValue: string;
    iptuValue: string;
    serviceValue: string;
    includesWater: boolean;
    includesElectricity: boolean;
    includesInternet: boolean;
    includesGas: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export function PropertyFinancialFields({ formData, onChange }: PropertyFinancialFieldsProps) {
  return (
    <Card className="animate-fade-in">
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
            <CurrencyInput
              id="rentValue"
              value={formData.rentValue}
              onValueChange={(val) => onChange("rentValue", val)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condoValue">Condomínio</Label>
            <CurrencyInput
              id="condoValue"
              value={formData.condoValue}
              onValueChange={(val) => onChange("condoValue", val)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iptuValue">IPTU</Label>
            <CurrencyInput
              id="iptuValue"
              value={formData.iptuValue}
              onValueChange={(val) => onChange("iptuValue", val)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceValue">Taxa de serviço</Label>
            <CurrencyInput
              id="serviceValue"
              value={formData.serviceValue}
              onValueChange={(val) => onChange("serviceValue", val)}
            />
          </div>
        </div>

        <Separator />

        {/* Inclusões */}
        <div>
          <Label className="mb-3 block">Incluso no valor</Label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label 
              htmlFor="includesWater" 
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
            >
              <span className="text-sm font-medium leading-none">
                Água
              </span>
              <Switch
                id="includesWater"
                checked={formData.includesWater}
                onCheckedChange={(checked) => onChange("includesWater", checked)}
              />
            </label>
            <label 
              htmlFor="includesElectricity" 
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
            >
              <span className="text-sm font-medium leading-none">
                Luz
              </span>
              <Switch
                id="includesElectricity"
                checked={formData.includesElectricity}
                onCheckedChange={(checked) => onChange("includesElectricity", checked)}
              />
            </label>
            <label 
              htmlFor="includesInternet" 
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
            >
              <span className="text-sm font-medium leading-none">
                Internet
              </span>
              <Switch
                id="includesInternet"
                checked={formData.includesInternet}
                onCheckedChange={(checked) => onChange("includesInternet", checked)}
              />
            </label>
            <label 
              htmlFor="includesGas" 
              className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
            >
              <span className="text-sm font-medium leading-none">
                Gás
              </span>
              <Switch
                id="includesGas"
                checked={formData.includesGas}
                onCheckedChange={(checked) => onChange("includesGas", checked)}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
