import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register({
      path: '/metrics', // The path Prometheus will scan
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URL ||
      'mongodb://localhost:27018/bookverse_books',
    ),
    OrdersModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
