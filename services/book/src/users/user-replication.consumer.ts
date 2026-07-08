// import { Injectable } from '@nestjs/common';
// import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
// import { UserSnapshotStore } from './user-snapshot.store';

// @Injectable()
// export class UserReplicationConsumer {
//   constructor(private readonly store: UserSnapshotStore) {}

//   @RabbitSubscribe({
//     exchange: 'bookverse_global_exchange',
//     routingKey: 'user.created',
//     queue: 'user_created_queue',
//   })
//   handleUserCreated(msg: any) {
//     this.store.upsert(msg);
//     console.log('[Book] user replicated:', msg.userId);
//   }

//   @RabbitSubscribe({
//     exchange: 'bookverse_global_exchange',
//     routingKey: 'user.updated',
//     queue: 'user_created_queue',
//   })
//   handleUserUpdated(msg: any) {
//     this.store.upsert(msg);
//     console.log('[Book] user updated:', msg.userId);
//   }
// }