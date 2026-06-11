import {
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import * as amqp from 'amqplib';

import {
  Channel,
  Connection,
} from 'amqplib';

@Injectable()
export class RabbitMQService
  implements OnModuleDestroy {
  private readonly logger =
    new Logger(RabbitMQService.name);

  private connection: any = null;

  private channel: any = null;

  async connect(): Promise<void> {
    if (
      this.connection &&
      this.channel
    ) {
      return;
    }

    try {
      this.connection =
        await amqp.connect(
          process.env.RABBITMQ_URL!,
        );

      this.connection.on(
        'error',
        (err) => {
          this.logger.error(
            `RabbitMQ Connection Error`,
            err,
          );
        },
      );

      this.connection.on(
        'close',
        () => {
          this.logger.warn(
            'RabbitMQ Connection Closed',
          );

          this.connection = null;
          this.channel = null;
        },
      );

      this.channel =
        await this.connection.createChannel();

      await this.channel.assertQueue(
        'order_created',
        {
          durable: true,
        },
      );

      await this.channel.prefetch(10);

      this.logger.log(
        'RabbitMQ Connected',
      );
    } catch (error) {
      this.logger.error(
        'RabbitMQ Connection Failed',
        error,
      );

      throw error;
    }
  }

  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error(
        'RabbitMQ channel not initialized',
      );
    }

    return this.channel;
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}