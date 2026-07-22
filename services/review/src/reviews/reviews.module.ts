import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { ReviewController } from './infrastructure/delivery/review.controller';
import { CreateReviewHandler } from './application/commands/create-review.handler';
import { ReviewFactory } from './domain/factories/review.factory';
import { ReviewDocument, ReviewSchema } from './infrastructure/persistence/mongo/review.document';
import { GetReviewsByProductHandler } from './application/queries/get-reviews-product.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './infrastructure/persistence/postgres/review.entity';
import { PostgresReviewWriteRepository } from './infrastructure/persistence/postgres/postgres-review-write.repository';
import { DeleteReviewHandler } from './application/commands/delete-review.handler';
import { UpdateReviewHandler } from './application/commands/update-review.handler';
import { ReviewEligibilityService } from './domain/services/review-eligibility.service';
import { IReviewWriteRepositoryToken } from './domain/repositories/review-write.repository.interface';
import { PostgresReviewReadRepository } from './infrastructure/persistence/postgres/postgres-review-read.repository';
import { IReviewReadRepositoryToken } from './domain/repositories/review-read.repository.interface';
import { GetReviewsByProductQuery } from './application/queries/get-reviews-product.query';
import { GetReviewByIdHandler } from './application/queries/get-review.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';


const CommandHandlers = [CreateReviewHandler, UpdateReviewHandler, DeleteReviewHandler];
const QueryHandlers = [GetReviewByIdHandler, GetReviewsByProductHandler];

@Module({
  imports: [
    CqrsModule,
    // Infrastructure MongoDB registration
    MongooseModule.forFeature([{ name: ReviewDocument.name, schema: ReviewSchema }]),
    TypeOrmModule.forFeature([ReviewEntity]),
    // ClientsModule.register([
    //   {
    //     name: 'NOTIFICATION_SERVICE_PROXY',
    //     transport: Transport.RMQ,
    // { inheritAppConfig: true }, // inherit global pipes, interceptors, guards and filters configured for the main (HTTP-based) application
    //     options: {
    //       urls: ['amqp://localhost:5672'], // Your RabbitMQ server instance address
    //       queue: 'review_created',
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),

    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'bookverse_global_exchange',
            type: 'direct',
          },
        ],
        queues: [
          {
            name: 'review_moderation_requested',
            exchange: 'bookverse_global_exchange',
            routingKey: 'review_moderation_requested',
          },
          {
            name: 'review_book_rating_changed',
            exchange: 'bookverse_global_exchange',
            routingKey: 'book_rating_changed',
          },
          {
            name: 'review_published',
            exchange: 'bookverse_global_exchange',
            routingKey: 'review_published',
          },
          
        ],
        uri: configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672'),
        registerHandlers: true,
        connectionInitOptions: { wait: true },
      }),
    }),

    ClientsModule.register([
      {
        name: 'AUTH_TCP_SERVICE',
        transport: Transport.TCP,
        options: {
          // host: '127.0.0.1',
          host: 'auth',
          port: 8877,
        },
      },
    ]),

  ],
  controllers: [ReviewController],
  providers: [
    ReviewFactory,
    ...CommandHandlers,
    ...QueryHandlers,

    ReviewEligibilityService,
    // {
    //   // Dependency Inversion mapping
    //   provide: IReviewRepositoryToken,
    //   useClass: MongoReviewRepository, // Swap this class to replace MongoDB completely
    // },
    // {
    //   provide: IReviewRepositoryToken,
    //   useClass: PostgresReviewRepository, 
    // },
    {
      provide: IReviewWriteRepositoryToken,
      useClass: PostgresReviewWriteRepository,
    },
    {
      provide: IReviewReadRepositoryToken,
      useClass: PostgresReviewReadRepository,
    },
    {
      provide: 'ORDER_REPOSITORY_TOKEN',
      useValue: {
        hasUserPurchasedBook: async (userId: string, bookId: string) => {
          // Temporary stub: returns true for all checks until connected to the infrastructure layer
          return true;
        },
      },
    }
  ],
})
export class ReviewsModule { }