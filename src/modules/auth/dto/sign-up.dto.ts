import { IsEmail, IsString, MinLength } from "@nestjs/class-validator"

export class SignUpDto {
    @IsString()
    firstName: string
    @IsString()
    lastName: string
    @IsEmail()
    email: string
    @IsString()
    @MinLength(5)
    password: string
}