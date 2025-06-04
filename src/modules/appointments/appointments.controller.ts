import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { RequestUser } from '../auth/types/request-user';
import { AppointmentDto } from './dto/appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post('create')
  async create(
    @Body() dto: CreateAppointmentDto,
    @CurrentUser() user: RequestUser
  ): Promise<void> {
    return await this.appointmentsService.create(dto, user.sub)
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<AppointmentDto> {
    return await this.appointmentsService.findOne(id)
  }

  @Get('availability/:businessId')
  async getAvailability(
    @Param('businessId') businessId: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string
  ) {
    return await this.appointmentsService.getAvailability(businessId, new Date(dateFrom), new Date(dateTo))
  }

  @Patch(':id')
  async cancel(
    @Param('businessId') businessId: string,
    @CurrentUser() user: RequestUser
  ) {
    return await this.appointmentsService.cancel(businessId)
  }


}
