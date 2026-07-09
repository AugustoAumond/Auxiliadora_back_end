import { prisma } from "../database/prisma";


export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}


export class UserRepository {

    async create(data: CreateUserDTO) {
        return prisma.users.create({
            data
        });
    }


    async findByEmail(email: string) {
        return prisma.users.findUnique({
            where: {
                email
            }
        });
    }

    async findById(id: string) {
        return prisma.users.findUnique({
            where: {
                id
            }
        });
    }

    async findAll() {
        return prisma.users.findMany();
    }

}