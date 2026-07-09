import { proposal_status } from "@prisma/client";
import { prisma } from "../database/prisma";


export interface CreateRentalProposals {
    applicantId: string;
    propertyId: string;
    status?: string;
}


export class RentalProposalsRepository {

    async create(data: CreateRentalProposals) {
        return prisma.rental_proposal.create({
            data: {
                propertyId: data.propertyId,
                applicantId: data.applicantId
            }
        });
    }

    async findById(id: string) {
        return prisma.rental_proposal.findUnique({
            where: {
                id
            }
        });
    }

    
    async updateStatus( id: string, status: proposal_status) {
        if (status){
            return prisma.rental_proposal.update({
                where: {
                    id
                },
                data: {
                    status
                }
            });
        }
    }

    //Melhoria, implementar um paginação;
    async findAll() {

        return prisma.rental_proposal.findMany();

    }
}