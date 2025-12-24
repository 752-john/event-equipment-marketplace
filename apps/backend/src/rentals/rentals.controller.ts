import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
    constructor(private readonly rentalsService: RentalsService) { }

    @Post()
    create(@CurrentUser() user: User, @Body() createRentalDto: CreateRentalDto) {
        return this.rentalsService.create(user.id, createRentalDto);
    }

    @Get('my')
    findMy(@CurrentUser() user: User) {
        return this.rentalsService.getMyRentals(user.id);
    }

    @Get('company')
    findCompanyRentals(@CurrentUser() user: User) {
        return this.rentalsService.getCompanyRentals(user.id);
    }

    @Patch(':id/approve')
    approve(@CurrentUser() user: User, @Param('id') id: string) {
        return this.rentalsService.approveRental(user.id, id);
    }

    @Patch(':id/reject')
    reject(@CurrentUser() user: User, @Param('id') id: string) {
        return this.rentalsService.rejectRental(user.id, id);
    }

    @Patch(':id/pay')
    pay(@CurrentUser() user: User, @Param('id') id: string) {
        return this.rentalsService.payRental(user.id, id);
    }
}
