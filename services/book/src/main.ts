import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomUUID } from 'crypto'
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/interceptors/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['log', 'error', 'warn']
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new GlobalExceptionFilter());
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 Book Application is running on: ${port}`);

}

bootstrap();
