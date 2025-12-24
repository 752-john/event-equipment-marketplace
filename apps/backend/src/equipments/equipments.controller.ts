import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('equipments')
export class EquipmentsController {
    constructor(private readonly equipmentsService: EquipmentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@CurrentUser() user: User, @Body() createEquipmentDto: CreateEquipmentDto) {
        return this.equipmentsService.create(user.id, createEquipmentDto);
    }

    @Get()
    findAll() {
        return this.equipmentsService.findAllActive();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    findMy(@CurrentUser() user: User) {
        return this.equipmentsService.findMyEquipments(user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.equipmentsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: string,
        @Body() updateEquipmentDto: UpdateEquipmentDto,
    ) {
        return this.equipmentsService.update(user.id, id, updateEquipmentDto);
    }
}
