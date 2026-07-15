// mock-email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EmailService, SendEmailDto } from '../email.service.interface';

@Injectable()
export class MockEmailService implements EmailService {
  private readonly logger = new Logger(MockEmailService.name);

  async send(dto: SendEmailDto): Promise<boolean> {
    this.logger.log(`[MOCK EMAIL SENT] To: ${dto.to} | Subject: ${dto.subject}`);
    // You can store sent emails in an in-memory array here for testing assertions
    return true;
  }
}