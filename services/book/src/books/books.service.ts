import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>,
  ) {}

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
}