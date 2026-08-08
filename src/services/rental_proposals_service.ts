import { PropertyStatus, proposal_status } from "@prisma/client";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/app_error";
import { RentalProposalLogsRepository } from "../repositories/rental_proposals_logs_repository";
import { RentalProposalsRepository } from "../repositories/rental_proposals_repository";
import { RentalProposalMachine } from "../state_machine/state_machine";
import { RentalProposalAction } from "../state_machine/states";
import { Pagination } from "../types/pagination";

interface CreateRentalProposal {
  propertyId: string;
}

export class RentalProposalsService {
  private readonly repository = new RentalProposalsRepository();
  private readonly logsRepository = new RentalProposalLogsRepository();

  async create(applicantId: string, data: CreateRentalProposal) {
    return prisma.$transaction(async (tx) => {
      const applicant = await tx.users.findUnique({
        where: { id: applicantId },
        select: { id: true },
      });
      if (!applicant) throw new AppError("Usuário não encontrado", 404);

      const property = await tx.properties.findUnique({
        where: { id: data.propertyId },
      });
      if (!property) throw new AppError("Imóvel não encontrado", 404);
      if (property.ownerId === applicantId)
        throw new AppError(
          "O proprietário não pode criar proposta para o próprio imóvel",
          403,
        );

      const claimed = await tx.properties.updateMany({
        where: { id: data.propertyId, status: PropertyStatus.AVAILABLE },
        data: { status: PropertyStatus.NEGOTIATING },
      });
      if (claimed.count !== 1) throw new AppError("Imóvel indisponível", 409);

      return tx.rental_proposal.create({
        data: { applicantId, propertyId: data.propertyId },
      });
    });
  }

  async updateStatus(
    id: string,
    action: RentalProposalAction,
    actorId: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const proposal = await tx.rental_proposal.findUnique({ where: { id } });
      if (!proposal) throw new AppError("Proposta não encontrada", 404);

      const property = await tx.properties.findUnique({
        where: { id: proposal.propertyId },
      });
      if (!property) throw new AppError("Imóvel não encontrado", 404);

      const allowed =
        action === RentalProposalAction.CANCELAR
          ? actorId === proposal.applicantId || actorId === property.ownerId
          : actorId === property.ownerId;
      if (!allowed)
        throw new AppError("Você não tem permissão para esta ação", 403);

      const nextStatus = RentalProposalMachine.transition(
        proposal.status,
        action,
      );
      const updated = await tx.rental_proposal.updateMany({
        where: { id, status: proposal.status },
        data: { status: nextStatus },
      });
      if (updated.count !== 1)
        throw new AppError(
          "A proposta foi alterada por outra requisição; tente novamente",
          409,
        );

      const nextPropertyStatus =
        nextStatus === proposal_status.ATIVO
          ? PropertyStatus.RENTED
          : nextStatus === proposal_status.CANCELADA ||
              nextStatus === proposal_status.REPROVADA
            ? PropertyStatus.AVAILABLE
            : property.status;

      if (nextPropertyStatus !== property.status) {
        await tx.properties.update({
          where: { id: property.id },
          data: { status: nextPropertyStatus },
        });
      }

      await tx.rental_proposal_logs.create({
        data: {
          propertyId: property.id,
          applicantId: proposal.applicantId,
          ownerPropertyId: property.ownerId,
          propertiesStatus: nextPropertyStatus,
          rentalProposalStatus: nextStatus,
          message: `A proposta foi atualizada para o status ${nextStatus}`,
        },
      });

      return tx.rental_proposal.findUniqueOrThrow({ where: { id } });
    });
  }

  async findAll(actorId: string, pagination: Pagination) {
    return this.repository.findAll(actorId, pagination);
  }

  async findAllLogs(actorId: string, pagination: Pagination) {
    return this.logsRepository.findAll(actorId, pagination);
  }
}
