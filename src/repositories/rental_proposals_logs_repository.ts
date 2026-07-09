import { proposal_status } from "@prisma/client";
import { prisma } from "../database/prisma";


export interface CreateRentalProposalLog {
    propertyId: string;

    applicantId: string;

    ownerPropertyId: string;

    propertiesStatus: string;

    rentalProposalStatus: proposal_status;

    message: string;
}


export class RentalProposalLogsRepository {


    async create(
        data: CreateRentalProposalLog
    ) {

        return prisma.rental_proposal_logs.create({
            data
        });
    }

    //Melhoria, implementar um paginação;
    async findAll() {
        return prisma.rental_proposal_logs.findMany();
    }

}