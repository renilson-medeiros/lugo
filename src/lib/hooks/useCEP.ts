import { useState } from "react";
import { toast } from "sonner";
import { formatarCEP } from "@/lib/validators";

export interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function useCEP() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddress = async (cep: string): Promise<AddressData | null> => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) return null;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cep?cep=${cleanCep}`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return null;
      }

      toast.success('Endereço encontrado!');
      return data as AddressData;
    } catch (error) {
      toast.error('Erro ao buscar CEP');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchAddress,
    isLoading,
    formatCEP: formatarCEP
  };
}
