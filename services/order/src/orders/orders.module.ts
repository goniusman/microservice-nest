import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [

    OrdersService,
    RabbitMQService
  ],
})
export class OrdersModule { }
