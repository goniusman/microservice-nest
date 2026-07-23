import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './common/database/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PermissionGuard, RedisModule } from '@my-app/shared';
import { HealthModule } from './health/health.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),

    MongooseModule.forRoot(
      process.env.MONGO_REVIEWS_URL ||
      'mongodb://localhost:27018/bookverse_reviews',
    ),
    // PrometheusModule.register({
    //   path: '/metrics',
    // }),

    // HealthModule,
    // // UsersModule,
    // RedisModule.register({
    //   maxRetriesPerRequest: 5,
    // }),
    HealthModule,
    ReviewsModule,

    RedisModule.register({
      maxRetriesPerRequest: 5,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
