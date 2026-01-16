"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formatarCPF, formatarTelefone } from "@/lib/validators";

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  mask: "cpf" | "phone" | ((value: string) => string);
  onValueChange: (value: string) => void;
  value: string;
  error?: string;
}

const masks = {
  cpf: formatarCPF,
  phone: formatarTelefone,
};

export function MaskedInput({ label, mask, onValueChange, error, value, ...props }: MaskedInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskFn = typeof mask === "function" ? mask : masks[mask];
    const maskedValue = maskFn(e.target.value);
    onValueChange(maskedValue);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
