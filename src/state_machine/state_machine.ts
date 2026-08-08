import { AppError } from "../errors/app_error";
import { RentalProposalAction, RentalProposalStatus } from "./states";

export class RentalProposalMachine {
  static transition(
    currentStatus: RentalProposalStatus,
    action: RentalProposalAction,
  ): RentalProposalStatus {
    if (
      currentStatus === RentalProposalStatus.ATIVO ||
      currentStatus === RentalProposalStatus.REPROVADA ||
      currentStatus === RentalProposalStatus.CANCELADA
    ) {
      throw new AppError("MAQUINA DE ESTADOS: proposta em estado final", 409);
    }

    if (action === RentalProposalAction.CANCELAR) {
      return RentalProposalStatus.CANCELADA;
    }

    if (action === RentalProposalAction.REPROVAR) {
      return RentalProposalStatus.REPROVADA;
    }

    const flow: RentalProposalStatus[] = [
      RentalProposalStatus.NOVA,
      RentalProposalStatus.ANALISE_CREDITO,
      RentalProposalStatus.CONTRATO_EMITIDO,
      RentalProposalStatus.ASSINADO,
      RentalProposalStatus.ATIVO,
    ];
    const currentIndex = flow.indexOf(currentStatus);

    if (currentIndex === -1) {
      throw new AppError(
        "MAQUINA DE ESTADOS: status inválido para transição",
        409,
      );
    }

    if (action === RentalProposalAction.AVANCAR) {
      return flow[currentIndex + 1];
    }

    if (action === RentalProposalAction.RETROCEDER) {
      if (currentIndex === 0) {
        throw new AppError(
          "MAQUINA DE ESTADOS: a proposta não pode retroceder",
          409,
        );
      }

      return flow[currentIndex - 1];
    }

    throw new AppError("MAQUINA DE ESTADOS: ação inválida", 400);
  }
}
