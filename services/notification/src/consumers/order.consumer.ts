import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrderConsumer
  implements OnModuleInit
{
  constructor(
    private readonly rabbitMQ: RabbitMQService,
    private readonly notifications: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQ.connect();

    const channel =
      this.rabbitMQ.getChannel();

    channel.consume(
      'order_created',
      async (msg) => {
        if (!msg) return;

        const payload =
          JSON.parse(
            msg.content.toString(),
          );

        await this.notifications.sendOrderCreatedNotification(
          payload,
        );

        channel.ack(msg);
      },
    );
  }
}