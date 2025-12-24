import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateRentalDto {
    @IsUUID()
    @IsNotEmpty()
    equipmentId: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}
