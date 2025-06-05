import { IsEmail, IsOptional, IsString } from "@nestjs/class-validator"

export class CreateBusinessDto {
    @IsString()
    name: string
    @IsEmail()
    email: string
    @IsString()
    @IsOptional()
    logo?: string
    @IsString()
    address: string
}
