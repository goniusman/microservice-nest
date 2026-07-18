// email.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service.interface';
import { MockEmailService } from './adapters/mock-email.service';
import { SmtpEmailService } from './adapters/smtp-email.service';
import { SesEmailService } from './adapters/ses-email.service';
import { EmailProvider } from './email-provider.enum';


@Module({
  imports: [ConfigModule],
  providers: [
    // {
    //   provide: EmailService,
    //   useFactory: (configService: ConfigService) => {
    //     const env = configService.get<string>('NODE_ENV');
    //     return env === 'production' ? new SmtpEmailService() : new MockEmailService();
    //   },
    //   inject: [ConfigService],
    // },


    MockEmailService,
    SmtpEmailService,
    SesEmailService,
    {
      provide: EmailService,
      inject: [
        ConfigService,
        MockEmailService,
        SmtpEmailService,
        SesEmailService,

      ],
      useFactory: (
        configService: ConfigService,
        mock: MockEmailService,
        smtp: SmtpEmailService,
        ses: SesEmailService,

      ) => {
        // Fetch the provider from .env (e.g., 'ses', 'smtp'), defaulting to 'mock'
        const provider = configService.get<EmailProvider>('EMAIL_PROVIDER') || EmailProvider.SMTP;

        // Use a clean Strategy Map instead of complex if-else logic
        const adapterMap: Record<EmailProvider, EmailService> = {
          [EmailProvider.MOCK]: mock,
          [EmailProvider.SMTP]: smtp,
          [EmailProvider.SES]: ses,

        };

        // Fallback to mock if a wrong provider string was supplied by mistake
        return adapterMap[provider] || mock;
      },
    },





  ],
  exports: [EmailService],
})
export class EmailModule { }