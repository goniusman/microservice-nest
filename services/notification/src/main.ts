import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startMetricsServer } from './metrics/metrics.server';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log(
    '📨 Notification Service running (event consumer only)',
  );

    // 2. Start metrics server separately
  await startMetricsServer(3006);
}

bootstrap();


