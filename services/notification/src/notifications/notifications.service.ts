import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendOrderCreatedNotification(
    payload: any,
  ) {
    // simulate email sending
    console.log(
      '📧 EMAIL SENT TO USER',
      payload.userId,
    );

    console.log(
      '📦 ORDER CONFIRMED:',
      payload.orderId,
    );

    return true;
  }
}