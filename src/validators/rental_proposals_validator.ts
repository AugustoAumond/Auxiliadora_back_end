import { z } from "zod";

export const createRenatalProposalsSchema = z.object({

    applicantId: z
        .uuid({
            error: "Usuário interessado no imóvel é obrigatório ou não existe",
        }),

    propertyId: z
        .uuid({
            error: "Imóvel não existe ou está indisponível",
        }),

    status: z
        .string()
        .optional()
});