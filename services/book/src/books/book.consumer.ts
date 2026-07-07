import { Controller, Get, Post, Body, Param, Put, Delete, Inject, Injectable } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { propagation, context, trace, SpanKind } from '@opentelemetry/api';
import { ConsumeMessage } from 'amqplib'; // Import types from amqplib


@Injectable()
export class BooksConsumer {
  private bookStock = { book_123: 5 };

  constructor(
    private readonly booksService: BooksService,
    // @Inject('BROADCAST_BROKER') private readonly client: ClientProxy
  ) { }


  // 📻 RABBITMQ CONSUMER: Listens for order placement
  public async handleOrderCreated(msg: any, rawMessage: ConsumeMessage) {
    // 1. Extract the trace headers from the raw AMQP message
    const amqpHeaders = rawMessage?.properties?.headers || {};

    // 2. Extract the parent context from those headers
    const parentContext = propagation.extract(context.active(), amqpHeaders);

    // 3. Create a tracer instance
    const tracer = trace.getTracer('rabbitmq-consumer');

    // 4. Run the handler inside the extracted parent context
    await context.with(parentContext, async () => {
      // 5. Start a new child span manually linked to the publisher
      await tracer.startActiveSpan(
        `rabbitmq.consume book_inventory_queue`,
        { kind: SpanKind.CONSUMER },
        async (span) => {
          try {
            console.log('[Book Service] 🎯 CONNECTED! Received Event payload:', msg);

            // Execute your business logic
            await this.booksService.processStockReservation(msg);

            span.setStatus({ code: 1 }); // Ok
          } catch (error: any) {
            span.recordException(error);
            span.setStatus({ code: 2, message: error.message }); // Error
            throw error;
          } finally {
            span.end(); // Always close the span
          }
        }
      );
    });
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