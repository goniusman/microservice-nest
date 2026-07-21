import { Injectable, Inject, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
// import { RedisClientType } from 'redis';

import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_CLIENT) 
    private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    if (ttlSeconds) {
      await this.redisClient.set(key, stringValue, 'EX', ttlSeconds);
    } else {
      await this.redisClient.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // Ensure graceful shutdown inside Kubernetes/Minikube
  async onApplicationShutdown() {
    await this.redisClient.quit();
  }
}