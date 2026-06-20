import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review extends Document {

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  bookId: string;

  @Prop({ type: Number, min: 1, max: 5 })
  rating: number;

  @Prop({ type: Boolean, required: true, default: true })
  status: boolean;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);


ReviewSchema.index({ bookId: 1, createdAt: -1 });