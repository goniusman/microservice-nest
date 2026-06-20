import { Injectable } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class OrdersConsumer {

    constructor(
        private readonly ordersService: OrdersService,
    ) { }

    // 📻 Listen for transaction success from Book Service
    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'inventory_reserved',
        queue: 'order_success_queue',
    })
    handleInventoryReserved(@Payload() data: { orderId: string }) {
        this.ordersService.handleInventoryReserved(data);
    }

    // 📻 Listen for transaction failure / compensation from Book Service
    @RabbitSubscribe({
        exchange: 'bookverse_global_exchange',
        routingKey: 'inventory_failed',
        queue: 'order_failure_queue',
    })
    handleInventoryFailed(@Payload() data: { orderId: string }) {
        this.ordersService.handleInventoryFailed(data);
    }

    // @EventPattern('inventory_reserved')
    // handleInventoryReserved(@Payload() data: { orderId: string }) {
    //     this.ordersService.handleInventoryReserved(data);
    // }

    // @EventPattern('inventory_failed')
    // handleInventoryFailed(@Payload() data: { orderId: string }) {
    //     this.ordersService.handleInventoryFailed(data);
    // }

}