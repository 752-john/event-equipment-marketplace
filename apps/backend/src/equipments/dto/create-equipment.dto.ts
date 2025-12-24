import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUrl, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EquipmentStatus } from '@prisma/client';

export class CreateEquipmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsEnum(EquipmentStatus)
    @IsOptional()
    status?: EquipmentStatus;
}
