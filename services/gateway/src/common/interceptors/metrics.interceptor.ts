import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';
import { Observable, tap } from 'rxjs';

const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

const httpRequestCount = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestErrorsCount = new Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP error responses (4xx, 5xx)',
  labelNames: ['method', 'route', 'status'],
});

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const method = req.method;
    // Use route path if available, fallback to url (avoid query params for cardinality)
    const route = req.route?.path || req.url.split('?')[0];

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const status = res.statusCode;
        const duration = (Date.now() - start) / 1000;

        // Record duration
        httpRequestDurationSeconds.labels(method, route, status.toString()).observe(duration);

        // Increment total requests
        httpRequestCount.labels(method, route, status.toString()).inc();

        // Increment errors counter for 4xx and 5xx
        if (status >= 400 && status < 600) {
          httpRequestErrorsCount.labels(method, route, status.toString()).inc();
        }
      }),
    );
  }
}
