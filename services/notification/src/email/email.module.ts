// email.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service.interface';
import { MockEmailService } from './adapters/mock-email.service';
import { SmtpEmailService } from './adapters/smtp-email.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EmailService,
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        return env === 'production' ? new SmtpEmailService() : new MockEmailService();
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}