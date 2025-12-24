import { Injectable } from '@nestjs/common';
import { Prisma, Company } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.CompanyCreateInput): Promise<Company> {
        return this.prisma.company.create({ data });
    }

    async findByUserId(userId: string): Promise<Company | null> {
        return this.prisma.company.findUnique({ where: { userId } });
    }

    async findById(id: string): Promise<Company | null> {
        return this.prisma.company.findUnique({ where: { id } });
    }
}
