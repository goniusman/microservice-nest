import { PartialType } from '@nestjs/mapped-types'; // or '@nestjs/swagger' if using OpenAPI
import { CreateBookDto } from './create-book.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  // title, author, description, price, and quantity are already cleanly inherited here as optional fields!

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean; // You only declare brand-new fields unique to updating a book
}