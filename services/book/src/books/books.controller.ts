import { Controller, Get, Post, Body, Param, Put, Delete, Inject, UseGuards, NotFoundException, ForbiddenException, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
// import { RedisService } from '../shared/redis/redis.service';
// import { PermissionGuard } from '../auth/guards/permission.guard';
import { BookPolicy } from './policies/book.policy';
import { AbacEngineService } from '../auth/abac/abac-engine.service';
import { PermissionGuard, RedisService } from '@my-app/shared';

@Controller('books')
@UseGuards(PermissionGuard)
export class BooksController {
  private bookStock = { book_123: 5 };

  constructor(
    private readonly booksService: BooksService,
    // @Inject('BROADCAST_BROKER') private readonly client: ClientProxy
    private readonly redisService: RedisService,
    private readonly bookPolicy: BookPolicy,
    private readonly abacEngine: AbacEngineService,
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
        return { source: 'cache', books: cached };
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

  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
  //   return this.booksService.update(id, dto);
  // }

  @Put(':id')
  async updateBook(
    @Param('id') bookId: string,
    @Body() updateBookDto: any,
    @Req() request: any,
  ) {
    const user = request.user; // Appended by PermissionGuard: { id, roles }

    // Fetch the raw document configuration from MongoDB
    const book = await this.booksService.findOne(bookId);
    if (!book) throw new NotFoundException('Target document cannot be found.');

    // Layer 2: ReBAC Check (Verifies Resource Ownership Mapping)
    const hasOwnership = this.bookPolicy.canUpdate(user, book);
    if (!hasOwnership) {
      throw new ForbiddenException('Access Denied: Relationship owner check failed.');
    }

    // Layer 3: ABAC Check (Validates Environmental Attributes Matrix)
    try {
      this.abacEngine.evaluate({
        user: user,
        resource: {
          type: 'book',
          status: book.status, // e.g., 'DRAFT', 'UNDER_REVIEW', 'ARCHIVED'
          author: book.author
        },
        environment: {
          // Captures client IP proxy headers passed from NGINX setup out front
          clientIp: request.headers['x-forwarded-for'] || request.ip || '127.0.0.1',
          requestTime: new Date(), // Real-time timestamp execution
        }
      });
    } catch (abacError: any) {
      // Catch validation rule issues and bubble down descriptive errors to clients
      throw new ForbiddenException(abacError.message);
    }

    // All structural protection checks cleared successfully
    return this.booksService.update(bookId, updateBookDto);
  }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.booksService.delete(id);
  // }

  @Delete(':id')
  async deleteBook(@Param('id') bookId: string, @Req() request: any) {
    const user = request.user;

    const book = await this.booksService.findOne(bookId);
    if (!book) throw new NotFoundException('Book not found.');

    // Enforce deletion rule context
    if (!this.bookPolicy.canDelete(user, book)) {
      throw new ForbiddenException('Access Denied: Insufficient ownership relationship status.');
    }

    return this.booksService.delete(bookId);
  }



}