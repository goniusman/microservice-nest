import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookProxy } from '../proxy/book.proxy';

@Controller('books')
export class BookController {
  constructor(private readonly bookProxy: BookProxy) {}

  @Post()
  create(@Body() body: any) {
    return this.bookProxy.create(body);
  }

  @Get()
  findAll() {
    return this.bookProxy.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookProxy.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.bookProxy.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookProxy.delete(id);
  }
}