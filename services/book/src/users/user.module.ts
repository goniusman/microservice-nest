// import { Module, OnModuleInit } from '@nestjs/common';

// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './schemas/user.schema';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
// import { DiscoveryModule } from '@nestjs/core';

// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { UserReplicationConsumer } from './user-replication.consumer';
// import { UserSnapshotStore } from './user-snapshot.store';

// @Module({
//   imports: [

//     RabbitMQModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         exchanges: [
//           {
//             name: 'bookverse_global_exchange',
//             type: 'direct',
//           },
//         ],
//         queues: [
//           {
//             name: 'user_created_queue',
//             exchange: 'bookverse_global_exchange',
//             routingKey: 'user.created', 
//           },
//         ],
//         uri: configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672'),
//         registerHandlers: true,
//         connectionInitOptions: {wait: true},
//       }),
//     }),

//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//     ]),
//   ],
//   controllers: [],
//   providers: [UserReplicationConsumer, UserSnapshotStore],
// })
// export class UsersModule { }
