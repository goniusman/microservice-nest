// book-service/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';
// import { PermissionGuard } from './guards/permission.guard';
// import { RedisModule } from '../shared/redis/redis.module';
import { AbacEngineService } from './abac/abac-engine.service';
import { PermissionGuard } from '@my-app/shared';

@Module({
    imports: [
        // Connect to the shared microservice Redis cluster locally
        // CacheModule.register({
        //   store: redisStore as any,
        //   host: 'redis-server',
        //   port: 6379,
        // }),
        // RedisModule.register({
        //     maxRetriesPerRequest: 5,
        // }), // More aggressive retry for enterprise resilience
        // Register the internal TCP connection network mapping
        ClientsModule.register([
            {
                name: 'AUTH_TCP_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '127.0.0.1',
                    // host: 'auth',
                    port: 8877,
                },
            },
        ]),
    ],
    providers: [PermissionGuard, AbacEngineService],
    exports: [ClientsModule, PermissionGuard],
})
export class AuthModule { }