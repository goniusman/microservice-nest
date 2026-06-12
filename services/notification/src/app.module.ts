import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NotificationsModule,
    PrometheusModule.register({
      path: '/metrics', // The path Prometheus will scan
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
