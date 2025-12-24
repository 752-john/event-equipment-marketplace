import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { EquipmentsRepository } from './equipments.repository';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { User } from '@prisma/client';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class EquipmentsService {
    constructor(
        private equipmentsRepository: EquipmentsRepository,
        private companiesService: CompaniesService,
        private usersService: UsersService,
    ) { }

    async create(userId: string, createEquipmentDto: CreateEquipmentDto) {
        const user = await this.usersService.findOne(userId);
        // Double check company existence/link via UsersService or direct repo, 
        // but the most reliable is checking the company via the user relation or id.
        // For now assuming we need the company ID.
        const company = await this.companiesService.companiesRepository.findByUserId(userId);

        if (!company) {
            throw new ForbiddenException('User does not have a registered company');
        }

        return this.equipmentsRepository.create({
            ...createEquipmentDto,
            company: { connect: { id: company.id } },
        });
    }

    async findAllActive() {
        return this.equipmentsRepository.findAllActive();
    }

    async findMyEquipments(userId: string) {
        const company = await this.companiesService.companiesRepository.findByUserId(userId);
        if (!company) {
            throw new ForbiddenException('User is not a company owner');
        }
        return this.equipmentsRepository.findByCompany(company.id);
    }

    async findOne(id: string) {
        const equipment = await this.equipmentsRepository.findById(id);
        if (!equipment) {
            throw new NotFoundException('Equipment not found');
        }
        return equipment;
    }

    async update(userId: string, id: string, updateEquipmentDto: UpdateEquipmentDto) {
        const equipment = await this.findOne(id);
        const company = await this.companiesService.companiesRepository.findByUserId(userId);

        if (!company || equipment.companyId !== company.id) {
            throw new ForbiddenException('You do not own this equipment');
        }

        return this.equipmentsRepository.update(id, updateEquipmentDto);
    }
}
