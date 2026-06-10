import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest()
        const res = context.switchToHttp().getResponse() // Get response object to capture status code

        const authHeader = req?.headers?.authorization
        let userid: any
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const [type, token] = req?.headers?.authorization?.split(' ') ?? []
            const jwtService = new JwtService() // Create an instance of JwtService

            const payload = await jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            })
            userid = payload?._id || null // Extract userId from JWT payload if available
        }

        const method = req.method
        const url = req.url
        const ip = req.ip || req.connection.remoteAddress
        const userAgent = req.headers['user-agent']
        const originalUrl = req.originalUrl || req.url // Use originalUrl for full path

        // Stringify body early to avoid issues if it's accessed later or mutated
        const requestBodyString = safeStringify(req.body)

        const ignoredPaths = ['/metrics', '/healthz', '/api-docs', '/api/v1/metrics']

        if (ignoredPaths.includes(url) || ignoredPaths.includes(originalUrl)) {
            // Check both url and originalUrl
            return next.handle()
        }

        const startTime = Date.now() // Capture start time for duration calculation

        return next.handle().pipe(
            tap(data => {
                const responseBodyString = safeStringify(data)
                const statusCode = res.statusCode // Get status code from response object
                const duration = Date.now() - startTime // Calculate request duration

                // Log successful request as a structured object
                this.logger.info(
                    `API Request Handled ${JSON.stringify({
                        userid,
                        method,
                        url: originalUrl,
                        ip: ip,
                        userAgent: userAgent,
                        requestBody: requestBodyString,
                        responseBody: responseBodyString,
                        statusCode: statusCode,
                        durationMs: duration, // Add request duration
                        context: 'LoggerInterceptor'
                    })}`
                )
            }),
            catchError(error => {
                // const statusCode = error.status || res.statusCode || 500 // Get status code from error or response
                // const duration = Date.now() - startTime // Calculate duration even on error
                // console.log('Error occurred:=========<<>>', error)

                // Log error as a structured object
                // this.logger.error('API Request Error', {
                //     http: {
                //         userid,
                //         method: method,
                //         url: originalUrl, // Use originalUrl
                //         ip: ip,
                //         userAgent: userAgent,
                //         requestBody: requestBodyString,
                //         statusCode: statusCode,
                //         durationMs: duration // Add request duration
                //     },
                //     error: {
                //         message: error.message,
                //         stack: error.stack,
                //         code: error.code, // Include custom error codes if available
                //         name: error.name // Include error name
                //     },
                //     context: 'LoggerInterceptor'
                // })
                return throwError(() => error) // Re-throw the error to continue NestJS error handling
            })
        )
    }
}

// Helper function to safely stringify objects, preventing circular references
function safeStringify(obj: any): string {
    const seen = new WeakSet()
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]'
            seen.add(value)
        }
        return value
    })
}
