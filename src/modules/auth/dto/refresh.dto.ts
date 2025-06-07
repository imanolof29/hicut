import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class RefreshDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string
}