import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BYPASS_KEY } from '../decorators/bypass.decorator';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | T>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | T> {
    /**
     * GraphQL
     */
    if (context.getType<'graphql'>() === 'graphql') {
      return next.handle();
    }

    /**
     * HTTP
     */
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();

    const request = http.getRequest();
    const response = http.getResponse();

    const excludedUrls = ['/health/live', '/health/ready', '/metrics'];

    if (excludedUrls.includes(request.url)) {
      return next.handle();
    }

    const isBypassed = this.reflector.getAllAndOverride<boolean>(BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypassed) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message: 'Request processed successfully',
        data: data ?? null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}