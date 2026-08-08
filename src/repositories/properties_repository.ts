import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import { Pagination, paginationMeta } from "../types/pagination";

export interface CreateProperties {
  description: string;
  value: number;
  bedrooms?: number;
  parking?: boolean;
  city: string;
  address: string;
}

const propertyDetails = {
  owner: { select: { id: true, name: true, email: true } },
} satisfies Prisma.propertiesInclude;

export class PropertiesRepository {
  async create(ownerId: string, data: CreateProperties) {
    return prisma.properties.create({
      data: { ...data, ownerId },
      include: propertyDetails,
    });
  }

  async findById(id: string) {
    return prisma.properties.findUnique({ where: { id } });
  }

  async findAll({ page, limit }: Pagination) {
    const [data, total] = await prisma.$transaction([
      prisma.properties.findMany({
        include: propertyDetails,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.properties.count(),
    ]);
    return { data, meta: paginationMeta(page, limit, total) };
  }
}
