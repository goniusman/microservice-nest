import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/user.module';
import { EnterpriseLoggerMiddleware } from './common/middleware/logger.middleware';
import { RedisModule } from './shared/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGO_BOOKS_URL ||
      'mongodb://localhost:27017/bookverse_books',
    ),
    PrometheusModule.register({
      path: '/metrics',
    }),
    BooksModule,
    HealthModule,
    UsersModule,
    RedisModule.register({
      maxRetriesPerRequest: 5,
    })// More aggressive retry for enterprise resilience
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EnterpriseLoggerMiddleware).forRoutes('*');
  }
}
