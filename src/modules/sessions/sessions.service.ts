import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class SessionsService {

  private readonly logger = new Logger(SessionsService.name)

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) { }

  async create(userId: string): Promise<SessionEntity> {
    const session = await this.sessionRepository.create({
      userId
    })
    await this.sessionRepository.save(session)
    return session
  }


  async findAllForUser(userId: string) {
    return await this.sessionRepository.find({
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

  async invalidate(id: string) {
    const session = await this.sessionRepository.findOneBy({ id })
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    session.active = false
    this.sessionRepository.save(session)
  }

  async delete(id: string) {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    await this.sessionRepository.delete(id);
  }
}
