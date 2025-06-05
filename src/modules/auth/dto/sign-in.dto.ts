import { IsEmail, IsString, MinLength } from "@nestjs/class-validator"

export class SignInDto {
    @IsEmail()
    email: string
    @IsString()
    password: string
}