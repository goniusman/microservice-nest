import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controller/auth.controller';
import { AuthProxy } from './proxy/auth.proxy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookController } from './controller/book.controller';
import { BookProxy } from './proxy/book.proxy';
import { OrderController } from './controller/order.controller';
import { OrderProxy } from './proxy/order.proxy';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
} from '@nestjs/core';

import {
  ThrottlerGuard,
} from '@nestjs/throttler';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { GatewayAuthGuard } from './common/guards/jwt-auth.guard';
// import { MongoExceptionFilter } from './common/utils/MongoExceptionFilter';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file'
import { PromModule } from '@digikare/nestjs-prom'
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import { LoggerInterceptor } from './common/interceptors/logger.Interceptor';
import { AllExceptionsFilter } from './common/utils/exceptions.filter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';


@Module({
  imports: [

    CacheModule.register({
      // ttl: 60*60, // seconds
      max: 100000000, // maximum number of items in cache
      isGlobal: true // make cache globally available
    }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'test' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    PromModule.forRoot({
      defaultLabels: {
        app: 'bookverse'
      }
      // path: '/metrics', // optional, defaults to /metrics
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.json(),
          }),
          new DailyRotateFile({
            level: 'info',
            filename: `logs/info/%DATE%-info.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '2d',
            format: winston.format.combine(
              winston.format((info: winston.Logform.TransformableInfo) => {
                const ignoredPatterns = ['/api/v1/metrics', 'version', 'Mapped', 'ChatGateway'];

                // Cast info.message as a string if TypeScript complains about it being unknown
                const message = info.message as string;

                if (message && ignoredPatterns.some(pattern => message.includes(pattern))) {
                  return false; // Skip logging this entry
                }

                return info;
              })(),


              winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
              nestWinstonModuleUtilities.format.nestLike('BOOKVERSE', { prettyPrint: true }),
            ),
          }),
          new DailyRotateFile({
            level: 'error',
            filename: `logs/error/%DATE%-error.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '5d',
            format: winston.format.combine(
              winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
              nestWinstonModuleUtilities.format.nestLike('BOOKVERSE', { prettyPrint: true }),
            ),
          }),

        ],
      }),
    }),

    PrometheusModule.register({
      path: '/metrics', // The path Prometheus will scan
    }),

  ],
  controllers: [AuthController, BookController, OrderController, AppController],
  providers: [
    AppService,
    // { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard, },
    // { provide: APP_GUARD, useClass: GatewayAuthGuard, },
    // {
    //   provide: APP_FILTER,
    //   useClass: MongoExceptionFilter
    // },
    AuthProxy,
    BookProxy,
    OrderProxy
  ],
})


export class AppModule
  implements NestModule {
  configure(
    consumer: MiddlewareConsumer,
  ) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(CorrelationIdMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
