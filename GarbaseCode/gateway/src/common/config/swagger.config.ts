import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const config = new DocumentBuilder()
    .setTitle('Seenyor backend CICD')
    .setDescription('Seenyor admin APIs')
    .setVersion('1.0.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token',
            in: 'header'
        },
        'JWT'
    )
    .build()
