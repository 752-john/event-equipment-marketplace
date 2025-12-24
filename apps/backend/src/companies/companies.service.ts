import { ConflictException, Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from '@prisma/client';

@Injectable()
export class CompaniesService {
    constructor(private companiesRepository: CompaniesRepository) { }

    async create(userId: string, createCompanyDto: CreateCompanyDto): Promise<Company> {
        const existingCompany = await this.companiesRepository.findByUserId(userId);
        if (existingCompany) {
            throw new ConflictException('User already has a company');
        }

        return this.companiesRepository.create({
            ...createCompanyDto,
            user: { connect: { id: userId } },
        });
    }

    async findOne(id: string): Promise<Company | null> {
        return this.companiesRepository.findById(id);
    }
}
