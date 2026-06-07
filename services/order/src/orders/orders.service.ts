import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,

    private readonly rabbitMQ: RabbitMQService,
  ) {}

  async create(dto: CreateOrderDto) {
    const order =
      await this.orderModel.create({
        ...dto,
        status: 'CREATED',
      });

    // EVENT EMIT (VERY IMPORTANT)
    await this.rabbitMQ.publish(
      'order_created',
      {
        orderId: order.id,
        userId: dto.userId,
        bookId: dto.bookId,
        price: dto.price,
      },
    );

    return order;
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