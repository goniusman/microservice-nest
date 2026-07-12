import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    /**
     * GraphQL
     */
    if (host.getType<'graphql'>() === 'graphql') {
      if (exception instanceof HttpException) {
        throw new GraphQLError(exception.message, {
          extensions: {
            code: exception.getStatus(),
          },
        });
      }

      if (exception instanceof Error) {
        throw new GraphQLError(exception.message);
      }

      throw new GraphQLError('Internal server error');
    }

    /**
     * HTTP
     */
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      message =
        typeof res === 'object' && res !== null
          ? (res as any).message || exception.message
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}