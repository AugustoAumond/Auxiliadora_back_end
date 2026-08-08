import { prisma } from "../database/prisma";
import { Pagination, paginationMeta } from "../types/pagination";

export class RentalProposalLogsRepository {
  async findAll(actorId: string, { page, limit }: Pagination) {
    const where = {
      OR: [{ applicantId: actorId }, { property: { ownerId: actorId } }],
    };
    const [data, total] = await prisma.$transaction([
      prisma.rental_proposal_logs.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental_proposal_logs.count({ where }),
    ]);
    return { data, meta: paginationMeta(page, limit, total) };
  }
}
