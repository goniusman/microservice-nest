import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

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
    return this.bookModel.create(dto);
  }

  async findAll() {
    return this.bookModel.find();
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.bookModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async delete(id: string) {
    const book = await this.bookModel.findByIdAndDelete(id);
    if (!book) throw new NotFoundException('Book not found');
    return { message: 'Deleted successfully' };
  }

  async processStockReservation(payload: { orderId: string; bookId: string; quantity: number, userId: string }) {
    console.log(`[Book Service] Checking and reserving stock for book: ${payload.bookId}`);

    try {
      // 1. Atomically check stock AND decrement it in one query
      const updatedBook = await this.bookModel.findOneAndUpdate(
        {
          _id: payload.bookId,
          quantity: { $gte: payload.quantity }
        },
        {
          $inc: { quantity: -payload.quantity } // Decrement the stock atomically
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


}