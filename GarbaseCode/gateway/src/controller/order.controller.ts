import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrderProxy } from '../proxy/order.proxy';
import { Public } from '../common/decorators/public.decorator';

@Public() // 🔓 This endpoint is completely public
@Controller('orders')
export class OrderController {
  constructor(private readonly OrderProxy: OrderProxy) { }

  @Post()
  create(@Body() body: any) {
    return this.OrderProxy.create(body);
  }

  @Get()
  findAll() {
    return this.OrderProxy.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.OrderProxy.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.OrderProxy.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.OrderProxy.delete(id);
  }
}