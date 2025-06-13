import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleProtected } from '../auth/decorator/role.decorator';
import { UserRoleEnum } from './entity/user.entity';
import { Auth } from '../auth/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { RequestUser } from '../auth/types/request-user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('find')
  @Auth()
  @RoleProtected(UserRoleEnum.ADMIN, UserRoleEnum.SALON_OWNER, UserRoleEnum.SALON_WORKER)
  @ApiResponse({ status: 200, description: 'User list', type: Array<UserDto> })
  async findAll(): Promise<UserDto[]> {
    return await this.usersService.findAll()
  }

  @Get('pick/:id')
  @Auth()
  @RoleProtected(UserRoleEnum.ADMIN, UserRoleEnum.SALON_OWNER, UserRoleEnum.SALON_WORKER)
  @ApiResponse({ status: 200, description: 'User detail', type: UserDto })
  async findById(@Param('id', new ParseUUIDPipe()) id: string,): Promise<UserDto> {
    return await this.usersService.findById(id)
  }

  @Put('update/:id')
  @Auth()
  @RoleProtected(UserRoleEnum.SALON_OWNER, UserRoleEnum.ADMIN)
  @ApiResponse({ status: 201, description: 'Update user' })
  @ApiBody({
    type: UpdateUserDto
  })
  async update(@Param('id', new ParseUUIDPipe()) id: string, dto: UpdateUserDto): Promise<void> {
    return await this.usersService.updateUser(id, dto)
  }

  @Post('create')
  @Auth()
  @RoleProtected(UserRoleEnum.SALON_OWNER, UserRoleEnum.ADMIN)
  @ApiResponse({ status: 201, description: 'Create user' })
  @ApiBody({
    type: CreateUserDto
  })
  async create(@Body() dto: CreateUserDto): Promise<void> {
    return await this.usersService.createAdminUser(dto)
  }

  @Get('business')
  @Auth()
  @RoleProtected(UserRoleEnum.SALON_OWNER)
  async getBusinessUsers(@CurrentUser() user: RequestUser): Promise<UserDto[]> {
    return await this.usersService.getMyWorkplaceEmployees(user.sub)
  }

}
