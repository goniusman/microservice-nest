import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGO_URL ||
      'mongodb://localhost:27017/bookverse_books',
    ),
    PrometheusModule.register({
      path: '/metrics', // The path Prometheus will scan
    }),
    BooksModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
