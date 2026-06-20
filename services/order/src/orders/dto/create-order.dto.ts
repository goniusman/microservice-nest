import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsEnum, IsInt } from 'class-validator';

// Define an enum for your order status to prevent typos
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  orderId?: string;

  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Book ID is required' })
  bookId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(OrderStatus, { message: 'Status must be PENDING, CONFIRMED, or CANCELLED' })
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING; // Set default value
}