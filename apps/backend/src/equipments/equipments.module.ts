import { Module } from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { EquipmentsController } from './equipments.controller';
import { EquipmentsRepository } from './equipments.repository';
import { CompaniesModule } from '../companies/companies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CompaniesModule, UsersModule],
  controllers: [EquipmentsController],
  providers: [EquipmentsService, EquipmentsRepository],
  exports: [EquipmentsService, EquipmentsRepository], // Export for Rentals check
})
export class EquipmentsModule { }
