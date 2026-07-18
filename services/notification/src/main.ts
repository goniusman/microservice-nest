import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomUUID } from 'crypto'

async function bootstrap() {
  // Bootstraps using whatever configuration is defined in AppModule
  const app = await NestFactory.createMicroservice(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['log', 'error', 'warn']
  });


  // {
  //       transport: Transport.RMQ,
  //       options: {
  //         // Point to your active RabbitMQ instance server broker
  //         urls: ['amqp://localhost:5672'],
  //         // Must match the exact delivery queue string configured in the review proxy
  //         queue: 'notification_queue',
  //         // Manual acknowledgment setting can be configured here for advanced tracking
  //         noAck: false, 
  //         queueOptions: {
  //           durable: true, // Persists the queue across RabbitMQ server reboots
  //         },
  //       },
  //     },


  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`${process.env.RABBITMQ_URL}`],
  //     queue: 'notification_email_queue', // Isolated queue
  //     queueOptions: {
  //       channelOptions: {
  //         exchange: 'bookverse_global_exchange', // Binds to the same global exchange
  //         exchangeType: 'fanout',
  //       },
  //     },
  //   },
  // });


  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );

  // function generateId() {
  //   return randomUUID();
  // }

  // app.use((req, res, next) => {
  //   const traceId = req.headers['x-trace-id'] || generateId();
  //   req['traceId'] = traceId;
  //   console.log({
  //     traceId,
  //     path: req.path,
  //     service: process.env.OTEL_SERVICE_NAME,
  //   });
  //   next();
  // });

  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalFilters(new GlobalExceptionFilter());
  // const port = process.env.PORT || 3002;
  // await app.listen(port);
  // console.log(`🚀 Book Application is running on: ${port}`);

  // const reflector = app.get(Reflector);
  // app.useGlobalInterceptors(new TransformInterceptor(reflector));
  // app.useGlobalFilters(new GlobalExceptionFilter());
  app.listen()
  console.log('📨 Notification Service running (event consumer only)')

}
bootstrap();
