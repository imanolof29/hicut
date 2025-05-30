import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) { }


  async findAllForUser(userId: string) {
    return this.sessionRepository.find({
      where: { userId },
    })
  }

  async findById(id: string) {
    const session = await this.sessionRepository.findOneBy({ id });

    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }

    return session;
  }

  async delete(id: string) {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    await this.sessionRepository.delete(id);
  }
}
