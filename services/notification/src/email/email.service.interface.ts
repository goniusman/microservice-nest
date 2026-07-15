// email.service.interface.ts
export interface SendEmailDto {
  to: string;
  subject: string;
  body: string; // or html
}

export abstract class EmailService {
  abstract send(dto: SendEmailDto): Promise<boolean>;
}