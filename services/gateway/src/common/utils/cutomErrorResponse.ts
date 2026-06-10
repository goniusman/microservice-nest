import { BadRequestException } from '@nestjs/common'

export class CustomValidationException extends BadRequestException {
    constructor(property: string, message: string) {
        super({
            statusCode: 400,
            message: 'Validation failed',
            errors: [
                {
                    property: property,
                    message: message
                }
            ]
        })
    }
}
