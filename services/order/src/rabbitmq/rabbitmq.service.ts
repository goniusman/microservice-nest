import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private channel: amqp.Channel;

  async connect() {
    const connection = await amqp.connect(`${process.env.RABBITMQ_URL}`);
    this.channel = await connection.createChannel();
  }

  async publish(
    queue: string,
    message: any,
  ) {
    await this.channel.assertQueue(queue);

    this.channel.sendToQueue(
      queue,
      Buffer.from(
        JSON.stringify(message),
      ),
    );
  }
}