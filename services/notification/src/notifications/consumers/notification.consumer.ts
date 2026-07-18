
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../../email/email.service.interface';


@Injectable()
export class NotificationConsumer {

    constructor(private readonly emailService: EmailService) { }

    //   @EventPattern('inventory_reserved')
    //   async sendOrderConfirmationEmail(@Payload() data: any) {
    //     console.log(`[Notification Service] ✉️ Sending receipt email for Order: ${data.orderId}`);
    //   }

    //   @EventPattern('inventory_failed')
    //   async sendOrderFailureEmail(@Payload() data: any) {
    //     console.log(`[Notification Service] ❌ Sending failure notice for Order ${data.orderId}: ${data.reason}`);
    //   }

    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'inventory_reserved',
        queue: 'notification_success_email_queue',
    })
    public async handleOrderSuccess(msg: { orderId: string }) {
        console.log(`[Notification Service] ✉️ Email Dispatched: Your order ${msg.orderId} is complete and shipped!`);

        await this.emailService.send({
            to: 'osman@gmail.com',
            subject: 'New Notification',
            body: `<p>[Notification Service] ✉️ Email Dispatched: Your order ${msg.orderId} is complete and shipped!.</p>`,
        });
    }

    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'inventory_failed',
        queue: 'notification_failure_email_queue',
    })
    public async handleOrderFailure(msg: { orderId: string }) {
        console.log(`[Notification Service] ❌ Email Dispatched: Order ${msg.orderId} failed due to short inventory.`);
        await this.emailService.send({
            to: 'osman@gmail.com',
            subject: 'New Notification',
            body: `<p>[Notification Service] ❌ Email Dispatched: Order ${msg.orderId} failed due to short inventory.</p>`,
        });
    }


    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'review_created', // 🔑 Matches the queue mapping routingKey precisely
        queue: 'notification_review_queue',
    })
    public async handleReviewCreatedEvent(payload: any) {
        console.log(`Notification service captured review event from global exchange for user: ${payload}`);
        // Execute messaging notification workflows (Email, SMS, Push, etc.) here

        await this.emailService.send({
            to: 'osman@gmail.com',
            subject: 'New Notification',
            body: `<p>Notification service captured review event from global exchange for user: ${payload}.</p>`,
        });

    }
}









