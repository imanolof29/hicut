import { IsOptional, IsString } from "@nestjs/class-validator"

export class UpdateUserDto {
    @IsString()
    firstName: string
    @IsString()
    lastName: string
    @IsString()
    phone: string

    @IsString()
    @IsOptional()
    avatar?: string
}