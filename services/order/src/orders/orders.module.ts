import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersConsumer } from './order.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
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
        uri: configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672'),
        registerHandlers: true,
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersConsumer
  ],
  exports: [OrdersService]
})
export class OrdersModule { }
