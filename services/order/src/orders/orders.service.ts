import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './schemas/order.schema';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
// import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { propagation, context } from '@opentelemetry/api';
import { AmqpTracer } from '../common/helper/amqp-tracer.util';


@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly amqpConnection: AmqpConnection

  ) { }

  async placeOrder(orderDto: CreateOrderDto) {
    try {
      const orderId = `order_${Date.now()}`;
      let orderBody: CreateOrderDto = {
        ...orderDto,
        orderId: orderId,
        status: OrderStatus.PENDING
      };
      console.log('[Order Service] Placing order with body:', orderBody);
      const newOrder = await this.orderModel.create(orderBody);

      // const headers: Record<string, any> = {};

      // 2. Inject the current trace context into the headers object
      // propagation.inject(context.active(), headers);

      // console.log('Injected Tracing Headers:', headers); // 👈 Add this log! 
      // You should see something like: { traceparent: '00-4bf92f3577b3...01' }

      console.log('[Order Service] Order saved as PENDING:', newOrder.orderId);
      // this.amqpConnection.publish('bookverse_global_exchange', 'order_created', newOrder, { headers });
      AmqpTracer.publishWithTrace(
        this.amqpConnection,
        'bookverse_global_exchange',
        'order_created',
        newOrder,
        {},
        { 'order.id': newOrder.id, 'customer.plan': 'premium' }
      );

      return { message: 'Order processing started', orderId: newOrder.orderId };
    } catch (error) {
      throw error;
    }

  }

  // Saga Compensation / Success Handlers called by incoming events
  // updateOrderStatus(orderId: string, status: 'CONFIRMED' | 'CANCELLED') {
  //   const order = this.orders.find(o => o.orderId === orderId);
  //   if (order) {
  //     order.status = status;
  //     console.log(`[Order Service] Order ${orderId} updated to: ${status}`);
  //   }
  // }


  public async handleInventoryReserved(msg: { orderId: string }) {

    try {
      // Find the order by orderId and update its status atomically in MongoDB
      const updatedOrder = await this.orderModel.findOneAndUpdate(
        { orderId: msg.orderId },
        { $set: { status: 'CONFIRMED' } },
        { new: true } // Returns the updated document after modifications
      );

      if (updatedOrder) {
        console.log(`[Order Service] ✅ Order ${msg.orderId} updated to CONFIRMED`);
      } else {
        console.warn(`[Order Service] ⚠️ Order ${msg.orderId} not found in database to confirmed.`);
      }
    } catch (error) {
      console.error(`[Order Service] Failed to update order status for ${msg.orderId}:`, error);
    }


  }


  public async handleInventoryFailed(msg: { orderId: string }) {
    console.log(`[Order Service] Inventory failed for order: ${msg.orderId}. Updating status...`);
    try {
      // Find the order by orderId and update its status atomically in MongoDB
      const updatedOrder = await this.orderModel.findOneAndUpdate(
        { orderId: msg.orderId },
        { $set: { status: 'CANCELLED' } },
        { new: true } // Returns the updated document after modifications
      );

      if (updatedOrder) {
        console.log(`[Order Service] ❌ Order ${msg.orderId} updated to CANCELLED in DB.`);
      } else {
        console.warn(`[Order Service] ⚠️ Order ${msg.orderId} not found in database to cancel.`);
      }
    } catch (error) {
      console.error(`[Order Service] Failed to update order status for ${msg.orderId}:`, error);
    }
  }

  async findAll() {
    return this.orderModel.find();
  }

  async findOne(id: string) {
    const book = await this.orderModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: any) {
    const book = await this.orderModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async delete(id: string) {
    const book = await this.orderModel.findByIdAndDelete(id);
    if (!book) throw new NotFoundException('Book not found');
    return { message: 'Deleted successfully' };
  }

}