import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RentalsRepository } from './rentals.repository';
import { EquipmentsRepository } from '../equipments/equipments.repository';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalStatus } from '@prisma/client';
import { CompaniesRepository } from '../companies/companies.repository';

@Injectable()
export class RentalsService {
    constructor(
        private rentalsRepository: RentalsRepository,
        private equipmentsRepository: EquipmentsRepository,
        private companiesRepository: CompaniesRepository,
    ) { }

    async create(userId: string, createRentalDto: CreateRentalDto) {
        const { equipmentId, startDate, endDate } = createRentalDto;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        // Reset time components for strict date comparison (optional, but safer for 'daily' rentals)
        // For now keep as is strictly.

        if (start < now) {
            // Allow creating for today? Yes.
            // But not past. Strict check?
            // createRentalDto validation ensures dates? No, just string.
        }
        if (start > end) {
            throw new BadRequestException('Start date must be before end date');
        }

        const equipment = await this.equipmentsRepository.findById(equipmentId);
        if (!equipment) {
            throw new NotFoundException('Equipment not found');
        }
        if (equipment.status !== 'ACTIVE') {
            throw new BadRequestException('Equipment is not active');
        }

        const overlapping = await this.rentalsRepository.findOverlappingRentals(equipmentId, start, end);
        if (overlapping.length > 0) {
            throw new BadRequestException('Equipment is not available for the selected dates');
        }

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const finalDays = diffDays === 0 ? 1 : diffDays;

        const totalPrice = Number(equipment.price) * finalDays;

        return this.rentalsRepository.create({
            userId,
            equipmentId,
            startDate: start,
            endDate: end,
            totalPrice: totalPrice,
            status: RentalStatus.REQUESTED,
        });
    }

    async getMyRentals(userId: string) {
        return this.rentalsRepository.findByUser(userId);
    }

    async getCompanyRentals(userId: string) {
        const company = await this.companiesRepository.findByUserId(userId);
        if (!company) throw new ForbiddenException('User does not display a company');
        return this.rentalsRepository.findByCompany(company.id);
    }

    async approveRental(userId: string, rentalId: string) {
        const rental = await this.rentalsRepository.findById(rentalId);
        if (!rental) throw new NotFoundException('Rental not found');

        const equipment = await this.equipmentsRepository.findById(rental.equipmentId);
        const company = await this.companiesRepository.findByUserId(userId);

        if (!company || equipment?.companyId !== company.id) {
            throw new ForbiddenException('You do not own the equipment for this rental');
        }

        if (rental.status !== RentalStatus.REQUESTED) {
            throw new BadRequestException(`Cannot approve rental with status ${rental.status}`);
        }

        // Direct transition to PAYMENT_PENDING as per requirements
        return this.rentalsRepository.updateStatus(rentalId, RentalStatus.PAYMENT_PENDING);
    }

    async rejectRental(userId: string, rentalId: string) {
        const rental = await this.rentalsRepository.findById(rentalId);
        if (!rental) throw new NotFoundException('Rental not found');

        const equipment = await this.equipmentsRepository.findById(rental.equipmentId);
        const company = await this.companiesRepository.findByUserId(userId);

        if (!company || equipment?.companyId !== company.id) {
            throw new ForbiddenException('You do not own the equipment for this rental');
        }

        return this.rentalsRepository.updateStatus(rentalId, RentalStatus.CANCELLED);
    }

    async payRental(userId: string, rentalId: string) {
        const rental = await this.rentalsRepository.findById(rentalId);
        if (!rental) throw new NotFoundException('Rental not found');

        if (rental.userId !== userId) {
            throw new ForbiddenException('You are not the owner of this rental request');
        }

        if (rental.status !== RentalStatus.PAYMENT_PENDING) {
            throw new BadRequestException('Rental is not pending payment');
        }

        return this.rentalsRepository.updateStatus(rentalId, RentalStatus.PAID);
    }
}
