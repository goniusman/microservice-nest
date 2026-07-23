import { Module, OnModuleInit } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DiscoveryModule } from '@nestjs/core';
import { BooksConsumer } from './book.consumer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookResolver } from './book-resolver';
import { AuthModule } from '../auth/auth.module';
import { BookPolicy } from './policies/book.policy';
import { AbacEngineService } from '../auth/abac/abac-engine.service';
import { IUserProfile } from '@my-app/shared';
import { PermissionGuard } from '@my-app/shared';

@Module({
  imports: [

    DiscoveryModule,

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
            name: 'book_inventory_queue',
            exchange: 'bookverse_global_exchange',
            routingKey: 'order_created', // Binds the queue to this exact event key
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672'),
        registerHandlers: true,
        connectionInitOptions: { wait: true },
      }),
    }),

    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
    ]),

    AuthModule,
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
  controllers: [BooksController],
  providers: [BooksService, BooksConsumer, BookResolver, BookPolicy, AbacEngineService, PermissionGuard],
  exports: [PermissionGuard, ClientsModule]
})
export class BooksModule { }
