import { Controller, Get, Post, Body, Param, Put, Delete, Inject, Injectable } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class BooksConsumer {
  private bookStock = { book_123: 5 };

  constructor(
    private readonly booksService: BooksService,
    // @Inject('BROADCAST_BROKER') private readonly client: ClientProxy
  ) { }

 
  // 📻 RABBITMQ CONSUMER: Listens for order placement
  @RabbitSubscribe({
    exchange: 'bookverse_global_exchange',
    routingKey: 'order_created',
    queue: 'book_inventory_queue',
  })
  public async handleOrderCreated(msg: any) {
    console.log(msg)
    console.log('[Book Service] 🎯 CONNECTED! Received Event payload:', msg);
    await this.booksService.processStockReservation(msg);
  }


  // @EventPattern('order_created')
  // async handleOrderCreated(@Payload() data: { orderId: string; bookId: string; quantity: number }) {
  //   // await this.bookService.deductStock(data.bookId, data.quantity);
  //   console.log(`[Book Service] Checking stock for book: ${data.bookId}`);

  //   const availableStock = this.bookStock[data.bookId] || 0;

  //   if (availableStock >= data.quantity) {
  //     // Deduct stock
  //     this.bookStock[data.bookId] -= data.quantity;
  //     console.log(`[Book Service] Stock reserved. Remaining: ${this.bookStock[data.bookId]}`);

  //     // Trigger Next Step in Saga
  //     this.client.emit('inventory_reserved', { orderId: data.orderId, bookId: data.bookId });
  //   } else {
  //     console.log(`[Book Service] Stock insufficient for: ${data.bookId}`);

  //     // Trigger Compensation Step
  //     this.client.emit('inventory_failed', { orderId: data.orderId, reason: 'Out of stock' });
  //   }
  // }

 
}