import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalsRepository } from './rentals.repository';
import { EquipmentsModule } from '../equipments/equipments.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { CompaniesRepository } from '../companies/companies.repository';

@Module({
  imports: [EquipmentsModule, UsersModule, CompaniesModule],
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository, CompaniesRepository], // Explicitly provide CompaniesRepo because CompaniesModule usually exports Service only
  // Ideally CompaniesModule should export CompaniesRepository. I'll check/fix CompaniesModule exports if needed or just provide here if it's transient. 
  // Better practice: Export Repository from CompaniesModule.
})
export class RentalsModule { }
