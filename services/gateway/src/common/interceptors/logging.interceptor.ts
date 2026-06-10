// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API-GATEWAY');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const correlationId = req.headers['x-correlation-id'];
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => 
          this.logger.log(`[${correlationId}] ${method} ${url} completed in ${Date.now() - now}ms`)
        ),
      );
  }
}