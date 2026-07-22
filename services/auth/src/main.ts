import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();

// Import this first!
import "./instrument";

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { randomUUID } from 'crypto';

import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn'],
  });


  const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      // host: '0.0.0.0',
      // host: 'auth',
      port: 8877, // Internal TCP port
      // Socket reconnect/retry handling configuration
      retryAttempts: 5,
      retryDelay: 1000,
    },
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
  await app.startAllMicroservices();
  const port = process.env.PORT || 3000;
  app.enableShutdownHooks()
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Auth Application is running on: ${port} `); 
}
bootstrap();
