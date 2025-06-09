import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty({
        type: String,
        description: 'Id'
    })
    id: string
    @ApiProperty({
        type: String,
        description: 'First name'
    })
    firstName: string
    @ApiProperty({
        type: String,
        description: 'Last name'
    })
    lastName: string
    @ApiProperty({
        type: String,
        description: 'Email'
    })
    email: string
    @ApiProperty({
        type: String,
        description: 'Avatar'
    })
    avatar?: string
}