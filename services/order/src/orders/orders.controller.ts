import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Headers
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) { }

  @Post()
  create(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-email') userEmail: string,
    @Headers('x-user-role') userRole: string,
    @Body() dto: CreateOrderDto) {


    console.log(`User ${userEmail} (${userId}) with role ${userRole} is making an order!`);
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }


}