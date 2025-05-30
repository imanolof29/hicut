import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Get()
  findAll() {
    return this.sessionsService.findAllForUser("");
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.delete(id);
  }
}
