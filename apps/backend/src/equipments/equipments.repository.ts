import { Injectable } from '@nestjs/common';
import { Prisma, Equipment, EquipmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipmentsRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.EquipmentCreateInput): Promise<Equipment> {
        return this.prisma.equipment.create({ data });
    }

    async findAllActive(): Promise<Equipment[]> {
        return this.prisma.equipment.findMany({
            where: { status: EquipmentStatus.ACTIVE },
        });
    }

    async findByCompany(companyId: string): Promise<Equipment[]> {
        return this.prisma.equipment.findMany({
            where: { companyId },
        });
    }

    async findById(id: string): Promise<Equipment | null> {
        return this.prisma.equipment.findUnique({
            where: { id },
            include: { company: true },
        });
    }

    async update(id: string, data: Prisma.EquipmentUpdateInput): Promise<Equipment> {
        return this.prisma.equipment.update({
            where: { id },
            data,
        });
    }
}
