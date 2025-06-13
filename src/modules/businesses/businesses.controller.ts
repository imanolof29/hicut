import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { RequestUser } from '../auth/types/request-user';
import { BusinessDto } from './dto/business.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorator/auth.decorator';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) { }

  @Auth()
  @Post('create')
  @ApiResponse({ status: 201, description: 'Business created' })
  @ApiResponse({ status: 409, description: 'Business already exists' })
  async create(@Body() dto: CreateBusinessDto, @CurrentUser() requestUser: RequestUser): Promise<void> {
    return await this.businessesService.create(dto, requestUser.sub)
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Business details' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async findOne(@Param('id') id: string): Promise<BusinessDto> {
    return await this.businessesService.findOne(id)
  }

}
