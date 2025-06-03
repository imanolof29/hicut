import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { SessionEntity } from '../sessions/entities/session.entity';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    SessionsModule,
    UsersModule,
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
