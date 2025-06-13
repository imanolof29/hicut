import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/business.entity';
import { UserEntity } from '../users/entity/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity, UserEntity]), AuthModule],
  controllers: [BusinessesController],
  providers: [BusinessesService],
})
export class BusinessesModule { }
