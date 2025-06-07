import { IsEmail, IsString, MinLength } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SignInDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'User email'
    })
    email: string
    @IsString()
    @ApiProperty({
        type: String,
        description: 'User password'
    })
    password: string
}