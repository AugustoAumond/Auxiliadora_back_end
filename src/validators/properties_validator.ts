import { z } from "zod";

export const createPropertiesSchema = z.object({

    description: z
        .string({
            error: "Descrição do imóvel é obrigatório",
        })
        .min(15, "Descrição deve ter no mínimo 15 caracteres"),

    city: z
        .string({
            error: "Cidade do imóvel é obrigatório",
        }),

    address: z
        .string({
            error: "Enderço do imóvel é obrigatório",
        }),

    ownerId: z
        .string({
            error: "Email é obrigatório",
        }),

    value: z
        .number({
            error: "Valor do imóvel é obrigatório",
        })
        .positive("Valor deve ser maior que zero"),

    bedrooms: z
        .number()
        .optional(),

    parking: z
        .boolean()
        .optional(),

    status: z
        .string()
        .optional()
});