import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusinessServicesService } from "./business-services.service";
import { BusinessServiceDto } from "./dto/business-service.dto";
import { CreateBusinessServiceDto } from "./dto/create-business-service.dto";

@ApiTags('BusinessService')
@Controller('businesses/:businessId/services')
export class BusinessServicesController {
    constructor(private readonly businessServiceService: BusinessServicesService) { }

    @Get('find')
    async find(
        @Param('businessId') id: string
    ): Promise<BusinessServiceDto[]> {
        return await this.businessServiceService.find(id)
    }

    @Post('create')
    async create(
        @Param('businessId') id: string,
        @Body() dto: CreateBusinessServiceDto
    ): Promise<void> {
        return await this.businessServiceService.create(id, dto)
    }

}