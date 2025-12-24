import { Injectable } from '@nestjs/common';
import { Prisma, Rental, RentalStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentalsRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.RentalCreateInput): Promise<Rental> {
        return this.prisma.rental.create({ data });
    }

    async findOverlappingRentals(equipmentId: string, startDate: Date, endDate: Date): Promise<Rental[]> {
        return this.prisma.rental.findMany({
            where: {
                equipmentId,
                status: { not: RentalStatus.CANCELLED },
                AND: [
                    { startDate: { lte: endDate } },
                    { endDate: { gte: startDate } },
                ],
            },
        });
    }

    async findById(id: string): Promise<Rental | null> {
        return this.prisma.rental.findUnique({
            where: { id },
            include: { equipment: true },
        });
    }

    async findByUser(userId: string): Promise<Rental[]> {
        return this.prisma.rental.findMany({
            where: { userId },
            include: { equipment: true },
        });
    }

    async findByCompany(companyId: string): Promise<Rental[]> {
        return this.prisma.rental.findMany({
            where: {
                equipment: {
                    companyId: companyId,
                },
            },
            include: { equipment: true, user: { select: { id: true, name: true, email: true } } },
        });
    }

    async updateStatus(id: string, status: RentalStatus): Promise<Rental> {
        return this.prisma.rental.update({
            where: { id },
            data: { status },
        });
    }

    async update(id: string, data: Prisma.RentalUpdateInput): Promise<Rental> {
        return this.prisma.rental.update({
            where: { id },
            data,
        });
    }
}
