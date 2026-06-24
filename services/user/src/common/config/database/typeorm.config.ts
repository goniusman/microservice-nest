import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',

  // The replication object replaces the standard single-connection parameters
  replication: {
    // 1. All Write commands go to the Primary Service
    master: {
      host: configService.get<string>('DB_MASTER_HOST'), // e.g., "bookverse-postgresql-primary"
      port: configService.get<number>('DB_MASTER_PORT', 5432), // K8s service internal port
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME_AUTH'),
    },
    // 2. All Read commands go to the Read Replica Load-Balancer Service
    slaves: [
      {
        host: configService.get<string>('DB_REPLICA_HOST'), // e.g., "bookverse-postgresql-read"
        port: configService.get<number>('DB_REPLICA_PORT', 5432), // K8s service internal port
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME_AUTH'),
      },
    ],
  },
  autoLoadEntities: true,

  // Keep this false in production environments to avoid race conditions 
  // between multiple running application instances.
  synchronize: true,

  // 1. Enable query logging
  logging: ['query', 'error'],
  // 2. Use 'advanced-console' to see structured outputs
  logger: 'advanced-console',


});









// Without Replication

// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const getTypeOrmConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => ({
//   type: 'postgres',

//   host: configService.get<string>('DB_HOST'),
//   port: configService.get<number>('DB_PORT'),

//   username: configService.get<string>('DB_USERNAME'),
//   password: configService.get<string>('DB_PASSWORD'),

//   database: configService.get<string>('DB_NAME'),

//   autoLoadEntities: true,

//   synchronize: true,
// });