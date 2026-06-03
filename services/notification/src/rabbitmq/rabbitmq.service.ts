import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private channel: amqp.Channel;

  async connect() {
    const connection = await amqp.connect(`${process.env.RABBITMQ_URL}`);

    this.channel =
      await connection.createChannel();

    await this.channel.assertQueue(
      'order_created',
    );
  }

  getChannel() {
    return this.channel;
  }
}