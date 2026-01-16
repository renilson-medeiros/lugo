"use client";

import { Home, X, Plus, Minus, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const propertyTypes = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "kitnet", label: "Kitnet" },
  { value: "studio", label: "Studio" },
  { value: "cobertura", label: "Cobertura" },
  { value: "comercial", label: "Comercial" },
];

interface PropertyBasicInfoFieldsProps {
  formData: {
    title: string;
    type: string;
    rooms: string[];
    maxPeople: string;
    acceptsPets: boolean;
    hasGarage: boolean;
    acceptsChildren: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export function PropertyBasicInfoFields({ formData, onChange }: PropertyBasicInfoFieldsProps) {
  const [newRoom, setNewRoom] = useState("");
  const [roomQuantity, setRoomQuantity] = useState(1);

  const addRoom = () => {
    if (newRoom.trim()) {
      const roomText = roomQuantity > 1 ? `${roomQuantity} ${newRoom.trim()}` : newRoom.trim();
      if (!formData.rooms.includes(roomText)) {
        onChange("rooms", [...formData.rooms, roomText]);
        setNewRoom("");
        setRoomQuantity(1);
      }
    }
  };

  const removeRoom = (room: string) => {
    onChange("rooms", formData.rooms.filter(r => r !== room));
  };

  return (
    <Card className="animate-fade-in">
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
              onChange={(e) => onChange("title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo do imóvel</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onChange("type", value)}
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
              onChange={(e) => onChange("maxPeople", e.target.value)}
            />
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
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-r-none py-6"
                  onClick={() => setRoomQuantity(Math.max(1, roomQuantity - 1))}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-12 w-12 items-center justify-center border-x text-sm font-medium">
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
              <Input
                placeholder="Ex: Quartos, Salas..."
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRoom())}
                className="max-w-xs"
              />
            </div>

            <Button 
              type="button" 
              className="w-full md:w-fit px-4 bg-tertiary hover:bg-tertiary/90" 
              variant="default" 
              size="lg" 
              onClick={addRoom} 
              aria-label="Adicionar cômodo"
            >
              <span>Adicionar</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Regras */}
        <div className="grid gap-4 sm:grid-cols-3">
          <label 
            htmlFor="acceptsPets" 
            className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
          >
            <span className="text-sm font-medium leading-none">
              Aceita animais
            </span>
            <Switch
              id="acceptsPets"
              checked={formData.acceptsPets}
              onCheckedChange={(checked) => onChange("acceptsPets", checked)}
            />
          </label>
          <label 
            htmlFor="hasGarage" 
            className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
          >
            <span className="text-sm font-medium leading-none">
              Possui garagem
            </span>
            <Switch
              id="hasGarage"
              checked={formData.hasGarage}
              onCheckedChange={(checked) => onChange("hasGarage", checked)}
            />
          </label>
          <label 
            htmlFor="acceptsChildren" 
            className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/20 transition-colors select-none"
          >
            <span className="text-sm font-medium leading-none">
              Aceita crianças
            </span>
            <Switch
              id="acceptsChildren"
              checked={formData.acceptsChildren}
              onCheckedChange={(checked) => onChange("acceptsChildren", checked)}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
