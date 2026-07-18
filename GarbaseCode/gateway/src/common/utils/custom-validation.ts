import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common'
import { Response } from 'express'
import { ValidationError } from 'class-validator'

@Catch(BadRequestException)
export class CustomValidationFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus()
        const exceptionResponse: any = exception.getResponse()

        if (Array.isArray(exceptionResponse.message)) {
            response.status(status).json({
                statusCode: status,
                message: 'Validation failed',
                errors: this.formatErrors(exceptionResponse.message)
            })
        } else {
            response.status(status).json(exceptionResponse)
        }
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
