import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusinessServicesService } from "./business-services.service";
import { BusinessServiceDto } from "./dto/business-service.dto";
import { CreateBusinessServiceDto } from "./dto/create-business-service.dto";
import { Auth } from "../auth/decorator/auth.decorator";
import { RoleGuard } from "../auth/guards/role.guard";
import { UserRoleEnum } from "../users/entity/user.entity";
import { RoleProtected } from "../auth/decorator/role.decorator";

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
    @Auth()
    @RoleProtected(UserRoleEnum.SALON_OWNER, UserRoleEnum.ADMIN)
    async create(
        @Param('businessId') id: string,
        @Body() dto: CreateBusinessServiceDto
    ): Promise<void> {
        return await this.businessServiceService.create(id, dto)
    }

}