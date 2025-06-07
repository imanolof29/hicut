import { IsEmail, IsString, MinLength } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SignUpDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'User first name'
    })
    firstName: string
    @IsString()
    @ApiProperty({
        type: String,
        description: 'User last name'
    })
    lastName: string
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'User email'
    })
    email: string
    @IsString()
    @MinLength(5)
    @ApiProperty({
        type: String,
        description: 'User password'
    })
    password: string
}