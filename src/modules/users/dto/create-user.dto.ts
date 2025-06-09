import { IsEmail, IsString, MinLength } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'First name'
    })
    firstName: string
    @IsString()
    @ApiProperty({
        type: String,
        description: 'Last name'
    })
    lastName: string
    @IsString()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'Email'
    })
    email: string
    @IsString()
    @ApiProperty({
        type: String,
        description: 'Phone'
    })
    phone: string
    @IsString()
    @MinLength(4)
    @ApiProperty({
        type: String,
        description: 'Password'
    })
    password: string
}