import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@CurrentUser() user: User, @Body() createCompanyDto: CreateCompanyDto) {
        return this.companiesService.create(user.id, createCompanyDto);
    }
}
