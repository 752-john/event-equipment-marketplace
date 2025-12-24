import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsOptional()
    description?: string;
}
