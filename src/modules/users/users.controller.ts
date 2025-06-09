import { Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('find')
  @ApiResponse({ status: 200, description: 'User list', type: Array<UserDto> })
  async findAll(): Promise<UserDto[]> {
    return await this.usersService.findAll()
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User detail', type: UserDto })
  async findById(@Param('id') id: string): Promise<UserDto> {
    return await this.usersService.findById(id)
  }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Update user' })
  @ApiBody({
    type: UpdateUserDto
  })
  async update(@Param('id') id: string, dto: UpdateUserDto): Promise<void> {
    return await this.usersService.updateUser(id, dto)
  }

}
