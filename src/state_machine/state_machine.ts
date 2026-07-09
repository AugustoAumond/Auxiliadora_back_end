import { RentalProposalAction, RentalProposalStatus } from "./states";
import { AppError } from "../errors/app_error";


export class RentalProposalMachine {
    static transition(
        currentStatus: RentalProposalStatus,
        action: RentalProposalAction
    ): RentalProposalStatus {


        // Ações que podem acontecer independentemente da etapa
        if (action === RentalProposalAction.CANCELAR) {
            if (currentStatus === RentalProposalStatus.ATIVO) {
                throw new AppError("MAQUINA DE ESTADOS: Não é possível cancelar uma proposta ativa", 409);
            }

            return RentalProposalStatus.CANCELADA;
        }


        if (action === RentalProposalAction.REPROVAR) {
            if (currentStatus === RentalProposalStatus.ATIVO) {
                throw new AppError("MAQUINA DE ESTADOS: Não é possível reprovar uma proposta ativa", 409);
            }

            return RentalProposalStatus.REPROVADA;
        }


        const flow: RentalProposalStatus[] = [
            RentalProposalStatus.NOVA,
            RentalProposalStatus.ANALISE_CREDITO,
            RentalProposalStatus.CONTRATO_EMITIDO,
            RentalProposalStatus.ASSINADO,
            RentalProposalStatus.ATIVO
        ];


        const currentIndex = flow.indexOf(currentStatus);


        if (currentIndex === -1) {
            throw new AppError("MAQUINA DE ESTADOS: Status inválido para transição", 409);
        }


        if (action === RentalProposalAction.AVANCAR) {
            if (currentStatus === "REPROVADA" || currentStatus === "CANCELADA"){
                throw new AppError("MAQUINA DE ESTADOS: Não é possível avançar uma proposta com status REPROVADA ou CANCELADA", 409);
            } else {
                if (currentIndex === flow.length - 1) {
                    throw new AppError("MAQUINA DE ESTADOS: A proposta já está ativa", 409);
                }

                return flow[currentIndex + 1];
            }
        }


        if (action === RentalProposalAction.RETROCEDER) {
            if (currentStatus === "REPROVADA" || currentStatus === "CANCELADA"){
                throw new AppError("MAQUINA DE ESTADOS: Não é possível retroceder uma proposta com status REPROVADA ou CANCELADA", 409);
            } else {
                if (currentIndex === 0) {
                    throw new AppError("MAQUINA DE ESTADOS: A proposta não pode retroceder", 409);
                }

                return flow[currentIndex - 1];
            }
           
        }

        throw new AppError("MAQUINA DE ESTADOS: Ação inválida", 409);
    }

}