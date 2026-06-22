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
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) { }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();


    // 1. HARD EXCLUSIONS: Instantly bypass by URL path strings
    // This catches Kubernetes liveness probes and Prometheus metrics endpoints perfectly!
    const excludedUrls = ['/health/live', '/health/ready', '/metrics'];
    if (excludedUrls.includes(request.url)) {
      return next.handle();
    }

    // 2. DECORATOR BYPASS: Check if your custom methods are explicitly tagged
    const isBypassed = this.reflector.getAllAndOverride<boolean>(BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypassed) {
      return next.handle();
    }



    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: statusCode,
        message: 'Request processed successfully',
        // If your controller returns an object with a custom message, you can extract it here, 
        // otherwise default to standard data payload
        data: data ?? null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}