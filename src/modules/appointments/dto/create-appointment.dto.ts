import { IsDate, IsString, IsUUID } from "@nestjs/class-validator"

export class CreateAppointmentDto {
    @IsUUID()
    businessId: string
    @IsDate()
    appointmentDate: Date
    @IsString()
    startTime: string
    @IsString()
    endTime: string
}