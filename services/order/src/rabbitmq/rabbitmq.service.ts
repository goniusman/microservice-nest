import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  // private connection: amqp.Connection | null = null;
  // private channel: amqp.Channel | null = null;

  private connection: any = null;
  private channel: any = null;

  async connect() {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL!,
    );

    this.connection.on('error', (err) => {
      this.logger.error('RabbitMQ connection error', err);
    });

    this.connection.on('close', () => {
      this.logger.warn('RabbitMQ connection closed');
      this.channel = null;
      this.connection = null;
    });

    this.channel = await this.connection.createChannel();

    this.logger.log('RabbitMQ connected');
  }

  async publish(queue: string, message: any) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.assertQueue(queue, {
      durable: true,
    });

    return this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );
  }

  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('Channel not ready');
    }
    return this.channel;
  }
}