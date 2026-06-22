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

    // Check if the handler method has the bypass metadata
    const isBypassed = this.reflector.getAllAndOverride<boolean>(BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypassed) {
      return next.handle(); // Skip processing and return raw data
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