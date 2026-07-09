import { proposal_status } from "@prisma/client";
import { prisma } from "../database/prisma";
import { PropertiesRepository } from "../repositories/properties_repository";
import { CreateRentalProposals } from "../repositories/rental_proposals_repository";
import { RentalProposalsRepository } from "../repositories/rental_proposals_repository"; 
import { UserRepository } from "../repositories/user_repository";
import { RentalProposalMachine } from "../state_machine/state_machine";
import { RentalProposalAction, RentalProposalStatus } from "../state_machine/states";
import { RentalProposalLogsRepository } from "../repositories/rental_proposals_logs_repository"; 
import { AppError } from "../errors/app_error";


export class RentalProposalsService {

    private repository: RentalProposalsRepository;
    private properties: PropertiesRepository;
    private users: UserRepository;
    private logsRepository: RentalProposalLogsRepository;


    constructor() {
        this.repository = new RentalProposalsRepository();
        this.properties = new PropertiesRepository();
        this.users = new UserRepository();
        this.logsRepository = new RentalProposalLogsRepository();
    }


    async create(data: CreateRentalProposals) {
        return prisma.$transaction(async (tx) => {

            const property = await tx.properties.findUnique({
                where: {
                    id: data.propertyId
                }
            });

            if (!property) {
                throw new AppError("Imóvel não encontrado!", 404);
            }


            if (property.status !== "disponível") {
                throw new AppError("Imóvel indisponível!", 404);
            }

            const ownerProperty = await tx.properties.findUnique({
                where: {
                    id: data.propertyId,
                    ownerId: data.applicantId
                }
            });

            if (ownerProperty){
                throw new AppError("O dono do imóvel não pode fazer uma proposta para a sua própria propriedade!", 404);
            }

            const proposal = await tx.rental_proposal.create({
                data: {
                    applicantId: data.applicantId,
                    propertyId: data.propertyId
                }
            });


            await tx.properties.update({
                where: {
                    id: data.propertyId
                },
                data: {
                    status: "em_negociacao"
                }
            });

            return proposal;
        });
    }

    async updateStatus( id: string, action: RentalProposalAction) {     
        const proposal = await this.repository.findById(id);

        if (!proposal) {
            throw new AppError("Proposta não encontrada!", 404);
        }

        const nextStatus = RentalProposalMachine.transition(
            proposal.status,
            action
        );

        return prisma.$transaction(async (tx) => {
            const updatedProposal = await tx.rental_proposal.update({
                where: {
                    id
                },
                data: {
                    status: nextStatus
                }
            });

            const property = await tx.properties.findUnique({
                where: {
                    id: proposal.propertyId
                }
            });

            if (!property) {
                throw new AppError("Imóvel não encontrado!", 404);
            }

            if (nextStatus === proposal_status.CANCELADA || nextStatus === proposal_status.REPROVADA) {
                await tx.properties.update({
                    where: {
                        id: proposal.propertyId
                    },
                    data: {
                        status: "disponível"
                    }
                });
            }


            if ( nextStatus === proposal_status.ATIVO) {
                await tx.properties.update({
                    where: {
                        id: proposal.propertyId
                    },
                    data: {
                        status: "alugado"
                    }
                });
            }


            await tx.rental_proposal_logs.create({
                data: {
                    propertyId: property.id,
                    applicantId: proposal.applicantId,
                    ownerPropertyId: property.ownerId,
                    propertiesStatus: nextStatus === proposal_status.ATIVO ? "alugado" : property.status, 
                    rentalProposalStatus: nextStatus, 
                    message: `A proposta foi atualizada para o status ${nextStatus}`
                }
            });
            return updatedProposal;
        });
    }


    async findAll() {
        return this.repository.findAll();
    }

    async findAllLogs() {
        return this.logsRepository.findAll();
    }

}