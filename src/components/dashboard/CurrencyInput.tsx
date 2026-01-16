"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatarMoeda } from "@/lib/validators";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export function CurrencyInput({ label, value, onValueChange, error, ...props }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "");
    if (!numbers) {
      onValueChange("");
      return;
    }
    const formatted = formatarMoeda(numbers);
    onValueChange(formatted);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        placeholder="R$ 0,00"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
