import { prisma } from "../database/prisma";
import { Pagination, paginationMeta } from "../types/pagination";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

const publicUser = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const;

export class UserRepository {
  async create(data: CreateUserDTO) {
    return prisma.users.create({ data, select: publicUser });
  }

  async findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.users.findUnique({ where: { id }, select: publicUser });
  }

  async updatePassword(id: string, password: string) {
    return prisma.users.update({ where: { id }, data: { password } });
  }

  async findAll({ page, limit }: Pagination) {
    const [data, total] = await prisma.$transaction([
      prisma.users.findMany({
        select: publicUser,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.users.count(),
    ]);
    return { data, meta: paginationMeta(page, limit, total) };
  }
}
