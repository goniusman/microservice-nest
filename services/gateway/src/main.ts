
// src/main.ts
import { otelSDK } from './tracing';
// Start the OpenTelemetry SDK before any other imports!
otelSDK.start();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston'
import { collectDefaultMetrics } from 'prom-client';
import helmet from 'helmet'
import * as bodyParser from 'body-parser';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.Interceptor';
import { AllExceptionsFilter } from './common/utils/exceptions.filter';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from './common/config/swagger.config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // disables log & verbose (e.g., RouterExplorer)
  });
  const configService = app.get(ConfigService)
  const logger = app.get<WinstonLogger>(WINSTON_MODULE_PROVIDER)

  collectDefaultMetrics({ prefix: 'seenyor_' });

  app.use(bodyParser.json()); // other routes
  const APP_ROUTE_PREFIX = 'api'
  app.use(helmet()) // for now disable helmet as it may cause issues with Swagger UI, later we can enable it
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: errors => new BadRequestException(errors)
    })
  )
  app.useGlobalInterceptors(new MetricsInterceptor());

  // app.enableCors(CORS_CONFIG)
  app.setGlobalPrefix(APP_ROUTE_PREFIX)
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // app.useGlobalFilters(new CustomValidationFilter())
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI })
  app.useGlobalInterceptors(new LoggerInterceptor(logger))
  // const slackService = new SlackService(configService)
  app.useGlobalFilters(new AllExceptionsFilter(logger, configService));


  // Configure CORS centrally 
  // app.enableCors({
  //   origin: ['https://yourfrontend.com'], 
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });

  // await app.listen(process.env.PORT ?? 3000);

  // app.use(compression());
  const expressApp = app.getHttpAdapter().getInstance();
  // const bullBoardService = app.get(BullBoardService);
  // bullBoardService.registerBullBoard(expressApp);
  SwaggerModule.setup(`${APP_ROUTE_PREFIX}-docs`, app, SwaggerModule.createDocument(app, config))
  await app.listen(configService.get<string>('PORT') ?? 3000)
  logger.log(`Application is running on port ${configService.get<string>('PORT')}`, 'Bootstrap')



}
bootstrap();


// testings is for docker hub...

