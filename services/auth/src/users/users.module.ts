import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from '../auth/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'bookverse_global_exchange',
            type: 'direct',
          },
        ],
        queues: [
          {
            name: 'user_created_queue',
            exchange: 'bookverse_global_exchange',
            routingKey: 'user.created',
          },
        ],
        uri: configService.get<string>(
          'RABBITMQ_URL',
          'amqp://guest:guest@localhost:5672',
        ),
        registerHandlers: true,
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
