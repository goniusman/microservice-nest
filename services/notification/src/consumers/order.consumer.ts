// import {
//   Injectable,
//   Logger,
//   OnModuleInit,
// } from '@nestjs/common';

// import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
// import { NotificationsService } from '../notifications/notifications.service';

// @Injectable()
// export class OrderConsumer
//   implements OnModuleInit {
//   private readonly logger =
//     new Logger(OrderConsumer.name);

//   constructor(
//     private readonly rabbitMQ: RabbitMQService,
//     private readonly notifications: NotificationsService,
//   ) { }

//   async onModuleInit() {
//     await this.rabbitMQ.connect();

//     const channel =
//       this.rabbitMQ.getChannel();

//     await channel.consume(
//       'order_created',
//       async (msg) => {
//         if (!msg) {
//           return;
//         }

//         try {
//           const raw =
//             msg.content.toString();

//           const payload =
//             JSON.parse(raw);

//           await this.notifications.sendOrderCreatedNotification(
//             payload,
//           );

//           channel.ack(msg);

//           this.logger.log(
//             `Notification sent for order ${payload.orderId}`,
//           );
//         } catch (error) {
//           this.logger.error(
//             'Failed processing message',
//             error,
//           );

//           channel.nack(
//             msg,
//             false,
//             false,
//           );
//         }
//       },
//       {
//         noAck: false,
//       },
//     );

//     this.logger.log(
//       'Order Consumer Started',
//     );
//   }
// }