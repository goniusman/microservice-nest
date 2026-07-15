// notification.consumer.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationConsumer } from './notification.consumer';
import { EmailService } from './email.service.interface';

describe('NotificationConsumer', () => {
  let consumer: NotificationConsumer;
  let emailService: EmailService;

  const mockEmailService = {
    send: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationConsumer,
        {
          provide: EmailService,
          useValue: mockEmailService, // Swap actual service with our spy object
        },
      ],
    }).compile();

    consumer = module.get<NotificationConsumer>(NotificationConsumer);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should call the email service with correct parameters', async () => {
    const jobPayload = { email: 'user@example.com', message: 'Hello World' };
    
    await consumer.handleNotificationJob(jobPayload);

    expect(emailService.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'New Notification',
      body: '<p>Hello World</p>',
    });
  });
});