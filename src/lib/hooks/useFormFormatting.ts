import { formatarCPF, formatarTelefone, formatarMoeda, parseMoeda } from "../validators";

export function useFormFormatting() {
  return {
    formatarCPF,
    formatarTelefone,
    formatarMoeda,
    parseMoeda,
  };
}
