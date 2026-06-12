import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const rabbit = app.get(RabbitMQService);
  await rabbit.connect();
  await app.listen(process.env.PORT ?? 3003);

}
bootstrap();
