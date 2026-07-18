import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getTypeOrmConfig } from './common/config/database/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthModule } from './health/health.module';
import { EnterpriseLoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),

    PrometheusModule.register({
      path: '/metrics', // The path Prometheus will scan
    }),
    AuthModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor, 
    // },
  ]
})

export class AppModule implements NestModule, OnModuleInit {
  
  // 1. Injected dependencies in the constructor
  constructor(private readonly dataSource: DataSource) {}

  // 2. Implemented OnModuleInit hook
  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('======================================================');
      console.log('✅ DATABASE CONNECTED SUCCESSFULLY IN SYSTEM');
      // console.log(`Primary (Master) Target: ${process.env.DB_MASTER_HOST}`);
      // console.log(`Replica (Slave) Target:  ${process.env.DB_REPLICA_HOST}`);
      console.log('======================================================');
    } else {
      console.error('❌ Database initialization failed.');
    }
  }

  // 3. Implemented NestModule interface for middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EnterpriseLoggerMiddleware).forRoutes('*');
  }
}