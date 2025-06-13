import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SessionsModule,
    BusinessesModule,
    AppointmentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'imanolortiz',
        password: '',
        database: 'hicut',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
