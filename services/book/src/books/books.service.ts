import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { trace } from '@opentelemetry/api';

@Injectable()
// export class BooksService implements OnModuleInit {
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  private bookStock = { 1: 500 }; // Mock Database stock

  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>,
    private readonly amqpConnection: AmqpConnection
  ) { }


  // ⚡ FORCE INITIALIZATION ON BOOT
  // onModuleInit() {
  //   this.logger.log('🚀 Book Service initialized. Forcing RabbitMQ connection handshake...');
  //   // This empty check ensures the connection client instance is fully mounted by NestJS
  //   if (this.amqpConnection) {
  //     this.logger.log('✅ RabbitMQ AmqpConnection successfully attached to Book Service.');
  //   }
  // }



  async create(dto: CreateBookDto) {
    try {
      return await this.bookModel.create(dto);
    } catch (e: any) {
      console.log("========== MONGOOSE ERROR ==========");
      console.log(e);
      console.log(e.message);
      console.log(e.errors);
      throw e;
    }

  }

  async findAll(): Promise<any> {
    return this.bookModel.find().lean().exec();
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.bookModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).lean().exec();

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async delete(id: string) {
    const book = await this.bookModel.findByIdAndDelete(id).lean().exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
    // return { message: 'Deleted successfully' };
  }

  async processStockReservation(payload: { orderId: string; bookId: string; quantity: number, userId: string }) {
    console.log(`[Book Service] Checking and reserving stock for book: ${payload.bookId}`);

    try {
      // 1. Grab whatever span is currently wrapping this execution thread
      const activeSpan = trace.getActiveSpan();

      if (activeSpan) {
        // 2. Set an attribute inline
        activeSpan.setAttribute('inventory.status', 'stock_reserved');
        activeSpan.setAttribute('bookId', payload.bookId);
      }

      const quantity = Number(payload.quantity);


      // 2. Validate that it's a valid, positive number greater than 0
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid stock reservation quantity: ${payload.quantity}`);
      }


      // 1. Atomically check stock AND decrement it in one query
      const updatedBook = await this.bookModel.findOneAndUpdate(
        {
          _id: payload.bookId,
          quantity: { $gte: quantity }
        },
        {
          $inc: { quantity: -quantity } // Decrement the stock atomically
        },
        {
          new: true // Returns the modified document instead of the original
        }
      );

      // 2. If updatedBook is null, it means either the book wasn't found or stock was insufficient
      if (updatedBook) {
        console.log(`[Book Service] Stock reserved in DB. Remaining: ${updatedBook.quantity}`);

        // Emit success step to global exchange
        this.amqpConnection.publish('bookverse_global_exchange', 'inventory_reserved', {
          orderId: payload.orderId,
          bookId: payload.bookId,
          quantity: quantity,
          userId: payload.userId
        });
      } else {
        console.log(`[Book Service] Stock insufficient or book not found for ID: ${payload.bookId}`);

        // Emit failure step to global exchange
        this.amqpConnection.publish('bookverse_global_exchange', 'inventory_failed', {
          orderId: payload.orderId
        });
      }
    } catch (error) {
      console.error(`[Book Service] Database error during stock reservation:`, error);

      // Fail safely: notify the system that inventory booking failed due to a system error
      this.amqpConnection.publish('bookverse_global_exchange', 'inventory_failed', {
        orderId: payload.orderId
      });
    }
  }

  @RabbitRPC({
    exchange: 'bookverse_global_exchange',
    routingKey: 'book.validate',
    queue: 'book_rpc_queue',
  })
  async validateBook(data: { bookId: string }) {
    const book = await this.bookModel.findById(data.bookId);

    return {
      valid: !!book,
      book,
    };
  }


  //  write a quick hello world function  


}