import { z } from "zod";


export const createUserSchema = z.object({

    name:  z.string({
            error: "Nome é obrigatório",
        })
        .min(3, "Nome deve ter no mínimo 3 caracteres"),

    email: z
        .string({
            error: "Email é obrigatório",
        })
        .email("Email inválido"),

    password: z
        .string({
            error: "Senha é obrigatório",
        })
        .min(8, "Senha deve ter no mínimo 8 caracteres")
});