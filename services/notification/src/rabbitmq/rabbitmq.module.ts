import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  controllers: [],
  providers: [RabbitMQService],
})
export class RabbitmqModule {}
