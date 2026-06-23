import { Controller, Get, Post, Body, Param, Put, Delete, Inject } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from '../shared/redis/redis.service';

@Controller('books')
export class BooksController {
  private bookStock = { book_123: 5 };

  constructor(
    private readonly booksService: BooksService,
    // @Inject('BROADCAST_BROKER') private readonly client: ClientProxy
    private readonly redisService: RedisService
  ) { }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  // // 📻 RABBITMQ CONSUMER: Listens for order placement
  // @RabbitSubscribe({
  //   exchange: 'bookverse_global_exchange',
  //   routingKey: 'order_created',
  //   queue: 'book_inventory_queue',
  // })
  // public async handleOrderCreated(msg: any) {
  //   console.log('[Book Service] 🎯 CONNECTED! Received Event payload:', msg);
  //   await this.booksService.processStockReservation(msg);
  // }


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

  @Get()
  findAll() {
    const redisKey = 'all_books_cache';
    // Check Redis cache first
    return this.redisService.get(redisKey).then(cached => {
      if (cached) {
        console.log('[BooksController] Cache hit for all books');
        return {  source: 'cache', books: cached };
      } else {
        console.log('[BooksController] Cache miss for all books, fetching from DB');
        return this.booksService.findAll().then(books => {
          this.redisService.set(redisKey, books, 60); // Cache for 60 seconds
          return { source: 'database', books: books };
        });
      }
    }).catch(err => {
      console.error('[BooksController] Redis error:', err);
      return this.booksService.findAll(); // Fallback to DB on Redis failure
    });

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.booksService.delete(id);
  }
}