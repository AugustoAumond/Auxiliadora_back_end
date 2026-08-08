import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import { Pagination, paginationMeta } from "../types/pagination";

const proposalDetails = {
  applicant: { select: { id: true, name: true, email: true } },
  property: {
    select: {
      id: true,
      city: true,
      address: true,
      status: true,
      ownerId: true,
    },
  },
} satisfies Prisma.rental_proposalInclude;

export class RentalProposalsRepository {
  async findById(id: string) {
    return prisma.rental_proposal.findUnique({ where: { id } });
  }

  async findAll(actorId: string, { page, limit }: Pagination) {
    const where = {
      OR: [{ applicantId: actorId }, { property: { ownerId: actorId } }],
    };
    const [data, total] = await prisma.$transaction([
      prisma.rental_proposal.findMany({
        include: proposalDetails,
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental_proposal.count({ where }),
    ]);
    return { data, meta: paginationMeta(page, limit, total) };
  }
}
