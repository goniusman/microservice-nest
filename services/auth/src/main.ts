import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { randomUUID } from 'crypto';


function generateId() {
  return randomUUID();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );


  app.use((req, res, next) => {
    const traceId = req.headers['x-trace-id'] || generateId();

    req['traceId'] = traceId;

    console.log({
      traceId,
      path: req.path,
      service: process.env.OTEL_SERVICE_NAME,
    });

    next();
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();


