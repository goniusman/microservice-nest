import { DynamicModule, Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({})
export class RedisModule {
    static register(options: RedisOptions): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_CLIENT,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        const client = new Redis({
                            host: configService.get<string>("REDIS_HOST", 'localhost'),
                            port: configService.get<number>('REDIS_PORT', 6379),
                            password: configService.get<string>('REDIS_PASSWORD'),
                            maxRetriesPerRequest: options.maxRetriesPerRequest ?? 3,
                            retryStrategy(times) {
                                // Exponential backoff strategy for enterprise resiliency
                                const delay = Math.min(times * 50, 2000);
                                return delay;
                            },
                            // Enable reconnection drop guard
                            reconnectOnError: (err) => {
                                const targetError = 'READONLY';
                                if (err.message.includes(targetError)) return true;
                                return false;
                            },
                        });

                        client.on('error', (err) => console.error('Redis Client Error', err));
                        client.on('connect', () => console.log('Redis Client Connected Successfully'));

                        return client;
                    },
                },
                RedisService,
            ],
            exports: [REDIS_CLIENT, RedisService],
        };
    }
}

// // redis.module.ts
// import { Module, Global } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Redis from 'ioredis';

// @Global()
// @Module({
//     providers: [
//         {
//             provide: 'REDIS_CLIENT',
//             inject: [ConfigService],
//             useFactory: (configService: ConfigService) => {
//                 return new Redis({
//                     host: configService.get<string>("REDIS_HOST", 'localhost'),
//                     port: configService.get<number>('REDIS_PORT', 6379),
//                     password: configService.get<string>('REDIS_PASSWORD'),
//                     maxRetriesPerRequest: 3,
//                     enableReadyCheck: true,
//                 });
//             },
//         },
//     ],
//     exports: ['REDIS_CLIENT'],
// })
// export class RedisModule { }


// export const REDIS_CLIENT = 'REDIS_CLIENT';

