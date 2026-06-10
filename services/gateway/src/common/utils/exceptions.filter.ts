import {
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    ExceptionFilter,
    Inject,
    Injectable,
    BadRequestException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
// import { SlackService } from 'src/modules/slack/slack.service'
import { Logger } from 'winston'
// import { MongoServerError } from 'mongodb'
import { ValidationError } from 'class-validator'
// 
@Catch() // This filter catches ALL exceptions
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly NODE_ENV: string

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        // private readonly slackService: SlackService,
        private readonly configService: ConfigService
        // private readonly jwtService: JwtService // Correctly injected JwtService
    ) {
        // this.NODE_ENV = this.configService.get<string>('NODE_ENV')
    }

    private async extractUserIdFromToken(authHeader: string): Promise<string | null> {
        const jwtService = new JwtService()
        if (!authHeader?.startsWith('Bearer ')) return null

        const token = authHeader.split(' ')[1]
        try {
            // Use the injected service instance to verify the token
            const payload = await jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_ACCESS_KEY')
            })
            return payload?._id || null
        } catch {
            return null
        }
    }

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        const ip = request.ip || request.connection.remoteAddress
        const userAgent = request.headers['user-agent']
        const authHeader = request?.headers?.authorization ?? ""
        const userid = await this.extractUserIdFromToken(authHeader)

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message: string | string[] | Record<string, string> = 'Internal server error'
        let errorType: any = HttpStatus[status]
        let stack: string  = "Default String";

        // Centralized logic to handle different exception types
        if (exception instanceof BadRequestException) {
            // Logic for DTO validation errors, coming from ValidationPipe
            status = exception.getStatus()
            const exceptionResponse = exception.getResponse() as any

            if (
                Array.isArray(exceptionResponse.message) &&
                exceptionResponse.message.every(m => m instanceof ValidationError)
            ) {
                message = 'Validation failed'
                errorType = this.formatErrors(exceptionResponse.message)
            } else {
                message = exceptionResponse.message
                errorType = exception?.name || exceptionResponse.error
            }
        // } else if (exception instanceof MongoServerError) {
        //     // Your custom logic for MongoServerError
        //     status = exception.code === 11000 ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR
        //     message =
        //         exception.code === 11000 && exception.keyPattern.email === 1
        //             ? 'Email already exists'
        //             : 'Database error occurred'
        //     errorType = exception?.name ||  'MongoServerError'
        //     stack = exception.stack
        } else if (exception instanceof HttpException) {
            // NestJS's standard HTTP exceptions (other than BadRequest)
            status = exception.getStatus()
            const responseBody = exception.getResponse()
            message = (responseBody as any).message || exception.message
            errorType = exception?.name || (responseBody as any).error || HttpStatus[status]
            // stack = exception instanceof Error ? exception.stack : "http exceptions"
            stack = 'custom http exceptions'
        } else if (exception instanceof Error) {
            // Catch all unhandled standard JavaScript Error objects
            message = exception.message
            errorType = exception?.name || 'Unhandled Error'
            stack = exception.stack ? exception.stack : "all unhandeld error"
        }

        // Winston logging
        this.logger.error(
            `[${JSON.stringify(errorType)}] - ${JSON.stringify({ userid, ip, userAgent, body: request.body, method: request.method, timestamp: new Date().toISOString(), path: request.url, statusCode: status, error: errorType, message: message })}`,
            stack || ''
        )

        // TODO:- Optional: Handle 404s later wil enabled 
        // if (exception instanceof NotFoundException) {
        //     return response.status(HttpStatus.NOT_FOUND).json({
        //         statusCode: 404,
        //         path: request.url,
        //         message: 'The requested resource was not found.',
        //     });
        // }

        // Slack notification for critical errors in production
        // if (this.NODE_ENV === 'production') {
        //     const slackText =
        //         `<!channel> ⚠️ **Critical Error** ⚠️\n` +
        //         `*Path:* \`${request.method} ${request.url}\`\n` +
        //         `*Status:* \`${status}\`\n` +
        //         `*User Agent:* \`${userAgent}\`\n` +
        //         `*Message:* \`\`\`${typeof message === 'string' ? message : JSON.stringify(message)}\`\`\`\n` +
        //         `*User ID:* \`${userid || 'N/A'}\`\n` +
        //         `*Stack Trace:*\n` +
        //         `\`\`\`\n${stack || 'No stack trace available.'}\n\`\`\``

        //     // const channel = this.configService.get<string>('SLACK_API_WARNING')
        //     // this.slackService.sendMessage(slackText, channel).catch(e => {
        //     //     this.logger.error(`Failed to send Slack alert: ${e.message}`)
        //     // })
        // }

        // Send a standardized JSON error response to the client
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            errors: errorType
        })
    }

    private formatErrors(validationErrors: ValidationError[]): Array<any> {
        return validationErrors.map((error: ValidationError) => ({
            property: error.property,
            message: this.buildConstraints(error)
        }))
    }

    private buildConstraints(error: ValidationError): Record<string, string> {
        const constraints = {}

        // Capture all constraints even if validation passed
        if (error.constraints) {
            for (const [constraint, message] of Object.entries(error.constraints)) {
                constraints[constraint] = message
            }
        }

        // If children validation errors exist, we handle them recursively
        if (error.children && error.children.length) {
            for (const childError of error.children) {
                Object.assign(constraints, this.buildConstraints(childError))
            }
        }

        return constraints
    }
}
