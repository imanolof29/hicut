import { IsEmail, IsString, MinLength } from "@nestjs/class-validator"

export class CreateUserDto {
    @IsString()
    firstName: string
    @IsString()
    lastName: string
    @IsString()
    @IsEmail()
    email: string
    @IsString()
    phone: string
    @IsString()
    @MinLength(4)
    password: string
}