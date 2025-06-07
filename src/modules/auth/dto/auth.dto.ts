import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/modules/users/dto/user.dto";

export class AuthDto {
    @ApiProperty({
        type: UserDto,
        description: 'UserDto'
    })
    user: UserDto
    @ApiProperty({
        type: String,
        description: 'Session Id'
    })
    session: string
    @ApiProperty({
        type: String,
        description: 'Access Token'
    })
    accessToken: string
    @ApiProperty({
        type: String,
        description: 'Refresh token'
    })
    refreshToken: string
}