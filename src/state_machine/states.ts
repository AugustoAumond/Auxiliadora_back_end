import { proposal_status } from "@prisma/client";


export { proposal_status as RentalProposalStatus };


export enum RentalProposalAction {
    AVANCAR = "AVANCAR",
    RETROCEDER = "RETROCEDER",
    CANCELAR = "CANCELAR",
    REPROVAR = "REPROVAR"
}