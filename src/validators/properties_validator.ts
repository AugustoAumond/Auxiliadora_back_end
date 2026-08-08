import { z } from "zod";

export const createPropertiesSchema = z.object({
  description: z
    .string()
    .trim()
    .min(15, "Descrição deve ter no mínimo 15 caracteres"),
  city: z.string().trim().min(1, "Cidade do imóvel é obrigatória"),
  address: z.string().trim().min(1, "Endereço do imóvel é obrigatório"),
  value: z.number().finite().positive("Valor deve ser maior que zero"),
  bedrooms: z.number().int().positive().optional(),
  parking: z.boolean().optional(),
});
