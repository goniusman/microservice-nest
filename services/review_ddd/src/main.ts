// import { otelSDK } from './tracing';
// // Start the OpenTelemetry SDK before any other imports!
// otelSDK.start();


import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { randomUUID } from 'crypto';

// import { GlobalExceptionFilter } from './common/interceptors/http-exception.filter';
// import { TransformInterceptor } from './common/interceptors/transform.interceptor';

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


  const reflector = app.get(Reflector);
  // app.useGlobalInterceptors(new TransformInterceptor(reflector));
  // app.useGlobalFilters(new GlobalExceptionFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Reviews DDD Application is running on: ${port}`);
}
bootstrap();


