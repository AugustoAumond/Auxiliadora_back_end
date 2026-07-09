import { prisma } from "../database/prisma";


export interface CreateProperties {
    ownerId: string;
    description: string;
    value: number;
    bedrooms?: number;
    parking?: boolean;
    status?: string;
    city: string;
    address: string;
}


export class PropertiesRepository {
    async create(data: CreateProperties) {
        return prisma.properties.create({
            data: {
                description: data.description,
                value: data.value,
                address: data.address,
                city: data.city,
                ownerId: data.ownerId,
                bedrooms: data?.bedrooms,
                parking: data?.parking,
                status: data?.status
            }
        });
    }

    async findById(id: string) {
        return prisma.properties.findUnique({
            where: {
                id
            }
        });
    }


    //Melhoria, implementar um paginação;
    async findAll() {
        return prisma.properties.findMany();
    }
}