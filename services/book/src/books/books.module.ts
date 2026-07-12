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
import { RedisModule } from '../shared/redis/redis.module';
import { BookResolver } from './book.resolver';

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


  ],
  controllers: [BooksController],
  providers: [BooksService, BooksConsumer, BookResolver],
})
export class BooksModule { }
