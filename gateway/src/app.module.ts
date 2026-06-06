import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controller/auth.controller';
import { AuthProxy } from './proxy/auth.proxy';
import { ConfigModule } from '@nestjs/config';
import { BookController } from './controller/book.controller';
import { BookProxy } from './proxy/book.proxy';
import { OrderController } from './controller/order.controller';
import { OrderProxy } from './proxy/order.proxy';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  APP_GUARD,
} from '@nestjs/core';

import {
  ThrottlerGuard,
} from '@nestjs/throttler';
import { LoggerMiddleware } from './middleware/logger.middleware';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),

  ],
  controllers: [AuthController, BookController, OrderController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AuthProxy,
    BookProxy,
    OrderProxy
  ],
})


export class AppModule
  implements NestModule
{
  configure(
    consumer: MiddlewareConsumer,
  ) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
