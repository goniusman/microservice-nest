import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  status: boolean;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);