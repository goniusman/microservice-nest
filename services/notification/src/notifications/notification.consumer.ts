
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EventPattern, Payload, Payload } from '@nestjs/microservices';


@Injectable()
export class NotificationConsumer {

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
    }

    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'inventory_failed',
        queue: 'notification_failure_email_queue',
    })
    public async handleOrderFailure(msg: { orderId: string }) {
        console.log(`[Notification Service] ❌ Email Dispatched: Order ${msg.orderId} failed due to short inventory.`);
    }


    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'review_created', // 🔑 Matches the queue mapping routingKey precisely
        queue: 'notification_review_queue',
    })
    public async handleReviewCreatedEvent(payload: any) {
        console.log(`Notification service captured review event from global exchange for user: ${payload.userId}`);
        // Execute messaging notification workflows (Email, SMS, Push, etc.) here
    }
}









