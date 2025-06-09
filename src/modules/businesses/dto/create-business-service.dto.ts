import { IsDecimal, IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator"

export class CreateBusinessServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsOptional()
    description: string
    @IsDecimal()
    price: number
}