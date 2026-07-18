import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
// import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
// import { OrderConsumer } from '../consumers/order.consumer';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotificationConsumer } from './consumers/notification.consumer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [

    EmailModule,
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
            name: 'notification_success_email_queue',
            exchange: 'bookverse_global_exchange',
            routingKey: 'inventory_reserved',
          },
          {
            name: 'notification_failure_email_queue',
            exchange: 'bookverse_global_exchange',
            routingKey: 'inventory_failed',
          },
          {
            name: 'notification_review_queue',
            exchange: 'bookverse_global_exchange',
            routingKey: 'review_created',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672'),
        registerHandlers: true,
        connectionInitOptions: { wait: true },
      }),
    }),

  ],
  controllers: [NotificationController],
  providers: [

    // RabbitMQService,
    NotificationsService,
    NotificationConsumer,
    // OrderConsumer,


  ],
})
export class NotificationsModule { }
