// smtp-email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EmailService, SendEmailDto } from '../email.service.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SmtpEmailService implements EmailService {
    private readonly logger = new Logger(SmtpEmailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async send(dto: SendEmailDto): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: dto.to,
                subject: dto.subject,
                html: dto.body,
            });
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to send email to ${dto.to}`, error.stack);
            return false;
        }
    }
}