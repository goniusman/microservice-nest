import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'PENDING' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
