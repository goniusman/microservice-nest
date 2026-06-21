import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './common/config/typeorm.config';
import { UsersModule } from './users/users.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register({
      path: '/metrics', 
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    UsersModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
