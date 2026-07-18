import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message safely
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const resContent = exception.getResponse();
      message =
        typeof resContent === 'object' && resContent !== null
          ? (resContent as any).message || exception.message
          : exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Return the identical structure matching your Interceptor
    response.status(status).json({
      success: false, // 👈 Explicitly false for errors
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null, 
      timestamp: new Date().toISOString(),
    });
  }
}