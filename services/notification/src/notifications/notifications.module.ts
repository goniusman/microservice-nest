import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { OrderConsumer } from '../consumers/order.consumer';

@Module({
  controllers: [],
  providers: [
    
    RabbitMQService,
    NotificationsService,
    OrderConsumer,
  
  ],
})
export class NotificationsModule {}
