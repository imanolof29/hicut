import { IsOptional, IsString } from "@nestjs/class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
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
    @ApiProperty({
        type: String,
        description: 'Phone'
    })
    phone: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'User avatar'
    })
    avatar?: string
}