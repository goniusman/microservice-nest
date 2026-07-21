import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Headers,
  UseGuards
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PermissionGuard, RedisService } from '@my-app/shared';

@Controller('orders')
@UseGuards(PermissionGuard)
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
    // console.log(`User ${userEmail} (${userId}) with role ${userRole} is making an order!`);
    // console.log(dto)
    return this.ordersService.placeOrder(dto);
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