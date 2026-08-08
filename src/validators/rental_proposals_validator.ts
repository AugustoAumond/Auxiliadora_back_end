import { z } from "zod";
import { RentalProposalAction } from "../state_machine/states";

export const createRentalProposalsSchema = z.object({
  propertyId: z.uuid({ error: "Imóvel inválido" }),
});

export const updateRentalProposalStatusSchema = z.object({
  action: z.enum(RentalProposalAction),
});

export const idParamSchema = z.object({
  id: z.uuid({ error: "Identificador inválido" }),
});
